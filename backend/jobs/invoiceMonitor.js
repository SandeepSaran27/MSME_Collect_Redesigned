const cron = require('node-cron');
const Invoice = require('../models/Invoice');
const { calculateInvoiceStatus } = require('../services/invoiceStatusService');
const reminderService = require('../services/reminderService');

const initInvoiceMonitorJob = () => {
  // Schedule job to run every day at midnight ('0 0 * * *')
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron Job] Running daily invoice status monitor and reminder scheduler...');
    try {
      const unpaidInvoices = await Invoice.find({ paymentStatus: { $ne: 'paid' } });

      for (const invoice of unpaidInvoices) {
        const { status: newStatus } = calculateInvoiceStatus(invoice);

        // Update status if changed and not manually escalated
        if (invoice.invoiceStatus !== newStatus && invoice.invoiceStatus !== 'escalated') {
          invoice.invoiceStatus = newStatus;
          await invoice.save();
        }

        // Trigger automatic scheduled reminders based on transition status
        if (newStatus === 'due_soon') {
          await reminderService.createReminder(invoice._id, 'due_soon', null, invoice.createdBy);
        } else if (newStatus === 'due') {
          await reminderService.createReminder(invoice._id, 'due_today', null, invoice.createdBy);
        } else if (newStatus === 'overdue') {
          await reminderService.createReminder(invoice._id, 'overdue', null, invoice.createdBy);
        }
      }
      console.log(`[Cron Job] Finished monitoring ${unpaidInvoices.length} unpaid invoices.`);
    } catch (error) {
      console.error('[Cron Job Error]:', error.message);
    }
  });

  console.log('[Cron Job] Invoice monitor initialized successfully.');
};

module.exports = initInvoiceMonitorJob;
