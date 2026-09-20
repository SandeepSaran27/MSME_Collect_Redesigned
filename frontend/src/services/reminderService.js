import api from './api';

export const createReminder = async (invoiceId, reminderData) => {
  const response = await api.post(`/reminders/${invoiceId}`, reminderData);
  return response.data;
};

export const getRemindersByInvoice = async (invoiceId) => {
  const response = await api.get(`/reminders/invoice/${invoiceId}`);
  return response.data;
};
