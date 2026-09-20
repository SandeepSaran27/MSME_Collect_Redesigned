import React from 'react';

/**
 * Decorative, purely visual background used behind the auth screens.
 * It renders a subtle "document intelligence" scene — floating document
 * cards connected by scanning/verification lines — entirely in CSS/SVG.
 * It carries no data and no logic; it never overlaps or blocks the form.
 *
 * variant: "login" | "register" — changes the flow direction/labels only.
 * mode: "auth" (default, full floating-document scene) | "app" — a much
 * more subtle fixed ambient backdrop used behind real application content
 * (dashboard, invoices, evidence, escalations, customers). "app" mode
 * renders only soft color blobs + a faint grid, tinted per page via
 * `variant`, and never renders any text/data.
 */
const DOC_FLOW = {
  login: [
    { label: 'Purchase Order', sub: 'PO-2291' },
    { label: 'Delivery Proof', sub: 'DC-0847' },
    { label: 'Invoice', sub: 'INV-1004' },
    { label: 'Evidence Check', sub: '92% ready' },
    { label: 'Payment Follow-up', sub: 'Reminder sent' },
  ],
  register: [
    { label: 'Business Profile', sub: 'New MSME' },
    { label: 'Customer Ledger', sub: 'Synced' },
    { label: 'Invoice Records', sub: 'Structured' },
    { label: 'AI Evidence Score', sub: 'Calculating' },
  ],
};

const AnimatedBackground = ({ variant = 'login', mode = 'auth' }) => {
  if (mode === 'app') {
    return (
      <div className={`app-bg app-bg--${variant}`} aria-hidden="true">
        <div className="app-bg__blob" />
        <div className="app-bg__blob" />
        <div className="app-bg__grid" />
      </div>
    );
  }

  const items = DOC_FLOW[variant] || DOC_FLOW.login;

  return (
    <div className="auth-bg" aria-hidden="true">
      <div className="auth-bg__glow auth-bg__glow--a" />
      <div className="auth-bg__glow auth-bg__glow--b" />
      <div className="auth-bg__glow auth-bg__glow--c" />

      <svg className="auth-bg__grid" width="100%" height="100%">
        <defs>
          <pattern id={`grid-${variant}`} width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(148,163,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${variant})`} />
      </svg>

      <svg className="auth-bg__lines" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`lineGrad-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d="M 120 160 C 320 260, 420 120, 620 220" stroke={`url(#lineGrad-${variant})`} strokeWidth="1.4" fill="none" strokeDasharray="6 10" className="auth-bg__dash" />
        <path d="M 980 140 C 800 260, 900 420, 1040 520" stroke={`url(#lineGrad-${variant})`} strokeWidth="1.4" fill="none" strokeDasharray="6 10" className="auth-bg__dash" style={{ animationDelay: '-4s' }} />
        <path d="M 150 700 C 350 620, 300 780, 520 760" stroke={`url(#lineGrad-${variant})`} strokeWidth="1.4" fill="none" strokeDasharray="6 10" className="auth-bg__dash" style={{ animationDelay: '-8s' }} />
        {[...Array(6)].map((_, i) => (
          <circle key={i} r="2.4" fill="#8ecbff" className="auth-bg__node" style={{ animationDelay: `${i * -1.4}s` }}>
            <animateMotion
              dur={`${9 + i}s`}
              repeatCount="indefinite"
              path={i % 3 === 0
                ? 'M 120 160 C 320 260, 420 120, 620 220'
                : i % 3 === 1
                ? 'M 980 140 C 800 260, 900 420, 1040 520'
                : 'M 150 700 C 350 620, 300 780, 520 760'}
            />
          </circle>
        ))}
      </svg>

      <div className="auth-bg__flow">
        {items.map((item, i) => (
          <div
            className={`auth-bg__doc auth-bg__doc--${i}`}
            key={item.label}
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <span className="auth-bg__doc-dot" />
            <div>
              <div className="auth-bg__doc-label">{item.label}</div>
              <div className="auth-bg__doc-sub">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
