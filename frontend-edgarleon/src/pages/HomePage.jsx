import Container from '../components/ui/Container'
import Section from '../components/ui/Section'
import Hero from '../components/sections/Hero'
import Projects from '../components/sections/Projects'
import Skills from '../components/sections/Skills'
import Contact from '../components/sections/Contact'
import { getProjects, getSkills } from '../api/strapi'
import { useLocalizedApi } from '../hooks/useLocalizedApi'
import { findGithubProfile } from '../utils/url'

export default function HomePage({ profile }) {
  const projects = useLocalizedApi(getProjects)
  const skills = useLocalizedApi(getSkills)
  const github = findGithubProfile(profile.data?.socialLinks)

  return (
    <>
      <Container>
        <Hero profile={profile.data} loading={profile.loading} error={profile.error} />
      </Container>

      <Section id="projects">
        <Projects projects={projects.data} loading={projects.loading} error={projects.error} github={github} />
      </Section>

      <Section id="skills">
        <Skills skills={skills.data} loading={skills.loading} error={skills.error} />
      </Section>

      <Section id="contact">
        <Contact profile={profile.data} loading={profile.loading} error={profile.error} />
      </Section>
    </>
  )
}
