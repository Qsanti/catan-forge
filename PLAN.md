# Plan: Catan Fair Map Generator

## Context
Web app gratuita para generar mapas justos de Catan (base game). Hosteada como sitio estático (GitHub Pages / Netlify / Vercel), sin backend. Todo corre en el browser.

## Tech Stack
- **React + Vite** (TypeScript)
- **Vitest** para testing
- CSS Modules + CSS custom properties (dark mode)
- Deploy estático gratuito

## Features

### 1. Generador de mapa balanceado
- Board estándar: 19 hexágonos (4 wood, 4 wheat, 4 sheep, 3 brick, 3 ore, 1 desert)
- 18 number tokens (distribución estándar)
- Opciones de balanceo (selector):
  - **Recursos**: mismo recurso no adyacente entre sí
  - **Números**: 6/8 no adyacentes, distribución pareja de pips por zona
  - **Ambos** (default)

### 2. Sugerencia de posiciones iniciales
- Selector de jugadores: 3 o 4
- Calcula posiciones de poblados + caminos iniciales balanceadas
- Cada jugador obtiene acceso similar en total de pips y variedad de recursos
- Sigue regla de distancia (no adyacentes)

### 3. Internacionalización (i18n)
- Español e inglés
- Detección automática por `navigator.language`
- Toggle manual en la UI

### 4. Compartir y exportar
- URL sharing: seed + config codificado en URL param (mapas reproducibles)
- Export a PNG (SVG → canvas → blob → download)

## Arquitectura

```
src/
  components/
    Board/
      Board.tsx              — renderizado del mapa hexagonal (SVG)
      HexTile.tsx            — hexágono individual con color + patrón
      NumberToken.tsx         — token numérico sobre el hex
      Board.module.css
    Controls/
      BalanceSelector.tsx    — selector de tipo de balanceo
      PlayerSelector.tsx     — selector 3/4 jugadores
      LanguageToggle.tsx     — toggle ES/EN
      DarkModeToggle.tsx     — toggle claro/oscuro
      Controls.module.css
    InitialPlacements/
      InitialPlacements.tsx  — overlay de poblados/caminos sugeridos
      Settlement.tsx         — círculo de poblado
      Road.tsx               — línea de camino
    ShareExport/
      ShareButton.tsx        — copiar URL al clipboard
      ExportButton.tsx       — descargar PNG
  logic/
    types/
      board.types.ts         — HexCoord, Resource, Hex, Vertex, Edge, Board
      game.types.ts          — MapConfig, Placement, BalanceMode
    board/
      board.ts               — estructura del board (hexágonos, vértices, aristas)
      coordinates.ts         — sistema de coordenadas axiales
      adjacency.ts           — cálculo de adyacencias
    generation/
      generator.ts           — orquestador: simulated annealing
      resourcePlacer.ts      — colocación de recursos
      numberPlacer.ts        — colocación de number tokens
      scorer.ts              — energy function + fairness metrics
    placement/
      placements.ts          — algoritmo MaxMin de posiciones iniciales
      vertexScorer.ts        — scoring de vértices (pips + diversidad)
    utils/
      constants.ts           — constantes del juego (recursos, tokens, pips)
      random.ts              — seeded PRNG para mapas reproducibles
      url.ts                 — serialización de estado en URL
  hooks/
    useMapGenerator.ts       — estado y lógica de generación
    useInitialPlacements.ts  — cálculo de posiciones
    useUrlState.ts           — persistencia de estado en URL
  i18n/
    es.ts                    — traducciones español
    en.ts                    — traducciones inglés
    index.ts                 — context provider
    useI18n.ts               — hook de i18n
  styles/
    theme.ts                 — paleta de colores + patrones por recurso
    variables.css            — CSS custom properties (light/dark)
  App.tsx
  main.tsx
tests/
  logic/
    generator.test.ts       — constraints de balance
    scorer.test.ts           — energy function y métricas
    adjacency.test.ts        — vecinos de hexágonos
    placements.test.ts       — regla de distancia y fairness
```

## Tipos core

```typescript
type HexCoord = { q: number; r: number };
type Resource = 'wood' | 'wheat' | 'sheep' | 'brick' | 'ore' | 'desert';
type BalanceMode = 'resources' | 'numbers' | 'both';

type Hex = {
  coord: HexCoord;
  resource: Resource;
  number: number | null;  // null para desert
  pips: number;
};

type Vertex = {
  id: string;
  adjacentHexes: HexCoord[];
};

type Edge = {
  id: string;
  vertices: [string, string];
};

type Board = {
  hexes: Map<string, Hex>;
  vertices: Map<string, Vertex>;
  edges: Map<string, Edge>;
};

type Placement = {
  settlement: Vertex;
  road: Edge;
  player: number;
  round: 1 | 2;
};

type MapConfig = {
  seed: string;
  balanceMode: BalanceMode;
  numPlayers: 3 | 4;
};
```

