# AGENTS.md — backend-edgarleon

API de contenido del portafolio de Edgar León: **Strapi 5.53** con SQLite. La consume, en solo lectura, la carpeta hermana `../frontend-edgarleon` del mismo repo.

## Comandos

```bash
npm install
npm run develop   # http://localhost:1337/admin — recarga automática + Content-Type Builder
npm run build     # compila el admin
npm run start     # producción
npm run seed      # fuerza la recarga del contenido (con develop DETENIDO)
npx strapi console  # REPL con `strapi` cargado, útil para tareas sobre la base
```

## Estructura

```
config/                 server, database (SQLite por defecto en .tmp/data.db), api, admin, middlewares
src/api/<tipo>/
  content-types/<tipo>/schema.json   ← la fuente de verdad del modelo
  controllers|routes|services/       ← fábricas core de Strapi, sin lógica propia
src/components/social-link/          Componente repetible { label, url }
src/index.ts                         bootstrap(): permisos públicos + seed si la base está vacía
src/seed/content.ts                  El contenido del portafolio (textos en/es, skills, proyectos)
src/seed/index.ts                    Carga idempotente con el Document Service
src/seed/permissions.ts              find/findOne para el rol Public
seed-assets/                         Portadas de los proyectos (sí se versionan)
scripts/seed-content.js              npm run seed: carga Strapi con FORCE_SEED=true
types/generated/                     Tipos que genera Strapi; no se editan a mano
```

## Modelo de contenido

Todos los tipos tienen i18n (`en` por defecto, `es`) y `draftAndPublish`.

- **Profile** (single type): `name`*, `role`, `bio`, `photo`, `location`*, `email`, `socialLinks[]`. `name`, `photo`, `location` y `email` no se traducen.
- **Project**: `title`*, `slug`, `description`, `body` (Markdown), `coverImage`, `screenshots`, `repositoryUrl`, `liveUrl`, `year`, `order`, `published`, `skills` (muchos a muchos).
- **Skill**: `name`*, `level`* (enum `fundamentos | aplicado | avanzado | dominado`), `category` (muchos a uno), `projects`.
- **Category**: `name`* (único por idioma), `order`, `skills`.

`*` = requerido.

## Convenciones

- **Sin comentarios en el código** (incluidos los encabezados `/** x controller */` que genera Strapi al crear un tipo nuevo: bórralos). Si algo necesita explicación, mejora los nombres o extrae una función. Las explicaciones de diseño van en este archivo o en el README.
- El modelo se cambia desde el Content-Type Builder (`npm run develop`) o editando `schema.json`. Revisa siempre el diff del `schema.json` y de `types/generated/`.
- Tipos en singular (`Project`) y campos en `camelCase`. Los slugs van en minúsculas y con guiones.
- **Contrato con el frontend:** cambiar o renombrar un campo, el enum `level` o un endpoint rompe `frontend-edgarleon` (`src/api/strapi.js`, `sections/Skills.jsx`, traducciones). Avísalo y actualiza los dos proyectos en el mismo commit.
- `config/api.ts` tiene `strictParams: true`: cualquier parámetro de query nuevo tiene que ser uno que Strapi reconozca.
- Los permisos del rol *Public* se quedan en solo lectura (`find` / `findOne`). Nunca des escritura pública.

## Uploads (local o S3)

- `config/plugins.ts` activa el provider `aws-s3` **solo** si `AWS_BUCKET` tiene valor; sin él se usa el provider local. Mantén esa condición: un clon nuevo tiene que arrancar sin credenciales de AWS.
- `config/middlewares.ts` agrega `*.amazonaws.com` (y `CDN_URL`) al CSP de `strapi::security` para que el admin muestre las miniaturas servidas desde S3.
- `@strapi/provider-upload-aws-s3` va fijo a la misma versión que `@strapi/strapi`; actualízalos juntos.
- El seed sube las portadas por el servicio de upload, así que con `AWS_BUCKET` definido terminan en S3.
- Las credenciales de AWS solo van en `.env` (o en las variables del hosting). Nunca en el código ni en el frontend (nada de `VITE_`).

## Seed automático

- `bootstrap()` corre en cada arranque. **Siempre** llama a `grantPublicReadAccess` y **solo** llama a `seedContent` si no hay proyectos (`isContentEmpty`) o si `FORCE_SEED=true`. Nunca hagas que el seed corra sin esa condición: pisaría lo que se edite en el admin.
- Usa el Document Service (`strapi.documents(uid)`) dentro del proceso de Strapi, no la API REST. Por eso no necesita token ni usuario admin.
- Es idempotente: busca en `en` por nombre (categorías, skills) o por `slug` (proyectos) y actualiza en vez de duplicar. Las relaciones se fijan con `set`.
- Cada documento se escribe primero en `en` (idioma por defecto) y luego en `es` sobre el mismo `documentId`. Si lo haces en otro orden o sin `locale`, quedan entradas huérfanas en el idioma equivocado (ya pasó una vez).
- Las portadas se suben desde `seed-assets/` solo si el proyecto todavía no tiene `coverImage`. El servicio de upload recibe una **copia temporal**, nunca el archivo original.
- `scripts/seed-content.js` va en **CommonJS** a propósito: `@strapi/strapi` falla al importarse como ES module (`ERR_UNSUPPORTED_DIR_IMPORT` en `lodash/fp`).
- Para probar cambios en el seed sin tocar la base real, copia el proyecto (sin `.tmp`, `public/uploads`, `.env`) a una carpeta temporal, enlaza `node_modules` con un junction, usa `.env.example` como `.env` con `PORT=1338` y corre `npm run develop`. Para borrar la copia, primero quita el junction con `rmdir`: si no, se borra el `node_modules` real.

## Qué no se versiona

`.env`, `.tmp/` (la base SQLite), `public/uploads/*` (imágenes), `dist/`, `.strapi/`. Aun así, un clon nuevo no necesita pasos extra: arranca con la base vacía y `bootstrap()` la llena con el contenido de `src/seed/content.ts` y las portadas de `seed-assets/`.

## Trampas conocidas

- En Windows no se puede renombrar ni mover la carpeta mientras Strapi o una terminal estén dentro de ella.
- No toques `.tmp/data.db` con Strapi corriendo en otra terminal (incluido `npm run seed`, que lo verifica en `/_health`). Si usas `strapi console` para escribir datos, primero haz una copia de la base.
- Si cambias el contenido base, actualiza `src/seed/content.ts`: es la fuente de verdad para quien clone el repo.
