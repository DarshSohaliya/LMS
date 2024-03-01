import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import contactRoute from './routes/contact.routes.js'
import errorMiddleware from './middlewares/error.middleware.js'
import connectToDb from './config/db.js'


const app = express()
// connectToDb()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin:[process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials:true
}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/ping' ,(req,res) =>{
    res.send('/pong')
})
  
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/payment' , paymentRoutes)
app.use('/api/v1/',contactRoute)


app.all('*', (req,res) =>{
    res.status(400).send('OOPS! 404 NOT FOUND')
})
app.use(errorMiddleware)
// app.disable('etag');

export default app