import AppError from "../utils/error.utils.js";
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const isLoggedIn = async function(req,res,next)  {
   
    const {token} = req.cookies;
    console.log("C",req.cookies);
console.log("Token",token);
    if (!token) {
        return next(new AppError('Unauthenticated ,please login again',401))
    }
    const userDetails = await jwt.verify(token,"process")

    req.user = userDetails

    next()
}
const authorizedRoles = (...roles) => async (req,res,next) =>{
     const currentUserRoles = req.user.role;

     if (!roles.includes(currentUserRoles)) {
        return next(new AppError('You do not have perssmission to access this route ',401))
        
     }next()
}

const authorizedSubscriber = async (req,res,next) => {
    //  const subscription = req.user.subscription
    //  const currentUserRoles = req.user.role;
     
     const user = await User.findById(req.user.id)
     if(user.role !== 'ADMIN' && user.subscription.status !== "active")
     {
        return next(
            new AppError('Plese subscribe to access this route !',500)
        )
     }
}
export {isLoggedIn , authorizedRoles,authorizedSubscriber}