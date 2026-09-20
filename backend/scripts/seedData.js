const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const Document = require('../models/Document');
const Reminder = require('../models/Reminder');
const Escalation = require('../models/Escalation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/msme_collect';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully. Cleaning existing database collections...');

    // Clear existing collections
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Invoice.deleteMany({});
    await Document.deleteMany({});
    await Reminder.deleteMany({});
    await Escalation.deleteMany({});

    console.log('Creating demo users...');
    const demoUser = await User.create({
      name: 'ABC Furniture Admin',
      email: 'demo@msmecollect.com',
      password: 'password123',
      companyName: 'ABC Furniture Ltd.',
      role: 'owner',
    });

    const accountantUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'accountant@msmecollect.com',
      password: 'password123',
      companyName: 'FinBook Advisory Services',
      role: 'accountant',
    });

    console.log('Creating demo customers...');
    const customers = await Customer.create([
      {
        name: 'XYZ Enterprises Admin',
        companyName: 'XYZ Enterprises',
        email: 'billing@xyzenterprises.in',
        phone: '+91 98765 12345',
        address: '404 Tech Park, Bengaluru, Karnataka, India',
        taxId: '29ABCDE1234F1Z5',
        createdBy: demoUser._id,
      },
      {
        name: 'Robert Vance',
        companyName: 'Acme Manufacturing & Engineering Ltd.',
        email: 'billing@acmemfg.com',
        phone: '+1 555-0142',
        address: '850 Industrial Parkway, Chicago, IL',
        taxId: 'TAX-US-9921',
        createdBy: demoUser._id,
      },
      {
        name: 'Elena Rostova',
        companyName: 'Global Tech Solutions Inc.',
        email: 'accounts@globaltech.io',
        phone: '+1 555-0199',
        address: '420 Innovation Way, Austin, TX',
        taxId: 'TAX-US-4412',
        createdBy: demoUser._id,
      },
    ]);

    const today = new Date();
    const daysAgo = (days) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    console.log('Creating hackathon demo invoice (ABC Furniture scenario)...');
    const hackathonInvoice = await Invoice.create({
      invoiceNumber: 'INV-2026-1001',
      customer: customers[0]._id,
      amount: 50000,
      invoiceDate: daysAgo(25),
      dueDate: new Date('2026-09-25'),
      poNumber: 'PO-8820',
      description: 'Supply of 100 Executive Office Chairs',
      paymentStatus: 'unpaid',
      invoiceStatus: 'overdue',
      evidenceScore: 75,
      createdBy: demoUser._id,
    });

    console.log('Creating additional realistic invoices...');
    const invoices = await Invoice.create([
      {
        invoiceNumber: 'INV-2026-001',
        customer: customers[1]._id,
        amount: 45000,
        invoiceDate: daysAgo(40),
        dueDate: daysAgo(10),
        poNumber: 'PO-ACME-884',
        description: 'Supply of heavy duty industrial valves and flange assemblies.',
        paymentStatus: 'paid',
        invoiceStatus: 'paid',
        evidenceScore: 100,
        createdBy: demoUser._id,
      },
      {
        invoiceNumber: 'INV-2026-002',
        customer: customers[2]._id,
        amount: 28500,
        invoiceDate: daysAgo(45),
        dueDate: daysAgo(15),
        poNumber: 'PO-GTS-551',
        description: 'Custom SaaS platform integration and backend API development.',
        paymentStatus: 'unpaid',
        invoiceStatus: 'escalated',
        evidenceScore: 75,
        createdBy: demoUser._id,
      },
    ]);

    console.log('Creating supporting evidence documents for ABC Furniture scenario...');
    await Document.create({
      invoice: hackathonInvoice._id,
      type: 'purchase_order',
      originalName: 'PO_8820_XYZ_Enterprises.pdf',
      fileName: 'po_8820.pdf',
      fileUrl: '/uploads/po_8820.pdf',
      mimeType: 'application/pdf',
      fileSize: 245000,
      extractionStatus: 'completed',
      extractedData: {
        poNumber: 'PO-8820',
        customerName: 'XYZ Enterprises',
        amount: 50000,
        orderedQuantity: 100,
        unitPrice: 500,
        orderDate: '2026-09-01',
      },
      uploadedBy: demoUser._id,
    });

    await Document.create({
      invoice: hackathonInvoice._id,
      type: 'invoice',
      originalName: 'Invoice_INV-2026-1001.pdf',
      fileName: 'inv_1001.pdf',
      fileUrl: '/uploads/inv_1001.pdf',
      mimeType: 'application/pdf',
      fileSize: 180000,
      extractionStatus: 'completed',
      extractedData: {
        invoiceNumber: 'INV-2026-1001',
        poNumber: 'PO-8820',
        customerName: 'XYZ Enterprises',
        amount: 50000,
        invoicedQuantity: 100,
        unitPrice: 500,
        invoiceDate: '2026-09-01',
        dueDate: '2026-09-25',
      },
      uploadedBy: demoUser._id,
    });

    await Document.create({
      invoice: hackathonInvoice._id,
      type: 'delivery_receipt',
      originalName: 'Delivery_Proof_XYZ_80units.pdf',
      fileName: 'pod_8820.pdf',
      fileUrl: '/uploads/pod_8820.pdf',
      mimeType: 'application/pdf',
      fileSize: 310000,
      extractionStatus: 'completed',
      extractedData: {
        poNumber: 'PO-8820',
        deliveryDate: '2026-09-05',
        deliveredQuantity: 80,
        deliveryStatus: 'PARTIAL_DELIVERY',
        receivedBy: 'XYZ Warehouse Store Manager',
        notes: 'Received 80 chairs in good condition. 20 chairs pending backorder delivery.',
      },
      uploadedBy: demoUser._id,
    });

    await Document.create({
      invoice: hackathonInvoice._id,
      type: 'correspondence',
      originalName: 'Email_XYZ_Quantity_Discrepancy.pdf',
      fileName: 'corr_8820.pdf',
      fileUrl: '/uploads/corr_8820.pdf',
      mimeType: 'application/pdf',
      fileSize: 120000,
      extractionStatus: 'completed',
      extractedData: {
        customerName: 'XYZ Enterprises',
        invoiceNumber: 'INV-2026-1001',
        poNumber: 'PO-8820',
        summary: 'XYZ Enterprises requested invoice amendment for 80 delivered units prior to payment processing.',
      },
      uploadedBy: demoUser._id,
    });

    console.log('\n========================================');
    console.log('DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('========================================');
    console.log('You can now log in with:');
    console.log('  Email:    demo@msmecollect.com');
    console.log('  Password: password123');
    console.log('========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
