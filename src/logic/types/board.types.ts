/** Axial hex coordinate */
export type HexCoord = { q: number; r: number };

export type Resource = 'wood' | 'wheat' | 'sheep' | 'brick' | 'ore' | 'desert';

export type Hex = {
  coord: HexCoord;
  resource: Resource;
  number: number | null; // null for desert
  pips: number; // probability dots: 6,8→5  5,9→4  4,10→3  3,11→2  2,12→1  desert→0
};

export type Vertex = {
  id: string; // e.g. "v_0_1_2" — sorted hex indices
  adjacentHexIndices: number[]; // indices into Board.hexes array (2 or 3)
  adjacentVertexIds: string[];
  adjacentEdgeIds: string[];
};

export type Edge = {
  id: string; // e.g. "e_v1_v2" — sorted vertex ids
  vertexIds: [string, string];
};

export type Board = {
  hexes: Hex[];
  vertices: Vertex[];
  edges: Edge[];
};
