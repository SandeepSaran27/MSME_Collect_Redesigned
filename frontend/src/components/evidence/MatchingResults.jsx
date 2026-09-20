import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const MatchingResults = ({ matchingResults }) => {
  if (!matchingResults) return null;

  const checks = matchingResults.checks || {};

  return (
    <div className="card">
      <div className="card-title">
        <span>Cross-Document Matching Integrity</span>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Confidence: {matchingResults.confidence}%</span>
      </div>

      <div className="grid-2" style={{ gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(15,23,42,0.4)', borderRadius: '6px' }}>
          <span style={{ fontSize: '13px' }}>Invoice Number Match</span>
          {checks.invoiceNumber ? <CheckCircle2 size={16} color="#10b981" /> : <AlertTriangle size={16} color="#ef4444" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(15,23,42,0.4)', borderRadius: '6px' }}>
          <span style={{ fontSize: '13px' }}>PO Number Match</span>
          {checks.poNumber ? <CheckCircle2 size={16} color="#10b981" /> : <AlertTriangle size={16} color="#ef4444" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(15,23,42,0.4)', borderRadius: '6px' }}>
          <span style={{ fontSize: '13px' }}>Customer Name Match</span>
          {checks.customerName ? <CheckCircle2 size={16} color="#10b981" /> : <AlertTriangle size={16} color="#ef4444" />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(15,23,42,0.4)', borderRadius: '6px' }}>
          <span style={{ fontSize: '13px' }}>Amount Match</span>
          {checks.amount ? <CheckCircle2 size={16} color="#10b981" /> : <AlertTriangle size={16} color="#ef4444" />}
        </div>
      </div>
    </div>
  );
};

export default MatchingResults;
