const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const Document = require('../models/Document');
const awsBedrockService = require('../services/awsBedrockService');

const followUpsStore = [];

const generateFollowUp = async (req, res, next) => {
  try {
    const { invoiceId, tone } = req.body;

    let invoice = null;
    let customerName = 'XYZ Enterprises';
    let invoiceNumber = 'INV-2026-1001';
    let amount = 50000;
    let dueDate = '2026-09-25';
    let issues = [];

    if (invoiceId && mongoose.Types.ObjectId.isValid(invoiceId)) {
      invoice = await Invoice.findById(invoiceId).populate('customer');
      if (invoice) {
        invoiceNumber = invoice.invoiceNumber;
        amount = invoice.amount;
        dueDate = new Date(invoice.dueDate).toISOString().split('T')[0];
        customerName = invoice.customer ? (invoice.customer.companyName || invoice.customer.name) : 'Customer';

        const docs = await Document.find({ invoice: invoiceId });
        const delDoc = docs.find((d) => d.type === 'delivery_receipt');
        if (delDoc && delDoc.extractedData?.deliveredQuantity < 100) {
          issues.push({ type: 'QUANTITY_MISMATCH' });
        }
      }
    }

    const draft = await awsBedrockService.generateFollowUpEmail({
      customerName,
      invoiceNumber,
      amount,
      dueDate,
      issues,
      tone: tone || 'POLITE_FIRM',
    });

    return res.status(200).json({
      success: true,
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

const saveFollowUp = async (req, res, next) => {
  try {
    const { invoiceId, subject, body, customerName } = req.body;

    const newFollowUp = {
      _id: new mongoose.Types.ObjectId().toString(),
      invoiceId,
      customerName: customerName || 'Customer',
      subject,
      body,
      createdAt: new Date().toISOString(),
      status: 'SAVED_DRAFT',
      createdBy: req.user._id,
    };

    followUpsStore.push(newFollowUp);

    return res.status(201).json({
      success: true,
      data: newFollowUp,
    });
  } catch (error) {
    next(error);
  }
};

const getFollowUps = async (req, res, next) => {
  try {
    const userFollowUps = followUpsStore.filter((f) => String(f.createdBy) === String(req.user._id));
    return res.status(200).json({
      success: true,
      data: userFollowUps,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateFollowUp,
  saveFollowUp,
  getFollowUps,
};
