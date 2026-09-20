import React from 'react';

/**
 * Consistent page header used across all app pages.
 * Purely presentational — takes whatever title/subtitle/actions the page passes in.
 */
const PageHeader = ({ eyebrow, title, subtitle, actions }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div>
        {eyebrow && (
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--cyan)',
              marginBottom: '6px',
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{subtitle}</p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
};

export default PageHeader;
