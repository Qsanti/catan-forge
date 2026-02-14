import type { Board, Hex, Resource } from '../types/board.types';
import { HEX_COORDS } from './coordinates';
import { buildVerticesAndEdges } from './adjacency';
import { PIPS } from '../utils/constants';

/**
 * Create a Board with given resources and numbers assigned to hex positions.
 * resources[i] and numbers[i] correspond to HEX_COORDS[i].
 * Desert hex should have numbers[i] = null.
 */
export function createBoard(resources: Resource[], numbers: (number | null)[]): Board {
  const hexes: Hex[] = HEX_COORDS.map((coord, i) => ({
    coord,
    resource: resources[i],
    number: numbers[i],
    pips: numbers[i] ? PIPS[numbers[i]] : 0,
  }));

  const { vertices, edges } = buildVerticesAndEdges();

  return { hexes, vertices, edges };
}
