# Catan Forge

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/Qsanti/catan-forge/issues)

A free web app that generates balanced Catan maps with fair initial placement suggestions. No backend needed — everything runs in the browser.

**[Live App](https://catan.fromlapampa.com/)** | **[Algorithm Docs](./docs/algorithms/)**

## Features

- **Balanced map generation** using simulated annealing
  - Same resources never adjacent
  - 6/8 numbers never adjacent
  - Even pip distribution across board regions
- **Fair initial placements** for 3 or 4 players using MaxMin allocation
- **Share maps** via URL (reproducible seeds)
- **Export to PNG**
- **Dark mode** with system preference detection
- **Bilingual** (English / Spanish) with auto-detection
- **Accessible** color-blind friendly palette with SVG patterns

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npx vitest` | Run tests (watch mode) |
| `npx vitest run` | Run tests once |

## How It Works

### Map Balancing

The generator uses **simulated annealing** to optimize board layout:

1. Randomly places resources and number tokens
2. Iteratively swaps tiles, accepting improvements and occasionally accepting worse states to escape local minima
3. Minimizes an energy function that penalizes same-resource adjacency, high-number (6/8) adjacency, and uneven pip distribution across board regions

### Initial Placements

Uses a **MaxMin fair allocation** algorithm:

- Round 1 (player 1 → N): each player picks the highest-value available vertex
- Round 2 (player N → 1): each player picks the vertex that maximizes their minimum resource coverage
- Roads point toward the player's most-needed resource

### Fairness Metrics

- **Pip variance** across board regions (corners, edges, center)
- **Resource diversity** per player
- **Gini coefficient** for pip distribution equality

## Tech Stack

- React + TypeScript
- Vite
- Vitest
- CSS Modules
- SVG rendering

## Project Structure

```
src/
  components/       UI components (Board, Controls, ShareExport, InitialPlacements)
  logic/
    types/           TypeScript type definitions
    board/           Board structure, coordinates, adjacency
    generation/      Simulated annealing generator + scorer
    placement/       Initial placement algorithm
    utils/           Constants, seeded PRNG, URL serialization
  hooks/             React hooks (useMapGenerator, useInitialPlacements)
  i18n/              Internationalization (ES/EN)
  styles/            Theme, CSS variables
```

## License

MIT
