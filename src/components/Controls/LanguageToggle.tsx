import { useI18n } from '../../i18n/useI18n';

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const toggle = () => {
    setLocale(locale === 'en' ? 'es' : 'en');
  };

  return (
    <button onClick={toggle}>
      {locale === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
