//cloudinary is used for managing uploaded files(images and videos)
//import cloudinary
//there is one method for uploading file using local path
//this is a utility we can use everywhere when we have to upload files

import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

//we  need to configure cloudinary because it should know nh who is the user
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//though there is an already built upload function available in cloudinary
//but we will create our own because there will some errors while uploading
//files so we will use try catch

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        //file has been uploaded successfully
        // console.log("file is uploaded on cloudinary ", response)
        fs.unlinkSync(localFilePath)
        return response;

    }
    catch{
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null;

    }
}

export {uploadOnCloudinary}