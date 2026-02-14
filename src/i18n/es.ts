const es = {
  appTitle: 'Catan Forge',
  generateButton: 'Generar Mapa',
  balanceLabel: 'Balance',
  balanceResources: 'Recursos',
  balanceNumbers: 'Números',
  balanceBoth: 'Ambos',
  playersLabel: 'Jugadores',
  showPlacements: 'Mostrar Colocaciones',
  shareCopied: '¡Copiado!',
  exportPng: 'Exportar PNG',
  darkMode: 'Modo Oscuro',
  language: 'Idioma',
  wood: 'Madera',
  wheat: 'Trigo',
  sheep: 'Oveja',
  brick: 'Ladrillo',
  ore: 'Mineral',
  desert: 'Desierto',
  player1: 'Jugador 1',
  player2: 'Jugador 2',
  player3: 'Jugador 3',
  player4: 'Jugador 4',
  sharedMap: 'Mapa Compartido',
  generateOwn: 'Genera Tu Propio Mapa',
} as const;

export type TranslationKeys = keyof typeof es;
export default es;
