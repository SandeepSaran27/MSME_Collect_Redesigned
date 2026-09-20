import React from 'react';

const EscalationStatus = ({ status }) => {
  let badgeClass = 'due_soon';
  if (status === 'resolved') badgeClass = 'paid';
  if (status === 'pending') badgeClass = 'overdue';

  return <span className={`badge ${badgeClass}`}>{status ? status.replace('_', ' ') : 'pending'}</span>;
};

export default EscalationStatus;
