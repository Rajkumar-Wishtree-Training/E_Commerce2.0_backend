const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'Please Enter address']
        },
        city: {
            type: String,
            required: [true, "Please Enter City"]
        },
        state: {
            type: String,
            required: [true, "Please Enter State"]
        },
        pinCode: {
            type: Number,
            required: [true, "Please Enter Pincode"]
        },
        phoneNo: {
            type: Number,
            required: [true, "Please Enter Phone no"]
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, "Please Enter Name"]
            },
            price: {
                type: Number,
                required: [true, "please Enter Price"]
            },
            quantity: {
                type: Number,
                required: [true, "please Enter Price"]
            },
            image: {
                type: String,
                required: [true, "please Enter Image"]
            },
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}
)
module.exports = mongoose.model("Order", orderSchema)