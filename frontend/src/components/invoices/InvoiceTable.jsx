import React from 'react';
import { Link } from 'react-router-dom';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { FileText, ShieldAlert } from 'lucide-react';

const InvoiceTable = ({ invoices, onDelete }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
        <FileText size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <p style={{ fontSize: '16px', fontWeight: '500' }}>No invoices match your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Payment Status</th>
            <th>Invoice Status</th>
            <th>Evidence Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv._id}>
              <td>
                <Link to={`/invoices/${inv._id}`} style={{ fontWeight: '600', color: '#f8fafc' }}>
                  {inv.invoiceNumber}
                </Link>
              </td>
              <td>{inv.customer?.companyName || inv.customer?.name || 'N/A'}</td>
              <td><strong>${inv.amount.toLocaleString()}</strong></td>
              <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
              <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
              <td>
                <InvoiceStatusBadge status={inv.paymentStatus} />
              </td>
              <td>
                <InvoiceStatusBadge status={inv.invoiceStatus} />
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: inv.evidenceScore === 100 ? '#10b981' : '#f59e0b' }}>
                    {inv.evidenceScore}%
                  </span>
                  {inv.evidenceScore < 100 && <ShieldAlert size={14} color="#f59e0b" />}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/invoices/${inv._id}`} className="button secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Details
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(inv._id)}
                      className="danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
