const express = require('express')
const { getAllProducts  ,createProduct , updateProduct, deleteProduct, getProductDetails, createProductReviewOrUpdateReview, getProductReview, deleteProductReview } = require('../controllers/productController');
const { isAuthenticated , isAdmin } = require('../middlewares/auth');

const router = express.Router()

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post( isAuthenticated , isAdmin('admin') ,createProduct)
router.route('/admin/product/update/:id').put(isAuthenticated ,isAdmin('admin'), updateProduct)
router.route('/admin/product/delete/:id').delete(isAuthenticated ,isAdmin('admin'), deleteProduct)
router.route('/product/:id').get(getProductDetails)
router.route('/review').post(isAuthenticated , createProductReviewOrUpdateReview)
router.route('/reviews').get(getProductReview).delete(isAuthenticated , deleteProductReview)
module.exports = router 