const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const Document = require('../models/Document');
const Escalation = require('../models/Escalation');
const evidenceService = require('./evidenceService');
const { calculateInvoiceStatus } = require('./invoiceStatusService');

class PDFService {
  async generateEvidenceReport(invoiceId, res) {
    const invoice = await Invoice.findById(invoiceId).populate('customer');
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const { daysOverdue, status: currentStatus } = calculateInvoiceStatus(invoice);
    const evidenceData = await evidenceService.calculateEvidenceReadiness(invoiceId);
    const escalation = await Escalation.findOne({ invoice: invoiceId }).sort({ createdAt: -1 });
    const documents = await Document.find({ invoice: invoiceId });

    // Set HTTP Headers for PDF Download stream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Evidence_Report_${invoice.invoiceNumber}.pdf`);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    // Document Header
    doc.fillColor('#1e293b').fontSize(22).text('MSME Collect', { align: 'left' });
    doc.fontSize(10).fillColor('#64748b').text('Factual Invoice Collection & Evidence Readiness Summary Report', { align: 'left' });
    doc.moveDown(0.5);
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Section 1: Invoice & Customer Summary
    doc.fontSize(14).fillColor('#0f172a').text('1. Invoice & Customer Information', { underline: true });
    doc.moveDown(0.5);

    const custName = invoice.customer ? invoice.customer.companyName || invoice.customer.name : 'N/A';
    const custEmail = invoice.customer ? invoice.customer.email : 'N/A';

    doc.fontSize(10).fillColor('#334155');
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Customer / Debtor: ${custName} (${custEmail})`);
    doc.text(`Invoice Amount: $${invoice.amount.toLocaleString()}`);
    doc.text(`PO Number: ${invoice.poNumber || 'None specified'}`);
    doc.text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    doc.text(`Payment Status: ${invoice.paymentStatus.toUpperCase()}`);
    doc.text(`Current Invoice Status: ${invoice.invoiceStatus.toUpperCase()}`);
    doc.text(`Days Overdue: ${daysOverdue} days`);
    doc.moveDown(1.5);

    // Section 2: Evidence Checklist & Score
    doc.fontSize(14).fillColor('#0f172a').text('2. Evidence Readiness Checklist', { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#1e293b').text(`Readiness Score: ${evidenceData.score}% (${evidenceData.status.toUpperCase()})`);
    doc.moveDown(0.5);

    const checklist = [
      { name: 'Purchase Order (PO)', key: 'purchase_order' },
      { name: 'Invoice Document', key: 'invoice' },
      { name: 'Delivery Receipt / Proof of Delivery', key: 'delivery_receipt' },
      { name: 'Correspondence / Written Communications', key: 'correspondence' },
    ];

    checklist.forEach((item) => {
      const isAvailable = evidenceData.documents[item.key];
      const statusSymbol = isAvailable ? '[ PRESENT ]' : '[ MISSING ]';
      const color = isAvailable ? '#166534' : '#991b1b';
      doc.fontSize(10).fillColor(color).text(` ${statusSymbol}  ${item.name}`);
    });

    if (evidenceData.missingDocuments.length > 0) {
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#b91c1c').text(`Missing Document Types: ${evidenceData.missingDocuments.join(', ')}`);
    }
    doc.moveDown(1.5);

    // Section 3: Document Matching & Integrity Audit
    doc.fontSize(14).fillColor('#0f172a').text('3. Cross-Document Matching & Integrity Verification', { underline: true });
    doc.moveDown(0.5);

    const checks = evidenceData.matchingResults.checks || {};
    doc.fontSize(10).fillColor('#334155');
    doc.text(`- Invoice Number Match: ${checks.invoiceNumber ? 'PASS' : 'WARNING / FAIL'}`);
    doc.text(`- PO Number Match: ${checks.poNumber ? 'PASS' : 'WARNING / FAIL'}`);
    doc.text(`- Customer Name Match: ${checks.customerName ? 'PASS' : 'WARNING / FAIL'}`);
    doc.text(`- Amount Match: ${checks.amount ? 'PASS' : 'WARNING / FAIL'}`);
    doc.text(`- Matching Confidence Index: ${evidenceData.matchingResults.confidence}%`);

    if (evidenceData.matchingResults.warnings && evidenceData.matchingResults.warnings.length > 0) {
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#c2410c').text('Audit Warnings Detected:');
      evidenceData.matchingResults.warnings.forEach((warn) => {
        doc.text(`  • ${warn}`);
      });
    }
    doc.moveDown(1.5);

    // Section 4: Escalation Notes (If exists)
    if (escalation) {
      doc.fontSize(14).fillColor('#0f172a').text('4. Escalation Log Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#334155');
      doc.text(`Escalation Date: ${new Date(escalation.createdAt).toLocaleDateString()}`);
      doc.text(`Escalation Status: ${escalation.status.toUpperCase()}`);
      doc.text(`Reason: ${escalation.reason}`);
      if (escalation.notes) doc.text(`Notes: ${escalation.notes}`);
      doc.moveDown(1.5);
    }

    // Disclaimer Footer
    doc.moveDown(1);
    doc.fontSize(8).fillColor('#94a3b8').text(
      'Disclaimer: This report is an automated factual summary of evidence documents registered in MSME Collect. It is provided for record-keeping and audit-readiness purposes and does not constitute formal legal advice or binding legal claims.',
      { align: 'justify' }
    );

    doc.end();
  }
}

module.exports = new PDFService();
