const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apifeatures');
const ErrorHandler = require('../utils/errorhandler')


//Create a Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const user = req.user.id;
    req.body.user = user
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
    const apiFeature = new ApiFeatures(Product.find(), req.query)
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

//Create A New Review Or Update A Review
exports.createProductReviewOrUpdateReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId)
    if(!product){
        return next(new ErrorHandler("Product Not Found" , 404))
    }
    // if Product is Reviewed or not
    let isReviewed = undefined
    //run foreach loop in products reviews array 
    product.reviews.forEach((rev, i) => {
        if (rev.user.toString() === req.user.id.toString()) {
            //I product find as Reviewed then as it's index from  product.reviews array. 
            isReviewed = i;
            return
        }
    });
    if (isReviewed !== undefined) {
        product.reviews[isReviewed].rating = rating
        product.reviews[isReviewed].comment = comment
    }
    else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })
    product.ratings = avg / product.reviews.length

    await product.save({ runValidators: false })

    res.status(200).json({
        success: true,
    })
})

//Get Reviews of Single Product
exports.getProductReview = catchAsyncErrors(async(req , res , next) => {
    const product =await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("Product Not found" , 404))
    }
    res.status(200).json({
        success : true,
        reviews : product.reviews
    })
})

//Delete Product Review
exports.deleteProductReview = catchAsyncErrors(async (req , res , next) => {
    const product =await Product.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler("Product Not found" , 404))
    }
    
    const reviews = product.reviews.filter((rev) =>
        rev._id.toString() !== req.query.id.toString()
    )
    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating
    })
    const ratings = avg / reviews.length
    const numOfReviews = reviews.length
    // console.log(ratings , numOfReviews);
    await Product.findByIdAndUpdate(req.query.productId , {
        reviews,
        ratings : Number(ratings),
        numOfReviews
    },
    {
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success : true,

    })

})