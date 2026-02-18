import type { FC } from 'react';
import type { BalanceMode } from '../../logic/types/game.types';
import type { TranslationKeys } from '../../i18n/es';
import { useI18n } from '../../i18n/useI18n';
import styles from './Controls.module.css';

type BalanceSelectorProps = {
  value: BalanceMode;
  onChange: (mode: BalanceMode) => void;
};

const options: { value: BalanceMode; labelKey: TranslationKeys }[] = [
  { value: 'resources', labelKey: 'balanceResources' },
  { value: 'numbers', labelKey: 'balanceNumbers' },
  { value: 'both', labelKey: 'balanceBoth' },
];

const BalanceSelector: FC<BalanceSelectorProps> = ({ value, onChange }) => {
  const { t } = useI18n();

  return (
    <div className={styles.group}>
      <span className={styles.label}>{t('balanceLabel')}</span>
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
            <span>{t(opt.labelKey)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BalanceSelector;