## Algoritmo de balanceo: Simulated Annealing

### Energy function (menor = mejor)
```
energy = sameResourceAdjacencies * 100
       + highNumberAdjacencies(6/8) * 150
       + pipVarianceByRegion * 10
```

### Regiones para medir pip variance
- **Corners**: 3 hexágonos de esquina
- **Edges**: 6 hexágonos de borde
- **Center**: hex central + 6 del anillo interior

### Proceso
1. Board random inicial
2. Para T = 1000 bajando con cooling rate 0.95:
   - Swap random de 2 recursos (o 2 números)
   - Si energy baja → aceptar. Si sube → aceptar con probabilidad exp(-ΔE/T)
3. ~200-300 iteraciones, suficientemente rápido para browser
4. Retornar mejor board encontrado

## Algoritmo de posiciones iniciales: MaxMin Fair Allocation

### Proceso
1. **Ronda 1** (J1→J4): cada jugador elige el mejor vértice disponible
2. **Ronda 2** (J4→J1): criterio MaxMin — maximizar la cobertura mínima de recursos

### Scoring de vértice para jugador
```
score = pipSum + diversityBonus(10 por recurso nuevo) + minCoverage * 5
```

### Métrica de justicia: Gini coefficient
- 0 = igualdad perfecta, 1 = desigualdad máxima
- Medir sobre distribución de pips totales por jugador

## Rendering
- SVG con viewBox responsive
- Paleta color-blind friendly + patrones SVG como indicador secundario:
  - Wood: `#228B22` + líneas verticales
  - Wheat: `#FFD700` + puntos
  - Sheep: `#90EE90` + líneas horizontales
  - Brick: `#E64A19` + líneas diagonales
  - Ore: `#607D8B` + cross-hatch
  - Desert: `#D7CCC8` + sólido
- Números renderizados sobre cada hex (rojo para 6/8)
- Poblados como círculos coloreados por jugador, caminos como líneas
- Animación stagger fade-in al generar nuevo mapa

## UI/UX

### Responsive (mobile-first)
- < 640px: board full-width, controles apilados verticalmente
- 640-1024px: board mediano, controles horizontales
- > 1024px: board grande, controles en sidebar

### Dark mode
- CSS custom properties en `:root` y `[data-theme="dark"]`
- Respetar `prefers-color-scheme`
- Persistir preferencia en localStorage

### Controles en cards
1. **Map Settings**: selector de balanceo + botón "Generar nuevo mapa"
2. **Initial Placements**: selector de jugadores + toggle mostrar/ocultar
3. **Share & Export**: botón compartir URL + botón exportar PNG
4. **Settings**: toggle idioma + toggle dark mode

### Accesibilidad
- ARIA labels en elementos interactivos
- Keyboard navigation (Tab + Enter)
- Contraste WCAG AA (4.5:1 mínimo)
- Tooltips con info de hex (recurso, número, pips)

## UI Flow
1. Usuario entra → ve mapa generado con balance "Ambos" por default
2. Puede ajustar tipo de balanceo, cantidad de jugadores
3. Botón "Generar nuevo mapa" → animación stagger de hexes
4. Toggle "Mostrar posiciones iniciales" → overlay con poblados y caminos
5. Toggle idioma (ES/EN), toggle dark mode
6. Compartir URL o exportar PNG

## Testing (Vitest)
- **Unit tests**: generator, scorer, adjacency, placements
- **Property-based tests**:
  - Boards siempre tienen 19 hexes con distribución correcta de recursos
  - Con modo "both", 6/8 nunca adyacentes y mismo recurso nunca adyacente
  - Settlements siempre respetan regla de distancia
- `npm run test` para correr suite completa

## Fases de implementación

### Fase 1 — MVP
- Proyecto Vite + estructura de archivos
- Tipos core
- Board structure (coordenadas, adyacencias)
- Simulated annealing (generador + scorer)
- Rendering SVG básico (responsive)
- Controles de balanceo + botón generar
- i18n (ES/EN)

### Fase 2 — Polish
- MaxMin placement algorithm
- Dark mode
- Animaciones de generación
- URL sharing (seeded PRNG)
- Export PNG
- Suite de tests

### Fase 3 — Nice to have
- Web Workers si generación > 100ms
- Visual regression tests
- Mejoras de performance (memoización)

## Verificación
- `npm run dev` → abrir en browser, probar mobile y desktop
- Generar múltiples mapas → verificar visualmente que no haya clusters
- Verificar que 6/8 no sean adyacentes (modo "numbers" y "both")
- Verificar posiciones iniciales: distancia respetada, pips balanceados
- Probar URL sharing: copiar URL, abrir en otra pestaña → mismo mapa
- Probar export PNG: descargar, verificar imagen
- Verificar detección de idioma y toggle manual
- Verificar dark mode toggle y detección de preferencia del sistema
- `npm run test` → todos los tests pasan
