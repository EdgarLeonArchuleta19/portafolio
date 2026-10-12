import { STRAPI_URL, STRAPI_TOKEN } from '../config/env'

const FALLBACK_LOCALE = 'en'
const NOT_TRANSLATED_STATUS = 404

function buildUrl(resource, params, locale) {
  const query = new URLSearchParams({ populate: '*', ...params, locale })
  return `${STRAPI_URL}/api/${resource}?${query}`
}

async function fetchData(resource, params, locale) {
  const headers = { accept: 'application/json' }
  if (STRAPI_TOKEN) headers.authorization = `Bearer ${STRAPI_TOKEN}`

  const response = await fetch(buildUrl(resource, params, locale), { headers })

  if (response.status === NOT_TRANSLATED_STATUS) return null
  if (!response.ok) throw new Error(`Strapi respondió con estado ${response.status}`)

  const payload = await response.json()
  return payload.data
}

const isEmpty = (data) => data == null || (Array.isArray(data) && data.length === 0)

async function fetchWithFallbackLocale(resource, params, locale) {
  const data = await fetchData(resource, params, locale)
  if (locale === FALLBACK_LOCALE || !isEmpty(data)) return data
  return fetchData(resource, params, FALLBACK_LOCALE)
}

export const getProfile = (locale) => fetchWithFallbackLocale('profile', {}, locale)

export const getProjects = (locale) =>
  fetchWithFallbackLocale('projects', { 'sort[0]': 'order:asc' }, locale)

export async function getProjectBySlug(locale, slug) {
  const projects = await fetchWithFallbackLocale('projects', { 'filters[slug][$eq]': slug }, locale)
  return projects?.[0] ?? null
}

export const getSkills = (locale) => fetchWithFallbackLocale('skills', {}, locale)

export function mediaUrl(media) {
  const url = media?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}
