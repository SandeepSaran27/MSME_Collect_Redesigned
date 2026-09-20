const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const { calculateInvoiceStatus } = require('./invoiceStatusService');

class DashboardService {
  async getSummary(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch all user invoices to synchronize and calculate status dynamically
    const allInvoices = await Invoice.find({ createdBy: userObjectId }).populate('customer', 'name companyName email');

    let totalOutstanding = 0;
    let dueSoonAmount = 0;
    let overdueAmount = 0;
    let paidAmount = 0;

    let totalInvoices = allInvoices.length;
    let overdueInvoicesCount = 0;
    let dueSoonInvoicesCount = 0;
    let evidenceIncompleteInvoicesCount = 0;

    const syncedInvoices = [];

    for (const inv of allInvoices) {
      const { status, daysUntilDue, daysOverdue } = calculateInvoiceStatus(inv);

      // Sync status if changed in memory (unless manually escalated)
      if (inv.paymentStatus !== 'paid' && inv.invoiceStatus !== status && inv.invoiceStatus !== 'escalated') {
        inv.invoiceStatus = status;
        await inv.save();
      }

      if (inv.paymentStatus === 'paid') {
        paidAmount += inv.amount;
      } else {
        totalOutstanding += inv.amount;

        if (status === 'overdue' || inv.invoiceStatus === 'escalated') {
          overdueAmount += inv.amount;
          overdueInvoicesCount++;
        } else if (status === 'due_soon' || status === 'due') {
          dueSoonAmount += inv.amount;
          dueSoonInvoicesCount++;
        }
      }

      if (inv.evidenceScore < 100) {
        evidenceIncompleteInvoicesCount++;
      }

      const invObj = inv.toObject();
      invObj.daysUntilDue = daysUntilDue;
      invObj.daysOverdue = daysOverdue;
      syncedInvoices.push(invObj);
    }

    // Sort recent invoices by createdAt descending
    const recentInvoices = syncedInvoices
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const overdueInvoices = syncedInvoices
      .filter((i) => i.paymentStatus !== 'paid' && (i.invoiceStatus === 'overdue' || i.invoiceStatus === 'escalated'))
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    const evidenceIncompleteInvoices = syncedInvoices
      .filter((i) => i.evidenceScore < 100)
      .sort((a, b) => a.evidenceScore - b.evidenceScore);

    return {
      summary: {
        totalOutstanding,
        dueSoonAmount,
        overdueAmount,
        paidAmount,
        totalInvoices,
        overdueInvoices: overdueInvoicesCount,
        dueSoonInvoices: dueSoonInvoicesCount,
        evidenceIncompleteInvoices: evidenceIncompleteInvoicesCount,
      },
      recentInvoices,
      overdueInvoices,
      evidenceIncompleteInvoices,
    };
  }
}

module.exports = new DashboardService();
