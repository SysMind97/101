export type TileColor = 'red' | 'black' | 'blue' | 'yellow';

export interface Tile {
  id: string;
  value: number; // 1-13, 0 for False Joker
  color: TileColor | null; // False Joker might not have a color or is irrelevant
  isFalseJoker?: boolean;
}

export interface OCRResult {
  tiles: Tile[];
  confidence: number;
}
