const express = require('express');
const router = express.Router();
const { extractDocumentData } = require('../controllers/aiController');
const { matchDocuments } = require('../controllers/evidenceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/extract/:documentId', extractDocumentData);
router.post('/match/:invoiceId', matchDocuments);

module.exports = router;
