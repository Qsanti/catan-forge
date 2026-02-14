import type { Vertex, Edge } from './board.types';

export type BalanceMode = 'resources' | 'numbers' | 'both';

export type MapConfig = {
  seed: string;
  balanceMode: BalanceMode;
  numPlayers: 3 | 4;
};

export type Placement = {
  settlement: Vertex;
  road: Edge;
  player: number;
  round: 1 | 2;
};
