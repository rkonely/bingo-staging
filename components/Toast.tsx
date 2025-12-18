import React, { useEffect, useState } from 'react';
import { Check, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    isVisible,
    onClose,
    duration = 3000
}) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isVisible) {
            setIsShowing(true);
            timer = setTimeout(() => {
                setIsShowing(false);
                // Wait for animation to finish before calling onClose
                setTimeout(onClose, 300);
            }, duration);
        } else {
            setIsShowing(false);
        }
        return () => clearTimeout(timer);
    }, [isVisible, duration, onClose]);

    if (!isVisible && !isShowing) return null;

    const bgColors = {
        success: 'bg-green-100 border-green-800',
        info: 'bg-blue-100 border-blue-800',
        error: 'bg-red-100 border-red-800'
    };

    const icons = {
        success: <Check className="text-green-800" size={24} />,
        info: <Info className="text-blue-800" size={24} />,
        error: <AlertTriangle className="text-red-800" size={24} />
    };

    return (
        <div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-lg border-2 shadow-sketch transition-all duration-300 ${bgColors[type]} ${isShowing ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
        >
            {icons[type]}
            <span className="font-bold text-ink text-lg">{message}</span>
            <button onClick={() => setIsShowing(false)} className="ml-2 hover:opacity-70">
                <X size={18} className="text-ink" />
            </button>
        </div>
    );
};

export default Toast;
