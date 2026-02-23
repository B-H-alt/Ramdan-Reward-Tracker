// components/Toast.js
import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className={`${colors[type]} text-white font-bold px-6 py-3 rounded-2xl shadow-xl text-sm max-w-xs text-center`}>
        {message}
      </div>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);
  
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-20 inset-x-0 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t, i) => (
        <div key={t.id} style={{ marginTop: i * 4 }}>
          <Toast message={t.message} type={t.type} onDone={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}
