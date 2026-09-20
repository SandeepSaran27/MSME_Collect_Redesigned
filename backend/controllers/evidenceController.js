const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const Document = require('../models/Document');
const evidenceService = require('../services/evidenceService');
const documentMatchingService = require('../services/documentMatchingService');
const awsBedrockService = require('../services/awsBedrockService');

const getEvidenceReadiness = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, createdBy: req.user._id }).populate('customer');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const readiness = await evidenceService.calculateEvidenceReadiness(invoiceId);
    const documents = await Document.find({ invoice: invoiceId });

    const aiAnalysis = await awsBedrockService.analyzeEvidence({
      invoice,
      documents,
      matchingResults: readiness.matchingResults,
    });

    return res.status(200).json({
      success: true,
      data: {
        ...readiness,
        aiAnalysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

const matchDocuments = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, createdBy: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const matchingResults = await documentMatchingService.matchInvoiceDocuments(invoiceId);

    return res.status(200).json({
      success: true,
      data: matchingResults,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvidenceReadiness,
  matchDocuments,
};
