const express = require("express")
const router = express.Router()
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getSingleUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController')
const { isAuthenticated, isAdmin } = require('../middlewares/auth');


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').get(logoutUser)
router.route('/me').get(isAuthenticated, getUserDetails)
router.route('/password/update').put(isAuthenticated, updatePassword)
router.route('/me/update').put(isAuthenticated, updateProfile)
router.route('/admin/users').get(isAuthenticated , isAdmin("admin") , getAllUsers)
router.route('/admin/user/:id')
.get(isAuthenticated , isAdmin("admin") , getSingleUser)
.put(isAuthenticated , isAdmin("admin") , updateUser)
.delete(isAuthenticated , isAdmin("admin") , deleteUser)
// router.route('/admin/')

module.exports = router