import api from './api';

export const extractDocumentData = async (documentId) => {
  const response = await api.post(`/ai/extract/${documentId}`);
  return response.data;
};

export const matchDocuments = async (invoiceId) => {
  const response = await api.post(`/ai/match/${invoiceId}`);
  return response.data;
};
