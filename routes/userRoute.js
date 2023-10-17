const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var user_controller = require('../controllers/userCTL');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', user_controller.test);

//create
router.post('/create', user_controller.user_create);

//read
router.post('/', user_controller.user_details);

//update
router.put('/update', user_controller.user_update);
router.put('/changepassword', user_controller.changePassword);

//delete
router.delete('/delete', user_controller.user_delete);

module.exports = router;