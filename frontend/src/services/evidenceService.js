import api from './api';

export const getEvidenceReadiness = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}/evidence`);
  return response.data;
};

export const downloadEvidenceReport = async (invoiceId, invoiceNumber) => {
  const response = await api.get(`/invoices/${invoiceId}/evidence-report`, {
    responseType: 'blob',
  });

  // Create download link for PDF stream
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Evidence_Report_${invoiceNumber || invoiceId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
