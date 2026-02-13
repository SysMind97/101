import { Tile, TileColor, OCRResult } from '../types';

const COLORS: TileColor[] = ['red', 'black', 'blue', 'yellow'];

export const mockOCRScan = async (): Promise<OCRResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tiles: Tile[] = [];
      const numTiles = Math.floor(Math.random() * 10) + 15; // Simulate 15-25 tiles

      for (let i = 0; i < numTiles; i++) {
        const isFalseJoker = Math.random() < 0.05; // 5% chance of False Joker
        
        if (isFalseJoker) {
          tiles.push({
            id: Math.random().toString(36).substring(7),
            value: 0,
            color: null,
            isFalseJoker: true,
          });
        } else {
          tiles.push({
            id: Math.random().toString(36).substring(7),
            value: Math.floor(Math.random() * 13) + 1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
      }

      resolve({
        tiles,
        confidence: 0.8 + Math.random() * 0.2, // 80-100% confidence
      });
    }, 2000); // 2 second delay
  });
};
