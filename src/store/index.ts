import { create } from 'zustand';
import { Tile } from '../types';

interface AppState {
  scannedImage: string | null;
  tiles: Tile[];
  isProcessing: boolean;
  
  setScannedImage: (uri: string) => void;
  setTiles: (tiles: Tile[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  updateTile: (id: string, updates: Partial<Tile>) => void;
  addTile: (tile: Tile) => void;
  removeTile: (id: string) => void;
  resetSession: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  scannedImage: null,
  tiles: [],
  isProcessing: false,

  setScannedImage: (uri) => set({ scannedImage: uri }),
  setTiles: (tiles) => set({ tiles }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  
  updateTile: (id, updates) => set((state) => ({
    tiles: state.tiles.map((tile) => 
      tile.id === id ? { ...tile, ...updates } : tile
    ),
  })),

  addTile: (tile) => set((state) => ({
    tiles: [...state.tiles, tile],
  })),

  removeTile: (id) => set((state) => ({
    tiles: state.tiles.filter((tile) => tile.id !== id),
  })),

  resetSession: () => set({
    scannedImage: null,
    tiles: [],
    isProcessing: false,
  }),
}));
