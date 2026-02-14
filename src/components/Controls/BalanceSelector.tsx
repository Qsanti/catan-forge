import type { FC } from 'react';
import type { BalanceMode } from '../../logic/types/game.types';
import styles from './Controls.module.css';

type BalanceSelectorProps = {
  value: BalanceMode;
  onChange: (mode: BalanceMode) => void;
};

const options: { value: BalanceMode; label: string }[] = [
  { value: 'resources', label: 'Resources' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'both', label: 'Both' },
];

const BalanceSelector: FC<BalanceSelectorProps> = ({ value, onChange }) => {
  return (
    <div className={styles.group}>
      <span className={styles.label}>Balance</span>
      <div className={styles.segmented}>
        {options.map(opt => (
          <label key={opt.value}>
            <input
              type="radio"
              name="balanceMode"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BalanceSelector;
