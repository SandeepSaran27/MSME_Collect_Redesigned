import React, { useState, useEffect } from 'react';
import { getEscalations } from '../services/escalationService';
import EscalationCard from '../components/escalation/EscalationCard';
import { AlertTriangle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const Escalations = () => {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEscalationList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEscalations();
      setEscalations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load escalations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalationList();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Payment Recovery"
        title="Escalations"
        subtitle="Monitor and recover critical escalated receivables"
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading escalation records...</p>
      ) : escalations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <AlertTriangle size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>No invoice escalations present.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Overdue invoices escalated from the invoice details workspace will appear here.</p>
        </div>
      ) : (
        <div>
          {escalations.map((esc) => (
            <EscalationCard
              key={esc._id}
              escalation={esc}
              onUpdateSuccess={fetchEscalationList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Escalations;
