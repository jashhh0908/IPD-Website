import React from 'react';
import { formatDateTime } from '../../utils/helpers';

/**
 * Reusable Timeline Component
 * @param {Object} props
 * @param {Array} props.steps Array of step objects: { label, time, status }
 */
export default function Timeline({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="timeline" role="list">
      {steps.map((step, idx) => {
        const dotStatus = step.status || (step.time ? 'completed' : 'pending');
        
        return (
          <div className="timeline-item" key={idx} role="listitem">
            <span 
              className={`timeline-dot ${dotStatus}`} 
              aria-hidden="true" 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="timeline-label" style={{ fontWeight: dotStatus === 'active' ? 'var(--weight-semibold)' : 'var(--weight-normal)' }}>
                {step.label}
              </span>
              {step.time && (
                <time className="timeline-meta" dateTime={step.time}>
                  {formatDateTime(step.time)}
                </time>
              )}
              {dotStatus === 'active' && (
                <span className="timeline-meta" style={{ color: 'var(--color-accent-amber)', fontWeight: 'var(--weight-semibold)' }}>
                  In progress
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
