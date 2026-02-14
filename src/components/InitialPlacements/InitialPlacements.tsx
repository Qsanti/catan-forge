import type { Placement } from '../../logic/types/game.types';
import type { Board } from '../../logic/types/board.types';
import { axialToPixel, hexCorners } from '../../logic/board/coordinates';

const PLAYER_COLORS = ['#2196F3', '#F44336', '#FF9800', '#4CAF50'];

type Props = {
  placements: Placement[];
  board: Board;
  hexSize: number;
};

type Point = { x: number; y: number };

const EPSILON = 0.5;

function pointsEqual(a: Point, b: Point): boolean {
  return Math.abs(a.x - b.x) < EPSILON && Math.abs(a.y - b.y) < EPSILON;
}

function findSharedCorner(cornerSets: Point[][]): Point {
  // Find a corner point that appears in ALL sets
  const first = cornerSets[0];
  for (const corner of first) {
    if (cornerSets.every(set => set.some(c => pointsEqual(c, corner)))) {
      return corner;
    }
  }
  // Fallback: average all corners (shouldn't happen)
  const all = cornerSets.flat();
  return {
    x: all.reduce((s, c) => s + c.x, 0) / all.length,
    y: all.reduce((s, c) => s + c.y, 0) / all.length,
  };
}

function vertexPosition(vertexId: string, board: Board, hexSize: number): Point {
  const vertex = board.vertices.find(v => v.id === vertexId);
  if (!vertex) return { x: 0, y: 0 };

  // Get corners for each adjacent hex
  const cornerSets = vertex.adjacentHexIndices.map(idx => {
    const hex = board.hexes[idx];
    const center = axialToPixel(hex.coord, hexSize);
    return hexCorners(center.x, center.y, hexSize);
  });

  // The vertex is the corner point shared by all adjacent hexes
  return findSharedCorner(cornerSets);
}

export function InitialPlacements({ placements, board, hexSize }: Props) {
  return (
    <g className="initial-placements">
      {placements.map((p, i) => {
        const color = PLAYER_COLORS[(p.player - 1) % PLAYER_COLORS.length];
        const pos = vertexPosition(p.settlement.id, board, hexSize);

        const [vid1, vid2] = p.road.vertexIds;
        const p1 = vertexPosition(vid1, board, hexSize);
        const p2 = vertexPosition(vid2, board, hexSize);

        return (
          <g key={i}>
            <line
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hexSize * 0.15}
              fill={color}
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={hexSize * 0.15}
              fill="#fff"
              fontWeight="bold"
            >
              {p.player}
            </text>
          </g>
        );
      })}
    </g>
  );
}
