const express = require('express');
const router = express.Router();
const { getAwsArchitectureStatus } = require('../controllers/awsController');

router.get('/status', getAwsArchitectureStatus);

module.exports = router;
