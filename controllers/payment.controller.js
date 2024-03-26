import Payment from '../models/payment.model.js'
import User from '../models/user.model.js'
import AppError from '../utils/error.utils.js'
import {razorpay} from '../index.js'
import crypto from 'crypto'
const getRazorpayApiKey = async (req,res,next) => {
      res.status(200).json({
        success:true,
        message:'Razorpay API key',
        key:process.env.RAZORPAY_KEY_ID,
      })
}



const buySubscription = async (req,res,next) => {
   try {
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
    const subscription = await razorpay.subscriptions.create({
        plan_id:process.env.RAZORPAY_PLAN_ID,
        customer_notify:1,
        total_count: 12
    })
    user.subscription.id = subscription.id
    user.subscription.status= subscription.status
    await user.save()

    res.status(200).json({
        success:true,
        message:'Subscription Successfully',
        subscription_id:subscription.id
    })
   } catch (error) {
    return next(
        
        new AppError(error.message,500)
    )
   }
}



const verifySubscription = async (req, res, next) => {
    const { id } = req.user;
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

    // Finding the user
    const user = await User.findById(id);
    // Getting the subscription ID from the user object
    const subscriptionId = user.subscription.id;
    // Generating a signature with SHA256 for verification purposes
    // Here the subscriptionId should be the one which we saved in the DB
    // razorpay_payment_id is from the frontend and there should be a '|' character between this and subscriptionId
    // At the end convert it to Hex value
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');
  

  
    // Check if generated signature and signature received from the frontend are the same or not
    if (generatedSignature !== razorpay_signature) {
        return next(new AppError('Payment not verified, please try again.', 400));
    }
  
    
    // If they match, create payment and store it in the DB
   const pay= await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
    });

    console.log(pay);
  
    // Update the user subscription status to active (This will be created before this)
    user.subscription.status = 'active';
  
    // Save the user in the DB with any changes
    await user.save();
  
    res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
    });
};



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
    const { count, skip } = req.query;

  // Find all subscriptions from razorpay
  const allPayments = await razorpay.subscriptions.all({
    count: count ? count : 10, // If count is sent then use that else default to 10
    skip: skip ? skip : 0, // // If skip is sent then use that else default to 0
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const finalMonths = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  const monthlyWisePayments = allPayments.items.map((payment) => {
    // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
    const monthsInNumbers = new Date(payment.start_at * 1000);

    return monthNames[monthsInNumbers.getMonth()];
  });

  monthlyWisePayments.map((month) => {
    Object.keys(finalMonths).forEach((objMonth) => {
      if (month === objMonth) {
        finalMonths[month] += 1;
      }
    });
  });

  const monthlySalesRecord = [];

  Object.keys(finalMonths).forEach((monthName) => {
    monthlySalesRecord.push(finalMonths[monthName]);
  });
  res.status(200).json({
    success: true,
    message: 'All payments',
    allPayments,
    finalMonths,
    monthlySalesRecord,
  });
   } catch (error) {
    return next(
        new AppError(error.message,500)
    )
   }
}


export {getRazorpayApiKey ,buySubscription ,cancelSubscription , verifySubscription ,allPayments}