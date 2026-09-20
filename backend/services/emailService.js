const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port || '587', 10),
        secure: parseInt(port, 10) === 465,
        auth: {
          user,
          pass,
        },
      });
    } else {
      // Mock transporter for development when SMTP credentials are not set
      console.log('Nodemailer initialized in Mock/Dev mode (No SMTP env set)');
    }
  }

  async sendReminderEmail(reminder, invoice) {
    const customer = invoice.customer || {};
    const recipientEmail = customer.email;
    const recipientName = customer.companyName || customer.name || 'Valued Customer';

    const subject = this.getEmailSubject(reminder.type, invoice.invoiceNumber);
    const htmlBody = this.getEmailTemplate(reminder.type, recipientName, invoice, reminder.message);

    if (!recipientEmail) {
      console.log(`[Email Service Mock] Cannot send email. No recipient email address found for customer.`);
      return true;
    }

    if (this.transporter) {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"MSME Collect" <noreply@msmecollect.com>',
        to: recipientEmail,
        subject,
        html: htmlBody,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully: ${info.messageId}`);
      return true;
    } else {
      console.log(`\n--- [MOCK EMAIL SENT] ---`);
      console.log(`To: ${recipientEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${reminder.message}`);
      console.log(`-------------------------\n`);
      return true;
    }
  }

  getEmailSubject(type, invoiceNumber) {
    switch (type) {
      case 'due_soon':
        return `Payment Reminder: Invoice #${invoiceNumber} Due Soon`;
      case 'due_today':
        return `Payment Due Today: Invoice #${invoiceNumber}`;
      case 'overdue':
        return `OVERDUE NOTICE: Invoice #${invoiceNumber} Payment Overdue`;
      case 'escalation':
        return `OFFICIAL ESCALATION NOTICE: Invoice #${invoiceNumber}`;
      default:
        return `Notice regarding Invoice #${invoiceNumber}`;
    }
  }

  getEmailTemplate(type, customerName, invoice, customNote) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">MSME Collect Payment Notice</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>${customNote}</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
          <p style="margin: 5px 0;"><strong>Amount Due:</strong> $${invoice.amount.toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>PO Number:</strong> ${invoice.poNumber || 'N/A'}</p>
        </div>
        <p>If you have already sent payment, please disregard this message or reply with proof of payment.</p>
        <br />
        <p style="color: #64748b; font-size: 12px;">Sent via MSME Collect Evidence Readiness & Recovery Platform</p>
      </div>
    `;
  }
}

module.exports = new EmailService();
