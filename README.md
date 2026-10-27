# ⚡ Edgar León Archuleta — Portafolio Editorial & Interactivo

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3_Editorial-1534FF?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS_(ES6+)-FFD60A?style=flat-square&logo=javascript&logoColor=0D0D0F)
![GitHub API](https://img.shields.io/badge/GitHub_REST_API-0D0D0F?style=flat-square&logo=github&logoColor=white)

Portafolio personal de **Edgar León Archuleta** (Desarrollador Full-Stack en Culiacán, Sinaloa). Diseñado con una estética **editorial brutalista** (*Papel / Tinta + Azul Eléctrico `#1534FF` + Amarillo Relámpago `#FFD60A`*), cero dependencias pesadas de runtime y sincronización en tiempo real con la API pública de GitHub.

🌐 **Sitio en vivo (GitHub Pages):** [edgarleonarchuleta19.github.io/portafolio](https://edgarleonarchuleta19.github.io/portafolio/)

---

## ✨ Características Principales

### 01 · Sincronización en Vivo con GitHub + Respaldo Local
- Consume directamente la API REST de GitHub (`/users/EdgarLeonArchuleta19`, `/repos`, `/languages`, `/readme`, `/events/public`).
- **Caché inteligente (`localStorage`)** con TTL de 30 minutos para evitar límites de rate-limiting (60 req/h sin token).
- **Snapshot local integrado:** Si el usuario está sin conexión o GitHub limita las peticiones, el portafolio carga instantáneamente el catálogo completo de proyectos y metadatos enriquecidos sin romper la interfaz.
- **Modal de inspección de proyectos:** Renderiza en vivo la distribución porcentual de lenguajes por bytes y el `README.md` original del repositorio (con sanitización HTML y resolución automática de imágenes/enlaces relativos).

### 02 · Sistema de Diseño Editorial
- **Tipografía expresiva:** *Fraunces* (display variable con optical sizing), *Schibsted Grotesk* (cuerpo de lectura) e *IBM Plex Mono* (metadatos, coordenadas y métricas).
- **Modo Claro / Oscuro sin parpadeo (FOUC):** Persistencia en `localStorage` con detección automática de `prefers-color-scheme`.
- **Grilla asimétrica de 12 columnas:** Tarjetas destacadas, sombras duras desplazadas y textura de grano de papel SVG.

### 03 · Relax Zone (Sección Interactiva)
- **♟️ Reto de Ajedrez (Mate en 1):** Motor ligero de ajedrez en el navegador con 3 problemas tácticos clásicos (*El pasillo*, *El beso de la dama*, *La coz del caballo*), validación de movimientos, pistas, sistema de puntuación **Elo dinámico** y comentarios en vivo.
- **🎲 Aperturas para Developers & Generador de Excusas:** Tarjetas interactivas con humor de ingeniería de software y teoría de ajedrez aplicada a deploys en viernes.
- **💻 Terminal Interactiva (`edgar@dev — zsh`):** Emulador de terminal con historial de comandos (`↑`/`↓`) y comandos reales (`ls`, `open <n>`, `whoami`, `stack`, `contact`, `chess`, `speedforce`, `theme`, `joke`, `clear`).
- **⚡ Easter Egg — Speed Force (Konami Code):** Ingresa `↑ ↑ ↓ ↓ ← → ← → B A` (o haz 5 clics rápidos en el logo / escribe `speedforce` en la terminal) para transformar la paleta al modo *Barry Allen / The Flash*.

### 04 · EdgarBot (Asistente Conversacional)
- Widget de chat integrado que responde preguntas sobre el perfil de Edgar, recomienda proyectos específicos con enlaces directos a su modal técnico, muestra el stack tecnológico y facilita el contacto directo.

---

## 🗂️ Estructura del Proyecto

```text
portafolio/
├── index.html          # Estructura semántica, secciones 01–05, modal y chat
├── styles.css          # Sistema de diseño editorial, variables CSS, grid y responsive
├── app.js              # Sincronización GitHub, motor de ajedrez, terminal y EdgarBot
├── vendor/phosphor/    # Iconografía local (@phosphor-icons/web regular & fill)
├── package.json        # Scripts de servidor local y dependencias
└── README.md           # Documentación del proyecto
```

---

## 🚀 Cómo Ejecutar en Local

No requiere compilación ni variables de entorno obligatorias.

```bash
# 1. Instalar dependencias (opcional, los iconos ya están en vendor/)
npm install

# 2. Levantar el servidor de desarrollo en http://localhost:3000
npm run dev
```

También puedes usar cualquier servidor estático:

```bash
npx http-server -p 3000 -c-1
```

---

## 🛠️ Proyectos Destacados en el Portafolio

| Proyecto | Stack Principal | Descripción |
| :--- | :--- | :--- |
| **[TechPoint](https://github.com/EdgarLeonArchuleta19/TechPoint)** | React · TypeScript · Tailwind · Vite | Plataforma web comercial para TECHPOINT — Soluciones Tecnológicas con diseño Bento UI. |
| **[superShop](https://github.com/EdgarLeonArchuleta19/superShop)** | React · TypeScript · Express · SQLite | Plataforma de gestión y POS offline-first para tiendas de abarrotes y supermercados. |
| **[float-gps](https://github.com/EdgarLeonArchuleta19/float-gps)** | TypeScript · React · Node.js | Sistema de monitoreo y rastreo GPS en tiempo real para flotas vehiculares. |
| **[floa-web](https://github.com/EdgarLeonArchuleta19/floa-web)** | React · TypeScript · CSS | Sitio comercial para FLOA — Renta de maquinaria pesada y construcción en Monterrey, N.L. |
| **[nallely-web](https://github.com/EdgarLeonArchuleta19/nallely-web)** | React 19 · TypeScript · Vite | Sitio web oficial para Súper Nallely en Culiacán, Sinaloa. |
| **[telmex-tickets](https://github.com/EdgarLeonArchuleta19/telmex-tickets)** | Vue · JavaScript · PostgreSQL | Sistema gestor de tickets e incidencias para Telmex. |
| **[iCoffee](https://github.com/EdgarLeonArchuleta19/iCoffee)** | Vue · JavaScript | Sistema Integral de Gestión Empresarial y punto de venta. |

---

## 📬 Contacto

- **Autor:** Edgar León Archuleta
- **Ubicación:** Culiacán, Sinaloa, México
- **Correo:** [leonedgar190@gmail.com](mailto:leonedgar190@gmail.com)
- **LinkedIn:** [linkedin.com/in/edgar-león-archuleta](https://www.linkedin.com/in/edgar-le%C3%B3n-archuleta-51b57128a/)
- **GitHub:** [@EdgarLeonArchuleta19](https://github.com/EdgarLeonArchuleta19)
