const Reminder = require('../models/Reminder');
const Invoice = require('../models/Invoice');
const emailService = require('./emailService');

class ReminderService {
  async createReminder(invoiceId, type, customMessage, userId) {
    const invoice = await Invoice.findById(invoiceId).populate('customer');
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // Check for duplicate reminder on the same date for the same type
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingReminder = await Reminder.findOne({
      invoice: invoiceId,
      type,
      scheduledFor: { $gte: today },
    });

    if (existingReminder) {
      return existingReminder;
    }

    let defaultMsg = `Payment Reminder: Invoice ${invoice.invoiceNumber} for amount $${invoice.amount} is ${type.replace('_', ' ')}.`;
    if (type === 'due_soon') {
      defaultMsg = `Friendly Notice: Invoice ${invoice.invoiceNumber} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.`;
    } else if (type === 'overdue') {
      defaultMsg = `URGENT: Payment for Invoice ${invoice.invoiceNumber} ($${invoice.amount}) is overdue. Please submit payment immediately.`;
    } else if (type === 'escalation') {
      defaultMsg = `OFFICIAL ESCALATION: Invoice ${invoice.invoiceNumber} has been escalated due to prolonged non-payment.`;
    }

    const reminder = await Reminder.create({
      invoice: invoiceId,
      type,
      message: customMessage || defaultMsg,
      scheduledFor: new Date(),
      status: 'scheduled',
      createdBy: userId || invoice.createdBy,
    });

    // Process sending email immediately
    try {
      await emailService.sendReminderEmail(reminder, invoice);
      reminder.status = 'sent';
      reminder.sentAt = new Date();
      await reminder.save();
    } catch (err) {
      console.error(`Failed to send email for reminder ${reminder._id}:`, err.message);
      reminder.status = 'failed';
      await reminder.save();
    }

    return reminder;
  }

  async getRemindersByInvoice(invoiceId) {
    return await Reminder.find({ invoice: invoiceId }).sort({ createdAt: -1 });
  }
}

module.exports = new ReminderService();
