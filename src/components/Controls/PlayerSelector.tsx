import type { FC } from 'react';
import { useI18n } from '../../i18n/useI18n';
import styles from './Controls.module.css';

type PlayerSelectorProps = {
  value: 3 | 4;
  onChange: (num: 3 | 4) => void;
};

const PlayerSelector: FC<PlayerSelectorProps> = ({ value, onChange }) => {
  const { t } = useI18n();

  return (
    <div className={styles.group}>
      <span className={styles.label}>{t('playersLabel')}</span>
      <div className={styles.segmented}>
        <label>
          <input
            type="radio"
            name="numPlayers"
            value={3}
            checked={value === 3}
            onChange={() => onChange(3)}
          />
          <span>{t('nPlayers').replace('{n}', '3')}</span>
        </label>
        <label>
          <input
            type="radio"
            name="numPlayers"
            value={4}
            checked={value === 4}
            onChange={() => onChange(4)}
          />
          <span>{t('nPlayers').replace('{n}', '4')}</span>
        </label>
      </div>
    </div>
  );
};

export default PlayerSelector;
