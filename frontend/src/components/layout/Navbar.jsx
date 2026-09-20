import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Building2 } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || name[0].toUpperCase();
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-title">
        <div className="navbar-title-icon">
          <Building2 size={17} color="#a5b4fc" />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
          {user ? user.companyName : 'MSME Collect'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="navbar-user">
          <div className="navbar-avatar">{getInitials(user?.name)}</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
              {user ? user.name : 'User'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
              {user ? user.role : 'owner'}
            </div>
          </div>
        </div>

        <button onClick={logout} className="secondary" style={{ padding: '9px 14px', fontSize: '13px' }}>
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
