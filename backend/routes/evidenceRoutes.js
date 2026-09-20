const express = require('express');
const router = express.Router();
const { getEvidenceReadiness } = require('../controllers/evidenceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/invoices/:invoiceId/evidence', protect, getEvidenceReadiness);

module.exports = router;
