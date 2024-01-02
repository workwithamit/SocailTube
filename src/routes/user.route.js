import {Router} from "express";

const router = Router();

//router.route("/home").post(middleware,methodThatShouldBeExecuted)
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
)

export default router
