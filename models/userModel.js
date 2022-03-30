const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Validd Email"]
    },
    password: {
        type: String,
        required: [true, "please Enter password"],
        minlength: [8, "password must contain atleast 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role : {
        type : String,
        default : 'user'
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
})

//Storing password in hash format before storing it in database
userSchema.pre('save' , async function (next) {
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(this.password , salt);
        this.password = secPass;
    }
})
//Creating JWT token for each user
userSchema.methods.getJwtToken = async function(){
    return  jwt.sign({id : this._id} , process.env.JWT_SECRET , { expiresIn : process.env.JWT_EXPIRE})
}

//Compare password
userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password , this.password)
}

//Generating password Reset Token
userSchema.methods.getResetPasswordToken = function(){

    //Generationg Token

    // const resetToken = crypto.getRandomBytes(20).toString("hex")
    const resetToken = crypto.randomBytes(20).toString("hex")
    // console.log(resetToken);
    //Hashing and adding to userSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken;

}
module.exports = mongoose.model('User' , userSchema)