import { GridData, MarkedState } from './types';

// Standard Fisher-Yates shuffle
export const shuffleGrid = (grid: GridData): GridData => {
  const newGrid = [...grid];
  for (let i = newGrid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newGrid[i], newGrid[j]] = [newGrid[j], newGrid[i]];
  }
  return newGrid;
};

export const checkWinCondition = (marked: MarkedState): boolean => {
  // Grid is 5x5
  const size = 5;

  // Check Rows
  for (let row = 0; row < size; row++) {
    const start = row * size;
    const end = start + size;
    const rowSlice = marked.slice(start, end);
    if (rowSlice.every((m) => m)) return true;
  }

  // Check Columns
  for (let col = 0; col < size; col++) {
    let colWin = true;
    for (let row = 0; row < size; row++) {
      if (!marked[row * size + col]) {
        colWin = false;
        break;
      }
    }
    if (colWin) return true;
  }

  // Check Diagonals (Optional based on prompt, but standard for Bingo)
  // Top-left to bottom-right
  if ([0, 6, 12, 18, 24].every(idx => marked[idx])) return true;
  // Top-right to bottom-left
  if ([4, 8, 12, 16, 20].every(idx => marked[idx])) return true;

  return false;
};

// Generate initial empty grid
export const getEmptyGrid = (): GridData => Array(25).fill("");
export const getEmptyMarkedState = (): MarkedState => Array(25).fill(false);

// --- Sound Effects using Web Audio API ---
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const getAudioCtx = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

export const playClickSound = () => {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // "Pop" sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors (e.g. if user hasn't interacted yet)
  }
};

export const playShuffleSound = () => {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // "Whoosh" / Slide sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) { }
};

export const playWinSound = () => {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    // Cheerful "Success" Chord (C Major)
    const playNote = (freq: number, startTime: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.value = freq;

      // Bell-like envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02); // Fast attack
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5); // Smooth decay

      osc.start(startTime);
      osc.stop(startTime + 0.5); // Let ring a bit
    };

    const now = ctx.currentTime;
    // Play a happy chord (C4 - E4 - G4 - C5)
    playNote(523.25, now);       // C5
    playNote(659.25, now + 0.1); // E5
    playNote(783.99, now + 0.2); // G5
    playNote(1046.50, now + 0.3); // C6 (High C) for the "ding!" finish

  } catch (e) { }
};

// Configuration encoding/decoding
export const encodeGridConfig = (grid: GridData): string => {
  try {
    const json = JSON.stringify(grid);
    // Encode unicode strings correctly
    // efficient way to handle potential unicode characters
    const bytes = new TextEncoder().encode(json);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binString);
  } catch (e) {
    console.error("Failed to encode grid config:", e);
    return "";
  }
};

export const decodeGridConfig = (config: string): GridData | null => {
  try {
    const binString = atob(config);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode grid config:", e);
    return null;
  }
};