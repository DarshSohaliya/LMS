import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import userRoutes from './routes/user.routes.js'
import errorMiddleware from './middlewares/error.middleware.js'
// import connectToDb from './config/db.js'

const app = express()
// connectToDb()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/ping' ,(req,res) =>{
    res.send('/pong')
})
  
app.use('/api/v1/user', userRoutes)
app.all('*', (req,res) =>{
    res.status(400).send('OOPS! 404 NOT FOUND')
})
app.use(errorMiddleware)

export default app