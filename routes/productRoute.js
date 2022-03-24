const express = require('express')
const { getAllProducts  ,createProduct , updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const { isAuthenticated , isAdmin } = require('../middlewares/auth');

const router = express.Router()

router.route("/products").get(getAllProducts);
router.route("/product/new").post( isAuthenticated , isAdmin('admin') ,createProduct)
router.route('/product/update/:id').put(isAuthenticated ,isAdmin('admin'), updateProduct)
router.route('/product/delete/:id').delete(isAuthenticated ,isAdmin('admin'), deleteProduct)
router.route('/product/:id').get(getProductDetails)
module.exports = router 

