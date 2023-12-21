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

export {isLoggedIn}