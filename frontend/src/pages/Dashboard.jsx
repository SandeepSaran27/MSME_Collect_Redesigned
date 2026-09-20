import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import SummaryCard from '../components/dashboard/SummaryCard';
import InvoiceStatusChart from '../components/dashboard/InvoiceStatusChart';
import RecentInvoices from '../components/dashboard/RecentInvoices';
import OverdueInvoices from '../components/dashboard/OverdueInvoices';
import EvidenceAlerts from '../components/dashboard/EvidenceAlerts';
import { DollarSign, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardSummary();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <div style={{ color: '#94a3b8', padding: '40px 0', textAlign: 'center' }}>Loading dashboard metrics...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ margin: '20px 0' }}>
        {error}
        <button onClick={fetchSummary} className="secondary" style={{ marginLeft: '12px', padding: '4px 8px' }}>Retry</button>
      </div>
    );
  }

  const summary = data?.summary || {};

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: '6px' }}>
            Evidence Command Center
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Financial &amp; Evidence Cockpit
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>Real-time invoice collection and evidence readiness overview</p>
        </div>
        <Link to="/invoices/create" className="button primary" style={{ height: '44px', padding: '0 20px' }}>
          <Plus size={18} /> Create New Invoice
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-4">
        <SummaryCard
          title="Total Outstanding"
          amount={summary.totalOutstanding || 0}
          icon={DollarSign}
          color="#4f6bff"
          subtext="Active unpaid receivables"
        />
        <SummaryCard
          title="Due Soon (7 Days)"
          amount={summary.dueSoonAmount || 0}
          count={summary.dueSoonInvoices}
          icon={Clock}
          color="#f59e0b"
          subtext={`${summary.dueSoonInvoices || 0} invoices maturing soon`}
        />
        <SummaryCard
          title="Overdue Receivables"
          amount={summary.overdueAmount || 0}
          count={summary.overdueInvoices}
          icon={AlertTriangle}
          color="#ef4444"
          subtext={`${summary.overdueInvoices || 0} invoices require collection`}
        />
        <SummaryCard
          title="Total Collected"
          amount={summary.paidAmount || 0}
          icon={CheckCircle}
          color="#10b981"
          subtext="Successfully paid receivables"
        />
      </div>

      {/* Main Visual & Alert Section */}
      <div className="grid-2">
        <InvoiceStatusChart summary={summary} />
        <EvidenceAlerts invoices={data?.evidenceIncompleteInvoices || []} />
      </div>

      {/* Overdue Collection Section */}
      <OverdueInvoices invoices={data?.overdueInvoices || []} />

      {/* Recent Invoices Table */}
      <RecentInvoices invoices={data?.recentInvoices || []} />
    </div>
  );
};

export default Dashboard;
