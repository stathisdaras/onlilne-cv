import { useEffect, useMemo, useState } from 'react'

type Certification = {
  certificationName: string
  institution: string
  icon?: string
  url?: string
  description?: string
}

type CertificationsCarouselProps = {
  certifications: Certification[]
  rotationMs?: number
}

const DEFAULT_ROTATION = 5000
const VISIBLE_COUNT = 6

export function CertificationsCarousel({ certifications, rotationMs = DEFAULT_ROTATION }: CertificationsCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    setStartIndex(0)
  }, [certifications.length])

  useEffect(() => {
    if (certifications.length <= VISIBLE_COUNT) return

    const intervalId = window.setInterval(() => {
      setStartIndex((prev) => (prev + 1) % certifications.length)
    }, rotationMs)

    return () => window.clearInterval(intervalId)
  }, [certifications.length, rotationMs])

  const visibleItems = useMemo(() => {
    if (certifications.length <= VISIBLE_COUNT) return certifications

    return Array.from({ length: VISIBLE_COUNT }, (_, offset) => {
      const index = (startIndex + offset) % certifications.length
      return certifications[index]
    })
  }, [certifications, startIndex])

  const activeIndices = useMemo(() => {
    if (certifications.length <= VISIBLE_COUNT) return new Set(certifications.map((_, index) => index))

    return new Set(
      Array.from({ length: VISIBLE_COUNT }, (_, offset) => (startIndex + offset) % certifications.length),
    )
  }, [certifications, startIndex])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((cert) => (
          <article
            key={`${cert.certificationName}-${cert.institution}`}
            className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              {cert.icon ? (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <img src={cert.icon} alt={cert.institution} className="h-8 w-8 object-contain" loading="lazy" />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  🎓
                </div>
              )}
              <div className="space-y-1 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{cert.institution}</p>
                <p className="text-lg font-semibold text-slate-900">{cert.certificationName}</p>
              </div>
            </div>
            {cert.description ? <p className="text-sm text-slate-600">{cert.description}</p> : null}
            {cert.url ? (
              <div className="mt-auto pt-2">
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
                >
                  View credential
                  <span aria-hidden>↗</span>
                </a>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {certifications.length > VISIBLE_COUNT ? (
        <div className="flex justify-center gap-2">
          {certifications.map((_, index) => (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition ${
                activeIndices.has(index) ? 'bg-slate-800' : 'bg-slate-300'
              }`}
              aria-hidden
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}


