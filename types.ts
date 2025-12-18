export type GridData = string[];
export type MarkedState = boolean[];

export enum GameMode {
  CREATOR = 'creator',
  PLAY = 'play'
}

// Toast types
export type ToastType = 'success' | 'info' | 'error';

export interface CreatorModeProps {
  gridValues: GridData;
  setGridValues: (values: GridData) => void;
  switchToPlay: () => void;
  showToast: (message: string, type?: ToastType) => void;
}

export interface PlayModeProps {
  gridValues: GridData;
  markedState: MarkedState;
  setMarkedState: (state: MarkedState) => void;
  onWin: () => void;
  resetGame: () => void;
  switchToCreator: () => void;
}
