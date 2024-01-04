import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import mongoose from "mongoose"
import {User, user} from "../models/user.model.js"
import { create } from "domain";

//async handler will essentially handle the error caused by any function
//else we have to write try catch everytime which causes redundancy
const registerUser = asyncHandler(async(req,res)=>{
    //get the data from the frontend
    //validation - check empty?
    //check if user already exists: username, email
    //check for images,check for avatar
    //upload them to cloudinary-avatar
    //checking for avatar(mandotary field)
    //create user object - entry in db
    //remove password and refreshToken from the user object(there are 
    // various method for removing them)
    //check for user creation
    //return the user object



    //destructure the data from req.body
    const {fullName, email, username, password} = req.body
    // console.log("email: ",email)

    if([fullName, email, username, password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All field required");
    }

    //findOne gives the very first entry which matches the given constraints
    //$or is an logical query operator
    const existedUser = await User.findOne({
        $or: [ { username },{ email } ]
    })

    if(existedUser){
        throw new ApiError(400,"User with username or email already exists")
    }

    //console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0].path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //this select method basically removes this keys from the user object
    //does the opposite of its name
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )





})