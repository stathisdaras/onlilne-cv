import { useTranslation } from '../../hooks/useTranslation'
import './InterestsGrid.css'

export type InterestKey =
  | 'Strength Training and Fitness'
  | 'Non-Fiction Literature'
  | 'Board Games and Chess'
  | 'Coffee Brewing'

type InterestsGridProps = {
  interests: InterestKey[]
}

export const INTEREST_ORDER: InterestKey[] = [
  'Strength Training and Fitness',
  'Non-Fiction Literature',
  'Board Games and Chess',
  'Coffee Brewing',
]

const INTEREST_ICONS: Record<InterestKey, string> = {
  'Strength Training and Fitness': '💪',
  'Non-Fiction Literature': '📚',
  'Board Games and Chess': '♟️',
  'Coffee Brewing': '☕',
}

const INTEREST_LABEL_KEYS: Record<InterestKey, string> = {
  'Strength Training and Fitness': 'interests.strengthTraining',
  'Non-Fiction Literature': 'interests.nonFiction',
  'Board Games and Chess': 'interests.boardGames',
  'Coffee Brewing': 'interests.coffee',
}

export function InterestsGrid({ interests }: InterestsGridProps) {
  const { t } = useTranslation()
  const orderedInterests = INTEREST_ORDER.filter((interest) => interests.includes(interest))

  return (
    <div className="interests-list">
      {orderedInterests.map((interest) => (
        <span key={interest} className="interest-tag" data-interest={slugify(interest)}>
          <span className="interest-tag__icon" aria-hidden="true">
            {INTEREST_ICONS[interest]}
          </span>
          <span className="interest-tag__label">{t(INTEREST_LABEL_KEYS[interest])}</span>
        </span>
      ))}
    </div>
  )
}

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')
}
