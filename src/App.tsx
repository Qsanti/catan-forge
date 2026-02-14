import { useState, useEffect, useRef } from 'react';
import { useMapGenerator } from './hooks/useMapGenerator';
import { useInitialPlacements } from './hooks/useInitialPlacements';
import { useI18n } from './i18n/useI18n';
import { encodeMapToUrl, decodeMapFromUrl } from './logic/utils/url';
import Board from './components/Board/Board';
import { InitialPlacements } from './components/InitialPlacements/InitialPlacements';
import BalanceSelector from './components/Controls/BalanceSelector';
import PlayerSelector from './components/Controls/PlayerSelector';
import { LanguageToggle } from './components/Controls/LanguageToggle';
import { ShareButton } from './components/ShareExport/ShareButton';
import { ExportButton } from './components/ShareExport/ExportButton';
import controlStyles from './components/Controls/Controls.module.css';
import styles from './App.module.css';
import './index.css';

function getInitialTheme(): string {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const urlConfig = decodeMapFromUrl();
  const { board, config, generate, setBalanceMode, setNumPlayers } = useMapGenerator(urlConfig ?? undefined);
  const { placements, showPlacements, setShowPlacements } = useInitialPlacements(board, config.numPlayers);
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  const shareUrl = encodeMapToUrl(config);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{t('appTitle')}</h1>
          <span className={styles.subtitle}>Map Generator</span>
        </div>
        <div className={styles.headerActions}>
          <LanguageToggle />
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {board && (
        <Board board={board} ref={svgRef}>
          {showPlacements && placements.length > 0 && (
            <InitialPlacements placements={placements} board={board} hexSize={50} />
          )}
        </Board>
      )}

      <div className={`${controlStyles.controls} ${styles.controlsRow}`}>
        <BalanceSelector value={config.balanceMode} onChange={setBalanceMode} />
        <PlayerSelector value={config.numPlayers} onChange={setNumPlayers} />
      </div>

      <div className={`${controlStyles.controls} ${styles.actionsRow}`}>
        <label className={styles.placementLabel}>
          <input
            type="checkbox"
            checked={showPlacements}
            onChange={e => setShowPlacements(e.target.checked)}
          />
          {t('showPlacements')}
        </label>
        <div className={styles.actionButtons}>
          <ShareButton mapUrl={shareUrl} />
          <ExportButton svgRef={svgRef} />
          <button className={controlStyles.generateButton} onClick={generate}>
            {t('generateButton')}
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        Catan Forge — Free & Open Source
      </footer>
    </div>
  );
}

export default App;
