import React from 'react';

const InvoiceStatusBadge = ({ status }) => {
  if (!status) return null;
  
  const formatted = status.replace('_', ' ');
  return <span className={`badge ${status}`}>{formatted}</span>;
};

export default InvoiceStatusBadge;
