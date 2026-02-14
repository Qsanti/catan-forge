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
        const rp1 = vertexPosition(vid1, board, hexSize);
        const rp2 = vertexPosition(vid2, board, hexSize);
        // Shorten road: pull endpoints 30% toward center
        const mx = (rp1.x + rp2.x) / 2;
        const my = (rp1.y + rp2.y) / 2;
        const shrink = 0.2;
        const p1 = { x: rp1.x + (mx - rp1.x) * shrink, y: rp1.y + (my - rp1.y) * shrink };
        const p2 = { x: rp2.x + (mx - rp2.x) * shrink, y: rp2.y + (my - rp2.y) * shrink };

        return (
          <g key={i}>
            <line
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke="#000000"
              strokeWidth={8}
              strokeLinecap="round"
            />
            <line
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={color}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <circle
              cx={pos.x}
              cy={pos.y}
              r={hexSize * 0.25}
              fill={color}
              stroke="#000000"
              strokeWidth={1.5}
            />
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={hexSize * 0.2}
              fill="#000000"
              fontWeight="900"
            >
              {p.player}
            </text>
          </g>
        );
      })}
    </g>
  );
}
