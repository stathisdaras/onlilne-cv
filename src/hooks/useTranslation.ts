import en from '../locales/en.json'
import de from '../locales/de.json'
import { useLanguage } from '../contexts/LanguageContext'

const locales = { en, de }

export function useTranslation() {
  const { language } = useLanguage()
  const translations = locales[language]

  function t(key: string): string {
    const result = key.split('.').reduce<unknown>((current, part) => {
      if (current != null && typeof current === 'object') {
        return (current as Record<string, unknown>)[part]
      }
      return undefined
    }, translations)
    return typeof result === 'string' ? result : key
  }

  return { t, language }
}
