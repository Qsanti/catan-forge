import type { Resource } from '../types/board.types';
import type { Rng } from '../utils/random';
import { RESOURCE_DISTRIBUTION } from '../utils/constants';

export function placeResources(rng: Rng): Resource[] {
  return rng.shuffle([...RESOURCE_DISTRIBUTION]);
}
