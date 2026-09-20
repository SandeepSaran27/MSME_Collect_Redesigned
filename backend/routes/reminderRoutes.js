const express = require('express');
const router = express.Router();
const { createReminder, getRemindersByInvoice } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/:invoiceId', createReminder);
router.get('/invoice/:invoiceId', getRemindersByInvoice);

module.exports = router;
