import React from 'react';

/**
 * Reusable Spinner Component
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 */
export default function Spinner({ size = 'md', className = '' }) {
  const spinnerSizeClass = `spinner-${size}`;
  return (
    <span 
      className={`spinner ${spinnerSizeClass} ${className}`} 
      role="status" 
      aria-label="Loading"
    />
  );
}
