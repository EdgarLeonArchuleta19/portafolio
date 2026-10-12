export function normalizeHref(value) {
  const url = (value || '').trim()
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  if (/^[\w-]+(\.[\w-]+)+/.test(url)) return `https://${url}`
  return null
}

export function findGithubProfile(socialLinks) {
  const url = normalizeHref(socialLinks?.find((link) => /^github$/i.test(link.label))?.url)
  const username = url?.match(/github\.com\/([^/]+)\/?$/i)?.[1]
  return username ? { url, username } : null
}
