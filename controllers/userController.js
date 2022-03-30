const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorhandler')
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail')
const sendToken = require('../utils/jwtTokens');
const crypto = require('crypto')


//Register a User
exports.registerUser = catchAsyncErrors(async ( req , res , next) => {
    const {name , email , password} = req.body;
    const user = await User.create({
        name , email , password,
        avatar : {
            public_id : "this is public id",
            url : "user profile pic url"
        }
    })
    //calling send token function
   sendToken(user , 201 , res);
})

//Login User
exports.loginUser = catchAsyncErrors(async (req , res , next) => {
    const {email , password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & password" , 401))
    }

    const user =await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler("User not found" , 401))
    }
    const isPasswordMatch = await user.comparePassword(password)

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid email or Password" , 401))
    }

    sendToken(user , 200 , res)
})

//Logout user
exports.logoutUser = catchAsyncErrors(async (req , res , next) => {
    res.cookie('token' , null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({
        success : true,
        message : "Loged Out"
    })
})

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req , res , next) => {
    const user = await User.findOne({email : req.body.email})

    if(!user){
        return next(new ErrorHandler("User not found" , 401))
    }

    //Get Reset Password Token 
    const resetToken = user.getResetPasswordToken() 
    await user.save()
   //https://www.youtube.com/
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your Reset Password token is :- \n\n${resetPasswordUrl} \n\n If you have not requested this email then ignore it`;

   try {
       await sendEmail({
           email : user.email,
           subject : `Ecommerce Password Recovery`,
           message
       })

       res.status(200).json({
           success:true,
           message : `Email Sent to ${user.email} successfully`
       })
       
   } catch (error) {
       user.resetPasswordToken = undefined
       user.resetPasswordExpire = undefined

       await user.save();
       return next(new ErrorHandler(error.message , 500))
   }
})

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req , res , next) => {
    //Create token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()},
    })
     
    if(!user){ 
        return next(new ErrorHandler('Reset Password Token is Invalid or Expired' , 401))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password and Confirm Password mismatched" , 401))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save()

    sendToken(user , 200 , res)
})

//Get User Details
exports.getUserDetails = catchAsyncErrors((req , res , next) => {
    res.status(200).json({
        success : true,
        user : req.user
    })
})

//Update / Change Password
exports.updatePassword = catchAsyncErrors( async(req , res , next) => {
    const user =  await User.findById(req.user.id).select('+password');
    if(!user){
        return next(new ErrorHandler('User not Found' , 404))
    }
    //Compare Password
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid email or Password" , 401))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password and Confirm Password mismatched" , 401))
    }
    
    user.password = req.body.newPassword;
    await user.save()

    res.status(200).json({
        success : true
    })
    
})

//Update Profile
exports.updateProfile = catchAsyncErrors(async (req , res , next) => {
       const {name , email} = req.body;
       const user = await User.findByIdAndUpdate(req.user.id , {name , email} , {runValidators : true , new : true})
       await user.save();
       res.status(200).json({
           success : true,
       })
})

//Get All User Admin
exports.getAllUsers = catchAsyncErrors(async (req , res , next) => {
    const users = await User.find();
    res.status(200).json({
        success : true , 
        users,
    })
})

//Get Single User (Admin)
exports.getSingleUser = catchAsyncErrors(async (req , res , next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User don't exist with ID: ${req.params.id}`))
    }

    res.status(200).json({
        success : true,
        user
    })

})

//Update User --Admin
exports.updateUser = catchAsyncErrors(async(req , res , next) => {
    const {role} = req.body;
       const user = await User.findByIdAndUpdate(req.params.id , {role} , {runValidators : true , new : true})
       await user.save();
       res.status(200).json({
           success : true,
       })
})

//Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req , res , next) =>{
    const user =await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User don't exist with ID: ${req.params.id}`))
    }
    await user.remove()
    res.status(200).json({
        success : true,
        message : "User Delete Successfully"
    })
})