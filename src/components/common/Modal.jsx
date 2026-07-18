import { useEffect } from 'react';

/**
 * Reusable Keyboard Accessible Modal Dialog Component
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]
 */
export default function Modal({ isOpen, onClose, title, children, footer }) {
  // Listen for Escape key to close the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="modal-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>{title}</h2>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={onClose} 
            aria-label="Close modal"
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
