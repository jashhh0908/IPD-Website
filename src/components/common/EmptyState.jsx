import React from 'react';

/**
 * Reusable Empty State Component
 * @param {Object} props
 * @param {string} [props.icon='⬡']
 * @param {string} [props.title='No records found']
 * @param {string} [props.message]
 * @param {React.ReactNode} [props.children]
 */
export default function EmptyState({ 
  icon = '⬡', 
  title = 'No records found', 
  message = 'There are no items matching the current filters or query.', 
  children 
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: '4px' }}>{title}</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: children ? 'var(--space-4)' : 0 }}>{message}</p>
      {children}
    </div>
  );
}
