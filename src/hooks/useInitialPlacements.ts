import { useMemo, useState } from 'react';
import type { Board } from '../logic/types/board.types';
import type { Placement } from '../logic/types/game.types';
import { calculatePlacements } from '../logic/placement/placements';

export function useInitialPlacements(board: Board | null, numPlayers: 3 | 4) {
  const [showPlacements, setShowPlacements] = useState(false);

  const placements: Placement[] = useMemo(() => {
    if (!board) return [];
    return calculatePlacements(board, numPlayers);
  }, [board, numPlayers]);

  return { placements, showPlacements, setShowPlacements };
}
