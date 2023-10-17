//Xác nhận người dùng khi login

const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var auth_controller = require('../controllers/auth.controller');
var user_controller = require('../controllers/userCTL');
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', auth_controller.test);

// router.get('/login', auth_controller.login);

router.post('/login', auth_controller.post_Login);

router.post('/signup', auth_controller.post_Signin, user_controller.user_create);

router.post('/password', auth_controller.forgetpassword, user_controller.changePassword)

module.exports = router;