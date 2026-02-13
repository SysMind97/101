import { calculateTotalScore } from './scoreCalculator';
import { Tile } from '../types';

const testTiles: Tile[] = [
  { id: '1', value: 10, color: 'red' },
  { id: '2', value: 5, color: 'blue' },
  { id: '3', value: 0, color: null, isFalseJoker: true }, // Should be 0
  { id: '4', value: 13, color: 'black' },
];

const expectedScore = 10 + 5 + 0 + 13; // 28
const actualScore = calculateTotalScore(testTiles);

console.log(`Expected: ${expectedScore}, Actual: ${actualScore}`);

if (actualScore === expectedScore) {
  console.log("✅ Score Calculation Test Passed");
} else {
  console.error("❌ Score Calculation Test Failed");
}
