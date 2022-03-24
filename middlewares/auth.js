const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
exports.isAuthenticated = catchAsyncErrors( async(req , res , next) => {
    const {token} = req.cookies
    if(!token){
        return next(new ErrorHandler('Login required to access this feature' , 401))
    }
    const decodedUser = jwt.verify(token , process.env.JWT_SECRET)
    // console.log(decodedUser);
    req.user = await User.findById(decodedUser.id)
    next()
})

exports.isAdmin = (...roles) =>{
    return (req , res , next) => {
        if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`Role : ${req.user.role} don't have access for this resourse`))
        }
        next()
    }
}
