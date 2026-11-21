import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (msg) => addToast(msg, 'success');
  const error = (msg) => addToast(msg, 'error');
  const info = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      {/* Bootstrap Floating Toast Container */}
      <div className="position-fixed bottom-0 end-0 p-3 z-3 d-flex flex-column gap-2" style={{ maxWidth: '380px', width: '100%', pointerEvents: 'none' }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`d-flex align-items-center gap-3 p-3 rounded-4 shadow-lg border text-dark ${
              toast.type === 'success'
                ? 'bg-white border-success'
                : toast.type === 'error'
                ? 'bg-white border-danger'
                : 'bg-white border-warning'
            }`}
            style={{ pointerEvents: 'auto', backdropFilter: 'blur(8px)' }}
          >
            {toast.type === 'success' && <CheckCircle className="text-success flex-shrink-0" size={20} />}
            {toast.type === 'error' && <AlertCircle className="text-danger flex-shrink-0" size={20} />}
            {toast.type === 'info' && <Info className="text-warning flex-shrink-0" size={20} />}

            <div className="flex-grow-1 small fw-semibold text-break">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="btn btn-sm btn-link text-muted p-0"
              style={{ textDecoration: 'none' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
