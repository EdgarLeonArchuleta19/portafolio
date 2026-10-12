import ButtonLink from '../ui/ButtonLink'
import StateMessage from '../ui/StateMessage'
import { useReveal } from '../../hooks/useReveal'
import { findGithubProfile, normalizeHref } from '../../utils/url'
import { useI18n } from '../../i18n'

export default function Contact({ profile, loading, error }) {
  const reveal = useReveal()
  const { t } = useI18n()

  if (loading) return <StateMessage status="loading" />
  if (error || !profile) return <StateMessage status="error" message={t('states.contactError')} />

  const github = findGithubProfile(profile.socialLinks)
  const socials = (profile.socialLinks ?? [])
    .map((link) => ({ ...link, href: normalizeHref(link.url) }))
    .filter((link) => link.href)

  return (
    <div ref={reveal} className="reveal pt-6 text-center">
      <h2 className="text-[clamp(32px,6vw,50px)] font-semibold tracking-[-0.02em] text-fg">
        {t('sections.contactTitle')}
      </h2>

      <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted md:text-[17px]">
        {t('contact.intro')}
      </p>

      {profile.email && (
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block max-w-full break-all border-b border-line2 pb-1.5 text-[clamp(15px,3vw,22px)] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {profile.email}
        </a>
      )}

      {github && (
        <div className="mt-8">
          <ButtonLink href={github.url} variant="accent" external>
            github.com/{github.username}
          </ButtonLink>
        </div>
      )}

      {socials.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {socials.map((link) => (
            <a
              key={link.id ?? link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[13px] text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {profile.location && (
        <p className="mt-9 text-xs text-muted">
          {t('contact.locatedIn')} {profile.location}
        </p>
      )}
    </div>
  )
}
