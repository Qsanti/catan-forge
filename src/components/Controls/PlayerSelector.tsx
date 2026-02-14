import type { FC } from 'react';
import styles from './Controls.module.css';

type PlayerSelectorProps = {
  value: 3 | 4;
  onChange: (num: 3 | 4) => void;
};

const PlayerSelector: FC<PlayerSelectorProps> = ({ value, onChange }) => {
  return (
    <div className={styles.group}>
      <span className={styles.label}>Players</span>
      <div className={styles.segmented}>
        <label>
          <input
            type="radio"
            name="numPlayers"
            value={3}
            checked={value === 3}
            onChange={() => onChange(3)}
          />
          <span>3 Players</span>
        </label>
        <label>
          <input
            type="radio"
            name="numPlayers"
            value={4}
            checked={value === 4}
            onChange={() => onChange(4)}
          />
          <span>4 Players</span>
        </label>
      </div>
    </div>
  );
};

export default PlayerSelector;
