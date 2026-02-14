import type { HexCoord, Vertex, Edge } from '../types/board.types';
import { HEX_COORDS, coordKey, getNeighborCoords } from './coordinates';

/** Map from coordKey → index in HEX_COORDS */
const coordToIndex = new Map<string, number>();
HEX_COORDS.forEach((c, i) => coordToIndex.set(coordKey(c), i));

/** Get indices of neighboring hexes (that exist on the board) */
export function getHexNeighborIndices(hexIndex: number): number[] {
  const coord = HEX_COORDS[hexIndex];
  const neighbors: number[] = [];
  for (const nc of getNeighborCoords(coord)) {
    const idx = coordToIndex.get(coordKey(nc));
    if (idx !== undefined) neighbors.push(idx);
  }
  return neighbors;
}

/** Precomputed adjacency list: hexIndex → neighbor hex indices */
export const HEX_ADJACENCY: number[][] = HEX_COORDS.map((_, i) => getHexNeighborIndices(i));

/**
 * Build vertices and edges for the standard Catan board.
 * A vertex is a point shared by 2 or 3 hexes (intersection).
 * An edge connects two adjacent vertices.
 */
export function buildVerticesAndEdges(): { vertices: Vertex[]; edges: Edge[] } {
  // A vertex is identified by the set of hex indices that share it.
  // Each hex has 6 corners. Two adjacent hexes share 2 corners (an edge).
  // Three mutually-adjacent hexes share 1 corner (a vertex).

  // For each hex corner, find which hexes share that corner.
  // We use the pixel positions of corners to group them.
  const cornerMap = new Map<string, Set<number>>(); // roundedPos → set of hex indices

  HEX_COORDS.forEach((coord, hexIdx) => {
    // Get the 6 corners of this hex in a canonical position
    // Use axial coords to compute relative corner positions
    const corners = getHexCornerKeys(coord);
    corners.forEach(ck => {
      if (!cornerMap.has(ck)) cornerMap.set(ck, new Set());
      cornerMap.get(ck)!.add(hexIdx);
    });
  });

  // Build vertices: only corners touching 2+ hexes are interesting,
  // but we include all corners for completeness (edge hexes have corners touching 1 hex too,
  // but those are valid settlement spots in Catan)
  const vertexMap = new Map<string, Vertex>();
  const cornerToVertexId = new Map<string, string>();

  for (const [ck, hexIndices] of cornerMap) {
    const sorted = [...hexIndices].sort((a, b) => a - b);
    const id = `v_${ck}`;
    cornerToVertexId.set(ck, id);
    vertexMap.set(id, {
      id,
      adjacentHexIndices: sorted,
      adjacentVertexIds: [], // filled below
      adjacentEdgeIds: [],   // filled below
    });
  }

  // Two vertices are adjacent if they share an edge of a hex
  // (i.e., they are consecutive corners of the same hex)
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];

  HEX_COORDS.forEach((coord) => {
    const corners = getHexCornerKeys(coord);
    for (let i = 0; i < 6; i++) {
      const c1 = corners[i];
      const c2 = corners[(i + 1) % 6];
      const vid1 = cornerToVertexId.get(c1)!;
      const vid2 = cornerToVertexId.get(c2)!;
      const edgeId = vid1 < vid2 ? `e_${vid1}_${vid2}` : `e_${vid2}_${vid1}`;

      if (!edgeSet.has(edgeId)) {
        edgeSet.add(edgeId);
        const edge: Edge = {
          id: edgeId,
          vertexIds: vid1 < vid2 ? [vid1, vid2] : [vid2, vid1],
        };
        edges.push(edge);

        // Link vertices as adjacent
        const v1 = vertexMap.get(vid1)!;
        const v2 = vertexMap.get(vid2)!;
        if (!v1.adjacentVertexIds.includes(vid2)) v1.adjacentVertexIds.push(vid2);
        if (!v2.adjacentVertexIds.includes(vid1)) v2.adjacentVertexIds.push(vid1);
        v1.adjacentEdgeIds.push(edgeId);
        v2.adjacentEdgeIds.push(edgeId);
      }
    }
  });

  return { vertices: [...vertexMap.values()], edges };
}

/**
 * Get canonical string keys for the 6 corners of a hex at axial coord.
 * Uses rounded pixel positions as keys to group shared corners.
 */
function getHexCornerKeys(coord: HexCoord): string[] {
  // Flat-top hex corner positions relative to center
  const size = 1; // unit size for key generation
  const cx = (3 / 2) * coord.q;
  const cy = (Math.sqrt(3) / 2) * coord.q + Math.sqrt(3) * coord.r;

  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    // Round to avoid floating-point mismatches
    return `${Math.round(x * 1000)},${Math.round(y * 1000)}`;
  });
}
