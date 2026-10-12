# Portafolio — Frontend

Sitio personal de **Edgar León Archuleta**: una SPA bilingüe (es / en) con tema claro y oscuro. Todo el contenido (perfil, proyectos y habilidades) se lee de un CMS headless con [Strapi](https://strapi.io).

> Parte del monorepo del portafolio. El backend está en [`../backend-edgarleon`](../backend-edgarleon) y la visión general en el [README principal](../README.md).

## Stack

- **React 19** + **React Router 7**
- **Vite 8**
- **Tailwind CSS 4** (+ `@tailwindcss/typography` para el detalle de proyecto en Markdown)
- **Oxlint** como linter

## Puesta en marcha

Requisitos: Node 20+.

```bash
npm install
cp .env.example .env   # con VITE_STRAPI_URL lee Strapi en vivo; sin ella, el contenido guardado
npm run dev            # http://localhost:5173
```

| Script             | Qué hace                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `npm run dev`      | Servidor de desarrollo con HMR                                           |
| `npm run build`    | Build de producción en `dist/`                                           |
| `npm run preview`  | Sirve el build localmente                                                |
| `npm run lint`     | Revisa el código con Oxlint                                              |
| `npm run snapshot` | Guarda el contenido de Strapi (en / es) en `src/data/content.json`       |

### De dónde salen los datos

El sitio en producción es **estático**: no hay ningún Strapi en línea. El contenido vive en `src/data/content.json` y las imágenes en Amazon S3.

- **Con `VITE_STRAPI_URL`** (desarrollo): se lee Strapi en vivo, como cualquier API.
- **Sin `VITE_STRAPI_URL`** (Vercel): se lee `src/data/content.json`, que se carga como un chunk aparte.

Para publicar un cambio de contenido:

```bash
# 1. con el backend corriendo (npm run develop), edita en http://localhost:1337/admin
# 2. guarda el contenido
npm run snapshot
# 3. súbelo; Vercel vuelve a desplegar solo
git add src/data/content.json && git commit -m "Actualizo contenido" && git push
```

`npm run snapshot` se detiene si alguna imagen sigue en `/uploads/...` (almacenamiento local), porque no se vería en línea. Por defecto lee `http://localhost:1337`; otra URL se pasa con `STRAPI_URL`.

### Despliegue en Vercel

- **Root Directory:** `frontend-edgarleon` (el preset de Vite detecta el resto).
- **Sin variables de entorno.** En particular, no definas `VITE_STRAPI_URL`, o el sitio intentará leer un Strapi que no existe en línea.
- `vercel.json` redirige todas las rutas a `index.html` para que `/project/<slug>` funcione al entrar directo o al recargar.

### Variables de entorno

| Variable            | Descripción                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `VITE_STRAPI_URL`   | Solo en desarrollo. URL base de Strapi (`http://localhost:1337`; una IP de red local deja de funcionar cuando cambia la red). Vacía = usa `src/data/content.json`. |
| `VITE_STRAPI_TOKEN` | No hace falta: el backend da permisos de solo lectura al rol *Public* al arrancar. Evítalo, porque todo lo que empieza con `VITE_` queda **público** dentro del bundle. |

## Estructura

```
src/
├── api/strapi.js          Datos: Strapi en vivo o content.json (idioma de respaldo: en)
├── api/resources.js       Endpoints y parámetros, compartidos con scripts/snapshot.js
├── components/
│   ├── layout/            Header, Footer, MainLayout, ScrollToTop
│   ├── sections/          Secciones de la portada: Hero, Projects, Skills, Contact
│   └── ui/                Piezas reutilizables: ButtonLink, Container, Section, SkillTags…
├── config/env.js          Lectura centralizada de variables de entorno
├── data/content.json      Contenido guardado con npm run snapshot (lo que se publica)
├── hooks/                 useApi, useLocalizedApi, useReveal
├── i18n/                  index.jsx (provider + hook useI18n) y translations.js (textos es/en)
├── pages/                 HomePage, ProjectPage
├── theme.jsx              Provider y hook del tema claro/oscuro
└── utils/                 url.js (enlaces y perfil de GitHub), storage.js (localStorage seguro)
```

### Decisiones de diseño

- **Los datos se piden según el idioma.** `useLocalizedApi(fetcher, param)` llama al endpoint con el idioma activo y vuelve a pedirlo al cambiar de idioma. Si una entrada todavía no está traducida, el cliente la pide en inglés.
- **El perfil se pide una sola vez** en `App` y se comparte entre la portada y el footer.
- **Los estilos de la UI viven en un solo lugar.** Botones, contenedores y etiquetas son componentes en `components/ui`, para no repetir las mismas clases de Tailwind.
- **El texto de la interfaz está en `i18n/translations.js`.** Los componentes no tienen textos escritos a mano.
