type SkillIconConfig = {
  src: string
  background?: string
  padding?: number
}

type SkillCategory = {
  category: string
  icon?: SkillIconConfig
  items: string[]
}

type SkillBadgeCloudProps = {
  skills: SkillCategory[]
}

const defaultIcon = '🛠️'

function renderIcon(icon?: SkillIconConfig) {
  if (!icon) {
    return (
      <span className="text-2xl" aria-hidden>
        {defaultIcon}
      </span>
    )
  }

  const hasBackground = typeof icon.background === 'string' && icon.background.trim().length > 0
  const style = {
    backgroundColor: hasBackground ? icon.background : '#ffffff',
    padding: typeof icon.padding === 'number' ? icon.padding : 6,
  }

  return (
    <span
      aria-hidden
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 shadow-sm dark:border-slate-700"
      style={style}
    >
      <img src={icon.src} alt="" className="h-full w-full object-contain" loading="lazy" />
    </span>
  )
}

const palette = ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#8338ec', '#ff9f1c']

function pickAccent(key: string) {
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % palette.length
  return palette[index]
}

function titleCase(label: string) {
  return label
    .split(/\s|\//)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

export function SkillBadgeCloud({ skills }: SkillBadgeCloudProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {skills.map(({ category, items, icon }) => {
        const accent = pickAccent(category)
        const accentGradient = `radial-gradient(circle at center, ${accent}, transparent 70%)`

        return (
          <div
            key={category}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur transition duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:shadow-lg"
          >
            <span
              className="pointer-events-none absolute inset-x-10 -top-32 h-48 rounded-full opacity-20 transition duration-500 group-hover:opacity-35"
              style={{ background: accentGradient }}
              aria-hidden
            />
            <header className="flex items-center justify-between gap-4">
              {renderIcon(icon)}
              <h3 className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">{titleCase(category)}</h3>
            </header>
            <div className="mt-6 flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 transition group-hover:-translate-y-0.5 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}


