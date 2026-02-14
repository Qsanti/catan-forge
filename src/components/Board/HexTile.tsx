import type { FC } from 'react';
import type { Hex } from '../../logic/types/board.types';
import { hexCorners } from '../../logic/board/coordinates';
import { RESOURCE_COLORS } from '../../logic/utils/constants';
import NumberToken from './NumberToken';
import styles from './Board.module.css';

type HexTileProps = {
  hex: Hex;
  cx: number;
  cy: number;
  size: number;
  animationDelay: number;
};

const HexTile: FC<HexTileProps> = ({ hex, cx, cy, size, animationDelay }) => {
  const corners = hexCorners(cx, cy, size);
  const points = corners.map(c => `${c.x},${c.y}`).join(' ');
  const fill = RESOURCE_COLORS[hex.resource];

  return (
    <g className={styles.hexGroup} style={{ animationDelay: `${animationDelay}ms` }}>
      <polygon
        points={points}
        fill={fill}
        stroke="var(--hex-stroke)"
        strokeWidth={2.5}
      />
      {hex.number !== null && (
        <NumberToken number={hex.number} cx={cx} cy={cy} size={size} />
      )}
    </g>
  );
};

export default HexTile;
