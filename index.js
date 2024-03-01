import dotenv from 'dotenv'
dotenv.config()
import Razorpay from 'razorpay'
import app from './app.js'
import connectToDb from './config/db.js'
import { v2 } from 'cloudinary';
import crypto from 'crypto'


v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

//   const razorpayApiKey = process.env.RAZORPAY_API_KEY;

//   if (!razorpayApiKey) {
//     console.error('Razorpay API Key is missing. Please set the RAZORPAY_API_KEY environment variable.');
//     process.exit(1);
//   }

export  const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET,
})

  

const PORT = process.env.PORT || 6000

app.listen(PORT,async() =>{
    await connectToDb()
    console.log(`App is runing at ${PORT}`);
})
