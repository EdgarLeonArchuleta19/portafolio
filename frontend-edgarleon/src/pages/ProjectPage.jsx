import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import ButtonLink from '../components/ui/ButtonLink'
import Container from '../components/ui/Container'
import SkillTags from '../components/ui/SkillTags'
import StateMessage from '../components/ui/StateMessage'
import { getProjectBySlug, mediaUrl } from '../api/strapi'
import { useLocalizedApi } from '../hooks/useLocalizedApi'
import { normalizeHref } from '../utils/url'
import { useI18n } from '../i18n'

const PROSE_CLASSES = [
  'prose max-w-none',
  'prose-headings:font-display prose-headings:text-fg',
  'prose-p:text-fg prose-li:text-fg prose-strong:text-fg prose-em:text-fg',
  'prose-a:text-accent prose-a:no-underline hover:prose-a:underline',
  'prose-blockquote:border-accent prose-code:text-accent prose-hr:border-line',
  'prose-pre:border prose-pre:border-line prose-pre:bg-surface',
].join(' ')

function BackLink() {
  const { t } = useI18n()

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-accent"
    >
      <span aria-hidden="true">←</span> {t('detail.backToWork')}
    </Link>
  )
}

function NotFound() {
  const { t } = useI18n()

  return (
    <div className="py-14">
      <StateMessage status="error" message={t('detail.notFound')} />
      <p className="mt-2 text-sm text-muted">{t('detail.notFoundHint')}</p>
      <div className="mt-6">
        <BackLink />
      </div>
    </div>
  )
}

function Screenshots({ title, urls }) {
  const { t } = useI18n()
  if (urls.length === 0) return null

  return (
    <div className="mt-10 border-t border-line pt-8">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">{t('detail.screenshots')}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {urls.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`${title} — ${index + 1}`}
            className="rounded-lg border border-line object-cover"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}

function ProjectDetail({ project }) {
  const { t } = useI18n()
  const coverUrl = mediaUrl(project.coverImage)
  const screenshotUrls = (project.screenshots ?? []).map(mediaUrl).filter(Boolean)
  const liveUrl = normalizeHref(project.liveUrl)
  const repositoryUrl = normalizeHref(project.repositoryUrl)
  const meta = [project.year, project.slug].filter(Boolean)

  return (
    <section className="py-14 md:py-20">
      <BackLink />

      <header className="mt-8 border-b border-line pb-8">
        <p className="font-mono text-xs text-muted">{t('detail.projectLabel')}</p>
        <h1 className="mt-3 font-display text-[clamp(34px,5vw,56px)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
          {project.title}
        </h1>
        {meta.length > 0 && <p className="mt-5 font-mono text-[13px] text-muted">{meta.join(' / ')}</p>}
      </header>

      {coverUrl && (
        <div className="mt-8 overflow-hidden rounded-lg border border-line">
          <img src={coverUrl} alt={project.title} className="h-auto w-full object-cover" />
        </div>
      )}

      <div className="mt-8">
        {project.skills?.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">{t('detail.stack')}</p>
            <SkillTags skills={project.skills} />
          </div>
        )}

        {project.body?.trim() ? (
          <article className={PROSE_CLASSES}>
            <ReactMarkdown>{project.body}</ReactMarkdown>
          </article>
        ) : (
          <p className="max-w-[65ch] whitespace-pre-line text-[16px] leading-relaxed text-muted">
            {project.description}
          </p>
        )}
      </div>

      <Screenshots title={project.title} urls={screenshotUrls} />

      {(liveUrl || repositoryUrl) && (
        <nav className="mt-10 flex flex-wrap gap-3 border-t border-line pt-8">
          {liveUrl && (
            <ButtonLink href={liveUrl} variant="primary" external>
              {t('detail.live')} <span aria-hidden="true">↗</span>
            </ButtonLink>
          )}
          {repositoryUrl && (
            <ButtonLink href={repositoryUrl} external>
              {t('detail.repository')} <span aria-hidden="true">↗</span>
            </ButtonLink>
          )}
        </nav>
      )}
    </section>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = useLocalizedApi(getProjectBySlug, slug)

  return (
    <Container width="narrow">
      {project.loading && <StateMessage status="loading" />}
      {!project.loading && (project.data ? <ProjectDetail project={project.data} /> : <NotFound />)}
    </Container>
  )
}
