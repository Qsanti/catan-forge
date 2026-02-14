/**
 * Central configuration for all algorithm parameters.
 * Tweak these values to tune map generation and placement behavior.
 */

// ─── Map Generation: Simulated Annealing ────────────────────────────

export const ANNEALING = {
  /** Number of iterations (swap attempts) */
  iterations: 500,
  /** Starting temperature — higher = more random exploration early on */
  initialTemperature: 1000,
  /** Cooling rate per iteration (temp *= coolingRate) */
  coolingRate: 0.95,
  /** Probability of swapping resources vs numbers in "both" mode */
  resourceSwapProbability: 0.5,
};

// ─── Map Generation: Energy Function Weights ────────────────────────

export const ENERGY_WEIGHTS = {
  /** Penalty per pair of adjacent hexes with the same resource */
  sameResourceAdjacency: 100,
  /** Penalty per pair of adjacent high-value numbers (6 & 8) */
  highNumberAdjacency: 150,
  /** Multiplier for pip variance across board regions */
  pipVariance: 10,
};

// ─── Initial Placement: Vertex Scoring ──────────────────────────────

export const PLACEMENT_WEIGHTS = {
  /** Bonus per resource type the player doesn't own yet */
  diversityBonus: 10,
  /** Multiplier for the player's minimum resource count (coverage) */
  coverageBonusMultiplier: 5,
  /** Bonus when a road leads toward a new resource type */
  roadDiversityBonus: 5,
};
