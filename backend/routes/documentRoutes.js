const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocumentsByInvoice,
  getDocumentById,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/invoice/:invoiceId', getDocumentsByInvoice);

router.route('/:id')
  .get(getDocumentById)
  .delete(deleteDocument);

module.exports = router;
