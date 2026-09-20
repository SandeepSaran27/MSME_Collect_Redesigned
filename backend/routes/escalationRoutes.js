const express = require('express');
const router = express.Router();
const {
  escalateInvoice,
  getEscalations,
  getEscalationById,
  updateEscalation,
} = require('../controllers/escalationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/invoices/:invoiceId/escalate', escalateInvoice);

router.route('/')
  .get(getEscalations);

router.route('/:id')
  .get(getEscalationById)
  .put(updateEscalation);

module.exports = router;
