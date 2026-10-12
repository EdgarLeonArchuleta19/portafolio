import { STRAPI_URL, STRAPI_TOKEN } from '../config/env'
import { FALLBACK_LOCALE, RESOURCE_PARAMS, buildStrapiUrl } from './resources'

const NOT_TRANSLATED_STATUS = 404

async function fetchFromStrapi(resource, params, locale) {
  const headers = { accept: 'application/json' }
  if (STRAPI_TOKEN) headers.authorization = `Bearer ${STRAPI_TOKEN}`

  const response = await fetch(buildStrapiUrl(STRAPI_URL, resource, params, locale), { headers })

  if (response.status === NOT_TRANSLATED_STATUS) return null
  if (!response.ok) throw new Error(`Strapi respondió con estado ${response.status}`)

  const payload = await response.json()
  return payload.data
}

const loadSnapshot = () => import('../data/content.json').then((module) => module.default)

async function readFromSnapshot(resource, locale) {
  const snapshot = await loadSnapshot()
  return snapshot[locale]?.[resource] ?? null
}

function readContent(resource, locale, extraParams = {}) {
  if (!STRAPI_URL) return readFromSnapshot(resource, locale)
  return fetchFromStrapi(resource, { ...RESOURCE_PARAMS[resource], ...extraParams }, locale)
}

const isEmpty = (data) => data == null || (Array.isArray(data) && data.length === 0)

async function withFallbackLocale(locale, read) {
  const data = await read(locale)
  if (locale === FALLBACK_LOCALE || !isEmpty(data)) return data
  return read(FALLBACK_LOCALE)
}

export const getProfile = (locale) => withFallbackLocale(locale, (current) => readContent('profile', current))

export const getProjects = (locale) => withFallbackLocale(locale, (current) => readContent('projects', current))

export const getProjectBySlug = (locale, slug) =>
  withFallbackLocale(locale, async (current) => {
    const projects = await readContent('projects', current, { 'filters[slug][$eq]': slug })
    return projects?.find((project) => project.slug === slug) ?? null
  })

export const getSkills = (locale) => withFallbackLocale(locale, (current) => readContent('skills', current))

export function mediaUrl(media) {
  const url = media?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}
