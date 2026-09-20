const initialNotifications = [
  {
    id: 'n1',
    type: 'DISCREPANCY',
    title: 'Quantity Mismatch Detected',
    message: 'Invoice INV-2026-1001 for XYZ Enterprises has 20 units discrepancy between PO (100) and Delivery Receipt (80).',
    timestamp: '10 minutes ago',
    read: false,
    invoiceId: 'inv-1001',
    severity: 'HIGH',
  },
  {
    id: 'n2',
    type: 'OVERDUE',
    title: 'Payment Overdue Alert',
    message: 'Invoice INV-2026-1001 of ₹50,000 is 5 days overdue.',
    timestamp: '1 hour ago',
    read: false,
    severity: 'HIGH',
  },
  {
    id: 'n3',
    type: 'DOCUMENT_PROCESSED',
    title: 'Amazon Textract OCR Completed',
    message: 'Delivery receipt for PO-8820 successfully extracted with 96% confidence score.',
    timestamp: '3 hours ago',
    read: true,
    severity: 'INFO',
  },
  {
    id: 'n4',
    type: 'EVIDENCE_READY',
    title: 'Evidence Score 100%',
    message: 'Invoice INV-2026-1004 for Acme Corp has complete 4-document evidence package.',
    timestamp: '1 day ago',
    read: true,
    severity: 'SUCCESS',
  },
];

const getNotifications = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: initialNotifications,
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = initialNotifications.find((n) => n.id === id);
    if (notif) notif.read = true;

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
