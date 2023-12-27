import AppError from "../utils/error.utils.js";
import jwt from 'jsonwebtoken'
const isLoggedIn = async function(req,res,next)  {
   
    const {token} = req.cookies;
    // console.log(req.cookies);
console.log(token);
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


export {isLoggedIn , authorizedRoles}