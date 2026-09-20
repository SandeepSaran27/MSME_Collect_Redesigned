const express = require('express');
const router = express.Router();
const { generateFollowUp, saveFollowUp, getFollowUps } = require('../controllers/followUpController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateFollowUp);
router.post('/', saveFollowUp);
router.get('/', getFollowUps);

module.exports = router;
