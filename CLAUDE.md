# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Catan Forge — a free web app that generates balanced Catan maps with fair initial placement suggestions. Static site, no backend, everything runs in the browser.

## Tech Stack

- React 19 + TypeScript + Vite
- Vitest for testing
- CSS Modules + CSS custom properties (light/dark themes)
- Static deploy (Vercel)

## Commands

- `npm run dev` — start dev server (localhost:5173)
- `npm run build` — production build (tsc + vite build, output in `dist/`)
- `npm run preview` — preview production build
- `npx vitest run` — run tests once
- `npx vitest` — run tests in watch mode

## Architecture

```
src/
  logic/           — pure TypeScript, no React dependencies
    types/         — board.types.ts, game.types.ts
    board/         — coordinates (axial), adjacency graph, board builder
    generation/    — simulated annealing map generator + energy scorer
    placement/     — MaxMin fair allocation for initial settlements
    utils/         — constants, seeded PRNG, URL serialization
  components/      — React components (Board SVG, Controls, ShareExport, InitialPlacements)
  hooks/           — useMapGenerator, useInitialPlacements
  i18n/            — ES/EN translations with context provider
  styles/          — theme colors, CSS variables
```

## Key Patterns

- Board uses axial hex coordinates (q, r) with flat-top orientation
- Map generation uses simulated annealing with an energy function (resource adjacency + number adjacency + pip variance)
- Seeded PRNG (mulberry32) enables reproducible maps via URL sharing
- i18n via React Context, auto-detects navigator.language
- All logic in `src/logic/` is framework-agnostic and testable without React

## Conventions

- CSS Modules for component styles (`.module.css`)
- CSS custom properties for theming (`variables.css`)
- Color-blind friendly palette with SVG pattern overlays
- TypeScript strict mode
