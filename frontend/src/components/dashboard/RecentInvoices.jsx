import React from 'react';
import { Link } from 'react-router-dom';
import InvoiceStatusBadge from '../invoices/InvoiceStatusBadge';

const RecentInvoices = ({ invoices }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Recent Invoices</div>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>No recent invoices recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">
        <span>Recent Invoices</span>
        <Link to="/invoices" style={{ fontSize: '13px' }}>View All →</Link>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td><strong>{inv.invoiceNumber}</strong></td>
                <td>{inv.customer?.companyName || inv.customer?.name || 'N/A'}</td>
                <td>${inv.amount.toLocaleString()}</td>
                <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td>
                  <InvoiceStatusBadge status={inv.invoiceStatus} />
                </td>
                <td>
                  <Link to={`/invoices/${inv._id}`} className="button secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentInvoices;
