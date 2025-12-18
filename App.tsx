import React, { useState, useEffect } from 'react';
import { Grid3X3, Gamepad2 } from 'lucide-react';
import CreatorMode from './components/CreatorMode';
import PlayMode from './components/PlayMode';
import WinModal from './components/WinModal';
import Toast, { ToastType } from './components/Toast';
import { GridData, MarkedState, GameMode } from './types';
import { getEmptyGrid, getEmptyMarkedState, playWinSound, decodeGridConfig } from './utils';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.CREATOR);
  const [gridValues, setGridValues] = useState<GridData>(getEmptyGrid());
  const [markedState, setMarkedState] = useState<MarkedState>(getEmptyMarkedState());
  const [showWinModal, setShowWinModal] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' as ToastType });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ show: true, message, type });
  };


  useEffect(() => {
    // Check for shared configuration in URL
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');

    if (configParam) {
      const decodedGrid = decodeGridConfig(configParam);
      if (decodedGrid) {
        setGridValues(decodedGrid);
        setMode(GameMode.PLAY);
        // Optional: Clean up URL without reloading
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const switchToPlay = () => {
    // Reset marks when switching to play mode for a fresh game
    setMode(GameMode.PLAY);
  };

  const switchToCreator = () => {
    setMode(GameMode.CREATOR);
  };

  const handleWin = () => {
    if (!showWinModal) {
      playWinSound();
      setShowWinModal(true);
    }
  };

  const resetGame = () => {
    setMarkedState(getEmptyMarkedState());
    setShowWinModal(false);
  };

  return (
    <div className="min-h-screen text-ink overflow-x-hidden selection:bg-yellow-200">

      {/* Navigation controls moved to top of body */}
      <div className="w-full flex justify-center pt-8 pb-2">
        <nav className="flex items-center gap-2 bg-white p-2 rounded-xl border-2 border-ink shadow-sketch transform -rotate-1 z-10">
          <button
            onClick={() => setMode(GameMode.CREATOR)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold border-2 transition-all duration-200 ${mode === GameMode.CREATOR
              ? 'bg-yellow-100 border-ink shadow-sketch-sm'
              : 'border-transparent text-gray-500 hover:text-ink hover:bg-gray-100'
              }`}
          >
            <Grid3X3 size={20} />
            <span className="inline">Creator</span>
          </button>
          <div className="w-0.5 h-6 bg-gray-200 rounded-full mx-1"></div>
          <button
            onClick={() => setMode(GameMode.PLAY)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold border-2 transition-all duration-200 ${mode === GameMode.PLAY
              ? 'bg-yellow-100 border-ink shadow-sketch-sm'
              : 'border-transparent text-gray-500 hover:text-ink hover:bg-gray-100'
              }`}
          >
            <Gamepad2 size={20} />
            <span className="inline">Play</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full pt-4 pb-20">
        {mode === GameMode.CREATOR ? (
          <CreatorMode
            gridValues={gridValues}
            setGridValues={setGridValues}
            switchToPlay={switchToPlay}
            showToast={showToast}
          />
        ) : (
          <PlayMode
            gridValues={gridValues}
            markedState={markedState}
            setMarkedState={setMarkedState}
            onWin={handleWin}
            resetGame={resetGame}
            switchToCreator={switchToCreator}
          />
        )}
      </main>

      {/* Modals */}
      <WinModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        onReset={resetGame}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default App;