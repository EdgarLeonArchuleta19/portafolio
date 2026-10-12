# Portafolio — Backend

API de contenido del portafolio de **Edgar León Archuleta**, hecha con **Strapi 5** y SQLite. Expone el perfil, los proyectos y las habilidades en español e inglés para el frontend.

> Parte del monorepo del portafolio. El frontend está en [`../frontend-edgarleon`](../frontend-edgarleon) y la visión general en el [README principal](../README.md).

## Puesta en marcha

Requisitos: Node 20+.

```bash
npm install
cp .env.example .env
npm run develop        # API en http://localhost:1337 · admin en /admin
```

**Eso es todo.** La primera vez que arranca con la base vacía, Strapi se configura solo:

- Da al rol *Public* permisos de **solo lectura** (`find` / `findOne`) para que el frontend pueda leer sin token.
- Carga todo el contenido del portafolio: perfil, categorías, skills y proyectos, en `en` y `es`, ya publicado y con las portadas de `seed-assets/`.

En los siguientes arranques ya hay contenido, así que no toca nada. Lo que edites en el admin se respeta.

El usuario administrador solo hace falta para entrar al panel `/admin`; Strapi lo pide la primera vez que lo abres.

> **Secretos:** para desarrollo local, los valores `tobemodified` del `.env.example` funcionan. En cualquier servidor real reemplázalos por cadenas aleatorias:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
> ```

| Script            | Qué hace                                                    |
| ----------------- | ----------------------------------------------------------- |
| `npm run develop` | Desarrollo con recarga automática y el Content-Type Builder |
| `npm run build`   | Compila el panel de administración                          |
| `npm run start`   | Producción (sin recarga automática)                         |
| `npm run seed`    | Fuerza la recarga del contenido aunque la base ya tenga datos |

## Imágenes en Amazon S3 (opcional)

Por defecto, las imágenes de la Media Library se guardan en `public/uploads`. Si en el `.env` se define `AWS_BUCKET`, Strapi usa `@strapi/provider-upload-aws-s3` y las sube al bucket; la API devuelve entonces URLs absolutas de S3 y el frontend las usa tal cual.

| Variable            | Qué es                                                         |
| ------------------- | -------------------------------------------------------------- |
| `AWS_ACCESS_KEY_ID` | Access key de un usuario IAM con permisos solo sobre el bucket |
| `AWS_ACCESS_SECRET` | Su secret                                                      |
| `AWS_REGION`        | Región del bucket, p. ej. `us-east-1`                          |
| `AWS_BUCKET`        | Nombre del bucket (vacío = almacenamiento local)               |
| `CDN_URL`           | Opcional: URL de CloudFront u otro CDN delante del bucket      |

El bucket necesita lectura pública (`s3:GetObject`) y ACLs habilitadas. Strapi **no lee** el bucket: un archivo solo existe para Strapi si se sube desde el admin (o con el servicio de upload); subirlo a mano desde la consola de AWS no sirve. Las imágenes que ya estaban en `public/uploads` no se migran solas.

## Modelo de contenido

Todos los tipos tienen **i18n** (`en` por defecto, `es`) y **borrador / publicado**.

| Tipo       | Clase           | Campos principales                                                                 |
| ---------- | --------------- | ---------------------------------------------------------------------------------- |
| `Profile`  | Single type     | `name`, `role`, `bio`, `photo`, `location`, `email`, `socialLinks` (componente repetible) |
| `Project`  | Collection type | `title`, `slug`, `description`, `body` (Markdown), `coverImage`, `screenshots`, `repositoryUrl`, `liveUrl`, `year`, `order`, `skills` |
| `Skill`    | Collection type | `name`, `level` (`fundamentos` · `aplicado` · `avanzado` · `dominado`), `category`, `projects` |
| `Category` | Collection type | `name`, `order`, `skills`                                                          |

Relaciones: `Project` ⟷ `Skill` (muchos a muchos) y `Skill` → `Category` (muchos a uno).

## Endpoints que consume el frontend

Todos aceptan `?locale=es|en` y son públicos (solo lectura).

```
GET /api/profile?populate=*
GET /api/projects?populate=*&sort[0]=order:asc
GET /api/projects?populate=*&filters[slug][$eq]=<slug>
GET /api/skills?populate=*
```

## Contenido inicial (seed)

```
seed-assets/            Portadas de los proyectos (se suben a la Media Library)
src/seed/content.ts     El contenido: textos en/es, skills, proyectos
src/seed/index.ts       La carga (idempotente: busca por nombre/slug y actualiza)
src/seed/permissions.ts Permisos de solo lectura para el rol Public
src/index.ts            bootstrap(): llama a lo anterior al arrancar
```

Para cambiar el contenido base, edita `src/seed/content.ts` (y `seed-assets/` si cambias una portada). Después:

```bash
# con `npm run develop` detenido
npm run seed
```

`npm run seed` se niega a correr si Strapi está encendido, porque dos procesos escribirían en el mismo archivo SQLite.
