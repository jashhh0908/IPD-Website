import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { ROLE_LABELS } from '../../constants/roles';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  // Nav links depending on the role
  const getNavLinks = () => {
    switch (user.role) {
      case 'police':
        return [
          { to: ROUTES.police.DASHBOARD, label: 'Overview', icon: '◩' },
          { to: ROUTES.police.REPORTS, label: 'Incident Reports', icon: '⚑' },
          { to: ROUTES.police.ANALYTICS, label: 'Analytics', icon: '📈' },
          { to: ROUTES.police.MAP, label: 'Live Map', icon: '🗺️' }
        ];
      case 'insurance':
        return [
          { to: ROUTES.insurance.DASHBOARD, label: 'Claims Overview', icon: '◫' }
        ];
      case 'victim':
        return [
          { to: ROUTES.victim.DASHBOARD, label: 'My Case', icon: '◩' },
          { to: ROUTES.victim.FOOTAGE, label: 'Footage', icon: '▶' },
          { to: ROUTES.victim.APPEALS, label: 'Appeals', icon: '⚖' }
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className={`sidebar-brand-icon ${user.role}`} aria-hidden="true">⬡</div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-title">Sentry</div>
            <div className="sidebar-brand-subtitle">{ROLE_LABELS[user.role]}</div>
          </div>
        </div>

        {/* User Card */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {user.role === 'police' && `Badge: ${user.badge}`}
            {user.role === 'insurance' && `${user.empId}`}
            {user.role === 'victim' && `${user.phone}`}
          </div>
          {user.station && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {user.station}
            </div>
          )}
        </div>

        {/* Sidebar Nav links */}
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem', width: '20px' }} aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button 
          className="btn btn-ghost" 
          onClick={handleLogout}
          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-accent-red)' }}
        >
          <span style={{ fontSize: '1rem' }} aria-hidden="true">⏻</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
