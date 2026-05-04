import type { Stage } from './GameTimeline'
import { StageIcon } from './StageIcon'

type TimelineStageProps = {
  stage: Stage
  stageIndex: number
  total: number
}

export function TimelineStage({ stage, stageIndex, total }: TimelineStageProps) {
  return (
    <article
      data-stage-index={stageIndex}
      className="timeline-stage"
    >
      <div className="timeline-stage__grid">
        <div className="timeline-stage__marker" aria-hidden>
          <span className="timeline-stage__dot" />
          {stageIndex < total - 1 && <span className="timeline-stage__line" />}
        </div>
        <div className="timeline-stage__checkpoint">
          {stage.url ? (
            <a
              className="inline-flex"
              href={stage.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${stage.title} link`}
            >
              <StageIcon icon={stage.icon} kind={stage.type} background={stage.iconBackground} />
            </a>
          ) : (
            <StageIcon icon={stage.icon} kind={stage.type} background={stage.iconBackground} />
          )}
        </div>
        <div className="timeline-stage__body">
          <header className="timeline-stage__header flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="timeline-stage__organization text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                {stage.organization}
              </p>
              <h3 className="timeline-stage__title mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stage.title}</h3>
            </div>
            <span className="timeline-stage__time mt-1 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-mono uppercase tracking-[0.3em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 lg:mt-0">
              {stage.timeframe}
            </span>
          </header>
          <p className="timeline-stage__description text-base leading-7 text-slate-600 dark:text-slate-300">{stage.description}</p>

          {stage.contributions.length > 0 && (
            <div className="timeline-stage__list space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {stage.contributions.map(({ text, icon }) => (
                <div key={text} className="flex items-start gap-3 px-1">
                  <span aria-hidden className="mt-0.5 text-base">{icon}</span>
                  <p className="leading-6">{text}</p>
                </div>
              ))}
            </div>
          )}

          {stage.stack.length > 0 && (
            <div className="timeline-stage__stack flex flex-wrap gap-2">
              {stage.stack.map((tech) => {
                const chipClass =
                  stage.type === 'education'
                    ? 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    : 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
                return (
                  <span
                    key={tech}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${chipClass}`}
                  >
                    {tech}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}


