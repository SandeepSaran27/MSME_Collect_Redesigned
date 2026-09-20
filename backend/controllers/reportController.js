const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const pdfService = require('../services/pdfService');

// @desc    Generate and stream PDF Evidence Summary Report
// @route   GET /api/invoices/:invoiceId/evidence-report
// @access  Private
const generateEvidenceReport = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, createdBy: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    await pdfService.generateEvidenceReport(invoiceId, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateEvidenceReport,
};
