import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

import {User} from "../models/user.model.js"

const generateAccessAndRefreshToken = async ( userId ) => {
    try {
        const user = User.findById(userId)
        const accessToken = User.generateAccessToken()
        const refreshToken = User.generateRefreshToken()

        user.refreshToken = refreshToken
        //refreshToken toh le liya but db mai save nahi kiya
        // user.save() --> ye jb call krte h tb mongoose k models kick in ho jate fir sare fields jo required h wo hone hi chahiy, but hume toh ek hi field save krna h

        user.save( { validateBeforeSave : false } )

        return { accessToken,refreshToken }
        
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token ")
    }
}


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
    //chainable methods of res object (http response object)
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )


})

const loginUser = asyncHandler(async(req,res)=>{
    // req.body --> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie(cookies are accessed two way both in req and res)
    const {email,username,password} = req.body
    console.log(email)

    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }

    //if(!(username || email)){
       // throw new ApiError(400,"username or email is required")
    //}

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"user does not exists")
    }

    const isPasswordValid = await isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400,"Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // now, jo upr user variable h (` const user = await User.findOne() `) isme kuchh unwanted fields ka access h like password and refreshToken ki value bhi empty toh ab hum ya toh user.password ko undefined krde and refreshtoken ki value add krde iss variable mai for further works for sending information in cookies

    // ab aapko ye decide krna pdega ki db mai query marna jyada expensive toh nahi h?

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // ab hume bhejhni h cookies, cookies jab bhi hum bhejhte h toh hume kuch options design krne pdte h, options kuchh nahi hote h ye ek object hota h bss


    const options = {
        httpOnly: true,
        secure: true
    }

    //options se hota kya h ki, aapki cookies jo hoti h unko koi bhi frontend pr modify kr skta h, so using options we can put security like httpOnly allows modification of cookies from the server end only

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged in Successfully"
        )
    )

    // ab aapke dimag mai ek sawal aa rha hoga ki jb hum cookie mai already accessToken and refreshToken bhejh rhe h toh ye .json mai firse kyu bhejh rhe

    // so basically, ye khrab practice h ya achhi h it depends, user agr localStorage mai save krna chahta ho accessToken and refreshToken ya fir mobile user ho toh bhejhna achhi practice h

})

const logOutUser = asyncHandler( async(req,res) => {
    // jb bhi mai user ko logout kr rha hu, toh aapke dimag mai strategy aani chahiy

    //we have to delete the cookies  and the refreshToken in db

    // now I need the access of user but we don't have any way of getting it directly so using auth.middleware we get the access of user in req object

    // using user we can get _id and using that we can access the whole user object from the User db and delete the refreshToken

    // so now we will access the user object using findById, but there is a catch, now we have to delete the refreshToken and save it to the db
    // then we have to save using "save({validateBefore : false})"

    // there is a better way or another method that we can use

    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }


    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out"))
})





export {registerUser,loginUser,logOutUser}