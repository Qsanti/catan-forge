import type { FC } from 'react';

type NumberTokenProps = {
  number: number;
  cx: number;
  cy: number;
  size: number;
};

const NumberToken: FC<NumberTokenProps> = ({ number, cx, cy, size }) => {
  const isHigh = number === 6 || number === 8;
  const radius = size * 0.32;
  const pips = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 }[number] ?? 0;
  const dotRadius = size * 0.03;

  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill="#FFF8E1" stroke="#5D4037" strokeWidth={1.5} />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.32}
        fontWeight={isHigh ? 700 : 500}
        fill={isHigh ? '#D32F2F' : '#333333'}
      >
        {number}
      </text>
      <g>
        {Array.from({ length: pips }, (_, i) => {
          const totalWidth = (pips - 1) * dotRadius * 3;
          const dotX = cx - totalWidth / 2 + i * dotRadius * 3;
          const dotY = cy + size * 0.18;
          return (
            <circle
              key={i}
              cx={dotX}
              cy={dotY}
              r={dotRadius}
              fill={isHigh ? '#D32F2F' : '#333333'}
            />
          );
        })}
      </g>
    </g>
  );
};

export default NumberToken;
