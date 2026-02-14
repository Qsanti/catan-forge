import type { Resource } from '../types/board.types';

/** Standard Catan resource distribution (19 hexes) */
export const RESOURCE_DISTRIBUTION: Resource[] = [
  'wood', 'wood', 'wood', 'wood',
  'wheat', 'wheat', 'wheat', 'wheat',
  'sheep', 'sheep', 'sheep', 'sheep',
  'brick', 'brick', 'brick',
  'ore', 'ore', 'ore',
  'desert',
];

/** Standard number tokens (placed on 18 non-desert hexes) */
export const NUMBER_TOKENS: number[] = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12,
];

/** Number → pip count (probability dots on token) */
export const PIPS: Record<number, number> = {
  2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
  8: 5, 9: 4, 10: 3, 11: 2, 12: 1,
};

/** High-value numbers that should not be adjacent */
export const HIGH_NUMBERS = [6, 8];

/** Resource colors (color-blind friendly) */
export const RESOURCE_COLORS: Record<Resource, string> = {
  wood: '#228B22',
  wheat: '#FFD700',
  sheep: '#90EE90',
  brick: '#E64A19',
  ore: '#607D8B',
  desert: '#D7CCC8',
};

/** SVG pattern ids per resource (for color-blind accessibility) */
export const RESOURCE_PATTERNS: Record<Resource, string> = {
  wood: 'pattern-vertical',
  wheat: 'pattern-dots',
  sheep: 'pattern-horizontal',
  brick: 'pattern-diagonal',
  ore: 'pattern-crosshatch',
  desert: 'pattern-solid',
};
