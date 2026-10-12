import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readStoredValue, storeValue } from '../utils/storage'
import { LOCALES, translations } from './translations'

const I18nContext = createContext(null)

const LOCALE_STORAGE_KEY = 'portfolio-locale'

function getInitialLocale() {
  const storedLocale = readStoredValue(LOCALE_STORAGE_KEY)
  if (LOCALES.includes(storedLocale)) return storedLocale
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

function findTranslation(locale, path) {
  return path.split('.').reduce((node, key) => node?.[key], translations[locale])
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    storeValue(LOCALE_STORAGE_KEY, locale)
  }, [locale])

  const setLocale = useCallback((nextLocale) => {
    if (LOCALES.includes(nextLocale)) setLocaleState(nextLocale)
  }, [])

  const t = useCallback((path, fallback = path) => findTranslation(locale, path) ?? fallback, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n debe usarse dentro de I18nProvider')
  return context
}
