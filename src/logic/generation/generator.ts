import type { Board } from '../types/board.types';
import type { MapConfig } from '../types/game.types';
import { createRng } from '../utils/random';
import { createBoard } from '../board/board';
import { placeResources } from './resourcePlacer';
import { placeNumbers } from './numberPlacer';
import { calculateEnergy } from './scorer';
import { ANNEALING } from '../utils/algorithmConfig';


export function generateMap(config: MapConfig): Board {
  const rng = createRng(config.seed);
  const resources = placeResources(rng);
  const numbers = placeNumbers(resources, rng);

  let bestResources = [...resources];
  let bestNumbers = [...numbers];
  let bestBoard = createBoard(bestResources, bestNumbers);
  let bestEnergy = calculateEnergy(bestBoard, config.balanceMode);

  let curResources = [...bestResources];
  let curNumbers = [...bestNumbers];
  let curEnergy = bestEnergy;

  let temp = ANNEALING.initialTemperature;
  const cooling = ANNEALING.coolingRate;

  for (let iter = 0; iter < ANNEALING.iterations; iter++) {
    const swapResources =
      config.balanceMode === 'both'
        ? rng.next() < ANNEALING.resourceSwapProbability
        : config.balanceMode === 'resources';

    const prevResources = [...curResources];
    const prevNumbers = [...curNumbers];

    if (swapResources) {
      const nonDesert = curResources
        .map((r, i) => (r !== 'desert' ? i : -1))
        .filter(i => i >= 0);
      const a = nonDesert[rng.nextInt(0, nonDesert.length - 1)];
      let b = a;
      while (b === a || curResources[a] === curResources[b])
        b = nonDesert[rng.nextInt(0, nonDesert.length - 1)];
      [curResources[a], curResources[b]] = [curResources[b], curResources[a]];
    } else {
      const nonNull = curNumbers
        .map((n, i) => (n !== null ? i : -1))
        .filter(i => i >= 0);
      const a = nonNull[rng.nextInt(0, nonNull.length - 1)];
      let b = a;
      while (b === a || curNumbers[a] === curNumbers[b])
        b = nonNull[rng.nextInt(0, nonNull.length - 1)];
      [curNumbers[a], curNumbers[b]] = [curNumbers[b], curNumbers[a]];
    }

    const candidate = createBoard(curResources, curNumbers);
    const candidateEnergy = calculateEnergy(candidate, config.balanceMode);
    const delta = candidateEnergy - curEnergy;

    if (delta < 0 || rng.next() < Math.exp(-delta / temp)) {
      curEnergy = candidateEnergy;
      if (curEnergy < bestEnergy) {
        bestEnergy = curEnergy;
        bestResources = [...curResources];
        bestNumbers = [...curNumbers];
        bestBoard = candidate;
      }
    } else {
      curResources = prevResources;
      curNumbers = prevNumbers;
    }

    temp *= cooling;
  }

  return bestBoard;
}
