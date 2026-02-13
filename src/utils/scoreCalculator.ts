import { Tile } from '../types';

export const calculateTotalScore = (tiles: Tile[]): number => {
  return tiles.reduce((sum, tile) => sum + tile.value, 0);
};
