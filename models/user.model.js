import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
     fullName:{
        type:'String',
        required:[true,'Name is required'],
        minLength: [5, 'Name must be at least 5 characters'],
        maxLength: [50,'Name should be  less than 50 characters'],
        lowercase:true,
        trim:true
     },
     email:{
        type:'String',
        required:[true,'email is required'],
        lowercase:true,
        trim:true,
        unique:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ],
     },
     password:{
        type:'String',
        required:[true,"Password is required"],
        minLength: [8 , 'Password must be at less 8 characters'],
        select:false
     },
     avatar:{
        public_id:{
            type:'String'
        },
        secure_url:{
            type:'String'
        }
     },
     role:{
        type:'String',
        enum: ["USER" , "ADMIN"],
        default:"USER"
     },
     forgotPasswordToken: String,
     forgotPasswordExpiry:Date
},{
    timestamps:true
})

userSchema.pre('save' ,async function(next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password  = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods = {
    generateJWTToken: async function() {
        return jwt.sign(
            { id: this._id, email: this.email, subscription: this.subscription, role: this.role },
            "process",
            { expiresIn: '24h' }

        )
    },
    comparePassword: async function(plainTextPassword)  {
       return await  bcrypt.compare(plainTextPassword,this.password)
    }
 }


export default mongoose.model("User" ,userSchema)