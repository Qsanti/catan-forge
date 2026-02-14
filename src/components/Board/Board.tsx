import { forwardRef, type ReactNode } from 'react';
import type { Board as BoardType } from '../../logic/types/board.types';
import { axialToPixel } from '../../logic/board/coordinates';
import HexTile from './HexTile';
import styles from './Board.module.css';

type BoardProps = {
  board: BoardType;
  children?: ReactNode;
};

const HEX_SIZE = 50;

const Board = forwardRef<SVGSVGElement, BoardProps>(({ board, children }, ref) => {
  const positions = board.hexes.map(h => axialToPixel(h.coord, HEX_SIZE));

  const xs = positions.map(p => p.x);
  const ys = positions.map(p => p.y);
  const padding = HEX_SIZE + 10;
  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  return (
    <div className={styles.boardContainer}>
      <svg ref={ref} className={styles.boardSvg} viewBox={viewBox}>
        <defs>
          <pattern id="pattern-vertical" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="3" y1="0" x2="3" y2="6" stroke="#000" strokeWidth="1" opacity="0.3" />
          </pattern>
          <pattern id="pattern-dots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill="#000" opacity="0.3" />
          </pattern>
          <pattern id="pattern-horizontal" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="#000" strokeWidth="1" opacity="0.3" />
          </pattern>
          <pattern id="pattern-diagonal" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="6" x2="6" y2="0" stroke="#000" strokeWidth="1" opacity="0.3" />
          </pattern>
          <pattern id="pattern-crosshatch" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="#000" strokeWidth="1" opacity="0.3" />
            <line x1="3" y1="0" x2="3" y2="6" stroke="#000" strokeWidth="1" opacity="0.3" />
          </pattern>
        </defs>
        {board.hexes.map((hex, i) => (
          <HexTile
            key={i}
            hex={hex}
            cx={positions[i].x}
            cy={positions[i].y}
            size={HEX_SIZE}
            animationDelay={i * 30}
          />
        ))}
        {children}
      </svg>
    </div>
  );
});

Board.displayName = 'Board';

export default Board;
