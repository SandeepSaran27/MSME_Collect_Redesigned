import React from 'react';

const InvoiceFilters = ({ filters, onChange, customers }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
      <div style={{ flex: '1', minWidth: '200px' }}>
        <input
          type="text"
          placeholder="Search by invoice number or description..."
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </div>

      <div style={{ width: '180px' }}>
        <select value={filters.status || ''} onChange={(e) => onChange('status', e.target.value)}>
          <option value="">All Invoice Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="due_soon">Due Soon</option>
          <option value="due">Due Today</option>
          <option value="overdue">Overdue</option>
          <option value="paid">Paid</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      <div style={{ width: '180px' }}>
        <select value={filters.paymentStatus || ''} onChange={(e) => onChange('paymentStatus', e.target.value)}>
          <option value="">All Payment Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {customers && (
        <div style={{ width: '200px' }}>
          <select value={filters.customer || ''} onChange={(e) => onChange('customer', e.target.value)}>
            <option value="">All Customers</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName || c.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;
