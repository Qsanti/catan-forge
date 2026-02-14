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
import styles from './components/Controls/Controls.module.css';
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
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('appTitle')}</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LanguageToggle />
          <button
            onClick={toggleTheme}
            className={styles.button}
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
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

      <div className={styles.controls} style={{ marginTop: '1.5rem' }}>
        <BalanceSelector value={config.balanceMode} onChange={setBalanceMode} />
        <PlayerSelector value={config.numPlayers} onChange={setNumPlayers} />
      </div>

      <div className={styles.controls} style={{ marginTop: '0.75rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={showPlacements}
            onChange={e => setShowPlacements(e.target.checked)}
          />
          {t('showPlacements')}
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
          <ShareButton mapUrl={shareUrl} />
          <ExportButton svgRef={svgRef} />
          <button className={styles.button} onClick={generate}>
            {t('generateButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
