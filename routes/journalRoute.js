const express = require('express');

const router = express.Router();
const journalController = require('../controllers/journalCTL')

router.post('/post-journal', journalController.postAddJournal);

router.get('/get-journal', journalController.getJournal);

router.post('/get-journal-postId', journalController.getUserIdByTimeStamp);

router.post('/delete-journal', journalController.deleteJournal);

module.exports = router;