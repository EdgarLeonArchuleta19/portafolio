export const LOCALES = ['en', 'es']

export const FALLBACK_LOCALE = 'en'

export const RESOURCE_PARAMS = {
  profile: {},
  projects: { 'sort[0]': 'order:asc' },
  skills: {},
}

export function buildStrapiUrl(baseUrl, resource, params, locale) {
  const query = new URLSearchParams({ populate: '*', ...params, locale })
  return `${baseUrl}/api/${resource}?${query}`
}
