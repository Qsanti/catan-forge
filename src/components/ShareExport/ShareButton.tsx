import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import styles from '../Controls/Controls.module.css';

type Props = {
  mapUrl: string;
};

export function ShareButton({ mapUrl }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(mapUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleClick} className={styles.button}>
      {copied ? t('shareCopied') : 'Share'}
    </button>
  );
}
