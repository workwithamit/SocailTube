// ye verify krwayega ki user h ya nahi h 

import { asyncHandler } from "../utils/asyncHandler.js";

//next ka kya kam hota h, toh bolta h dekho apna kam toh ho gya khtm ab isko
// jaha leke jana h leke jao, agle middleware mai leke jana h usme leke jao, ya aapka kam 
//ho gya toh response pr leke jao

export const verifyJWT = asyncHandler(async(req,res)=>{
    //hanji ab ho gya hamara boilerplate ho gya taiyar 

    //sbse pahli chiz, tokens ka access kese loge
    //are tokens ka access bahut asan h , kyu h asan
    //req k pas cookies ka access h
    // cookies ka access aaya kese
    // aapne hi toh diya ye middleware use krke cookieParser
})

