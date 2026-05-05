import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation } from '../../hooks/useTranslation'
import type { Language } from '../../contexts/LanguageContext'
import './Navigation.css'

const NAV_ITEM_DEFS = [
  { id: 'hero', labelKey: 'nav.about' },
  { id: 'skills', labelKey: 'nav.skills' },
  { id: 'journey', labelKey: 'nav.experience' },
  { id: 'certifications', labelKey: 'nav.certifications' },
  { id: 'languages', labelKey: 'nav.languages' },
  { id: 'interests', labelKey: 'nav.interests' },
]

type NavigationProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export function Navigation({ isDark, onToggleTheme }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  const LANGUAGES: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
  ]

  const navItems = NAV_ITEM_DEFS.map(({ id, labelKey }) => ({ id, label: t(labelKey) }))

  useEffect(() => {
    if (!langDropdownOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [langDropdownOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [navItems])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const navHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - navHeight

      window.scrollTo({
        top: id === 'hero' ? 0 : offsetPosition,
        behavior: 'smooth',
      })
      setIsMenuOpen(false)
    }
  }

  return (
    <nav
      className={`navigation ${isScrolled ? 'navigation--scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="navigation__container">
        <div className="navigation__brand">
          <button
            onClick={() => scrollToSection('hero')}
            className="navigation__logo"
            aria-label="Go to top"
          >
            SD
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="navigation__desktop">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`navigation__link ${
                activeSection === id ? 'navigation__link--active' : ''
              }`}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Language (desktop only) + Dark Mode */}
        <div className="flex items-center gap-1">
          <div ref={langDropdownRef} className="relative hidden md:block">
            <button
              onClick={() => setLangDropdownOpen(o => !o)}
              className="navigation__theme-toggle text-xs font-semibold"
              aria-haspopup="listbox"
              aria-expanded={langDropdownOpen}
            >
              {language.toUpperCase()}
            </button>
            {langDropdownOpen && (
              <ul
                role="listbox"
                style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(247,246,242,0.95)' }}
                className="absolute right-0 z-10 overflow-hidden rounded-b-md shadow-md"
              >
                {LANGUAGES.filter(l => l.code !== language).map(({ code, label }) => (
                  <li key={code} role="option" aria-selected={false}>
                    <button
                      onClick={() => { setLanguage(code); setLangDropdownOpen(false) }}
                      className="navigation__theme-toggle text-xs font-semibold"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={onToggleTheme}
            className="navigation__theme-toggle"
            aria-label={isDark ? t('nav.switchToLight') : t('nav.switchToDark')}
            title={isDark ? t('nav.switchToLight') : t('nav.switchToDark')}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navigation__mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          <span className={`hamburger ${isMenuOpen ? 'hamburger--open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="navigation__mobile-menu">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`navigation__mobile-link ${
                activeSection === id ? 'navigation__mobile-link--active' : ''
              }`}
            >
              {label}
            </button>
          ))}
          <div className="navigation__mobile-lang">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => { setLanguage(code); setIsMenuOpen(false) }}
                className={`navigation__mobile-link ${language === code ? 'navigation__mobile-link--active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
