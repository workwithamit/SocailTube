

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



})