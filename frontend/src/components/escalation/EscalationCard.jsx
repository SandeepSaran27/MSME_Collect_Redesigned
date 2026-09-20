import React, { useState } from 'react';
import { updateEscalation } from '../../services/escalationService';
import EscalationStatus from './EscalationStatus';
import { AlertTriangle, Calendar, FileText, CheckCircle2 } from 'lucide-react';

const EscalationCard = ({ escalation, onUpdateSuccess }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateEscalation(escalation._id, { status: newStatus });
      setUpdating(false);
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      setUpdating(false);
      console.error('Update escalation failed:', err);
    }
  };

  const inv = escalation.invoice || {};
  const cust = inv.customer || {};

  return (
    <div className="card" style={{ borderLeft: '4px solid #a855f7' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>
            Escalation for Invoice #{inv.invoiceNumber || 'N/A'}
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Customer: <strong>{cust.companyName || cust.name || 'N/A'}</strong> ({cust.email || 'N/A'})
          </p>
        </div>
        <EscalationStatus status={escalation.status} />
      </div>

      <div className="grid-3" style={{ margin: '16px 0', backgroundColor: 'rgba(15,23,42,0.5)', padding: '12px', borderRadius: '8px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Outstanding Amount:</span>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444' }}>${inv.amount ? inv.amount.toLocaleString() : 0}</p>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Days Overdue at Escalation:</span>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>{escalation.daysOverdue} Days</p>
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Snapshot Evidence Score:</span>
          <p style={{ fontSize: '16px', fontWeight: '600', color: escalation.evidenceScore === 100 ? '#10b981' : '#f59e0b' }}>
            {escalation.evidenceScore}%
          </p>
        </div>
      </div>

      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
        <strong>Escalation Reason:</strong> {escalation.reason}
      </div>
      {escalation.notes && (
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
          <strong>Notes:</strong> {escalation.notes}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        {escalation.status !== 'in_review' && escalation.status !== 'resolved' && (
          <button onClick={() => handleStatusChange('in_review')} className="secondary" disabled={updating} style={{ fontSize: '12px' }}>
            Mark In Review
          </button>
        )}
        {escalation.status !== 'resolved' && (
          <button onClick={() => handleStatusChange('resolved')} className="success" disabled={updating} style={{ fontSize: '12px' }}>
            <CheckCircle2 size={14} /> Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
};

export default EscalationCard;
