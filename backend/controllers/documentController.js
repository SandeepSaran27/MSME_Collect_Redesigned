const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const Invoice = require('../models/Invoice');
const evidenceService = require('../services/evidenceService');

// @desc    Upload document file & save document record
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a document file' });
    }

    const { invoiceId, type } = req.body;

    if (!invoiceId || !type) {
      // Remove uploaded file if missing metadata
      if (req.file.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Invoice ID and document type are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      if (req.file.path) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, createdBy: req.user._id });
    if (!invoice) {
      if (req.file.path) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const document = await Document.create({
      invoice: invoiceId,
      type,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileUrl,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      extractedData: {},
      extractionStatus: 'pending',
      uploadedBy: req.user._id,
    });

    // Recalculate evidence score automatically
    await evidenceService.calculateEvidenceReadiness(invoiceId);

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all documents for a specific invoice
// @route   GET /api/documents/invoice/:invoiceId
// @access  Private
const getDocumentsByInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, createdBy: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const documents = await Document.find({ invoice: invoiceId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Document ID format' });
    }

    const document = await Document.findById(req.params.id).populate('invoice');
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Security check: verify owner
    if (document.uploadedBy.toString() !== req.user._id.toString() && document.invoice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this document' });
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Document ID format' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const invoice = await Invoice.findOne({ _id: document.invoice, createdBy: req.user._id });
    if (!invoice) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this document' });
    }

    // Remove file from disk if exists
    const filePath = path.join(__dirname, '../uploads', document.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const invoiceId = document.invoice;
    await document.deleteOne();

    // Recalculate evidence score automatically
    await evidenceService.calculateEvidenceReadiness(invoiceId);

    return res.status(200).json({
      success: true,
      message: 'Document removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocumentsByInvoice,
  getDocumentById,
  deleteDocument,
};
