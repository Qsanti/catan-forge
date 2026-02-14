import type { Placement } from '../../logic/types/game.types';
import type { Board } from '../../logic/types/board.types';

const PLAYER_COLORS = ['#2196F3', '#F44336', '#FF9800', '#4CAF50'];

type Props = {
  placements: Placement[];
  board: Board;
  hexSize: number;
};

function vertexPosition(vertexId: string, board: Board, hexSize: number): { x: number; y: number } {
  // Average the centers of adjacent hexes to find vertex position
  const vertex = board.vertices.find(v => v.id === vertexId);
  if (!vertex) return { x: 0, y: 0 };

  let x = 0;
  let y = 0;
  for (const hexIdx of vertex.adjacentHexIndices) {
    const hex = board.hexes[hexIdx];
    const hx = hexSize * (3 / 2) * hex.coord.q;
    const hy = hexSize * (Math.sqrt(3) / 2 * hex.coord.q + Math.sqrt(3) * hex.coord.r);
    x += hx;
    y += hy;
  }
  x /= vertex.adjacentHexIndices.length;
  y /= vertex.adjacentHexIndices.length;
  return { x, y };
}

export function InitialPlacements({ placements, board, hexSize }: Props) {
  return (
    <g className="initial-placements">
      {placements.map((p, i) => {
        const color = PLAYER_COLORS[(p.player - 1) % PLAYER_COLORS.length];
        const pos = vertexPosition(p.settlement.id, board, hexSize);

        // Road endpoints
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
