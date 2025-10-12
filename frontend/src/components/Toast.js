import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

export default Toast;