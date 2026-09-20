import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

const EvidenceScore = ({ score }) => {
  const isComplete = score === 100;
  const color = isComplete ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="card">
      <div className="card-title">
        <span>Evidence Readiness Score</span>
        {isComplete ? <ShieldCheck size={24} color="#10b981" /> : <ShieldAlert size={24} color={color} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '36px', fontWeight: '800', color }}>{score}%</span>
        <span style={{ fontSize: '14px', color: '#94a3b8' }}>
          {isComplete ? 'Complete Evidence Readiness' : 'Incomplete Evidence Package'}
        </span>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

export default EvidenceScore;
