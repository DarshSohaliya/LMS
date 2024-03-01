import mongoose from "mongoose";

const paymentSchema =  new mongoose.Schema({
     rezorpay_payment_id:{
        type:String,
        required: true,

     },
     rezorpay_subscription_id: {
        type:String,
        required: true
     }
     ,rezorpay_signature_id:{
        type:String,
        required:true
     }
},{
    timestamps:true
})

export default mongoose.model("Payment", paymentSchema)