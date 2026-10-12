import SectionHeading from '../ui/SectionHeading'
import StateMessage from '../ui/StateMessage'
import { useReveal } from '../../hooks/useReveal'
import { useI18n } from '../../i18n'

const BAR_WIDTH_PERCENT_BY_LEVEL = { fundamentos: 30, aplicado: 60, avanzado: 80, dominado: 100 }
const UNCATEGORIZED = 'other'

const levelPercent = (skill) => BAR_WIDTH_PERCENT_BY_LEVEL[skill.level] ?? 0

function groupByCategorySortedByLevel(skills) {
  const groups = {}
  for (const skill of skills) {
    const category = skill.category?.name || UNCATEGORIZED
    ;(groups[category] ??= []).push(skill)
  }
  for (const items of Object.values(groups)) {
    items.sort((a, b) => levelPercent(b) - levelPercent(a))
  }
  return groups
}

function SkillBar({ skill, delay }) {
  const { t } = useI18n()

  return (
    <li>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[15px] text-fg">{skill.name}</span>
        <span className="text-xs text-muted">{t(`skills.levels.${skill.level}`, skill.level)}</span>
      </div>
      <div className="h-[4px] overflow-hidden rounded-full bg-ink2">
        <div
          className="animate-grow-bar h-full rounded-full bg-accent opacity-80"
          style={{ width: `${levelPercent(skill)}%`, animationDelay: `${delay}ms` }}
        />
      </div>
    </li>
  )
}

export default function Skills({ skills, loading, error }) {
  const reveal = useReveal()
  const { t } = useI18n()
  const hasSkills = skills?.length > 0

  return (
    <div ref={reveal}>
      <div className="animate-fade-up">
        <SectionHeading index="02" title={t('sections.skillsTitle')} hint={t('sections.skillsHint')} />
      </div>

      {loading && <StateMessage status="loading" />}
      {error && <StateMessage status="error" message={t('skills.loadError')} />}
      {!loading && !error && !hasSkills && <StateMessage message={t('skills.empty')} />}

      {hasSkills && (
        <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5">
          {Object.entries(groupByCategorySortedByLevel(skills)).map(([category, items], groupIndex) => (
            <div
              key={category}
              className="animate-fade-up rounded-xl border border-line bg-surface p-[22px] transition-colors duration-300 hover:border-line2"
              style={{ animationDelay: `${groupIndex * 80}ms` }}
            >
              <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
                {category === UNCATEGORIZED ? t('skills.otherCategory') : category}
              </h3>

              <ul className="flex flex-col gap-3.5">
                {items.map((skill, index) => (
                  <SkillBar key={skill.documentId ?? skill.id} skill={skill} delay={200 + index * 100} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
