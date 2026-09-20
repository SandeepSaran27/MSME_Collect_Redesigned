const Document = require('../models/Document');
const Invoice = require('../models/Invoice');

/**
 * Deterministic Cross-Document Matching Service.
 * Compares extracted JSON data across documents (PO, Invoice, Delivery Receipt, Correspondence, Payment Proof)
 * against the master Invoice record.
 */
class DocumentMatchingService {
  async matchInvoiceDocuments(invoiceId) {
    const invoice = await Invoice.findById(invoiceId).populate('customer');
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const documents = await Document.find({ invoice: invoiceId });

    const checks = {
      invoiceNumber: true,
      poNumber: true,
      customerName: true,
      amount: true,
    };

    const warnings = [];
    let checkedCount = 0;
    let passedCount = 0;

    const poDoc = documents.find((d) => d.type === 'purchase_order' && d.extractionStatus === 'completed');
    const invDoc = documents.find((d) => d.type === 'invoice' && d.extractionStatus === 'completed');
    const delDoc = documents.find((d) => d.type === 'delivery_receipt' && d.extractionStatus === 'completed');
    const payDoc = documents.find((d) => d.type === 'payment_proof' && d.extractionStatus === 'completed');

    const masterCustomerName = (invoice.customer ? invoice.customer.companyName || invoice.customer.name : '').toLowerCase();
    const masterAmount = invoice.amount;
    const masterPoNumber = (invoice.poNumber || '').trim().toLowerCase();
    const masterInvNumber = (invoice.invoiceNumber || '').trim().toLowerCase();

    // 1. PO Document Match Checks
    if (poDoc && poDoc.extractedData) {
      const data = poDoc.extractedData;

      // Check PO Amount vs Master Invoice Amount
      if (data.amount !== undefined && data.amount !== null && data.amount > 0) {
        checkedCount++;
        if (Number(data.amount) !== Number(masterAmount)) {
          checks.amount = false;
          warnings.push(`Purchase Order amount ($${data.amount}) differs from master invoice amount ($${masterAmount}).`);
        } else {
          passedCount++;
        }
      }

      // Check PO Number
      if (data.poNumber && masterPoNumber) {
        checkedCount++;
        if (data.poNumber.trim().toLowerCase() !== masterPoNumber) {
          checks.poNumber = false;
          warnings.push(`Purchase Order number '${data.poNumber}' does not match invoice PO number '${invoice.poNumber}'.`);
        } else {
          passedCount++;
        }
      }

      // Check Customer Name
      if (data.customerName && masterCustomerName) {
        checkedCount++;
        if (!data.customerName.toLowerCase().includes(masterCustomerName) && !masterCustomerName.includes(data.customerName.toLowerCase())) {
          checks.customerName = false;
          warnings.push(`PO customer name '${data.customerName}' differs from recorded customer '${invoice.customer.companyName || invoice.customer.name}'.`);
        } else {
          passedCount++;
        }
      }
    } else {
      warnings.push('Purchase Order document is missing or data has not been extracted yet.');
    }

    // 2. Invoice Document Match Checks
    if (invDoc && invDoc.extractedData) {
      const data = invDoc.extractedData;

      if (!data.invoiceNumber) {
        checks.invoiceNumber = false;
        warnings.push('Uploaded Invoice document is missing an extracted invoice number.');
      } else if (masterInvNumber && data.invoiceNumber.trim().toLowerCase() !== masterInvNumber) {
        checks.invoiceNumber = false;
        warnings.push(`Uploaded invoice number '${data.invoiceNumber}' does not match record '${invoice.invoiceNumber}'.`);
      } else {
        checkedCount++;
        passedCount++;
      }
    }

    // 3. Delivery Receipt Document Match Checks
    if (delDoc && delDoc.extractedData) {
      const data = delDoc.extractedData;
      if (data.poNumber && masterPoNumber && data.poNumber.trim().toLowerCase() !== masterPoNumber) {
        warnings.push(`Delivery Receipt refers to PO '${data.poNumber}', which differs from invoice PO '${invoice.poNumber}'.`);
      }
    }

    // Calculate Confidence Score
    let confidence = 100;
    if (checkedCount > 0) {
      confidence = Math.round((passedCount / checkedCount) * 100);
    }

    const matched = checks.invoiceNumber && checks.poNumber && checks.customerName && checks.amount && warnings.length === 0;

    return {
      matched,
      confidence,
      checks,
      warnings,
    };
  }
}

module.exports = new DocumentMatchingService();
