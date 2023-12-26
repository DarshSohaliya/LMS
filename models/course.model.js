import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required'],
        minLength: [8, 'Title must be atleast 8 characters'],
        maxLength: [60, 'Title should be less than 60 characters'],
        trim:true

    },
    description: {
        type:String,
        required: [true, 'Description is reqired'],
        minLength: [8, 'Description must be atleast 8 characters'],
        maxLength: [200, 'Description should be less than 60 characters'],
        trim:true
    },
    category: {
        type:String,
        required: [true, 'Description is reqired'],
    },
    thumbnail:{
        public_id: {
            type:String,
            required:true
            },
            secure_url : {
                type:String,
                required:true
            }
    },
    lectures: [{
      title:String,
      description:String,
      lectures: {
        public_id: {
        type:String,
        required:true
        },
        secure_url : {
            type:String,
            required:true
        }
      }
    }],
     numbersOfLecture:{
        type:Number,
        default:0
     },
     createdBy: {
        type :String,
        required:true

     }
},{
    timestamps:true
})

export default mongoose.model("Course" ,courseSchema )