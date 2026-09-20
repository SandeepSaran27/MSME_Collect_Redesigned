const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, getOAuthConfig, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/oauth-config', getOAuthConfig);
router.get('/me', protect, getMe);

module.exports = router;
