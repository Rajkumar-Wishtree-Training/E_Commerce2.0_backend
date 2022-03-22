const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHandler = require('../utils/errorhandler')


//Create a Product -- Admin
exports.createProduct = catchAsyncErrors( async (req, res, next) => {
        const product = await Product.create(req.body)

        await product.save()

        res.status(201).json({
            success: true,
            product
        })
});
//Get All Product 
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments();
    const apiFeature = new  ApiFeatures(Product.find() , req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount
    })
});
//Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })

});
// Update a Product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true
    });
    await product.save()

    res.status(200).json({
        success: true,
        product
    })
});

//Delete A product --Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }

    await product.remove();

    res.status(200).json({
        success: true,
        product
    })
}
);