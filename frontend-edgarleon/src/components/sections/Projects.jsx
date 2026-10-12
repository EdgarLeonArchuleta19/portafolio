import { Link } from 'react-router-dom'
import ButtonLink from '../ui/ButtonLink'
import SectionHeading from '../ui/SectionHeading'
import SkillTags from '../ui/SkillTags'
import StateMessage from '../ui/StateMessage'
import { mediaUrl } from '../../api/strapi'
import { useReveal } from '../../hooks/useReveal'
import { useI18n } from '../../i18n'

const detailPath = (project) => `/project/${project.slug || project.documentId}`

function ProjectCard({ project, index }) {
  const { t } = useI18n()
  const coverUrl = mediaUrl(project.coverImage)

  return (
    <article
      className="animate-fade-up flex h-full flex-col gap-4 rounded-xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-line2"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {coverUrl && (
        <div className="aspect-video overflow-hidden rounded-md border border-line">
          <Link to={detailPath(project)}>
            <img
              src={coverUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </Link>
        </div>
      )}

      <header className="flex items-start gap-3">
        <span className="pt-0.5 text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3 className="text-lg font-medium tracking-[-0.01em] text-fg">
            <Link to={detailPath(project)} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          </h3>
          {project.slug && <p className="mt-0.5 font-mono text-xs text-muted">{project.slug}</p>}
        </div>
      </header>

      <SkillTags skills={project.skills} />

      <footer className="mt-auto flex items-center border-t border-line pt-3.5">
        <Link to={detailPath(project)} className="text-[13px] font-medium text-accent hover:opacity-80">
          {t('projects.view')} <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </article>
  )
}

export default function Projects({ projects, loading, error, github }) {
  const reveal = useReveal()
  const { t } = useI18n()
  const hasProjects = projects?.length > 0

  return (
    <div ref={reveal}>
      <div className="animate-fade-up">
        <SectionHeading index="01" title={t('sections.projectsTitle')} hint={t('sections.projectsHint')} />
      </div>

      {loading && <StateMessage status="loading" />}
      {error && <StateMessage status="error" message={t('projects.loadError')} />}
      {!loading && !error && !hasProjects && <StateMessage message={t('projects.empty')} />}

      {hasProjects && (
        <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
          {projects.map((project, index) => (
            <ProjectCard key={project.documentId ?? project.id} project={project} index={index} />
          ))}
        </div>
      )}

      {github && (
        <div className="mt-10 text-center md:text-left">
          <ButtonLink href={github.url} external>
            {t('projects.allOnGithub')} <span aria-hidden="true">↗</span>
          </ButtonLink>
        </div>
      )}
    </div>
  )
}
