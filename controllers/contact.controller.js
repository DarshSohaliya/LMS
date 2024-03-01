import AppError from "../utils/error.utils.js"
import sendEmail from "../utils/sendEmail.js";


export const contactUs = (async (req,res,next) => {
    const {name,email,message}  = req.body
console.log(name,email,message);
    if (!name || !email || !message) {
         return next (new AppError('Name, Email, Message are required'))
    }

    try {
         const subject = 'Contact Us Form'
         const textMessage = `${name} - ${email} <br/> ${message}`
console.log(textMessage);
         await sendEmail('gopalsohaliya@gmail.com', subject, textMessage);
    } catch (error) {
        console.log(error);
    return next(new AppError(error.message, 400));
    }

    res.status(200).json({
        success: true,
        message: 'Your request has been submitted successfully',
})
});