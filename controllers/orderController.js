const Order = require('../models/orderModel')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler')

//Create New Order
exports.newOrder = catchAsyncErrors(async (req , res , next) => {
    req.body.user = req.user.id;
    req.body.paidAt = Date.now()
    const order = await Order.create(req.body)

    await order.save()

    res.status(201).json({
        success : true,
        order
    })
})

//Get a Single Order -- Admin
exports.getSingleOrder = catchAsyncErrors(async (req , res , next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if(!order){
        return next(new ErrorHandler('Order not found With Given Id' , 404))
    }
    res.status(200).json({
        success : true,
        order
    })
})

//Get All Orders Of LogedIn User 
exports.myOrders = catchAsyncErrors(async (req , res , next) => {
    const orders = await Order.find({user : req.user._id})
    res.status(200).json({
        success : true,
        orders
        
    })
})

//Get All Orders --Admin 
exports.getAllOrders = catchAsyncErrors(async (req , res , next) => {
    const orders = await Order.find()

    let totalAmount = 0;
    orders.forEach(order =>{
        totalAmount+= order.totalPrice
    })
    res.status(200).json({
        success : true,
        totalAmount,
        orders,
        
        
    })
})

//Update Order Status --Admin
exports.updateOrderStatus = catchAsyncErrors(async (req , res , next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler('Order not found With Given Id' , 404))
    }
    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('You already Delivered This order' , 400))
    }

    order.orderItems.forEach(async order => {
        await updateStock(order.product , order.quantity)
    });

    order.orderStatus = req.body.orderStatus;
    if(order.orderStatus === 'Delivered'){
        order.deliverdAt = Date.now()
    }

    await order.save({ validateBeforeSave : false });
    res.status(200).json({
        success : true
    })
})

async function updateStock(id , quantity){
    const product = await Product.findById(id);

    product.stock -= quantity; 

    await product.save({validateBeforeSave : false})

}

//Delete Orders --Admin 
exports.deleteOrder = catchAsyncErrors(async (req , res , next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler('Order not found With Given Id' , 404))
    }
    await order.remove()
    res.status(200).json({
        success : true,
    })
})