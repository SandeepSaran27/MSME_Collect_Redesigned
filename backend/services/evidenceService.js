const Document = require('../models/Document');
const Invoice = require('../models/Invoice');
const documentMatchingService = require('./documentMatchingService');

/**
 * Evidence Readiness Engine.
 * Required checklist (4 core documents):
 * 1. purchase_order
 * 2. invoice
 * 3. delivery_receipt
 * 4. correspondence
 *
 * Payment proof is optional.
 */
class EvidenceService {
  async calculateEvidenceReadiness(invoiceId) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const documents = await Document.find({ invoice: invoiceId });

    const requiredTypes = ['purchase_order', 'invoice', 'delivery_receipt', 'correspondence'];

    const docAvailability = {
      purchase_order: false,
      invoice: false,
      delivery_receipt: false,
      correspondence: false,
      payment_proof: false,
    };

    documents.forEach((doc) => {
      if (docAvailability.hasOwnProperty(doc.type)) {
        docAvailability[doc.type] = true;
      }
    });

    const missingDocuments = [];
    let availableCount = 0;

    requiredTypes.forEach((type) => {
      if (docAvailability[type]) {
        availableCount++;
      } else {
        missingDocuments.push(type);
      }
    });

    const score = Math.round((availableCount / requiredTypes.length) * 100);
    const status = score === 100 ? 'complete' : 'incomplete';

    // Update the invoice score dynamically
    invoice.evidenceScore = score;
    await invoice.save();

    // Fetch document matching engine warnings
    let matchingResults = { matched: true, confidence: 100, checks: {}, warnings: [] };
    try {
      matchingResults = await documentMatchingService.matchInvoiceDocuments(invoiceId);
    } catch (err) {
      console.error('Matching warning computation error:', err.message);
    }

    return {
      score,
      status,
      documents: docAvailability,
      missingDocuments,
      matchingResults,
    };
  }
}

module.exports = new EvidenceService();
