import { useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { LOCALES } from '../../i18n/translations'
import { useTheme } from '../../theme'

const NAV_LINKS = [
  { anchor: '#projects', labelKey: 'nav.projects' },
  { anchor: '#skills', labelKey: 'nav.skills' },
  { anchor: '#contact', labelKey: 'nav.contact' },
]

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" />
    </svg>
  )
}

function NavLinks({ className, linkClassName }) {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const toSectionHref = (anchor) => (pathname === '/' ? anchor : `/${anchor}`)

  return (
    <nav className={className}>
      {NAV_LINKS.map((link) => (
        <a
          key={link.anchor}
          href={toSectionHref(link.anchor)}
          className={`rounded-md py-2 text-sm text-muted transition-colors hover:text-fg ${linkClassName}`}
        >
          {t(link.labelKey)}
        </a>
      ))}
    </nav>
  )
}

function LanguageSwitch() {
  const { t, locale, setLocale } = useI18n()

  return (
    <div className="flex items-center rounded-full border border-line p-0.5" role="group" aria-label={t('language')}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
            locale === code ? 'bg-ink2 text-fg' : 'text-muted hover:text-fg'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

function ThemeToggle() {
  const { t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t('theme.light') : t('theme.dark')}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line2 hover:text-fg"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] w-full max-w-[1080px] items-center justify-between gap-3 px-4 sm:px-6">
        <NavLinks className="hidden items-center gap-1 md:flex" linkClassName="px-3" />

        <div className="flex items-center gap-2">
          <NavLinks className="flex items-center gap-0.5 md:hidden" linkClassName="px-2.5" />
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
