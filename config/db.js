import mongoose from "mongoose";

mongoose.set('strictQuery' ,false)

const connectToDb = async(req,res) =>{
    try {
        const {connection} = await mongoose.connect('mongodb+srv://Lmsbackend:Gop123@cluster0.iae5kck.mongodb.net/lms')
    
   if (connection) {
    console.log(`Connected to MongoDB: ${connection.host}`);
   }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
  
}

export default connectToDb