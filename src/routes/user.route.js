import {Router} from "express";
import {logOutUser, loginUser, registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();



//router.route("/home").post(middleware,methodThatShouldBeExecuted)

// that's why we use next() in code of middleware for telling the route that it's work is done now execute other functions

// we can add as many middleware as we want, just we have to add "next()" for removing the confusion of router

router.route("/register").post(
    //upload.field or fields ---> depends whether we are taking single file or multiple files
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),registerUser

)

router.route("/login").post(loginUser)

// Secured routes

router.route("/logout").post(verifyJWT,logOutUser)

export default router
