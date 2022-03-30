const ErrorHandler = require('../utils/errorhandler')

module.exports = (err , req , res , next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // //Wrong Mongodb ID error
    // if(err.name == 'CastError'){
    //     const message = `Resourse not found Invalid: ${err.path}`
    //     err = new ErrorHandler(message , 400)
    // }
    //Mongoose Duplicate Error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered.`
        err = new ErrorHandler(message , 401)
    }

    //Wrong JWT Error
    if(err.name === 'JsonWebTokenError'){
        const message = `Json Web Token is Invalid, Try Again`
        err = new ErrorHandler(message , 401)
    }

    if(err.name === 'TokenExpiredError'){
        const message = `Json Web Token is Expired, Try Again`
        err = new ErrorHandler(message , 401)
    }
    res.status(err.statusCode).json({
        success : false,
        error : err.message
    })

}