// require('dotenv').config({path:'./env'});

import dotenv from "dotenv"
// import mongoose from "mongoose"
import connectDB from './db/index.js'
// import {DB_NAME} from "./constants.js";

dotenv.config({
    path:'./env'
})

connectDB();

//IIFE

/*
import express from "express";
const app = express();

;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("Error",(error)=>{
            console.log("ERROR: ",error);
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.log(`ERROR :  ${error}`);
        // throw error;
    }

})()

*/

/*
function connectDB(){}

connectDB()

*/