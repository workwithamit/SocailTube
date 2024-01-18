// ye verify krwayega ki user h ya nahi h 

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {jwt} from "jsonwebtoken";
import { User } from "../models/user.model.js";

//next ka kya kam hota h, toh bolta h dekho apna kam toh ho gya khtm ab isko
// jaha leke jana h leke jao, agle middleware mai leke jana h usme leke jao, ya aapka kam 
//ho gya toh response pr leke jao

// kuchh cases m esi situation aayegi jinme req, res mai se ek chiz use nahi hogi ya jo bhi h, then we can replace it using "_"

export const verifyJWT = asyncHandler(async(req, _, next)=>{
    //hanji ab ho gya hamara boilerplate ho gya taiyar 

    //sbse pahli chiz, tokens ka access kese loge
    //are tokens ka access bahut asan h , kyu h asan
    //req k pas cookies ka access h
    // cookies ka access aaya kese
    // aapne hi toh diya ye middleware use krke cookieParser

    //req.header() --> ye mobile app se aata h isme hum "Authorization nam pass krte h jisme bearer <token_name> ka access hota h"

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"UnAuthorized request")
        }
    
        //this method directly verify the whether the token is valid or invalid
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
    
        const user = User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
    
        req.user = user
    
        next()
    } catch (error) {
        throw ApiError(401,error?.message || "Invalid access token")
    }


})


//now comes the interesting part, how will we use this and how it will make things easier for us

// so middlewares are mainly used in routes



