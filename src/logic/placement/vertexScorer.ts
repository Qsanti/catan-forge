import type { Board, Resource, Vertex } from '../types/board.types';
import { PLACEMENT_WEIGHTS } from '../utils/constants';

export function scoreVertex(
  board: Board,
  vertexId: string,
  playerResources: Resource[],
  vertices: Vertex[],
): number {
  const vertex = vertices.find(v => v.id === vertexId);
  if (!vertex) return 0;

  let pipTotal = 0;
  const resourceTypes = new Set<Resource>();

  for (const hexIdx of vertex.adjacentHexIndices) {
    const hex = board.hexes[hexIdx];
    if (hex.resource === 'desert') continue;
    pipTotal += hex.pips;
    resourceTypes.add(hex.resource);
  }

  // Diversity bonus per resource type not already owned
  let diversityBonus = 0;
  for (const r of resourceTypes) {
    if (!playerResources.includes(r)) {
      diversityBonus += PLACEMENT_WEIGHTS.diversityBonus;
    }
  }

  // Min coverage bonus
  const counts = new Map<Resource, number>();
  for (const r of playerResources) {
    counts.set(r, (counts.get(r) || 0) + 1);
  }
  for (const r of resourceTypes) {
    if (!counts.has(r)) counts.set(r, 0);
  }
  const minCount = counts.size > 0 ? Math.min(...counts.values()) : 0;
  const coverageBonus = PLACEMENT_WEIGHTS.coverageBonusMultiplier * minCount;

  return pipTotal + diversityBonus + coverageBonus;
}
