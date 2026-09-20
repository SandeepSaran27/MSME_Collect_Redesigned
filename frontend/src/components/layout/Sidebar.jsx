import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/escalations', label: 'Escalations', icon: AlertTriangle },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <div className="brand-mark">
          <ShieldCheck size={22} color="#fff" />
        </div>
        <div className="sidebar-text">
          <div className="brand-name">MSME Collect</div>
          <div className="brand-tag">Evidence Readiness</div>
        </div>
      </div>

      <nav className="side-nav">
        <div className="side-nav__section sidebar-text">Workspace</div>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
          >
            <Icon size={19} />
            <span className="sidebar-text">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer sidebar-text">
        <ShieldCheck size={13} />
        Evidence-ready workflow
      </div>
    </aside>
  );
};

export default Sidebar;
