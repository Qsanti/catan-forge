import type { HexCoord } from '../types/board.types';

/**
 * Standard Catan board: 19 hexes in axial coordinates.
 * Rows: 3-4-5-4-3 pattern.
 */
export const HEX_COORDS: HexCoord[] = [
  // Row 0 (top, 3 hexes)
  { q: 0, r: -2 }, { q: 1, r: -2 }, { q: 2, r: -2 },
  // Row 1 (4 hexes)
  { q: -1, r: -1 }, { q: 0, r: -1 }, { q: 1, r: -1 }, { q: 2, r: -1 },
  // Row 2 (center, 5 hexes)
  { q: -2, r: 0 }, { q: -1, r: 0 }, { q: 0, r: 0 }, { q: 1, r: 0 }, { q: 2, r: 0 },
  // Row 3 (4 hexes)
  { q: -2, r: 1 }, { q: -1, r: 1 }, { q: 0, r: 1 }, { q: 1, r: 1 },
  // Row 4 (bottom, 3 hexes)
  { q: -2, r: 2 }, { q: -1, r: 2 }, { q: 0, r: 2 },
];

/** 6 neighbor directions in axial coordinates */
const AXIAL_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 },
  { q: -1, r: 0 }, { q: 0, r: -1 }, { q: 1, r: -1 },
];

export function coordKey(c: HexCoord): string {
  return `${c.q},${c.r}`;
}

export function getNeighborCoords(c: HexCoord): HexCoord[] {
  return AXIAL_DIRECTIONS.map(d => ({ q: c.q + d.q, r: c.r + d.r }));
}

/**
 * Convert axial coord to pixel position (flat-top hex).
 * Returns center (x, y) of the hex.
 */
export function axialToPixel(c: HexCoord, size: number): { x: number; y: number } {
  const x = size * (3 / 2 * c.q);
  const y = size * (Math.sqrt(3) / 2 * c.q + Math.sqrt(3) * c.r);
  return { x, y };
}

/**
 * Get the 6 corner points of a flat-top hexagon centered at (cx, cy).
 */
export function hexCorners(cx: number, cy: number, size: number): { x: number; y: number }[] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return {
      x: cx + size * Math.cos(angle),
      y: cy + size * Math.sin(angle),
    };
  });
}
