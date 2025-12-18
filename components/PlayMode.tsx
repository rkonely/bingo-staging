import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { PlayModeProps } from '../types';
import { checkWinCondition, playClickSound } from '../utils';

const PlayMode: React.FC<PlayModeProps> = ({
  gridValues,
  markedState,
  setMarkedState,
  onWin,
  resetGame
}) => {
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const toggleCell = (index: number) => {
    // Trigger feedback animation & sound
    playClickSound();
    setLastClickedIndex(index);
    setTimeout(() => setLastClickedIndex(null), 300);

    const newState = [...markedState];
    newState[index] = !newState[index];
    setMarkedState(newState);
  };

  // Check for win whenever markedState changes
  useEffect(() => {
    if (checkWinCondition(markedState)) {
      onWin();
    }
  }, [markedState, onWin]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 animate-in slide-in-from-right-8 duration-500">

      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-ink mb-2 transform rotate-1">Play Mode</h2>
        <p className="text-gray-600 text-xl">Click squares! Get 5 in a row!</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center w-full">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-5 py-2 bg-orange-100 text-ink border-2 border-ink rounded-lg shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg transform rotate-1"
        >
          <RotateCcw size={18} />
          Reset Board
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-lg md:max-w-2xl aspect-square mb-8 p-3 bg-white border-2 border-ink rounded-sm shadow-sketch-lg transform -rotate-1">
        {gridValues.map((value, index) => {
          const isMarked = markedState[index];
          // Slight random rotation for natural feel
          const rotation = (index % 3) - 1;

          return (
            <button
              key={index}
              onClick={() => toggleCell(index)}
              aria-label={`Bingo cell ${index + 1}: ${value}`}
              aria-pressed={isMarked}
              className={`
                relative flex items-center justify-center p-1 text-center font-bold leading-tight border-2 rounded-sm transition-all duration-200 select-none overflow-hidden group
                active:scale-95
                ${isMarked
                  ? 'bg-pink-50 border-ink rotate-0 shadow-none hover:brightness-95'
                  : 'bg-paper text-ink border-ink hover:bg-gray-50 shadow-sketch-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'}
              `}
              style={{
                transform: !isMarked ? `rotate(${rotation}deg)` : 'none'
              }}
            >
              {isMarked ? (
                <>
                  <>
                    <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300 transition-all group-hover:brightness-50 group-hover:scale-95">
                      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
                        {/* Snout shape */}
                        <ellipse cx="50" cy="50" rx="45" ry="35" fill="#f9a8d4" stroke="#2d2d2d" strokeWidth="4" />
                        {/* Nostrils */}
                        <ellipse cx="35" cy="50" rx="8" ry="12" fill="#2d2d2d" />
                        <ellipse cx="65" cy="50" rx="8" ry="12" fill="#2d2d2d" />
                        {/* Highlight */}
                        <path d="M 30 30 Q 50 20 70 30" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" fill="none" />
                      </svg>
                    </div>
                    <div className="relative z-10 flex items-center justify-center p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="break-words w-full line-clamp-3 text-sm md:text-lg font-bold text-white drop-shadow-md">
                        {value}
                      </span>
                    </div>
                  </>
                </>
              ) : (
                <span className="break-words w-full line-clamp-3 text-sm md:text-lg">
                  {value || <span className="text-gray-400 opacity-50">-</span>}
                </span>
              )}

              {/* Click Ripple/Flash Effect */}
              {lastClickedIndex === index && (
                <span className="absolute inset-0 bg-yellow-400/30 rounded-sm pointer-events-none animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_1]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlayMode;