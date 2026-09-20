import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EvidenceWarnings = ({ warnings = [] }) => {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="alert alert-danger">
      <div style={{ fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={18} />
        Cross-Document Audit Warnings Detected ({warnings.length}):
      </div>
      <ul style={{ paddingLeft: '20px', margin: 0 }}>
        {warnings.map((warn, index) => (
          <li key={index} style={{ marginBottom: '4px' }}>{warn}</li>
        ))}
      </ul>
    </div>
  );
};

export default EvidenceWarnings;
