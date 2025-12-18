import React, { useEffect } from 'react';
import { X, Trophy, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ isOpen, onClose, onReset }) => {
  useEffect(() => {
    if (isOpen) {
      // Basic celebratory burst
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#2d2d2d', '#fbbf24', '#f472b6', '#3b82f6', '#ef4444']
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content - Paper Card */}
      <div className="relative bg-white border-4 border-ink shadow-sketch-lg w-full max-w-sm p-8 transform transition-all animate-in zoom-in-95 duration-200 scale-100 text-center rotate-2 overflow-hidden">

        {/* Animated Background Rays (CSS Trick) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(254,240,138,0.5)_0%,transparent_70%)] animate-pulse -z-10 pointer-events-none"></div>

        {/* Decorative Floating Stars */}
        <Star className="absolute top-4 left-4 text-yellow-400 w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} fill="currentColor" />
        <Star className="absolute bottom-4 right-4 text-pink-400 w-5 h-5 animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} fill="currentColor" />
        <Star className="absolute top-1/2 right-2 text-blue-400 w-4 h-4 animate-pulse" fill="currentColor" />
        <Star className="absolute bottom-12 left-6 text-green-400 w-4 h-4 animate-ping" style={{ animationDuration: '3s' }} fill="currentColor" />

        {/* Tape effect */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-100/80 rotate-2 border border-yellow-200 shadow-sm z-20"></div>

        <div className="relative mb-6 inline-flex items-center justify-center w-28 h-28 mx-auto">
          {/* Glowing background for pig */}
          <div className="absolute inset-0 bg-pink-200 rounded-full blur-md opacity-50 animate-pulse"></div>
          <div className="relative w-28 h-28 bg-white border-4 border-ink rounded-full shadow-sketch flex items-center justify-center animate-[bounce_1s_infinite] overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}pwa-512x512.png`} alt="Happy Pig" className="w-full h-full object-cover" />
          </div>
        </div>

        <h3 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-2 uppercase tracking-wide transform -rotate-2 drop-shadow-sm filter">
          PINGO!
        </h3>
        <p className="text-gray-600 text-xl mb-8 font-bold">
          We have a winner!
        </p>

        <div className="flex flex-col gap-4 relative z-10">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full py-3 px-4 bg-white text-ink border-2 border-ink rounded-lg font-bold text-xl hover:bg-gray-50 transition-all shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center gap-2 group"
          >
            <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            Play Again
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-ink hover:text-red-500 transition-colors p-2 z-20"
        >
          <X size={28} />
        </button>
      </div>
    </div>
  );
};

export default WinModal;