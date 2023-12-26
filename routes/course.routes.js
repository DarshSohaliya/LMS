 
 import express from 'express'
import {getAllCourses, getLecturesByCourseId} from '../controllers/course.controlles.js'
import { isLoggedIn } from '../middlewares/auth.middleware.js'
 const router = express.Router()

 router.route('/')
      .get( getAllCourses)
    //  .post(getAllCourses)
 router.route('/:id')
     .get(isLoggedIn,getLecturesByCourseId)


 export default router