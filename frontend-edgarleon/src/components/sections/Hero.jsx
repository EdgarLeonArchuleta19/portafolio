import ButtonLink from '../ui/ButtonLink'
import StateMessage from '../ui/StateMessage'
import { useReveal } from '../../hooks/useReveal'
import { findGithubProfile } from '../../utils/url'
import { useI18n } from '../../i18n'

function TerminalCard({ profile }) {
  const firstName = profile.name?.trim().split(/\s+/)[0]?.toLowerCase()
  const lines = [
    ['whoami', profile.name],
    ['role', profile.role],
    ['location', profile.location],
  ]

  return (
    <div
      className="animate-fade-up mx-auto w-full max-w-[360px] overflow-hidden rounded-xl border border-line bg-surface font-mono text-[13px] leading-[1.9] shadow-sm md:max-w-none"
      style={{ animationDelay: '320ms' }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line2" />
          <span className="h-2.5 w-2.5 rounded-full bg-line2" />
          <span className="h-2.5 w-2.5 rounded-full bg-line2" />
        </div>
        <span className="text-[11px] text-muted">~/{firstName || 'portfolio'}</span>
      </div>

      <div className="px-5 py-4">
        {lines.map(([command, output], index) => (
          <div key={command} className={index > 0 ? 'mt-2' : undefined}>
            <p>
              <span className="text-accent">$</span> {command}
            </p>
            <p className="pl-5 text-muted">{output || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ profile, loading, error }) {
  const reveal = useReveal()
  const { t } = useI18n()

  if (loading || error || !profile) {
    return (
      <section className="py-24 md:py-28">
        {loading ? (
          <StateMessage status="loading" />
        ) : (
          <StateMessage status="error" message={t('states.profileError')} />
        )}
      </section>
    )
  }

  const github = findGithubProfile(profile.socialLinks)

  return (
    <section id="top" ref={reveal} className="reveal py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        <div className="text-center md:text-left">
          {profile.location && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[13px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t('hero.locationLabel')} {profile.location}
            </span>
          )}

          <h1 className="animate-fade-up mt-6 font-display text-[clamp(44px,7.5vw,76px)] font-medium leading-[1.02] tracking-[-0.03em] text-fg">
            {profile.name}
          </h1>

          <p className="animate-fade-up mt-4 text-[clamp(18px,3vw,24px)] text-fg" style={{ animationDelay: '80ms' }}>
            {profile.role}
          </p>

          <p
            className="animate-fade-up mx-auto mt-5 max-w-[54ch] text-[16px] leading-relaxed text-muted md:mx-0 md:text-[17px]"
            style={{ animationDelay: '160ms' }}
          >
            {profile.bio}
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
            style={{ animationDelay: '240ms' }}
          >
            <ButtonLink href="#projects" variant="primary">
              {t('hero.viewProjects')}
            </ButtonLink>
            {profile.email && (
              <ButtonLink href={`mailto:${profile.email}`}>{t('hero.writeMe')}</ButtonLink>
            )}
            {github && (
              <ButtonLink href={github.url} variant="subtle" external>
                github.com/{github.username}
              </ButtonLink>
            )}
          </div>
        </div>

        <TerminalCard profile={profile} />
      </div>
    </section>
  )
}
