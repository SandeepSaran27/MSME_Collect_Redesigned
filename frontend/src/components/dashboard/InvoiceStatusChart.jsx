import React from 'react';

const InvoiceStatusChart = ({ summary }) => {
  const total = summary ? summary.totalInvoices || 1 : 1;
  const overduePct = Math.round(((summary?.overdueInvoices || 0) / total) * 100);
  const dueSoonPct = Math.round(((summary?.dueSoonInvoices || 0) / total) * 100);
  const paidPct = Math.max(0, 100 - overduePct - dueSoonPct);

  return (
    <div className="card">
      <div className="card-title">Invoice Portfolio Status Distribution</div>
      <div style={{ margin: '20px 0' }}>
        <div style={{ display: 'flex', height: '16px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)' }}>
          <div style={{ width: `${paidPct}%`, backgroundColor: '#10b981' }} title={`Paid: ${paidPct}%`} />
          <div style={{ width: `${dueSoonPct}%`, backgroundColor: '#f59e0b' }} title={`Due Soon: ${dueSoonPct}%`} />
          <div style={{ width: `${overduePct}%`, backgroundColor: '#ef4444' }} title={`Overdue: ${overduePct}%`} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '13px', color: '#94a3b8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          Paid ({summary?.paidAmount ? `$${summary.paidAmount.toLocaleString()}` : '$0'})
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          Due Soon ({summary?.dueSoonAmount ? `$${summary.dueSoonAmount.toLocaleString()}` : '$0'})
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          Overdue ({summary?.overdueAmount ? `$${summary.overdueAmount.toLocaleString()}` : '$0'})
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusChart;
