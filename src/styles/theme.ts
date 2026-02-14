import type { Resource } from '../logic/types/board.types';
import { RESOURCE_COLORS } from '../logic/utils/constants';

export { RESOURCE_COLORS };

export const RESOURCE_COLORS_DARK: Record<Resource, string> = {
  wood: '#1B6B1B',
  wheat: '#CCA800',
  sheep: '#6BBF6B',
  brick: '#C43E15',
  ore: '#4A6169',
  desert: '#A89E97',
};

export const PLAYER_COLORS: string[] = [
  '#E53935', // red
  '#1E88E5', // blue
  '#FB8C00', // orange
  '#43A047', // green
];
