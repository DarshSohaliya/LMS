import Payment from '../models/payment.model.js'
import User from '../models/user.model.js'
import AppError from '../utils/error.utils.js'
import {razorpay} from '../index.js'
const getRazorpayApiKey = async (req,res,next) => {
      res.status(200).json({
        success:true,
        message:'Razorpay API key',
        key:process.env.RAZORPAY_KEY_ID,
      })
}



const buySubscription = async (req,res,next) => {
   try {
    console.log(req.user);
    const {id} = req.user
    const user  = await User.findById(id)

    if (!user) {
        return next(
            new AppError('Unauthorized,plese login',500)
        )
    }

    if (user.role === "ADMIN") {
        return next(
            new AppError('Admin cannot purchase a subscripion',400)
        )
    }
console.log("fdh");
    const subscription = await razorpay.subscriptions.create({
        plan_id:process.env.RAZORPAY_PLAN_ID,
        customer_notify:1,
        total_count: 12
    })
    console.log("SS:",subscription);
console.log("sg");
    user.subscription.id = subscription.id
    user.subscription.status= subscription.status
console.log("hfd");
    await user.save()

    res.status(200).json({
        success:true,
        message:'Subscription Successfully',
        subscription_id:subscription.id
    })
   } catch (error) {
         console.log("sfdf");
    return next(
        
        new AppError(error.message,500)
    )
   }
}



const verifySubscription = async (req,res,next) => {
   try {
    const {id} = req.user
    const  { razorpay_payment_id, razorpay_signature, razorpay_subscription_id} = req.body
console.log({id});
console.log( razorpay_payment_id, razorpay_signature, razorpay_subscription_id);
    const user = await User.findById(id)
            console.log(user);
    if (!user) {
       return next(
           new AppError('Unauthorized,plese login')
       )
   }

   const subscriptionId = user.subscription.id
   console.log("SI:",subscriptionId);
   console.log(process.env.RAZORPAY_SECRET);
   const generatedSignature = crypto
   .createHmac('sha256', process.env.RAZORPAY_SECRET)
   .update(`${razorpay_payment_id}|${subscriptionId}`)
   .digest('hex');


   console.log("Generated Signature:", generatedSignature);
   console.log("Razorpay Signature:", razorpay_signature);
   if (generatedSingnature !== razorpay_signature) {
       return next(
           new AppError('Payment not verifyed plese try again',500)
       )
   }

   await Payment.create({
       razorpay_payment_id,
       razorpay_signature,
       razorpay_subscription_id

   })

   user.subscription.status = 'active'

   await user.save()

   res.status(200).json({
       success:true,
       message:"Payment Verified successfully"
   })
   } catch (error) {
    console.log("hd");
    return next(
        new AppError(error.message,500)
    )
   }
}



const cancelSubscription = async (req,res,next) => {
      try {
        const {id} = req.user
      

      const user = await User.findById(id)


      if (!user) {
        return next(
            new AppError('Unauthorized,plese login',500)
        )
    }

    if (user.role === "ADMIN") {
        return next(
            new AppError('Admin cannot purchase a subscripion',400)
        )
    }

    const subscriptionId = user.subscription.id

    const subscription = await razorpay.subscription.cancel(subscriptionId)

    user.subscription.status = subscription.status

    await user.save()
      } catch (error) {
        return next(
            new AppError(error.message,500)
        )
      }

}



const allPayments = async (req,res,next) => {
   try {
    const {count} = req.query

    const subscriptions = await razorpay.subscriptions.all({
        count : count || 10,
    })

    res.status(200).json({
        success:true,
        message:'All Payments',
        subscriptions
    })
   } catch (error) {
    return next(
        new AppError(error.message,500)
    )
   }
}


export {getRazorpayApiKey ,buySubscription ,cancelSubscription , verifySubscription ,allPayments}