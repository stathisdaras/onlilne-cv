import { useState, useEffect } from 'react'

const PHRASES = [
  { prefix: 'I enjoy ', skills: ['Vibe Coding', 'Troubleshooting', 'Problem Solving', 'Mentoring'] },
  { prefix: 'I like writing in ', skills: ['Java', 'Kotlin', 'TypeScript', 'Python', 'SQL'] },
  { prefix: 'I like building ', skills: ['Distributed Systems', 'Scalable Backends', 'Microservices', 'REST APIs', 'AI-powered tools'] },
  { prefix: 'I am passionate about ', skills: ['Clean Code', 'Customer Satisfaction', 'Product Engineering', 'User Experience', 'Beautiful Design'] },
]

const HOLD_MS = 900
const SKILL_FADE_MS = 250
const PREFIX_FADE_MS = 300

export function SkillCycler() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [skillIdx, setSkillIdx] = useState(0)
  const [skillVisible, setSkillVisible] = useState(true)
  const [prefixVisible, setPrefixVisible] = useState(true)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const isLastSkill = skillIdx === PHRASES[phraseIdx].skills.length - 1

    const t1 = setTimeout(() => {
      setSkillVisible(false)

      const t2 = setTimeout(() => {
        if (!isLastSkill) {
          setSkillIdx(i => i + 1)
          setSkillVisible(true)
        } else {
          setPrefixVisible(false)

          const t3 = setTimeout(() => {
            setPhraseIdx(i => (i + 1) % PHRASES.length)
            setSkillIdx(0)
            setPrefixVisible(true)
            setSkillVisible(true)
          }, PREFIX_FADE_MS)
          timers.push(t3)
        }
      }, SKILL_FADE_MS)
      timers.push(t2)
    }, HOLD_MS)
    timers.push(t1)

    return () => timers.forEach(clearTimeout)
  }, [phraseIdx, skillIdx])

  const phrase = PHRASES[phraseIdx]
  const skill = phrase.skills[skillIdx]

  return (
    <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
      <span style={{ transition: `opacity ${PREFIX_FADE_MS}ms ease`, opacity: prefixVisible ? 1 : 0 }}>
        {phrase.prefix}
      </span>
      <span
        className="font-semibold text-slate-900 dark:text-slate-50"
        style={{ transition: `opacity ${SKILL_FADE_MS}ms ease`, opacity: skillVisible ? 1 : 0 }}
      >
        {skill}
      </span>
      <span style={{ transition: `opacity ${PREFIX_FADE_MS}ms ease`, opacity: prefixVisible ? 1 : 0 }}>.</span>
    </p>
  )
}
