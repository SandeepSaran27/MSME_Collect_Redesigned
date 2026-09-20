import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const OverdueInvoices = ({ invoices }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Overdue Receivables</div>
        <p style={{ color: '#10b981', fontSize: '14px' }}>Great! You have no overdue invoices.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
      <div className="card-title" style={{ color: '#ef4444' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          Overdue Receivables ({invoices.length})
        </span>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Days Overdue</th>
              <th>Evidence Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td><strong>{inv.invoiceNumber}</strong></td>
                <td>{inv.customer?.companyName || inv.customer?.name}</td>
                <td style={{ color: '#ef4444', fontWeight: '600' }}>${inv.amount.toLocaleString()}</td>
                <td><span className="badge overdue">{inv.daysOverdue} days</span></td>
                <td>{inv.evidenceScore}%</td>
                <td>
                  <Link to={`/invoices/${inv._id}`} className="button primary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Collect Now
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

export default OverdueInvoices;
