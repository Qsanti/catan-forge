import type { Board, Resource, Vertex } from '../types/board.types';
import type { Placement } from '../types/game.types';
import { scoreVertex } from './vertexScorer';
import { PLACEMENT_WEIGHTS } from '../utils/algorithmConfig';

function getResourcesForVertex(board: Board, vertex: Vertex): Resource[] {
  return vertex.adjacentHexIndices
    .map(i => board.hexes[i].resource)
    .filter(r => r !== 'desert');
}

function pickBestVertex(
  board: Board,
  available: Set<string>,
  playerResources: Resource[],
  vertices: Vertex[],
): Vertex | null {
  let best: Vertex | null = null;
  let bestScore = -1;

  for (const vid of available) {
    const score = scoreVertex(board, vid, playerResources, vertices);
    if (score > bestScore) {
      bestScore = score;
      best = vertices.find(v => v.id === vid) || null;
    }
  }
  return best;
}

function pickRoad(board: Board, vertex: Vertex, playerResources: Resource[], takenEdges: Set<string>): string {
  // Pick edge leading toward the best adjacent hex the player doesn't have
  let bestEdge = '';
  let bestScore = -1;

  for (const edgeId of vertex.adjacentEdgeIds) {
    if (takenEdges.has(edgeId)) continue;

    const edge = board.edges.find(e => e.id === edgeId)!;
    const otherVid = edge.vertexIds[0] === vertex.id ? edge.vertexIds[1] : edge.vertexIds[0];
    const otherVertex = board.vertices.find(v => v.id === otherVid);
    if (!otherVertex) continue;

    let score = 0;
    for (const hexIdx of otherVertex.adjacentHexIndices) {
      const hex = board.hexes[hexIdx];
      if (hex.resource === 'desert') continue;
      if (!playerResources.includes(hex.resource)) {
        score += hex.pips + PLACEMENT_WEIGHTS.roadDiversityBonus;
      } else {
        score += hex.pips;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEdge = edgeId;
    }
  }

  // Fallback: if all adjacent edges are taken, pick the first available
  if (!bestEdge) bestEdge = vertex.adjacentEdgeIds[0];

  return bestEdge;
}

function blockVertices(vertexId: string, vertices: Vertex[], taken: Set<string>, blocked: Set<string>) {
  taken.add(vertexId);
  blocked.add(vertexId);
  const v = vertices.find(v => v.id === vertexId);
  if (v) {
    for (const adj of v.adjacentVertexIds) {
      blocked.add(adj);
    }
  }
}

export function calculatePlacements(board: Board, numPlayers: 3 | 4): Placement[] {
  const { vertices, edges } = board;
  const placements: Placement[] = [];
  const taken = new Set<string>();
  const blocked = new Set<string>();
  const takenEdges = new Set<string>();
  const playerResources: Resource[][] = Array.from({ length: numPlayers }, () => []);

  const available = () => {
    const set = new Set<string>();
    for (const v of vertices) {
      if (!blocked.has(v.id)) set.add(v.id);
    }
    return set;
  };

  // Round 1: players 1→N
  for (let p = 0; p < numPlayers; p++) {
    const vertex = pickBestVertex(board, available(), playerResources[p], vertices);
    if (!vertex) continue;

    const resources = getResourcesForVertex(board, vertex);
    playerResources[p].push(...resources);

    const roadId = pickRoad(board, vertex, playerResources[p], takenEdges);
    const road = edges.find(e => e.id === roadId)!;
    takenEdges.add(roadId);

    blockVertices(vertex.id, vertices, taken, blocked);
    placements.push({ settlement: vertex, road, player: p + 1, round: 1 });
  }

  // Round 2: players N→1
  for (let p = numPlayers - 1; p >= 0; p--) {
    const vertex = pickBestVertex(board, available(), playerResources[p], vertices);
    if (!vertex) continue;

    const resources = getResourcesForVertex(board, vertex);
    playerResources[p].push(...resources);

    const roadId = pickRoad(board, vertex, playerResources[p], takenEdges);
    const road = edges.find(e => e.id === roadId)!;
    takenEdges.add(roadId);

    blockVertices(vertex.id, vertices, taken, blocked);
    placements.push({ settlement: vertex, road, player: p + 1, round: 2 });
  }

  return placements;
}
