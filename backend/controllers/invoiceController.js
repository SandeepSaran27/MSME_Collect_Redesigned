const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { calculateInvoiceStatus } = require('../services/invoiceStatusService');
const evidenceService = require('../services/evidenceService');

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
  try {
    const { invoiceNumber, customer, amount, invoiceDate, dueDate, poNumber, description } = req.body;

    if (!invoiceNumber || !customer || amount === undefined || !invoiceDate || !dueDate) {
      return res.status(400).json({ success: false, message: 'Invoice number, customer, amount, invoice date, and due date are required' });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({ success: false, message: 'Invoice amount cannot be negative' });
    }

    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({ success: false, message: 'Invalid Customer ID format' });
    }

    // Verify customer belongs to authenticated user
    const customerExists = await Customer.findOne({ _id: customer, createdBy: req.user._id });
    if (!customerExists) {
      return res.status(404).json({ success: false, message: 'Referenced Customer not found' });
    }

    // Check unique invoice number for user
    const duplicateInv = await Invoice.findOne({ createdBy: req.user._id, invoiceNumber });
    if (duplicateInv) {
      return res.status(400).json({ success: false, message: `Invoice number '${invoiceNumber}' already exists in your account` });
    }

    const initialStatus = calculateInvoiceStatus({ paymentStatus: 'unpaid', dueDate }).status;

    const invoice = await Invoice.create({
      invoiceNumber,
      customer,
      amount: Number(amount),
      invoiceDate: new Date(invoiceDate),
      dueDate: new Date(dueDate),
      poNumber: poNumber || '',
      description: description || '',
      paymentStatus: 'unpaid',
      invoiceStatus: initialStatus,
      evidenceScore: 0,
      createdBy: req.user._id,
    });

    const populatedInvoice = await Invoice.findById(invoice._id).populate('customer', 'name companyName email phone');

    return res.status(201).json({
      success: true,
      data: populatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices for user (with optional query filters)
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const { status, paymentStatus, customer } = req.query;

    const filter = { createdBy: req.user._id };

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }
    if (status) {
      filter.invoiceStatus = status;
    }
    if (customer && mongoose.Types.ObjectId.isValid(customer)) {
      filter.customer = customer;
    }

    const invoices = await Invoice.find(filter).populate('customer', 'name companyName email').sort({ createdAt: -1 });

    // Synchronize statuses in response
    const syncedInvoices = invoices.map((inv) => {
      const { status: computedStatus, daysUntilDue, daysOverdue } = calculateInvoiceStatus(inv);
      const invObj = inv.toObject();
      if (inv.paymentStatus !== 'paid' && inv.invoiceStatus !== 'escalated') {
        invObj.invoiceStatus = computedStatus;
      }
      invObj.daysUntilDue = daysUntilDue;
      invObj.daysOverdue = daysOverdue;
      return invObj;
    });

    return res.status(200).json({
      success: true,
      count: syncedInvoices.length,
      data: syncedInvoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('customer');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const { status: computedStatus, daysUntilDue, daysOverdue } = calculateInvoiceStatus(invoice);
    if (invoice.paymentStatus !== 'paid' && invoice.invoiceStatus !== 'escalated' && invoice.invoiceStatus !== computedStatus) {
      invoice.invoiceStatus = computedStatus;
      await invoice.save();
    }

    const invObj = invoice.toObject();
    invObj.daysUntilDue = daysUntilDue;
    invObj.daysOverdue = daysOverdue;

    return res.status(200).json({
      success: true,
      data: invObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    let invoice = await Invoice.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const { invoiceNumber, customer, amount, invoiceDate, dueDate, poNumber, description, paymentStatus } = req.body;

    if (amount !== undefined && Number(amount) < 0) {
      return res.status(400).json({ success: false, message: 'Invoice amount cannot be negative' });
    }

    if (customer && mongoose.Types.ObjectId.isValid(customer)) {
      const custExists = await Customer.findOne({ _id: customer, createdBy: req.user._id });
      if (!custExists) {
        return res.status(404).json({ success: false, message: 'Referenced Customer not found' });
      }
      invoice.customer = customer;
    }

    if (invoiceNumber) invoice.invoiceNumber = invoiceNumber;
    if (amount !== undefined) invoice.amount = Number(amount);
    if (invoiceDate) invoice.invoiceDate = new Date(invoiceDate);
    if (dueDate) invoice.dueDate = new Date(dueDate);
    if (poNumber !== undefined) invoice.poNumber = poNumber;
    if (description !== undefined) invoice.description = description;

    if (paymentStatus) {
      invoice.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') {
        invoice.invoiceStatus = 'paid';
      }
    }

    // Recalculate status dynamically
    if (invoice.paymentStatus !== 'paid' && invoice.invoiceStatus !== 'escalated') {
      const { status } = calculateInvoiceStatus(invoice);
      invoice.invoiceStatus = status;
    }

    await invoice.save();

    const updatedPopulated = await Invoice.findById(invoice._id).populate('customer');

    return res.status(200).json({
      success: true,
      data: updatedPopulated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Invoice ID format' });
    }

    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Invoice removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
