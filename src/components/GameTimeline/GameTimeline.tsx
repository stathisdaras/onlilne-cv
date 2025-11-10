import { useMemo } from 'react'
import { TimelineStage } from './TimelineStage'
import './GameTimeline.css'

type WorkExperience = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  mainContributions: string[]
  techStack: string[]
  icon?: string
  iconBackground?: string
  url?: string
}

type EducationItem = {
  institution: string
  degree: string
  startDate: string
  endDate: string
  thesis?: string
  supervisor?: string
  icon?: string
  iconBackground?: string
  url?: string
}

type GameTimelineProps = {
  experiences: WorkExperience[]
  education: EducationItem[]
}

export type Stage = {
  id: string
  type: 'education' | 'experience'
  title: string
  organization: string
  timeframe: string
  description: string
  contributions: string[]
  stack: string[]
  icon: string
  iconBackground?: string
  url?: string
}

const ICONS: Record<Stage['type'], string> = {
  education: '🎓',
  experience: '🚀',
}

export function GameTimeline({ experiences, education }: GameTimelineProps) {
  const stages = useMemo<Stage[]>(() => {
    const parseDate = (label: string) => {
      const direct = Date.parse(label)
      if (!Number.isNaN(direct)) return direct
      const withDay = Date.parse(`${label} 1`)
      return Number.isNaN(withDay) ? 0 : withDay
    }

    const eduStages = education.map<Stage>((entry) => {
      const extras: string[] = []
      if (entry.thesis) extras.push(`Thesis: ${entry.thesis}`)
      if (entry.supervisor) extras.push(`Supervisor: ${entry.supervisor}`)

      return {
        id: `education-${entry.degree}`,
        type: 'education',
        title: entry.degree,
        organization: entry.institution,
        timeframe: `${entry.startDate} — ${entry.endDate}`,
        description: 'Focus on software development and computer science.',
        contributions: extras,
        stack: [],
        icon: entry.icon ?? ICONS.education,
        iconBackground: entry.iconBackground,
        url: entry.url,
      }
    })

    const workStages = [...experiences]
      .slice()
      .sort((a, b) => {
        const aDate = parseDate(a.startDate)
        const bDate = parseDate(b.startDate)
        return bDate - aDate
      })
      .map<Stage>((experience) => ({
        id: `experience-${experience.company}-${experience.startDate}`,
        type: 'experience',
        title: experience.position,
        organization: experience.company,
        timeframe: `${experience.startDate} — ${experience.endDate}`,
        description: experience.description,
        contributions: experience.mainContributions,
        stack: experience.techStack,
        icon: experience.icon ?? ICONS.experience,
        iconBackground: experience.iconBackground,
        url: experience.url,
      }))

    return [...workStages, ...eduStages]
  }, [education, experiences])
  return (
    <div className="timeline-board">
      <div className="timeline-axis" aria-hidden />
      <div className="timeline-track">
        {stages.map((stage, index) => (
          <TimelineStage
            key={stage.id}
            stageIndex={index}
            total={stages.length}
            stage={stage}
          />
        ))}
      </div>
    </div>
  )
}


