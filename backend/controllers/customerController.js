const mongoose = require('mongoose');
const Customer = require('../models/Customer');

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res, next) => {
  try {
    const { name, companyName, email, phone, address, taxId } = req.body;

    if (!name || !companyName || !email) {
      return res.status(400).json({ success: false, message: 'Name, Company Name, and Email are required' });
    }

    const customer = await Customer.create({
      name,
      companyName,
      email,
      phone: phone || '',
      address: address || '',
      taxId: taxId || '',
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers for authenticated user
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Customer ID format' });
    }

    const customer = await Customer.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Customer ID format' });
    }

    let customer = await Customer.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const { name, companyName, email, phone, address, taxId } = req.body;

    customer.name = name || customer.name;
    customer.companyName = companyName || customer.companyName;
    customer.email = email || customer.email;
    customer.phone = phone !== undefined ? phone : customer.phone;
    customer.address = address !== undefined ? address : customer.address;
    customer.taxId = taxId !== undefined ? taxId : customer.taxId;

    await customer.save();

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Customer ID format' });
    }

    const customer = await Customer.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Customer removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
