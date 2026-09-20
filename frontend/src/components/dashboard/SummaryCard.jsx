import React from 'react';

const SummaryCard = ({ title, amount, count, icon: Icon, color, subtext }) => {
  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${color}22, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', position: 'relative' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
        {Icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${color}1f`,
              border: `1px solid ${color}40`,
            }}
          >
            <Icon size={19} color={color || '#5b6bf5'} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#f8fafc', marginBottom: '4px', position: 'relative' }}>
        {amount !== undefined ? `$${amount.toLocaleString()}` : count}
      </div>
      {subtext && <div style={{ fontSize: '12.5px', color: '#8b94c2', position: 'relative' }}>{subtext}</div>}
    </div>
  );
};

export default SummaryCard;
