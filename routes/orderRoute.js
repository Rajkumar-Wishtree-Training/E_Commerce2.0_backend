const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { isAuthenticated , isAdmin } = require('../middlewares/auth');

const router = express.Router()

router.route("/order/new").post(isAuthenticated ,newOrder)
router.route("/order/me").get(isAuthenticated , myOrders)
router.route("/order/:id").get(isAuthenticated , getSingleOrder)
router.route("/admin/orders").get(isAuthenticated , isAdmin("admin") , getAllOrders)
router.route("/admin/order/:id")
    .put(isAuthenticated , isAdmin("admin") , updateOrderStatus)
    .delete(isAuthenticated , isAdmin("admin") , deleteOrder)


module.exports = router