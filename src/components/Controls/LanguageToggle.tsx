import { useI18n } from '../../i18n/useI18n';
import styles from './Controls.module.css';

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const toggle = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  return (
    <button onClick={toggle} className={styles.button}>
      {locale === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
