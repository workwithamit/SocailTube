//multer: package used for file uploading

//uploading file using multer and cloudinary includes two steps
//1. upload it to local server
//2. then upload it to cloudinary and unlink from local server

// though we can do it directly, there is no problem but we use it for
//the usecase of reupload if fails

import multer from "multer"

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./public/temp")
    },
    //we can add uniqueSuffix at the end of filename(better practice)
    filename:function(req,file,cb){
        cb(null,filename.originalname)
    }
})

export const upload = multer({
    storage,
})