import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readStoredValue, storeValue } from './utils/storage'

const ThemeContext = createContext(null)

const THEME_STORAGE_KEY = 'portfolio-theme'

const BROWSER_BAR_COLOR_BY_THEME = { dark: '#0f110f', light: '#f7f5ef' }

function getInitialTheme() {
  const storedTheme = readStoredValue(THEME_STORAGE_KEY)
  if (storedTheme in BROWSER_BAR_COLOR_BY_THEME) return storedTheme
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', BROWSER_BAR_COLOR_BY_THEME[theme])
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    storeValue(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider')
  return context
}
