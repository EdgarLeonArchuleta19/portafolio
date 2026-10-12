const DEFAULT_STRAPI_URL = 'http://localhost:1337'

const withoutTrailingSlash = (url) => url.replace(/\/$/, '')

export const STRAPI_URL = withoutTrailingSlash(import.meta.env.VITE_STRAPI_URL || DEFAULT_STRAPI_URL)

export const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || ''
