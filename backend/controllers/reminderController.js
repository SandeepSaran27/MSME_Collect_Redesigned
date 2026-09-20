const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const reminderService = require('../services/reminderService');

// @desc    Create and send a payment reminder for invoice
// @route   POST /api/reminders/:invoiceId
// @access  Private
const createReminder = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { type, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, createdBy: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const reminder = await reminderService.createReminder(invoiceId, type || 'overdue', message, req.user._id);

    return res.status(201).json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reminders history for invoice
// @route   GET /api/reminders/invoice/:invoiceId
// @access  Private
const getRemindersByInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, createdBy: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const reminders = await reminderService.getRemindersByInvoice(invoiceId);

    return res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReminder,
  getRemindersByInvoice,
};
