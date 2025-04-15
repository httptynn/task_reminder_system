import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  variant?: 'default' | 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ 
  message, 
  variant = 'default', 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const variantStyles = {
    default: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 rounded-md px-4 py-2 shadow-lg animate-in slide-in-from-bottom-4 ${variantStyles[variant]}`}
    >
      {message}
    </div>
  );
}