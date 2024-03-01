
import express from 'express'
import {getRazorpayApiKey,buySubscription,verifySubscription,cancelSubscription,allPayments} from '../controllers/payment.controller.js'
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js'

const router = express.Router()

router
    .route('/rezorpay-key')
    .get(isLoggedIn,getRazorpayApiKey)

router 
     .route('/subscribe')
     .post(isLoggedIn,buySubscription)   
     
router
     .route('/verify')
     .post(isLoggedIn,verifySubscription)

router
     .route('/unsubscribe')     
     .post(isLoggedIn,cancelSubscription)

router
     .route('/')
     .get(isLoggedIn,authorizedRoles("ADMIN"),allPayments)    
     
export default router     

     