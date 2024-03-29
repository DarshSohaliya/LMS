 
 import express from 'express'
import {getAllCourses, getLecturesByCourseId,craeteCourse,updateCourse,removeCourse,addLectureToCourseById, deletelecture} from '../controllers/course.controlles.js'
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js'

 const router = express.Router()

 router.route('/')
      .get( getAllCourses)
     .post(isLoggedIn,authorizedRoles("ADMIN"),upload.single('thumbnail'),craeteCourse)
     .delete(isLoggedIn,authorizedRoles("ADMIN"),deletelecture)


 router.route('/:id')
     .get(isLoggedIn,authorizedSubscriber,getLecturesByCourseId)
     .put(isLoggedIn,authorizedRoles("ADMIN"),updateCourse)
     .delete(isLoggedIn,authorizedRoles("ADMIN"),removeCourse)
     .post(isLoggedIn,authorizedRoles("ADMIN"),upload.single('lecture'),addLectureToCourseById)
     
   
     
 export default router