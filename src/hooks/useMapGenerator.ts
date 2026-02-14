import { useState, useCallback, useEffect } from 'react';
import type { Board } from '../logic/types/board.types';
import type { BalanceMode, MapConfig } from '../logic/types/game.types';
import { generateMap } from '../logic/generation/generator';

function randomSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function useMapGenerator(initialConfig?: Partial<MapConfig>) {
  const [board, setBoard] = useState<Board | null>(null);
  const [balanceMode, setBalanceMode] = useState<BalanceMode>(initialConfig?.balanceMode ?? 'both');
  const [numPlayers, setNumPlayers] = useState<3 | 4>(initialConfig?.numPlayers ?? 4);
  const [seed, setSeed] = useState(initialConfig?.seed ?? randomSeed);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback((s: string, mode: BalanceMode, players: 3 | 4) => {
    setIsGenerating(true);
    const result = generateMap({ seed: s, balanceMode: mode, numPlayers: players });
    setBoard(result);
    setIsGenerating(false);
  }, []);

  const regenerate = useCallback(() => {
    const s = randomSeed();
    setSeed(s);
    generate(s, balanceMode, numPlayers);
  }, [generate, balanceMode, numPlayers]);

  useEffect(() => {
    generate(seed, balanceMode, numPlayers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBalanceChange = useCallback((mode: BalanceMode) => {
    setBalanceMode(mode);
    const s = randomSeed();
    setSeed(s);
    generate(s, mode, numPlayers);
  }, [generate, numPlayers]);

  const handlePlayersChange = useCallback((players: 3 | 4) => {
    setNumPlayers(players);
    const s = randomSeed();
    setSeed(s);
    generate(s, balanceMode, players);
  }, [generate, balanceMode]);

  return {
    board,
    config: { seed, balanceMode, numPlayers },
    isGenerating,
    generate: regenerate,
    setBalanceMode: handleBalanceChange,
    setNumPlayers: handlePlayersChange,
  };
}
