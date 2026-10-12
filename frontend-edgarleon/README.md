# Portafolio — Frontend

Sitio personal de **Edgar León Archuleta**: una SPA bilingüe (es / en) con tema claro y oscuro. Todo el contenido (perfil, proyectos y habilidades) se lee de un CMS headless con [Strapi](https://strapi.io).

> Parte del monorepo del portafolio. El backend está en [`../backend-edgarleon`](../backend-edgarleon) y la visión general en el [README principal](../README.md).

## Stack

- **React 19** + **React Router 7**
- **Vite 8**
- **Tailwind CSS 4** (+ `@tailwindcss/typography` para el detalle de proyecto en Markdown)
- **Oxlint** como linter

## Puesta en marcha

Requisitos: Node 20+ y el backend (**backend-edgarleon**) corriendo en `http://localhost:1337`.

```bash
npm install
cp .env.example .env   # ajusta la URL de Strapi si hace falta
npm run dev            # http://localhost:5173
```

| Script            | Qué hace                                     |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con HMR               |
| `npm run build`   | Build de producción en `dist/`               |
| `npm run preview` | Sirve el build localmente                    |
| `npm run lint`    | Revisa el código con Oxlint                  |

### Variables de entorno

| Variable            | Descripción                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `VITE_STRAPI_URL`   | URL base de Strapi. Usa `http://localhost:1337`; una IP de red local deja de funcionar cuando cambia la red. |
| `VITE_STRAPI_TOKEN` | No hace falta: el backend da permisos de solo lectura al rol *Public* al arrancar. Evítalo, porque todo lo que empieza con `VITE_` queda **público** dentro del bundle. |

## Estructura

```
src/
├── api/strapi.js          Cliente REST de Strapi (idioma de respaldo: en)
├── components/
│   ├── layout/            Header, Footer, MainLayout, ScrollToTop
│   ├── sections/          Secciones de la portada: Hero, Projects, Skills, Contact
│   └── ui/                Piezas reutilizables: ButtonLink, Container, Section, SkillTags…
├── config/env.js          Lectura centralizada de variables de entorno
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
