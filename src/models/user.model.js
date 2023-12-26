import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,//cloudinary string
        required:true,
    },
    coverImage:{
        type:String,

    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"]
    }


},{timestamps:true})

/*
code below will be executed before saving userSchema to the db, so this hook will hash 
the passowrd everytime we will save the data, so we need to check if the passwrd is
modified or not.

userSchema.pre("save", async function(next){
    this.password = bcrypt.hash(this.password,10)
    next()
})

hashing takes time, so we use async function


*/
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

//we can inject methods also 

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


export const User = mongoose.model("User",userSchema)