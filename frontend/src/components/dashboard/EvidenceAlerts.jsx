import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const EvidenceAlerts = ({ invoices }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="card">
        <div className="card-title">Evidence Readiness Gaps</div>
        <p style={{ color: '#10b981', fontSize: '14px' }}>All invoice records have 100% evidence readiness.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
      <div className="card-title" style={{ color: '#f59e0b' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={20} />
          Incomplete Evidence Records ({invoices.length})
        </span>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Score</th>
              <th>Readiness Meter</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td><strong>{inv.invoiceNumber}</strong></td>
                <td>{inv.customer?.companyName || inv.customer?.name}</td>
                <td><strong style={{ color: inv.evidenceScore >= 75 ? '#f59e0b' : '#ef4444' }}>{inv.evidenceScore}%</strong></td>
                <td style={{ minWidth: '140px' }}>
                  <div className="progress-bar-container" style={{ margin: 0 }}>
                    <div className="progress-bar-fill" style={{ width: `${inv.evidenceScore}%` }} />
                  </div>
                </td>
                <td>
                  <Link to={`/invoices/${inv._id}`} className="button secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    Upload Docs
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

export default EvidenceAlerts;
