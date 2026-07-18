import React from 'react';

/**
 * Reusable KPI Stat Card
 * @param {Object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} props.icon
 * @param {string} [props.iconBg]
 * @param {string} [props.iconColor]
 * @param {string} [props.change]
 * @param {'up'|'down'|'neutral'} [props.changeDir='neutral']
 */
export default function StatCard({ 
  label, 
  value, 
  icon, 
  iconBg = 'var(--color-bg-tertiary)', 
  iconColor = 'var(--color-text-secondary)',
  change,
  changeDir = 'neutral'
}) {
  const trendColor = changeDir === 'up' 
    ? 'var(--color-accent-green)' 
    : changeDir === 'down' 
      ? 'var(--color-accent-red)' 
      : 'var(--color-text-muted)';

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }} role="region" aria-label={label}>
      <div 
        style={{ 
          width: '42px', 
          height: '42px', 
          borderRadius: 'var(--radius-md)', 
          backgroundColor: iconBg, 
          color: iconColor, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          flexShrink: 0
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </div>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-heading)', margin: '2px 0 4px 0', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
        {change && (
          <div style={{ fontSize: 'var(--text-xs)', color: trendColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{changeDir === 'up' ? '▲' : changeDir === 'down' ? '▼' : '•'}</span>
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
