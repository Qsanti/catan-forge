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
  const isSharedView = urlConfig !== null;
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

  const goToGenerator = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{t('appTitle')}</h1>
          <span className={styles.subtitle}>{isSharedView ? t('sharedMap') : 'Map Generator'}</span>
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

      {isSharedView ? (
        <div className={styles.sharedActions}>
          <button className={controlStyles.generateButton} onClick={goToGenerator}>
            {t('generateOwn')}
          </button>
        </div>
      ) : (
        <>
          <div className={`${controlStyles.controls} ${styles.controlsRow}`}>
            <BalanceSelector value={config.balanceMode} onChange={setBalanceMode} />
            <PlayerSelector value={config.numPlayers} onChange={setNumPlayers} />
            <button className={`${controlStyles.generateButton} ${styles.generateMain}`} onClick={generate}>
              {t('generateButton')}
            </button>
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
            </div>
          </div>
        </>
      )}

      <footer className={styles.footer}>
        <span>Catan Forge</span>
        <span className={styles.footerDot}>·</span>
        <a href="https://github.com/Qsanti/catan-forge" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          <svg className={styles.ghIcon} viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
          Contribute
        </a>
      </footer>
    </div>
  );
}

export default App;
