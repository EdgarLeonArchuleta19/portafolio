# AGENTS.md — frontend-edgarleon

Frontend del portafolio de Edgar León: una SPA bilingüe (es/en) en React que **solo lee** contenido de una API de Strapi 5. El backend está en la carpeta hermana `../backend-edgarleon` del mismo repo.

## Stack

- React 19, React Router 7, Vite 8
- Tailwind CSS 4 (tokens en `src/index.css` dentro de `@theme`) + `@tailwindcss/typography`
- `react-markdown` para el campo `body` de los proyectos
- Linter: Oxlint (`.oxlintrc.json`). No hay TypeScript ni tests.

## Comandos

```bash
npm install
npm run dev       # http://localhost:5173 — requiere Strapi en VITE_STRAPI_URL
npm run lint      # debe quedar en 0 avisos
npm run build     # verificación mínima antes de entregar un cambio
```

Antes de dar un cambio por terminado, corre `npm run lint` y `npm run build`.

## Estructura

```
src/
├── api/strapi.js        Único lugar que habla con Strapi (fetch + idioma de respaldo)
├── config/env.js        Único lugar que lee import.meta.env
├── hooks/               useApi (estado de carga), useLocalizedApi (añade el idioma), useReveal
├── i18n/                index.jsx (I18nProvider + useI18n) y translations.js
├── theme.jsx            ThemeProvider + useTheme
├── pages/               HomePage, ProjectPage (una por ruta)
├── components/
│   ├── layout/          Header, Footer, MainLayout, ScrollToTop
│   ├── sections/        Secciones de la portada (Hero, Projects, Skills, Contact)
│   └── ui/              Piezas reutilizables sin datos propios
└── utils/               url.js (normalizeHref, findGithubProfile), storage.js (localStorage seguro)
```

## Convenciones

- **Datos:** cada función de `api/strapi.js` recibe `(locale, param?)`. En los componentes se consume con `useLocalizedApi(fetcher, param)`. No llames `fetch` desde un componente.
- **Textos:** todo texto visible va en `i18n/translations.js`, en **los dos idiomas** (`es` y `en`), y se usa con `t('ruta.clave')`. `t(path, fallback)` devuelve `fallback` si la clave no existe. Borra las claves que dejen de usarse.
- **Contextos:** cada contexto vive en un solo archivo (provider + hook). La excepción a `react/only-export-components` para esos archivos está en `overrides` de `.oxlintrc.json`; no los dividas en varios archivos.
- **Estilos:** solo clases de Tailwind con los tokens del tema (`text-fg`, `text-muted`, `bg-surface`, `border-line`, `text-accent`…). No uses colores sueltos. Para botones/enlaces usa `ui/ButtonLink` (variantes `primary`, `outline`, `subtle`, `accent`), para el ancho de página `ui/Container` y para las secciones de la portada `ui/Section`.
- **Enlaces externos:** `target="_blank"` con `rel="noopener noreferrer"` (`ButtonLink` lo hace con `external`).
- **Imágenes de Strapi:** pásalas siempre por `mediaUrl()`, porque Strapi devuelve rutas relativas (`/uploads/...`).
- **Estados de carga:** usa `ui/StateMessage` con `status="loading" | "error" | "info"`.
- **Sin comentarios en el código** (tampoco `oxlint-disable` ni JSDoc): si algo necesita explicación, mejora los nombres o extrae una función con nombre claro. Identificadores en inglés; textos visibles en `translations.js`.
- **Sin archivos basura:** nada de plantillas sin usar, logs, `dist/` ni exports que nadie importe. `localStorage` siempre a través de `utils/storage.js`.

## Contrato con el backend

| Función             | Endpoint                                                    |
| ------------------- | ----------------------------------------------------------- |
| `getProfile`        | `GET /api/profile?populate=*&locale=…` (single type)        |
| `getProjects`       | `GET /api/projects?populate=*&sort[0]=order:asc&locale=…`   |
| `getProjectBySlug`  | `GET /api/projects?populate=*&filters[slug][$eq]=…&locale=…`|
| `getSkills`         | `GET /api/skills?populate=*&locale=…`                       |

- Strapi tiene `strictParams: true`: un parámetro de query desconocido responde 400.
- El enum `skill.level` es `fundamentos | aplicado | avanzado | dominado`. Si cambia, actualiza `LEVEL_PERCENT` en `sections/Skills.jsx` y `skills.levels` en las traducciones.
- Si un recurso no existe en el idioma pedido (lista vacía o 404), `request()` lo pide en `en`. Los errores de red **no se tragan**: llegan a la UI como `error`.

## Trampas conocidas

- `VITE_STRAPI_URL` debe ser `http://localhost:1337`. Una IP de red local deja de funcionar al cambiar de red (`ERR_CONNECTION_TIMED_OUT`).
- No pongas tokens en variables `VITE_*`: se incrustan en el bundle público. El rol *Public* de Strapi ya permite leer.
- El script inline de `index.html` lee `localStorage['portfolio-theme']` para evitar un parpadeo de tema. Si cambias `THEME_STORAGE_KEY` en `theme.jsx`, cámbiala también ahí.
- `Object.groupBy` y otras APIs muy recientes no se polyfillean. Usa equivalentes con `reduce` o bucles.
