import { useEffect, useState } from 'react'
import './Navigation.css'

type NavItem = {
  id: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'journey', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'languages', label: 'Languages' },
  { id: 'interests', label: 'Interests' },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

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
          {NAV_ITEMS.map(({ id, label }) => (
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

        {/* Mobile Menu Button */}
        <button
          className="navigation__mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
          {NAV_ITEMS.map(({ id, label }) => (
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
        </div>
      )}
    </nav>
  )
}
