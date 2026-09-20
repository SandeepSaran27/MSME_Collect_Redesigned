import api from './api';

export const escalateInvoice = async (invoiceId, escalationData) => {
  const response = await api.post(`/escalations/invoices/${invoiceId}/escalate`, escalationData);
  return response.data;
};

export const getEscalations = async () => {
  const response = await api.get('/escalations');
  return response.data;
};

export const getEscalationById = async (id) => {
  const response = await api.get(`/escalations/${id}`);
  return response.data;
};

export const updateEscalation = async (id, updateData) => {
  const response = await api.put(`/escalations/${id}`, updateData);
  return response.data;
};
