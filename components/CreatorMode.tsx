import React, { useRef } from 'react';
import { Shuffle, Trash2, Play, Eraser, Save, FolderOpen, Share2 } from 'lucide-react';
import { CreatorModeProps } from '../types';
import { shuffleGrid, getEmptyGrid, playShuffleSound, encodeGridConfig } from '../utils';

const CreatorMode: React.FC<CreatorModeProps> = ({ gridValues, setGridValues, switchToPlay, showToast }) => {
  const inputRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    let nextIndex = index;
    const itemsPerRow = 5;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = index + 1;
        break;
      case 'ArrowLeft':
        nextIndex = index - 1;
        break;
      case 'ArrowUp':
        nextIndex = index - itemsPerRow;
        break;
      case 'ArrowDown':
        nextIndex = index + itemsPerRow;
        break;
      case 'Enter':
        e.preventDefault(); // Prevent new line
        nextIndex = index + 1;
        break;
      default:
        return;
    }

    // Ensure index is within bounds
    if (nextIndex >= 0 && nextIndex < 25) {
      e.preventDefault();
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newGrid = [...gridValues];
    newGrid[index] = value;
    setGridValues(newGrid);
  };

  const handleShuffle = () => {
    playShuffleSound();
    setGridValues(shuffleGrid(gridValues));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire grid?')) {
      setGridValues(getEmptyGrid());
    }
  };

  const fillRandomly = () => {
    playShuffleSound(); // Adding sound to auto-fill as well for better feedback
    const themes = ["Cat", "Dog", "Sun", "Moon", "Star", "Tree", "Car", "Bike", "Book", "Pen",
      "Cup", "Hat", "Shoe", "Door", "Code", "Bug", "Web", "App", "Data", "Wifi",
      "Leaf", "Rain", "Snow", "Wind", "Fire"];
    setGridValues(shuffleGrid(themes));
  };

  const handleSave = () => {
    try {
      const jsonString = JSON.stringify(gridValues, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bingo-grid.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Grid saved to file!', 'success');
    } catch (error) {
      console.error('Failed to save file:', error);
      showToast('Failed to save file.', 'error');
    }
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed) && parsed.length === 25) {
          if (window.confirm('Load this grid? This will overwrite your current work.')) {
            setGridValues(parsed);
            showToast('Grid loaded successfully!', 'success');
          }
        } else {
          showToast('Invalid file format. Must be a 25-item list.', 'error');
        }
      } catch (error) {
        console.error('Json parse error:', error);
        showToast('Error reading file. Is it valid JSON?', 'error');
      }
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleShare = () => {
    const config = encodeGridConfig(gridValues);
    if (!config) {
      showToast('Failed to generate link. Please try again.', 'error');
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}?config=${encodeURIComponent(config)}`;

    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied! Send it to friends.', 'success');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      showToast('Failed to copy link.', 'error');
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 animate-in fade-in duration-500">

      <div className="text-center mb-6 relative">
        <h2 className="text-4xl font-bold text-ink mb-2 transform -rotate-2">Creator Mode</h2>
        <p className="text-gray-600 text-xl transform rotate-1">Fill in the 5x5 grid below!</p>
        {/* Doodle decoration */}
        <div className="absolute -top-4 -right-8 opacity-20 transform rotate-12">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M10,50 Q25,25 50,10 T90,50 T50,90 T10,50" />
          </svg>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center w-full px-4">
        <button
          onClick={handleShuffle}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-ink border-2 border-ink rounded-lg shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg transform -rotate-1"
          title="Shuffle items"
        >
          <Shuffle size={20} />
          <span className="hidden sm:inline">Shuffle</span>
        </button>
        <button
          onClick={fillRandomly}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-ink border-2 border-ink rounded-lg shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg transform rotate-1"
          title="Auto fill with random words"
        >
          <Eraser size={20} />
          <span className="hidden sm:inline">Auto Fill</span>
        </button>

        <div className="hidden sm:block w-px h-10 bg-gray-300 mx-1"></div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-ink border-2 border-ink rounded-lg shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg transform -rotate-1"
          title="Save grid"
        >
          <Save size={20} />
          <span className="hidden sm:inline">Save</span>
        </button>
        <button
          onClick={handleLoadClick}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-ink border-2 border-ink rounded-lg shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg transform rotate-1"
          title="Load grid from file"
        >
          <FolderOpen size={20} />
          <span className="hidden sm:inline">Load</span>
        </button>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-ink border-2 border-ink rounded-lg shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg transform -rotate-1"
          title="Share grid with friends"
        >
          <Share2 size={20} />
          <span className="hidden sm:inline">Share</span>
        </button>

        <div className="hidden sm:block w-px h-10 bg-gray-300 mx-1"></div>

        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-ink border-2 border-ink rounded-lg shadow-sketch hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all font-bold text-lg transform -rotate-1"
          title="Clear grid"
        >
          <Trash2 size={20} />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-3 w-full max-w-lg md:max-w-2xl aspect-square mb-10 p-4 bg-white border-2 border-ink shadow-sketch rounded-sm rotate-1">
        {gridValues.map((value, index) => (
          <div key={index} className="relative group w-full h-full">
            <textarea
              ref={(el) => (inputRefs.current[index] = el)}
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder={`#${index + 1}`}
              aria-label={`Bingo cell ${index + 1}`}
              className="w-full h-full p-2 text-center text-lg md:text-xl resize-none border-2 border-gray-300 rounded-sm focus:border-ink focus:ring-0 focus:shadow-sketch-sm outline-none transition-all bg-paper flex items-center justify-center leading-tight placeholder-gray-300"
              style={{ minHeight: '100%' }}
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={switchToPlay}
        className="flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white border-4 border-ink rounded-xl shadow-sketch-lg hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all text-2xl font-bold transform -rotate-2"
      >
        <Play fill="currentColor" size={24} />
        Start Game
      </button>
    </div>
  );
};

export default CreatorMode;