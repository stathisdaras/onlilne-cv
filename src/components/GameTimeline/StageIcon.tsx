type StageIconProps = {
  icon: string
  kind: 'education' | 'experience'
  background?: string
}

export function StageIcon({ icon, kind, background }: StageIconProps) {
  const variantClass =
    kind === 'education'
      ? 'border-slate-200 text-slate-500'
      : 'border-slate-300 text-slate-600'

  const trimmed = icon.trim()
  const isImage = /^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')
  const hasCustomBackground = Boolean(background)
  const backgroundClass = hasCustomBackground ? '' : kind === 'education' ? 'bg-white' : 'bg-slate-100'
  const textClass = !isImage && hasCustomBackground ? 'text-white' : ''

  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1 ${variantClass} ${backgroundClass} ${textClass}`}
      style={hasCustomBackground ? { backgroundColor: background, borderColor: background } : undefined}
    >
      {isImage ? (
        <img src={trimmed} alt="" className="h-14 w-14 max-h-full max-w-full object-contain" loading="lazy" />
      ) : (
        <span>{icon}</span>
      )}
    </div>
  )
}


