import React, { useState, useCallback } from 'react';
import { ToastContext } from './ToastContext';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      // Transition out
      setToasts((prev) => 
        prev.map((t) => (t.id === id ? { ...t, exit: true } : t))
      );
      
      // Remove completely
      setTimeout(() => {
        removeToast(id);
      }, 200);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="assertive" aria-atomic="true">
        {toasts.map((t) => {
          let symbol = 'ℹ';
          if (t.type === 'success') symbol = '✓';
          if (t.type === 'error') symbol = '✕';
          if (t.type === 'warning') symbol = '⚠';

          return (
            <div 
              key={t.id} 
              className={`toast toast-${t.type} ${t.exit ? 'toast-exit' : ''}`}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }} aria-hidden="true">
                {symbol}
              </span>
              <div style={{ flex: 1 }}>{t.message}</div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
