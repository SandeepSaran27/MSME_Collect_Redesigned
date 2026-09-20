const mongoose = require('mongoose');
const Document = require('../models/Document');
const Invoice = require('../models/Invoice');
const aiExtractionService = require('../services/aiExtractionService');

// @desc    Trigger AI structured data extraction for document
// @route   POST /api/ai/extract/:documentId
// @access  Private
const extractDocumentData = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ success: false, message: 'Invalid Document ID format' });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const invoice = await Invoice.findOne({ _id: document.invoice, createdBy: req.user._id }).populate('customer');
    if (!invoice) {
      return res.status(403).json({ success: false, message: 'Not authorized to extract data for this document' });
    }

    const updatedDoc = await aiExtractionService.extractDocumentData(document, invoice);

    return res.status(200).json({
      success: true,
      data: updatedDoc,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  extractDocumentData,
};
