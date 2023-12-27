import Course from '../models/course.model.js'
import AppError from '../utils/error.utils.js';
import fs from 'fs/promises'
import cloudinary from 'cloudinary'

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

const craeteCourse = async function(req,res,next)  {
    const {title, description,category,createdBy} = req.body 

    if (!title || !description || !category || !createdBy ) {
        return next(
            new AppError('All fields are required',500)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:"Dummy",
            secure_url:"Dummy"
        },
    })

    if (!course) {
        return next(
            new AppError('Course Could not create',500)
        )
      }

      if (req.file) {
        // console.log("File :: ",req.file);
       try {
        const result = await  cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'LMS'
        })
        // console.log("File2 :: ",req.file);
        if (result) {
            course.thumbnail.public_id = result.public_id
            course.thumbnail.secure_url = result.secure_url
          }
        //   console.log("File3 :: ",req.file);
          fs.rm(`uploads/${req.file.filename}`)
       } catch (error) {
        return next(
            new AppError(error.message,500)
        )
       }
      }
    //   console.log("File5 :`: ",req.file);
      await course.save()

      res.status(200).json({
        success:true,
        message:"Course created successfully"
      })
       
}

  
const updateCourse = async function(req,res,next) {
    try {
        const { id } = req.params
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set : req.body
            },
            {
               runValidators : true
            }
        )
        if (!course) {
            return (
                new AppError('Course with given id dose not exist',500)
            )
        }

        res.status(200).json({
            success:true,
            message:'Course update successfully'
        })
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
}

const removeCourse  = async function(req,res,next) {
    try {
        const {id} = req.params
        const course = await Course.findById(id)
       
        if (!course) {
            return (
                new AppError('Course with given id dose not exist',500)
            )
        }
         
        await course.findByIdAndDelete(id);

      res.status(200).json({
        success:true,
        message:'Course deleted successfully'
      })

    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
}
const addLectureToCourseById = async (req,res,next) => {
   try {
    const {title,description} = req.body
    const {id} = req.params

    if (!title || !description ) {
       return next(
           new AppError('All field are required',500)
       )
    }

    const course =await Course.findById(id)

    
    if (!course) {
       return (
           new AppError('Course with given id dose not exist',500)
       )
   }

   const lectureData = {
       title,
       description,
       lecture:{}
   }

   if (req.file) {
       try {
           const result = await  cloudinary.v2.uploader.upload(req.file.path, {
               folder: 'LMS'
           })

           if (result) {
               lectureData.lecture.public_id = result.public_id
               lectureData.lecture.secure_url = result.secure_url
             }

             fs.rm(`uploads/${req.file.filename}`)

          } catch (error) {
           return next(
               new AppError(error.message,500)
           )
          }
   }

   course.lectures.push(lectureData)

   course.numbersOfLecture = course.lectures.length

   await course.save()
1
   res.status(200).json({
       success:true,
       message:'Lecture successfully added to the course',
       course
   })
   } catch (error) {
    return next(
        new AppError(error.message,500)
    )
   }
}

const deletelecture = async (req,res,next) => {
   try {
    const {id} = req.params
    const course = await Course.findById(id)

    if (!course) {
        return next(
            new AppError('Course is Not Created',500)
        )
    }

    await course.lectures.findByIdAndDelete(id);

    res.status(200).json({
        success:true,
        message:'Lecture is remove successfully'
    })
   } catch (error) {
    return next(
        new AppError(error.message,500)
    )
   }

}
export {getAllCourses ,
    getLecturesByCourseId,
    craeteCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deletelecture}