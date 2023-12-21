import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import connectToDb from './config/db.js'

const PORT = process.env.PORT || 6000

app.listen(PORT,async() =>{
    await connectToDb()
    console.log(`App is runing at ${PORT}`);
})
