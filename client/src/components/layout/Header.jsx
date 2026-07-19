import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDateTime } from '../../utils/helpers';

export default function Header({ title, breadcrumb }) {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine breadcrumb based on location if not passed explicitly
  const getBreadcrumbs = () => {
    if (breadcrumb) return breadcrumb;
    
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return 'Sentry';
    
    return paths
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' / ');
  };

  return (
    <header className="app-header" role="banner">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 'var(--weight-semibold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {getBreadcrumbs()}
        </span>
        {title && (
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-heading)', marginTop: '2px' }}>
            {title}
          </h2>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
        {/* Live system clock */}
        <time 
          dateTime={time.toISOString()} 
          style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', fontWeight: 'var(--weight-medium)' }}
        >
          {formatDateTime(time.toISOString())}
        </time>

        {/* Notifications Indicator */}
        <div style={{ position: 'relative', cursor: 'pointer' }} aria-label="System Notifications" role="button">
          <span style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }} aria-hidden="true">🔔</span>
          <span 
            style={{ 
              position: 'absolute', 
              top: '-2px', 
              right: '-2px', 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-accent-amber)' 
            }} 
          />
        </div>
      </div>
    </header>
  );
}
