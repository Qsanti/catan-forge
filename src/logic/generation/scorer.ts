import type { Board } from '../types/board.types';
import type { BalanceMode } from '../types/game.types';
import { HEX_ADJACENCY } from '../board/adjacency';
import { HIGH_NUMBERS } from '../utils/constants';
import { ENERGY_WEIGHTS } from '../utils/algorithmConfig';

export function countSameResourceAdjacencies(board: Board): number {
  let count = 0;
  for (let i = 0; i < board.hexes.length; i++) {
    const res = board.hexes[i].resource;
    if (res === 'desert') continue;
    for (const j of HEX_ADJACENCY[i]) {
      if (j > i && board.hexes[j].resource === res) count++;
    }
  }
  return count;
}

export function countHighNumberAdjacencies(board: Board): number {
  let count = 0;
  for (let i = 0; i < board.hexes.length; i++) {
    const num = board.hexes[i].number;
    if (num === null || !HIGH_NUMBERS.includes(num)) continue;
    for (const j of HEX_ADJACENCY[i]) {
      if (j > i) {
        const nj = board.hexes[j].number;
        if (nj !== null && HIGH_NUMBERS.includes(nj)) count++;
      }
    }
  }
  return count;
}

export function calculatePipVariance(board: Board): number {
  const corners = [0, 2, 7, 11, 16, 18];
  const center = [9];
  const outer = new Set([...corners, ...center]);
  const edgeIndices: number[] = [];
  for (let i = 0; i < 19; i++) {
    if (!outer.has(i)) edgeIndices.push(i);
  }

  const regions = [corners, edgeIndices, center];
  const regionPips = regions.map(indices => {
    const total = indices.reduce((s, i) => s + board.hexes[i].pips, 0);
    return indices.length > 0 ? total / indices.length : 0;
  });

  const mean = regionPips.reduce((s, v) => s + v, 0) / regionPips.length;
  return regionPips.reduce((s, v) => s + (v - mean) ** 2, 0) / regionPips.length;
}

export function calculateEnergy(board: Board, _mode: BalanceMode): number {
  return (
    countSameResourceAdjacencies(board) * ENERGY_WEIGHTS.sameResourceAdjacency +
    countHighNumberAdjacencies(board) * ENERGY_WEIGHTS.highNumberAdjacency +
    calculatePipVariance(board) * ENERGY_WEIGHTS.pipVariance
  );
}
