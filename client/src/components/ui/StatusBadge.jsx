import React from 'react';

/**
 * Reusable Status & Severity Badge
 * @param {Object} props
 * @param {string} props.value
 * @param {'status'|'severity'} [props.type='status']
 */
export default function StatusBadge({ value, type = 'status' }) {
  if (!value) return null;

  const val = value.toLowerCase();
  let bg = 'var(--color-bg-tertiary)';
  let color = 'var(--color-text-secondary)';

  if (type === 'severity') {
    if (val.includes('critical')) {
      bg = 'var(--color-accent-red-muted)';
      color = 'var(--color-severity-critical)';
    } else if (val.includes('high')) {
      bg = 'rgba(196, 122, 58, 0.14)';
      color = 'var(--color-severity-high)';
    } else if (val.includes('moderate') || val.includes('medium')) {
      bg = 'var(--color-accent-amber-muted)';
      color = 'var(--color-severity-moderate)';
    } else if (val.includes('low')) {
      bg = 'var(--color-accent-green-muted)';
      color = 'var(--color-severity-low)';
    }
  } else {
    // Regular status values
    if (val === 'open' || val === 'submitted') {
      bg = 'var(--color-accent-blue-muted)';
      color = 'var(--color-status-open)';
    } else if (val.includes('investigation') || val.includes('pending') || val.includes('info')) {
      bg = 'var(--color-accent-amber-muted)';
      color = 'var(--color-status-pending)';
    } else if (val === 'closed') {
      bg = 'rgba(122, 117, 111, 0.14)';
      color = 'var(--color-status-closed)';
    } else if (val === 'approved') {
      bg = 'var(--color-accent-green-muted)';
      color = 'var(--color-status-approved)';
    } else if (val === 'denied') {
      bg = 'var(--color-accent-red-muted)';
      color = 'var(--color-status-denied)';
    }
  }

  return (
    <span 
      className="badge" 
      style={{ backgroundColor: bg, color }}
      title={`${type}: ${value}`}
    >
      <span className="badge-dot" style={{ backgroundColor: color }} />
      {value}
    </span>
  );
}
