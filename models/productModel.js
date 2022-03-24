const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , "Please Enter Product Name"]
    },
    description : {
       type: String,
       required : [true , "Please Enter Product Description"]
    },
    price :{
        type : Number,
        required : [true , "Please Enter Product Price"],
        max : [2000000 , "product value can't exceed from 20 lac"]
    },
    rating : {
        type : Number,
        default : 0
    },
    images : [
        {
            public_id:{
                type : String,
                required : true
            },
            url:{
                type : String,
                required : true
            }

        }
    ],
    category:{
        type : String,
        required : [true , 'Please Enter Product Category']
    },
    stock : {
        type : Number,
        required : [true, "Please Enter Product Stock"], 
        max : [999 , "stock can not exceed from 9999"]
    },
    numOfReviews:{
        type : Number,
        default : 0   
    },
    reviews : [
        {
            name : {
                type : String,
                required : true
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Types.ObjectId,
        ref : 'User',
        required : true
    },
    createdAt:{
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Product',productSchema)