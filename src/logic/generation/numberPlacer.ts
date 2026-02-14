import type { Resource } from '../types/board.types';
import type { Rng } from '../utils/random';
import { NUMBER_TOKENS } from '../utils/constants';

export function placeNumbers(resources: Resource[], rng: Rng): (number | null)[] {
  const tokens = rng.shuffle([...NUMBER_TOKENS]);
  let tokenIdx = 0;
  return resources.map(r => (r === 'desert' ? null : tokens[tokenIdx++]));
}
