import React from 'react';
import { AlertCircle } from 'lucide-react';

const MissingEvidence = ({ missingDocuments = [] }) => {
  if (missingDocuments.length === 0) return null;

  return (
    <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <AlertCircle size={20} />
      <div>
        <strong>Missing Required Evidence Documents:</strong> {missingDocuments.map(d => d.replace('_', ' ')).join(', ')}
      </div>
    </div>
  );
};

export default MissingEvidence;
