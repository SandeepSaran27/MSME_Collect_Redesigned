const mongoose = require('mongoose');
const escalationService = require('../services/escalationService');

// @desc    Escalate overdue invoice
// @route   POST /api/invoices/:invoiceId/escalate
// @access  Private
const escalateInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Escalation reason is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const escalation = await escalationService.escalateInvoice(invoiceId, reason, notes, req.user._id);

    return res.status(201).json({
      success: true,
      data: escalation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all escalations for user
// @route   GET /api/escalations
// @access  Private
const getEscalations = async (req, res, next) => {
  try {
    const escalations = await escalationService.getEscalations(req.user._id);
    return res.status(200).json({
      success: true,
      count: escalations.length,
      data: escalations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single escalation by ID
// @route   GET /api/escalations/:id
// @access  Private
const getEscalationById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Escalation ID format' });
    }

    const escalation = await escalationService.getEscalationById(req.params.id, req.user._id);
    return res.status(200).json({
      success: true,
      data: escalation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update escalation status/notes
// @route   PUT /api/escalations/:id
// @access  Private
const updateEscalation = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Escalation ID format' });
    }

    const escalation = await escalationService.updateEscalation(req.params.id, status, notes, req.user._id);

    return res.status(200).json({
      success: true,
      data: escalation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  escalateInvoice,
  getEscalations,
  getEscalationById,
  updateEscalation,
};
