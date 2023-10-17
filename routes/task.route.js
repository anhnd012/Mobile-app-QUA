const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var task_controller = require('../controllers/task.controller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test1', task_controller.test);

//create
router.post('/create', task_controller.task_create);

//read
router.post('/get_all_task', task_controller.get_all_task);
router.post('/getOne', task_controller.task_details);


//update
router.put('/update', task_controller.task_update);
router.put('/finish', task_controller.task_finished);

//delete
router.delete('/delete', task_controller.task_delete);

module.exports = router;