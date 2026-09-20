/**
 * Calculates dynamic invoice status and days relative to due date.
 * Rules:
 * - If paid -> 'paid'
 * - If unpaid and due date is more than 7 days away -> 'upcoming'
 * - If unpaid and due date is within 7 days -> 'due_soon'
 * - If unpaid and due date is today -> 'due'
 * - If unpaid and due date is before today -> 'overdue'
 * Note: If manually escalated, 'escalated' status can be preserved unless paid.
 */
const calculateInvoiceStatus = (invoice) => {
  if (invoice.paymentStatus === 'paid') {
    return {
      status: 'paid',
      daysUntilDue: 0,
      daysOverdue: 0,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status = 'upcoming';
  let daysUntilDue = 0;
  let daysOverdue = 0;

  if (diffDays < 0) {
    status = 'overdue';
    daysOverdue = Math.abs(diffDays);
    daysUntilDue = 0;
  } else if (diffDays === 0) {
    status = 'due';
    daysUntilDue = 0;
    daysOverdue = 0;
  } else if (diffDays <= 7) {
    status = 'due_soon';
    daysUntilDue = diffDays;
    daysOverdue = 0;
  } else {
    status = 'upcoming';
    daysUntilDue = diffDays;
    daysOverdue = 0;
  }

  // Preserve manual escalation status if it was previously set to escalated and still unpaid
  if (invoice.invoiceStatus === 'escalated' && status === 'overdue') {
    status = 'escalated';
  }

  return {
    status,
    daysUntilDue,
    daysOverdue,
  };
};

module.exports = { calculateInvoiceStatus };
