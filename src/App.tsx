import { useEffect, useState, useRef, type KeyboardEvent } from 'react'
import data from './assets/ed.json'
import edImage from './assets/ed.jpg'
import resumePdf from './assets/Efstathios_Daras_Resume.pdf'
import { CertificationsCarousel } from './components/CertificationsCarousel/CertificationsCarousel'
import { GameTimeline } from './components/GameTimeline/GameTimeline'
import { INTEREST_ORDER, InterestsGrid } from './components/InterestsGrid/InterestsGrid'
import { SkillBadgeCloud } from './components/SkillBadgeCloud/SkillBadgeCloud'
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay'
import { stopSpinningFavicon } from './utils/spinningFavicon'

function App() {
  const {
    name,
    title,
    briefProfile,
    email,
    phone,
    socials = [],
    skills,
    workExperiences,
    education,
    certifications,
    languages
  } = data

  const phoneHref = phone.replace(/\s+/g, '')

  const displayedInterests = INTEREST_ORDER
  const [emailCopied, setEmailCopied] = useState(false)
  const [phoneCopied, setPhoneCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const profileImageRef = useRef<HTMLImageElement>(null)
  const [profileImageLoaded, setProfileImageLoaded] = useState(false)

  const fallbackCopyTextToClipboard = (text: string) => {
    if (typeof document === 'undefined') return
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (error) {
      console.error('Clipboard copy failed', error)
    } finally {
      document.body.removeChild(textArea)
    }
  }

  const copyTextToClipboard = (text: string, onCopied: () => void) => {
    if (
      typeof navigator !== 'undefined' &&
      typeof window !== 'undefined' &&
      navigator.clipboard &&
      window.isSecureContext
    ) {
      navigator.clipboard
        .writeText(text)
        .then(onCopied)
        .catch(() => {
          fallbackCopyTextToClipboard(text)
          onCopied()
        })
    } else {
      fallbackCopyTextToClipboard(text)
      onCopied()
    }
  }

  const copyEmail = () => copyTextToClipboard(email, () => setEmailCopied(true))
  const copyPhone = () => copyTextToClipboard(phone, () => setPhoneCopied(true))

  const handleEmailKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      copyEmail()
    }
  }

  const handlePhoneKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      copyPhone()
    }
  }

  useEffect(() => {
    if (!emailCopied) return
    if (typeof window === 'undefined') return
    const timeout = window.setTimeout(() => {
      setEmailCopied(false)
    }, 2000)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [emailCopied])

  useEffect(() => {
    if (!phoneCopied) return
    if (typeof window === 'undefined') return
    const timeout = window.setTimeout(() => {
      setPhoneCopied(false)
    }, 2000)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [phoneCopied])

  // Stop spinning favicon and hide loading overlay once app is loaded
  useEffect(() => {
    // Wait for profile image to load, with a maximum timeout
    if (profileImageLoaded) {
      // Small delay after image loads for smooth transition
      const loadTimer = setTimeout(() => {
        setIsLoading(false)
        stopSpinningFavicon()
      }, 300)
      
      return () => {
        clearTimeout(loadTimer)
      }
    }
  }, [profileImageLoaded])

  // Fallback timeout in case image doesn't load
  useEffect(() => {
    const maxDelay = import.meta.env.DEV ? 5000 : 2000
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        stopSpinningFavicon()
      }
    }, maxDelay)
    
    return () => {
      clearTimeout(fallbackTimer)
    }
  }, [isLoading])
  const renderSocialIcon = (platform: string) => {
    const normalized = platform.toLowerCase()

    if (normalized.includes('linkedin')) {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M22.225 0H1.771C.792 0 0 .773 0 1.728v20.543C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.728C24 .773 23.2 0 22.225 0ZM7.118 20.452H3.554V9h3.564v11.452Zm-1.782-13.02a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123Zm16.11 13.02h-3.554V14.88c0-1.328-.027-3.036-1.852-3.036-1.853 0-2.136 1.445-2.136 2.939v5.668H9.35V9h3.414v1.562h.05c.476-.901 1.637-1.853 3.372-1.853 3.609 0 4.279 2.377 4.279 5.474v6.269Z" />
        </svg>
      )
    }

    if (normalized.includes('github')) {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.727-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.086 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.305-5.466-1.333-5.466-5.931 0-1.311.469-2.382 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404 11.48 11.48 0 0 1 3.003.404c2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.839 1.235 1.91 1.235 3.221 0 4.609-2.804 5.624-5.476 5.922.43.372.823 1.102.823 2.222 0 1.605-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z" />
        </svg>
      )
    }

    if (normalized.includes('twitter') || normalized === 'x' || normalized.includes('x (twitter)')) {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M17.562 0h3.65l-7.96 9.132L22.597 24h-6.918l-4.816-7.356L5.999 24H2.339l8.61-9.879L1.7 0h6.593l4.501 6.651L17.563 0Z" />
        </svg>
      )
    }

    if (normalized.includes('facebook')) {
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.691V11.41h3.129V8.709c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.144v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.765v2.339h3.587l-.467 3.295h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0Z" />
        </svg>
      )
    }

    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm3.707 13.707a1 1 0 0 1-1.414 0L12 13.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L10.586 12 8.293 9.707a1 1 0 0 1 1.414-1.414L12 10.586l2.293-2.293a1 1 0 0 1 1.414 1.414L13.414 12l2.293 2.293a1 1 0 0 1 0 1.414Z" />
      </svg>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#f7f6f2] text-slate-800">
      {isLoading && <LoadingOverlay />}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-white via-[#f7f6f2] to-[#ecebe6]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.35),_transparent_60%)]" />

      <main className={`relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:gap-12 sm:px-6 md:gap-16 md:px-8 lg:gap-20 lg:px-12 transition-all duration-300 ${isLoading ? 'blur-sm' : ''}`}>
        <section id="hero" className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl">{name}</h1>
              <p className="text-lg text-slate-600 sm:text-xl">{title}</p>
              {socials.length > 0 ? (
                <div className="flex flex-wrap gap-3 text-slate-500">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 hover:text-slate-900"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                    >
                      {renderSocialIcon(social.name)}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{briefProfile}</p>
            <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-4">
              <div className="group relative inline-flex w-full items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 sm:w-auto">
                <a
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent transition hover:border-slate-200 hover:bg-slate-200"
                  href={`mailto:${email}`}
                  aria-label={`Email ${name}`}
                  title="Open email client"
                >
                  <span className="text-lg">✉️</span>
                </a>
                <span
                  className="select-text rounded-md px-2 py-1 text-slate-600 transition group-hover:text-slate-900"
                  role="button"
                  tabIndex={0}
                  onClick={copyEmail}
                  onKeyDown={handleEmailKeyDown}
                  title="Copy email address"
                >
                  {email}
                </span>
                {emailCopied ? (
                  <span
                    role="status"
                    aria-live="polite"
                    className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow-md"
                  >
                    Copied!
                  </span>
                ) : null}
              </div>
              <div className="group relative inline-flex w-full items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 transition hover:bg-slate-100 hover:text-slate-900 sm:w-auto">
                <a
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent transition hover:border-slate-200 hover:bg-slate-200"
                  href={`tel:${phoneHref}`}
                  aria-label={`Call ${phone}`}
                  title="Call phone number"
                >
                  <span className="text-lg">📱</span>
                </a>
                <span
                  className="select-text rounded-md px-2 py-1 text-slate-600 transition group-hover:text-slate-900"
                  role="button"
                  tabIndex={0}
                  onClick={copyPhone}
                  onKeyDown={handlePhoneKeyDown}
                  title="Copy phone number"
                >
                  {phone}
                </span>
                {phoneCopied ? (
                  <span
                    role="status"
                    aria-live="polite"
                    className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow-md"
                  >
                    Copied!
                  </span>
                ) : null}
              </div>
              <a
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900 sm:w-auto"
                href={resumePdf}
                download="Efstathios_Daras_Resume.pdf"
              >
                <span aria-hidden className="text-lg text-emerald-600 transition group-hover:text-emerald-700">
                  ⬇️
                </span>
                <span>Download CV</span>
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative flex aspect-square w-48 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm sm:w-64 lg:w-80">
              <img
                ref={profileImageRef}
                src={edImage}
                alt={`${name} portrait`}
                className="h-full w-full object-cover"
                onLoad={() => setProfileImageLoaded(true)}
                onError={() => setProfileImageLoaded(true)} // Still hide loading even if image fails
              />
            </div>
          </div>
        </section>

        <section id="skills" className="border-t border-slate-200 pt-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Skills</p>
          </div>
          <SkillBadgeCloud skills={skills} />
        </section>

        <section id="journey" className="border-t border-slate-200 pt-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Work &amp; Education</p>
            </div>
            <GameTimeline experiences={workExperiences} education={education} />
          </div>
        </section>

        <section id="certifications" className="border-t border-slate-200 pt-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Certifications</p>
              <p className="mx-auto max-w-2xl text-base text-slate-600">
                I have always emphasized on continuous learning and staying updated with the latest technologies and best practices.
              </p>
            </div>
            <CertificationsCarousel certifications={certifications} />
          </div>
        </section>

        <section id="languages" className="border-t border-slate-200 pt-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Languages</p>
            <p className="max-w-2xl text-sm text-slate-600">
              Once I read that learning a new language is beneficial for the brain. Striving with german ever since!
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {languages.map((lang) => (
              <article
                key={lang.name}
                className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl" aria-hidden>
                    {lang.flag ?? '🌐'}
                  </span>
                  <div className="text-left">
                    <p className="text-lg font-semibold text-slate-900">{lang.name}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{lang.proficiency}</p>
                  </div>
                </div>
                {lang.description ? <p className="text-sm text-slate-600">{lang.description}</p> : null}
                <p className="mt-auto text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{lang.institute}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="interests" className="border-t border-slate-200 pt-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Beyond the keyboard</p>
            </div>
            <InterestsGrid interests={displayedInterests} />
          </div>
        </section>

        <footer className="mb-6 text-center text-xs text-slate-500">
          Vibe coded with the help of Cursor, GPT-5 Codex and Claude Sonnet 4.5.
        </footer>
      </main>
    </div>
  )
}

export default App
