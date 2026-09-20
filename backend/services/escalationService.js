const Escalation = require('../models/Escalation');
const Invoice = require('../models/Invoice');
const { calculateInvoiceStatus } = require('./invoiceStatusService');
const evidenceService = require('./evidenceService');

class EscalationService {
  async escalateInvoice(invoiceId, reason, notes, userId) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const { daysOverdue } = calculateInvoiceStatus(invoice);
    const evidenceReadiness = await evidenceService.calculateEvidenceReadiness(invoiceId);

    // Create Escalation Record storing current snapshot
    const escalation = await Escalation.create({
      invoice: invoiceId,
      reason,
      notes: notes || '',
      daysOverdue: daysOverdue || 0,
      evidenceScore: evidenceReadiness.score,
      status: 'pending',
      createdBy: userId,
    });

    // Update invoice status without altering payment status
    if (invoice.paymentStatus !== 'paid') {
      invoice.invoiceStatus = 'escalated';
      await invoice.save();
    }

    return escalation;
  }

  async getEscalations(userId) {
    return await Escalation.find({ createdBy: userId })
      .populate({
        path: 'invoice',
        populate: { path: 'customer', select: 'name companyName email' },
      })
      .sort({ createdAt: -1 });
  }

  async getEscalationById(escalationId, userId) {
    const escalation = await Escalation.findOne({ _id: escalationId, createdBy: userId }).populate({
      path: 'invoice',
      populate: { path: 'customer' },
    });
    if (!escalation) {
      throw new Error('Escalation record not found');
    }
    return escalation;
  }

  async updateEscalation(escalationId, status, notes, userId) {
    const escalation = await Escalation.findOne({ _id: escalationId, createdBy: userId });
    if (!escalation) {
      throw new Error('Escalation record not found');
    }

    if (status) escalation.status = status;
    if (notes !== undefined) escalation.notes = notes;
    if (status === 'resolved') {
      escalation.resolvedAt = new Date();
    }

    await escalation.save();
    return escalation;
  }
}

module.exports = new EscalationService();
