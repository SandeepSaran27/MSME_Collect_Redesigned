const express = require('express');
const router = express.Router();
const { generateEvidenceReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/invoices/:invoiceId/evidence-report', protect, generateEvidenceReport);

module.exports = router;
