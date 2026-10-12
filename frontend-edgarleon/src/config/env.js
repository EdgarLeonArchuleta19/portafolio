const withoutTrailingSlash = (url) => url.replace(/\/$/, '')

export const STRAPI_URL = withoutTrailingSlash(import.meta.env.VITE_STRAPI_URL || '')

export const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || ''
