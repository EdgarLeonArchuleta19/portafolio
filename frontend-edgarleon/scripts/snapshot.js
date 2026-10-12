import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LOCALES, RESOURCE_PARAMS, buildStrapiUrl } from '../src/api/resources.js'

const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')
const OUTPUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/content.json')
const NOT_TRANSLATED_STATUS = 404

async function fetchResource(resource, locale) {
  const url = buildStrapiUrl(STRAPI_URL, resource, RESOURCE_PARAMS[resource], locale)
  const response = await fetch(url).catch(() => {
    throw new Error(`No se pudo conectar con Strapi en ${STRAPI_URL}. ¿Está corriendo "npm run develop" en el backend?`)
  })

  if (response.status === NOT_TRANSLATED_STATUS) return null
  if (!response.ok) throw new Error(`Strapi respondió ${response.status} en ${url}`)

  return (await response.json()).data
}

function findLocalMedia(value, path = '') {
  if (Array.isArray(value)) return value.flatMap((item, index) => findLocalMedia(item, `${path}[${index}]`))
  if (value === null || typeof value !== 'object') return []

  return Object.entries(value).flatMap(([key, child]) =>
    key === 'url' && typeof child === 'string' && child.startsWith('/uploads/')
      ? [`${path}.${key} = ${child}`]
      : findLocalMedia(child, `${path}.${key}`),
  )
}

async function main() {
  const snapshot = {}

  for (const locale of LOCALES) {
    snapshot[locale] = {}
    for (const resource of Object.keys(RESOURCE_PARAMS)) {
      snapshot[locale][resource] = await fetchResource(resource, locale)
    }
  }

  const localMedia = findLocalMedia(snapshot)
  if (localMedia.length > 0) {
    throw new Error(
      `Hay imágenes guardadas en local que no se verían en línea. Vuelve a subirlas desde el admin para que queden en S3:\n  ${localMedia.join('\n  ')}`,
    )
  }

  await mkdir(dirname(OUTPUT_FILE), { recursive: true })
  await writeFile(OUTPUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`)

  const summary = LOCALES.map((locale) => {
    const { projects, skills } = snapshot[locale]
    return `${locale}: ${projects?.length ?? 0} proyectos, ${skills?.length ?? 0} skills`
  })
  console.log(`Contenido guardado en src/data/content.json (${summary.join(' · ')})`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
