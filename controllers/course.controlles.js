import Course from '../models/course.model.js'
import AppError from '../utils/error.utils.js';


const getAllCourses = async function(req,res,next) {

    try {
        const courses = await Course.find({}).select('-lectures')

     res.status(200).json({
        success:true,
        message:"All courses",
        courses,

     });
    } catch (error) {
        return next(new AppError(e.message,500))
    }
     

}




const getLecturesByCourseId = async function(req,res,next) {

    try {
        const {id} = req.params

        const course  =await Course.findById(id)
          if (!course) {
        return next(new AppError('Invalid Course Id',500))
            
          }
        res.status(200).json({
            success:true,
            message:'Course lecture fetched successfully',
            lectures:course.lectures
        })
    } catch (error) {
        return next(new AppError(e.message,500))
    }

}

export {getAllCourses ,getLecturesByCourseId}