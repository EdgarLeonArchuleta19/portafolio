/* =========================================================
   Portafolio · Edgar León Archuleta
   Datos en vivo desde la API pública de GitHub + Fallback
   ========================================================= */
const GITHUB_USER = 'EdgarLeonArchuleta19';
const API = 'https://api.github.com';
const CACHE_TTL = 30 * 60 * 1000; // 30 min (la API sin token permite 60 req/h)

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#663399',
  Java: '#b07219',
  Python: '#3572A5',
  PHP: '#4F5D95',
  'C#': '#178600',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  SCSS: '#c6538c',
  Otro: '#8b93a7',
};
const langColor = (l) => LANG_COLORS[l] || LANG_COLORS.Otro;

/* Descripciones y metadatos enriquecidos para repos sin descripción o destacados */
const REPO_CURATED = {
  TechPoint: {
    description: 'Plataforma web comercial para TECHPOINT — Soluciones Tecnológicas con diseño Bento UI e interfaz moderna.',
    topics: ['react', 'typescript', 'tailwindcss', 'vite', 'bento-ui'],
  },
  superShop: {
    description: 'Plataforma de gestión para tiendas de abarrotes, conveniencia y supermercados (POS, inventario y módulo de encuestas offline-first).',
    topics: ['react', 'typescript', 'express', 'sqlite', 'pwa', 'point-of-sale'],
  },
  'floa-web': {
    description: 'Sitio web comercial de FLOA — Renta de maquinaria pesada y construcción en Monterrey, N.L.',
    topics: ['react', 'typescript', 'css-animations', 'website'],
  },
  'nallely-web': {
    description: 'Sitio web oficial de Súper Nallely, supermercado local en Culiacán, Sinaloa. Construido con React 19, TypeScript y Vite.',
    topics: ['react', 'typescript', 'vite', 'responsive-design', 'spa'],
  },
  portafolio: {
    description: 'Portafolio personal editorial e interactivo sincronizado en tiempo real con la API de GitHub, con reto de ajedrez, terminal y EdgarBot.',
    topics: ['portfolio', 'javascript', 'css', 'github-api', 'chess', 'editorial-design'],
  },
  iCoffee: {
    description: 'Sistema Integral de Gestión Empresarial y punto de venta desarrollado con Vue.',
    topics: ['vue', 'javascript', 'point-of-sale', 'erp'],
  },
  'telmex-tickets': {
    description: 'Sistema gestor de tickets de soporte e incidencias para Telmex con Vue y PostgreSQL.',
    topics: ['vue', 'javascript', 'postgresql', 'ticketing-system'],
  },
  'float-gps': {
    description: 'Sistema de monitoreo y rastreo GPS en tiempo real para flotas vehiculares.',
    topics: ['typescript', 'react', 'nodejs', 'gps-tracking'],
  },
  'Ejercicios-JAVA': {
    description: 'Colección de proyectos, estructuras de datos y prácticas de programación orientada a objetos en Java.',
    topics: ['java', 'oop', 'algorithms'],
  },
  'ejercicios-java2': {
    description: 'Prácticas complementarias de desarrollo de interfaces y lógica de programación en Java y web.',
    topics: ['java', 'html', 'practicas'],
  },
  AJEDREZ: {
    description: 'Tablero e interfaz de ajedrez para navegador construido con tecnologías web.',
    topics: ['chess', 'html', 'css', 'javascript'],
  },
  'EdgarLeonArchuleta19.github.io': {
    description: 'Primera página personal en GitHub Pages dedicada al ajedrez y The Flash.',
    topics: ['github-pages', 'html', 'personal'],
  },
};

/* Snapshot de respaldo por si la API de GitHub alcanza límite de peticiones */
const FALLBACK_USER = {
  login: 'EdgarLeonArchuleta19',
  name: 'Edgar León Archuleta',
  location: 'Culiacán, Sinaloa',
  public_repos: 12,
  created_at: '2019-02-26T01:26:59Z',
  avatar_url: 'https://avatars.githubusercontent.com/u/47997877?v=4',
};

const FALLBACK_REPOS = [
  {
    name: 'TechPoint',
    description: 'Plataforma web para TECHPOINT — Soluciones Tecnológicas',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-22T06:49:23Z',
    created_at: '2026-10-22T01:45:02Z',
    homepage: 'https://edgarleonarchuleta19.github.io/TechPoint/',
    html_url: 'https://github.com/EdgarLeonArchuleta19/TechPoint',
    topics: ['apple-design', 'bento-ui', 'culiacan', 'react', 'tailwindcss', 'techpoint', 'typescript', 'vite'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'superShop',
    description: 'Plataforma de gestion para tiendas de abarrotes, conveniencia y supermercados. Modulo 1: encuestas de satisfaccion.',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-22T03:12:26Z',
    created_at: '2026-10-13T17:06:04Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/superShop',
    topics: ['dashboard', 'express', 'inventory-management', 'offline-first', 'point-of-sale', 'pwa', 'react', 'retail', 'sqlite', 'tailwindcss', 'typescript', 'vite'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'floa-web',
    description: 'Pagina web de FLOA - Renta de maquinaria pesada y construccion en Monterrey, N.L.',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-13T23:06:33Z',
    created_at: '2026-09-04T19:55:22Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/floa-web',
    topics: ['animation-css', 'css', 'react', 'typescript', 'website'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'nallely-web',
    description: 'Sitio web oficial de Super Nallely, supermercado local en Culiacan, Sinaloa. React 19 + TypeScript + Vite.',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-13T22:29:25Z',
    created_at: '2026-10-13T22:26:31Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/nallely-web',
    topics: ['accessibility', 'css', 'react', 'responsive-design', 'spa', 'supermarket', 'typescript', 'vite'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'portafolio',
    description: 'Portafolio personal editorial e interactivo sincronizado en tiempo real con la API de GitHub, con reto de ajedrez, terminal y EdgarBot.',
    language: 'JavaScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-26T23:55:00Z',
    created_at: '2026-10-12T19:58:41Z',
    homepage: 'https://edgarleonarchuleta19.github.io/portafolio/',
    html_url: 'https://github.com/EdgarLeonArchuleta19/portafolio',
    topics: ['portfolio', 'javascript', 'css', 'github-api', 'chess'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'iCoffee',
    description: 'Sistema Integral de Gestión Empresarial',
    language: 'Vue',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-12T19:43:35Z',
    created_at: '2024-10-15T02:36:02Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/iCoffee',
    topics: ['javascript', 'point-of-sale', 'vue'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'telmex-tickets',
    description: 'Sistema Gestor de tickets para la empresa Telmex',
    language: 'Vue',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-12T19:34:30Z',
    created_at: '2024-12-09T22:39:58Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/telmex-tickets',
    topics: ['javascript', 'postgresql', 'ticketing-system', 'vue'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'float-gps',
    description: 'Sistema de Monitoreo GPS para Flotas',
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-09-04T22:45:49Z',
    created_at: '2026-09-02T18:52:06Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/float-gps',
    topics: ['gps-tracking', 'nodejs', 'react', 'typescript'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'Ejercicios-JAVA',
    description: 'Mis proyectos de Java y programación orientada a objetos',
    language: 'Java',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-12T19:00:38Z',
    created_at: '2023-06-04T01:45:40Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/Ejercicios-JAVA',
    topics: ['java', 'oop'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'AJEDREZ',
    description: 'Tablero e interfaz de ajedrez para navegador construido con tecnologías web.',
    language: 'HTML',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2026-10-12T18:59:01Z',
    created_at: '2019-02-26T01:58:51Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/AJEDREZ',
    topics: ['chess', 'html', 'css'],
    fork: false,
    default_branch: 'master',
  },
  {
    name: 'ejercicios-java2',
    description: 'Prácticas complementarias de desarrollo de interfaces y lógica en Java y web.',
    language: 'HTML',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2024-05-08T22:58:27Z',
    created_at: '2024-02-12T17:37:39Z',
    homepage: '',
    html_url: 'https://github.com/EdgarLeonArchuleta19/ejercicios-java2',
    topics: ['java', 'html'],
    fork: false,
    default_branch: 'main',
  },
  {
    name: 'EdgarLeonArchuleta19.github.io',
    description: 'Primera página personal en GitHub Pages dedicada al ajedrez y The Flash.',
    language: 'HTML',
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: '2019-02-26T01:57:54Z',
    created_at: '2019-02-26T01:57:53Z',
    homepage: 'https://edgarleonarchuleta19.github.io',
    html_url: 'https://github.com/EdgarLeonArchuleta19/EdgarLeonArchuleta19.github.io',
    topics: ['github-pages', 'html'],
    fork: false,
    default_branch: 'master',
  },
];

const state = {
  user: null,
  repos: [],
  filter: 'Todos',
  search: '',
  sort: 'updated',
};

/* ---------------------------------------------------------
   Utilidades
   --------------------------------------------------------- */
const escapeHTML = (str = '') =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const normalize = (s = '') => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function timeAgo(date) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(date)) / 1000));
  const units = [
    ['año', 31536000],
    ['mes', 2592000],
    ['semana', 604800],
    ['día', 86400],
    ['hora', 3600],
    ['minuto', 60],
  ];
  for (const [name, secs] of units) {
    const v = Math.floor(s / secs);
    if (v >= 1) {
      const plural = name === 'mes' ? 'meses' : name + 's';
      return `hace ${v} ${v > 1 ? plural : name}`;
    }
  }
  return 'justo ahora';
}

const prettyName = (name) =>
  name
    .replace(/\.github\.io$/i, ' · GitHub Pages')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

function enrichRepo(r) {
  const extra = REPO_CURATED[r.name] || {};
  return {
    ...r,
    description: r.description || extra.description || 'Proyecto de software en GitHub.',
    language: r.language || (r.name.includes('github.io') ? 'HTML' : 'Otro'),
    topics: r.topics && r.topics.length ? r.topics : extra.topics || [],
  };
}

async function fetchJSON(path, { cacheKey = path, accept } = {}) {
  const key = `gh:${cacheKey}`;
  try {
    const cached = JSON.parse(localStorage.getItem(key) || 'null');
    if (cached && Date.now() - cached.t < CACHE_TTL) return cached.d;
  } catch {
    /* cache corrupto, ignorar */
  }

  const res = await fetch(API + path, { headers: accept ? { Accept: accept } : {} });
  if (!res.ok) {
    try {
      const stale = JSON.parse(localStorage.getItem(key) || 'null');
      if (stale) return stale.d;
    } catch {
      /* ignore */
    }
    throw new Error(`GitHub ${res.status}`);
  }
  const data = accept && accept.includes('raw') ? await res.text() : await res.json();
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data }));
  } catch {
    /* storage lleno */
  }
  return data;
}

function toast(htmlMsg, ms = 2800) {
  const t = $('#toast');
  if (!t) return;
  t.innerHTML = htmlMsg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), ms);
}

/* ---------------------------------------------------------
   Tema claro / oscuro
   --------------------------------------------------------- */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}
const toggleTheme = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');

$('#themeToggle')?.addEventListener('click', () => {
  toggleTheme();
  const isLight = document.documentElement.dataset.theme === 'light';
  toast(
    isLight
      ? '<i class="ph-fill ph-sun"></i> Modo claro · Papel y tinta'
      : '<i class="ph-fill ph-moon"></i> Modo oscuro · Azul nocturno'
  );
});

/* ---------------------------------------------------------
   Navegación y Reveal
   --------------------------------------------------------- */
const topbar = $('#topbar');
const menuBtn = $('#menuBtn');
const navLinks = $('#navLinks');

menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

navLinks?.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    navLinks.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener(
  'scroll',
  () => topbar?.classList.toggle('scrolled', window.scrollY > 20),
  { passive: true }
);

// Resalta la sección activa
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $$('.nav-links a').forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);
$$('main section[id]').forEach((s) => sectionObserver.observe(s));

// Animaciones al hacer scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
const observeReveals = (root = document) =>
  $$('.reveal:not(.visible)', root).forEach((el) => revealObserver.observe(el));
observeReveals();

/* ---------------------------------------------------------
   Rotador de especialidades en el Hero
   --------------------------------------------------------- */
(function initRotator() {
  const rotator = $('#rotator');
  if (!rotator) return;
  const phrases = [
    'Plataformas de gestión',
    'Monitoreo GPS en tiempo real',
    'Aplicaciones con React y TypeScript',
    'Sistemas empresariales con Vue',
    'Sitios comerciales de alto impacto',
    'APIs y arquitecturas headless',
  ];
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % phrases.length;
    const current = rotator.querySelector('span');
    if (current) {
      current.classList.remove('in');
      current.classList.add('out');
      setTimeout(() => {
        current.textContent = phrases[idx];
        current.classList.remove('out');
        current.classList.add('in');
      }, 220);
    }
  }, 2900);
})();

/* Contador animado */
function animateCount(el, to, dur = 1000) {
  if (!el) return;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------------------------------------------------------
   GitHub: perfil + repos
   --------------------------------------------------------- */
function applyGitHubData(user, rawRepos) {
  state.user = user;
  state.repos = rawRepos
    .filter((r) => !r.fork || r.stargazers_count > 0)
    .map(enrichRepo);

  if (user.avatar_url && $('#avatar')) $('#avatar').src = user.avatar_url;
  if (user.location && $('#heroLocation')) $('#heroLocation').textContent = user.location;

  const langs = new Set(state.repos.map((r) => r.language).filter(Boolean));
  animateCount($('#statRepos'), user.public_repos ?? state.repos.length);
  animateCount($('#statLangs'), langs.size);

  const sinceYear = user.created_at ? new Date(user.created_at).getFullYear() : 2019;
  const sinceEl = $('#statSince');
  if (sinceEl) sinceEl.textContent = sinceYear;

  renderLangBars();
  renderFilters();
  renderProjects();
}

async function loadGitHub() {
  try {
    const [user, repos] = await Promise.all([
      fetchJSON(`/users/${GITHUB_USER}`),
      fetchJSON(`/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
    ]);
    applyGitHubData(user, repos);
  } catch (err) {
    console.warn('Usando snapshot local de GitHub:', err);
    applyGitHubData(FALLBACK_USER, FALLBACK_REPOS);
  }
  loadActivity();
}

function renderLangBars() {
  const box = $('#langBars');
  if (!box) return;
  const counts = {};
  state.repos.forEach((r) => {
    const l = r.language || 'Otro';
    counts[l] = (counts[l] || 0) + 1;
  });
  const total = state.repos.length || 1;
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  box.innerHTML = sorted
    .map(([lang, n]) => {
      const pct = Math.round((n / total) * 100);
      return `
        <div class="lang-row">
          <span>${escapeHTML(lang)}</span>
          <div class="lang-track"><div class="lang-fill" data-w="${pct}"></div></div>
          <span class="pct">${pct}%</span>
        </div>`;
    })
    .join('');

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      $$('.lang-fill', box).forEach((f) => {
        f.style.width = `${f.dataset.w}%`;
      });
      io.disconnect();
    }
  });
  io.observe(box);
}

function renderFilters() {
  const filtersEl = $('#filters');
  if (!filtersEl) return;
  const langs = ['Todos', ...new Set(state.repos.map((r) => r.language || 'Otro'))];
  filtersEl.innerHTML = langs
    .map(
      (l) =>
        `<button class="filter-btn ${l === state.filter ? 'active' : ''}" role="tab" aria-selected="${
          l === state.filter
        }" data-lang="${escapeHTML(l)}">${escapeHTML(l)}</button>`
    )
    .join('');
}

$('#filters')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  state.filter = btn.dataset.lang;
  $$('.filter-btn').forEach((b) => {
    b.classList.toggle('active', b === btn);
    b.setAttribute('aria-selected', String(b === btn));
  });
  renderProjects();
});

$('#searchInput')?.addEventListener('input', (e) => {
  state.search = normalize(e.target.value);
  renderProjects();
});

$('#sortSelect')?.addEventListener('change', (e) => {
  state.sort = e.target.value;
  renderProjects();
});

function getVisibleRepos() {
  const list = state.repos.filter((r) => {
    const lang = r.language || 'Otro';
    const matchLang = state.filter === 'Todos' || lang === state.filter;
    const hay = normalize(`${r.name} ${r.description || ''} ${(r.topics || []).join(' ')} ${lang}`);
    return matchLang && (!state.search || hay.includes(state.search));
  });
  const sorters = {
    updated: (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at),
    stars: (a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at),
    name: (a, b) => a.name.localeCompare(b.name),
    created: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  };
  return list.sort(sorters[state.sort] || sorters.updated);
}

function renderProjects() {
  const grid = $('#projectsGrid');
  if (!grid) return;
  const list = getVisibleRepos();
  const emptyEl = $('#emptyState');
  if (emptyEl) emptyEl.hidden = list.length > 0;

  grid.innerHTML = list
    .map((r, idx) => {
      const lang = r.language || 'Otro';
      const isNew = Date.now() - new Date(r.pushed_at) < 1000 * 60 * 60 * 24 * 35;
      const topics = (r.topics || [])
        .slice(0, 5)
        .map((t) => `<span class="topic">#${escapeHTML(t)}</span>`)
        .join('');

      return `
        <article class="project-card reveal" tabindex="0" data-repo="${escapeHTML(r.name)}" style="transition-delay:${
          Math.min(idx, 5) * 40
        }ms">
          <div class="card-top">
            <span class="card-index">
              ${String(idx + 1).padStart(2, '0')}
              <span class="lang-tag">${escapeHTML(lang)}</span>
            </span>
            <div class="card-links">
              ${
                r.homepage
                  ? `<a class="card-link" href="${escapeHTML(
                      r.homepage
                    )}" target="_blank" rel="noopener" title="Ver demo en vivo" aria-label="Ver demo de ${escapeHTML(
                      r.name
                    )}"><i class="ph ph-arrow-up-right"></i></a>`
                  : ''
              }
              <a class="card-link" href="${escapeHTML(
                r.html_url
              )}" target="_blank" rel="noopener" title="Ver en GitHub" aria-label="Ver ${escapeHTML(
                r.name
              )} en GitHub"><i class="ph ph-github-logo"></i></a>
            </div>
          </div>
          <h3>${escapeHTML(prettyName(r.name))}${isNew ? '<span class="badge-new">NUEVO</span>' : ''}</h3>
          <p class="project-desc">${escapeHTML(r.description)}</p>
          ${topics ? `<div class="topics">${topics}</div>` : ''}
          <div class="project-meta">
            <span><i class="ph ph-code"></i> ${escapeHTML(lang)}</span>
            ${r.stargazers_count > 0 ? `<span title="Estrellas"><i class="ph ph-star"></i> ${r.stargazers_count}</span>` : ''}
            ${r.forks_count > 0 ? `<span title="Forks"><i class="ph ph-git-fork"></i> ${r.forks_count}</span>` : ''}
            <span title="Última actualización"><i class="ph ph-clock"></i> ${timeAgo(r.pushed_at)}</span>
          </div>
        </article>`;
    })
    .join('');

  observeReveals(grid);
}

// Abrir modal al hacer clic o presionar Enter en una tarjeta
$('#projectsGrid')?.addEventListener('click', (e) => {
  if (e.target.closest('a')) return;
  const card = e.target.closest('.project-card');
  if (card?.dataset.repo) openProject(card.dataset.repo);
});

$('#projectsGrid')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.classList.contains('project-card')) {
    openProject(e.target.dataset.repo);
  }
});

/* ---------------------------------------------------------
   Modal de proyecto (lenguajes + README)
   --------------------------------------------------------- */
const modal = $('#projectModal');
let lastFocus = null;

async function openProject(name) {
  const r = state.repos.find((x) => x.name === name);
  if (!r || !modal) return;
  lastFocus = document.activeElement;
  const lang = r.language || 'Otro';

  $('#modalContent').innerHTML = `
    <span class="mono-label modal-eyebrow">${escapeHTML(lang)} · ${escapeHTML(r.name)}</span>
    <h2 class="modal-title" id="modalTitle">${escapeHTML(prettyName(r.name))}</h2>
    <p class="modal-desc">${escapeHTML(r.description)}</p>
    <div class="modal-actions">
      <a class="btn btn-solid" href="${escapeHTML(r.html_url)}" target="_blank" rel="noopener">
        <i class="ph ph-github-logo"></i> Ver código en GitHub <i class="ph ph-arrow-up-right"></i>
      </a>
      ${
        r.homepage
          ? `<a class="btn btn-line" href="${escapeHTML(r.homepage)}" target="_blank" rel="noopener">
              <i class="ph ph-globe"></i> Demo en vivo <i class="ph ph-arrow-up-right"></i>
            </a>`
          : ''
      }
    </div>
    <div class="modal-stats">
      <div><strong>${r.stargazers_count}</strong><span>Estrellas</span></div>
      <div><strong>${r.forks_count}</strong><span>Forks</span></div>
      <div><strong>${new Date(r.created_at).toLocaleDateString('es-MX', {
        month: 'short',
        year: 'numeric',
      })}</strong><span>Creado</span></div>
      <div><strong>${timeAgo(r.pushed_at).replace('hace ', '')}</strong><span>Último push</span></div>
    </div>
    <h4>Lenguajes</h4>
    <div id="modalLangs">
      <div class="lang-stack"><div style="width:100%;background:${langColor(lang)}"></div></div>
      <div class="lang-legend"><span><i style="background:${langColor(lang)}"></i>${escapeHTML(lang)} 100%</span></div>
    </div>
    <h4>README</h4>
    <div class="readme" id="modalReadme">
      <div class="skeleton-line"></div><br>
      <div class="skeleton-line"></div><br>
      <div class="skeleton-line" style="width:60%"></div>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  $('.modal-close', modal)?.focus();

  // Lenguajes detallados
  fetchJSON(`/repos/${GITHUB_USER}/${r.name}/languages`)
    .then((langs) => {
      const total = Object.values(langs).reduce((a, b) => a + b, 0);
      if (!total) return;
      const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]);
      const modalLangs = $('#modalLangs');
      if (!modalLangs) return;
      modalLangs.innerHTML = `
        <div class="lang-stack">${entries
          .map(
            ([l, b]) =>
              `<div title="${escapeHTML(l)}" style="width:${(b / total) * 100}%;background:${langColor(l)}"></div>`
          )
          .join('')}</div>
        <div class="lang-legend">${entries
          .map(
            ([l, b]) =>
              `<span><i style="background:${langColor(l)}"></i>${escapeHTML(l)} ${((b / total) * 100).toFixed(1)}%</span>`
          )
          .join('')}</div>`;
    })
    .catch(() => {});

  // README
  try {
    const md = await fetchJSON(`/repos/${GITHUB_USER}/${r.name}/readme`, {
      cacheKey: `readme:${r.name}`,
      accept: 'application/vnd.github.raw',
    });
    const box = $('#modalReadme');
    if (!box) return;
    if (window.marked) {
      box.innerHTML = sanitize(marked.parse(md));
      fixRelativeUrls(box, r);
    } else {
      box.innerHTML = `<pre>${escapeHTML(md)}</pre>`;
    }
  } catch {
    const box = $('#modalReadme');
    if (box) {
      const topicsList = (r.topics || []).map((t) => `<code>#${escapeHTML(t)}</code>`).join(' ');
      box.innerHTML = `
        <h3>${escapeHTML(prettyName(r.name))}</h3>
        <p>${escapeHTML(r.description)}</p>
        ${topicsList ? `<p><strong>Tecnologías y temas:</strong> ${topicsList}</p>` : ''}
        <p class="muted">Explora el código fuente completo directamente en <a href="${escapeHTML(
          r.html_url
        )}" target="_blank" rel="noopener">github.com/${GITHUB_USER}/${escapeHTML(r.name)}</a>.</p>
      `;
    }
  }
}

function sanitize(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll('script, iframe, object, embed, style, link, meta').forEach((n) => n.remove());
  tpl.content.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((a) => {
      if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
    });
  });
  return tpl.innerHTML;
}

function fixRelativeUrls(box, repo) {
  const branch = repo.default_branch || 'main';
  const raw = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${branch}/`;
  const blob = `https://github.com/${GITHUB_USER}/${repo.name}/blob/${branch}/`;
  const isRel = (u) => u && !/^(https?:|data:|#|mailto:)/i.test(u);
  $$('img', box).forEach((img) => {
    const s = img.getAttribute('src');
    if (isRel(s)) img.src = raw + s.replace(/^\.?\//, '');
    img.loading = 'lazy';
  });
  $$('a', box).forEach((a) => {
    const h = a.getAttribute('href');
    if (isRel(h)) a.href = blob + h.replace(/^\.?\//, '');
    if (!h?.startsWith('#')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  lastFocus?.focus();
}

modal?.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && !modal.hidden) closeModal();
    else if (chat && !chat.hidden) toggleChat(false);
  }
});

/* ---------------------------------------------------------
   03 / Registro · Actividad reciente
   --------------------------------------------------------- */
async function loadActivity() {
  const tl = $('#timeline');
  if (!tl) return;
  const items = [];
  try {
    const events = await fetchJSON(`/users/${GITHUB_USER}/events/public?per_page=40`);
    for (const ev of events) {
      const repo = ev.repo.name.split('/')[1] || ev.repo.name;
      const url = `https://github.com/${ev.repo.name}`;
      let text = null;
      let msg = '';
      let icon = 'ph-git-commit';

      switch (ev.type) {
        case 'PushEvent': {
          const commits = ev.payload.commits || [];
          const n = ev.payload.size ?? commits.length;
          text = n ? `Pusheó ${n} commit${n > 1 ? 's' : ''} en` : 'Actualizó la rama principal de';
          msg = commits.length
            ? commits[commits.length - 1].message.split('\n')[0]
            : `rama ${(ev.payload.ref || 'main').replace('refs/heads/', '')}`;
          icon = 'ph-git-commit';
          break;
        }
        case 'CreateEvent':
          text =
            ev.payload.ref_type === 'repository'
              ? 'Creó el repositorio'
              : `Creó ${ev.payload.ref_type === 'branch' ? 'la rama' : 'el tag'} <code>${escapeHTML(
                  ev.payload.ref || ''
                )}</code> en`;
          icon = ev.payload.ref_type === 'repository' ? 'ph-sparkle' : 'ph-git-branch';
          break;
        case 'PullRequestEvent':
          text = `${ev.payload.action === 'closed' ? 'Cerró' : 'Abrió'} un Pull Request en`;
          msg = ev.payload.pull_request?.title || '';
          icon = 'ph-git-pull-request';
          break;
        case 'IssuesEvent':
          text = 'Actualizó un issue en';
          msg = ev.payload.issue?.title || '';
          icon = 'ph-bug';
          break;
        case 'WatchEvent':
          text = 'Marcó con estrella';
          icon = 'ph-star';
          break;
        case 'ReleaseEvent':
          text = 'Publicó un release en';
          msg = ev.payload.release?.name || '';
          icon = 'ph-tag';
          break;
        case 'PublicEvent':
          text = 'Hizo público el repositorio';
          icon = 'ph-globe';
          break;
      }
      if (text) items.push({ text, repo, url, msg, date: ev.created_at, icon });
      if (items.length >= 6) break;
    }
  } catch {
    /* fallback abajo */
  }

  if (!items.length && state.repos.length) {
    [...state.repos]
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, 6)
      .forEach((r) =>
        items.push({
          text: 'Actualizó el repositorio',
          repo: r.name,
          url: r.html_url,
          msg: r.description || '',
          date: r.pushed_at,
          icon: 'ph-git-commit',
        })
      );
  }

  tl.innerHTML = items.length
    ? items
        .map(
          (it) => `
        <li class="ledger-row">
          <span class="ledger-date">${timeAgo(it.date)}</span>
          <i class="ph ${it.icon} ledger-icon" aria-hidden="true"></i>
          <div class="ledger-text">
            ${it.text} <a href="${escapeHTML(it.url)}" target="_blank" rel="noopener">${escapeHTML(it.repo)}</a>
            ${it.msg ? `<span class="ledger-msg">› ${escapeHTML(it.msg)}</span>` : ''}
          </div>
        </li>`
        )
        .join('')
    : '<li class="ledger-row"><span class="ledger-date">ahora</span><i class="ph ph-code ledger-icon"></i><div class="ledger-text">Trabajando en nuevos repositorios locales.</div></li>';
}

/* ---------------------------------------------------------
   04 / Bro Zone · Reto de Ajedrez (Mate en 1)
   --------------------------------------------------------- */
const PIECE_GLYPHS = {
  wK: '♔',
  wQ: '♕',
  wR: '♖',
  wB: '♗',
  wN: '♘',
  wP: '♙',
  bK: '♚',
  bQ: '♛',
  bR: '♜',
  bB: '♝',
  bN: '♞',
  bP: '♟',
};

const CHESS_PUZZLES = [
  {
    title: 'El pasillo',
    prompt: 'Juegan blancas. <strong>Mate en 1.</strong>',
    pieces: {
      g8: 'bK',
      f7: 'bP',
      g7: 'bP',
      h7: 'bP',
      d1: 'wR',
      f2: 'wP',
      g2: 'wP',
      h2: 'wP',
      g1: 'wK',
    },
    solution: { from: 'd1', to: 'd8', mateKing: 'g8', notation: 'Td8#' },
    hint: 'La octava fila está completamente indefensa y el rey negro está atrapado por sus propios peones.',
    winMsg: '¡Td8# mate del pasillo! Clásico castigo por hacer deploy sin abrirle una ventanita (h6) al rey.',
    wrongMsg: 'Esa jugada deja escapar al rey negro. Mira la columna abierta "d" hasta el fondo.',
  },
  {
    title: 'El beso de la dama',
    prompt: 'Juegan blancas. <strong>Mate en 1.</strong>',
    pieces: {
      g8: 'bK',
      f8: 'bR',
      g7: 'bP',
      h6: 'bP',
      d4: 'wQ',
      b2: 'wB',
      g1: 'wK',
      g2: 'wP',
      h2: 'wP',
    },
    solution: { from: 'd4', to: 'g7', mateKing: 'g8', notation: 'Dxg7#' },
    hint: 'Tu alfil en b2 apunta como francotirador hacia g7. Combínalo con la dama.',
    winMsg: '¡Dxg7# jaque mate! La batería Dama + Alfil en la gran diagonal no perdona.',
    wrongMsg: 'Casi, pero no es mate en 1. Observa cómo cooperan la dama en d4 y el alfil en b2.',
  },
  {
    title: 'La coz del caballo',
    prompt: 'Juegan blancas. <strong>Mate en 1.</strong>',
    pieces: {
      h8: 'bK',
      g8: 'bR',
      g7: 'bP',
      h7: 'bP',
      e5: 'wN',
      a1: 'wR',
      g1: 'wK',
    },
    solution: { from: 'e5', to: 'f7', mateKing: 'h8', notation: 'Cf7#' },
    hint: 'El rey negro está encerrado por su propia torre y sus peones. Solo una pieza salta obstáculos.',
    winMsg: '¡Cf7# mate de la coz! El propio código legacy del rival encerró a su rey.',
    wrongMsg: 'Con esa no das mate. Recuerda que el caballo en e5 llega a una casilla letal.',
  },
];

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let currentPuzzleIdx = 0;
let selectedSquare = null;
let puzzleSolved = false;
let playerElo = 1200;
let boardState = {};

function coordToRC(coord) {
  return [8 - parseInt(coord[1], 10), FILES.indexOf(coord[0])];
}

function rcToCoord(r, c) {
  return `${FILES[c]}${8 - r}`;
}

function getPseudoTargets(coord, piece) {
  if (!piece || !piece.startsWith('w')) return [];
  const [r, c] = coordToRC(coord);
  const type = piece[1];
  const targets = [];
  const addSquare = (nr, nc) => {
    if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return false;
    const sq = rcToCoord(nr, nc);
    const occ = boardState[sq];
    if (occ && occ.startsWith('w')) return false;
    targets.push(sq);
    return !occ;
  };
  const slide = (dirs) => {
    dirs.forEach(([dr, dc]) => {
      for (let step = 1; step < 8; step++) {
        if (!addSquare(r + dr * step, c + dc * step)) break;
      }
    });
  };

  if (type === 'R') slide([[1, 0], [-1, 0], [0, 1], [0, -1]]);
  else if (type === 'B') slide([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  else if (type === 'Q') slide([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
  else if (type === 'N') {
    [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) =>
      addSquare(r + dr, c + dc)
    );
  } else if (type === 'K') {
    [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) =>
      addSquare(r + dr, c + dc)
    );
  } else if (type === 'P') {
    if (r > 0 && !boardState[rcToCoord(r - 1, c)]) {
      targets.push(rcToCoord(r - 1, c));
      if (r === 6 && !boardState[rcToCoord(r - 2, c)]) targets.push(rcToCoord(r - 2, c));
    }
    [-1, 1].forEach((dc) => {
      if (c + dc >= 0 && c + dc <= 7 && r > 0) {
        const diag = rcToCoord(r - 1, c + dc);
        if (boardState[diag]?.startsWith('b')) targets.push(diag);
      }
    });
  }
  return targets;
}

function updateElo(delta) {
  playerElo = Math.max(800, playerElo + delta);
  const eloEl = $('#elo');
  if (!eloEl) return;
  eloEl.textContent = playerElo;
  eloEl.classList.remove('bump');
  void eloEl.offsetWidth;
  eloEl.classList.add('bump');
  setTimeout(() => eloEl.classList.remove('bump'), 350);
}

function setCommentary(annot, text, isBad = false) {
  const box = $('#commentary');
  if (!box) return;
  box.classList.remove('pop');
  void box.offsetWidth;
  box.innerHTML = `<span class="annot ${isBad ? 'bad' : ''}">${escapeHTML(annot)}</span><p>${escapeHTML(text)}</p>`;
  box.classList.add('pop');
}

function renderChessBoard(highlights = {}) {
  const boardEl = $('#board');
  if (!boardEl) return;
  const targets = selectedSquare ? getPseudoTargets(selectedSquare, boardState[selectedSquare]) : [];

  let html = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const coord = rcToCoord(r, c);
      const isDark = (r + c) % 2 === 1;
      const piece = boardState[coord];
      const classes = ['sq'];
      if (isDark) classes.push('dark');
      if (selectedSquare === coord) classes.push('selected');
      if (targets.includes(coord)) classes.push('target');
      if (highlights.last?.includes(coord)) classes.push('last');
      if (highlights.mate === coord) classes.push('mate');
      if (highlights.hint === coord) classes.push('hint');
      if (highlights.wrong === coord) classes.push('wrong');

      const fileAttr = r === 7 ? ` data-file="${FILES[c]}"` : '';
      const rankAttr = c === 0 ? ` data-rank="${8 - r}"` : '';
      const pieceHtml = piece
        ? `<span class="piece ${piece[0]}">${PIECE_GLYPHS[piece]}</span>`
        : '';

      html += `<div class="${classes.join(' ')}" data-sq="${coord}" role="gridcell" aria-label="Casilla ${coord}"${fileAttr}${rankAttr}>${pieceHtml}</div>`;
    }
  }
  boardEl.innerHTML = html;
}

function loadPuzzle(idx) {
  currentPuzzleIdx = (idx + CHESS_PUZZLES.length) % CHESS_PUZZLES.length;
  const p = CHESS_PUZZLES[currentPuzzleIdx];
  boardState = { ...p.pieces };
  selectedSquare = null;
  puzzleSolved = false;

  if ($('#puzzleLabel')) $('#puzzleLabel').textContent = `Problema ${currentPuzzleIdx + 1} / ${CHESS_PUZZLES.length}`;
  if ($('#puzzleTitle')) $('#puzzleTitle').textContent = p.title;
  if ($('.chess-prompt')) $('.chess-prompt').innerHTML = `<span class="turn-dot"></span> ${p.prompt}`;
  setCommentary('…', 'Selecciona una pieza blanca y luego la casilla destino.');
  renderChessBoard();
}

$('#board')?.addEventListener('click', (e) => {
  const sqEl = e.target.closest('.sq');
  if (!sqEl || puzzleSolved) return;
  const coord = sqEl.dataset.sq;
  const piece = boardState[coord];
  const p = CHESS_PUZZLES[currentPuzzleIdx];

  if (selectedSquare) {
    if (selectedSquare === coord) {
      selectedSquare = null;
      renderChessBoard();
      return;
    }
    if (piece && piece.startsWith('w')) {
      selectedSquare = coord;
      renderChessBoard();
      return;
    }

    const validTargets = getPseudoTargets(selectedSquare, boardState[selectedSquare]);
    if (!validTargets.includes(coord)) {
      selectedSquare = null;
      renderChessBoard();
      return;
    }

    // Verificar si es la jugada ganadora
    if (selectedSquare === p.solution.from && coord === p.solution.to) {
      const movingPiece = boardState[selectedSquare];
      delete boardState[selectedSquare];
      boardState[coord] = movingPiece;
      const fromSq = selectedSquare;
      selectedSquare = null;
      puzzleSolved = true;

      renderChessBoard({ last: [fromSq, coord], mate: p.solution.mateKing });
      setCommentary('!!', p.winMsg, false);
      updateElo(25);
      launchConfetti(70);
      toast(`♟️ ¡${p.solution.notation} Jaque mate! +25 Elo`);
    } else {
      const wrongOrigin = selectedSquare;
      selectedSquare = null;
      renderChessBoard({ wrong: wrongOrigin });
      setCommentary('??', p.wrongMsg, true);
      updateElo(-15);
    }
  } else if (piece && piece.startsWith('w')) {
    selectedSquare = coord;
    renderChessBoard();
  }
});

$('#hintBtn')?.addEventListener('click', () => {
  const p = CHESS_PUZZLES[currentPuzzleIdx];
  if (puzzleSolved) return;
  selectedSquare = p.solution.from;
  renderChessBoard({ hint: p.solution.from });
  setCommentary('?!', p.hint, false);
});

$('#resignBtn')?.addEventListener('click', () => {
  const p = CHESS_PUZZLES[currentPuzzleIdx];
  if (puzzleSolved) {
    loadPuzzle(currentPuzzleIdx + 1);
    return;
  }
  const movingPiece = boardState[p.solution.from];
  delete boardState[p.solution.from];
  boardState[p.solution.to] = movingPiece;
  selectedSquare = null;
  puzzleSolved = true;

  renderChessBoard({ last: [p.solution.from, p.solution.to], mate: p.solution.mateKing });
  setCommentary('0-1', `Solución: ${p.solution.notation}. ${p.winMsg}`, true);
  updateElo(-10);
});

$('#nextBtn')?.addEventListener('click', () => {
  loadPuzzle(currentPuzzleIdx + 1);
});

/* ---------------------------------------------------------
   04 / Bro Zone · Excusas y Aperturas de Developer
   --------------------------------------------------------- */
const EXCUSES = [
  '"En mi máquina sí funciona."',
  '"Eso no es un bug, es una feature no documentada."',
  '"Seguro es caché. Abre una ventana de incógnito."',
  '"Ayer funcionaba perfecto, alguien más tocó esa rama."',
  '"Es un problema de DNS. Siempre es DNS."',
  '"El cliente hizo clic donde ningún humano debería hacer clic."',
  '"Eso ya está contemplado para la versión 2.0."',
  '"Funcionaba increíble hasta que lo subieron a producción."',
  '"No le muevas a esa función, tiene un comentario de 2021 que dice NO TOCAR."',
  '"Es culpa de una actualización de dependencias, no mía."',
  '"Lo probé exhaustivamente… en mi cabeza."',
  '"Falta una variable en el .env de producción, te lo juro."',
  '"Es un bug cuántico: desaparece cuando abro las DevTools."',
];

let lastExcuse = 0;
$('#excuseBtn')?.addEventListener('click', () => {
  const el = $('#excuseText');
  if (!el) return;
  let i;
  do {
    i = Math.floor(Math.random() * EXCUSES.length);
  } while (i === lastExcuse);
  lastExcuse = i;
  el.classList.add('swap');
  setTimeout(() => {
    el.textContent = EXCUSES[i];
    el.classList.remove('swap');
  }, 150);
});

const OPENINGS = [
  {
    eco: 'C42',
    name: 'Gambito del Deploy en Viernes',
    eval: '−9.9',
    note: 'Teóricamente refutada desde 2009. La gente la sigue jugando a las 4:55 PM.',
  },
  {
    eco: 'B20',
    name: 'Defensa Siciliana: Variante "En mi máquina sí corre"',
    eval: '0.0',
    note: 'Sólida e invencible en localhost:3000; colapsa misteriosamente al pasar a producción.',
  },
  {
    eco: 'A00',
    name: 'Ataque git push --force a main',
    eval: '±∞',
    note: 'Sacrificas el historial de todo tu equipo por iniciativa inmediata. No apta para cardíacos.',
  },
  {
    eco: 'D37',
    name: 'Gambito del Hotfix a las 3:00 AM',
    eval: '−4.2',
    note: 'Resuelve el incidente crítico, pero deja tres peones doblados y deuda técnica hasta 2029.',
  },
  {
    eco: 'E60',
    name: 'Defensa India de Stack Overflow',
    eval: '+1.8',
    note: 'Copias la línea principal de una respuesta de 2016 sin leer los comentarios de abajo.',
  },
  {
    eco: 'C65',
    name: 'Apertura Ruy López: Variante Refactor Total',
    eval: '?!',
    note: 'Prometes que solo tomará dos horas. Tres semanas después sigues renombrando carpetas.',
  },
];

let openingIdx = 0;
$('#openingBtn')?.addEventListener('click', () => {
  const box = $('#opening');
  if (!box) return;
  openingIdx = (openingIdx + 1) % OPENINGS.length;
  const op = OPENINGS[openingIdx];
  box.classList.add('swap');
  setTimeout(() => {
    $('#openingEco').textContent = op.eco;
    $('#openingName').textContent = op.name;
    $('#openingEval').textContent = op.eval;
    $('#openingNote').textContent = op.note;
    box.classList.remove('swap');
  }, 150);
});

/* ---------------------------------------------------------
   04 / Bro Zone · Terminal Interactiva
   --------------------------------------------------------- */
const termOut = $('#termOutput');
const termInput = $('#termInput');
const termHistory = [];
let histIdx = -1;

const JOKES = [
  '¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 == DEC 25.',
  'Hay 10 tipos de personas en el mundo: las que entienden binario y las que no.',
  '¿Cuántos programadores se necesitan para cambiar un foco? Ninguno, eso es problema de hardware.',
  'Un SQL entra a un bar, se acerca a dos mesas y pregunta: "¿Puedo hacer JOIN?"',
  '— Toc toc. — ¿Quién es? — … (pausa de 4 segundos) … — Java.',
  'Mi código no tiene bugs, desarrolla "características emergentes no planificadas".',
  '!false — Es gracioso porque es true.',
];
const randomJoke = () => JOKES[Math.floor(Math.random() * JOKES.length)];
const getSortedRepos = () => [...state.repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

const COMMANDS = {
  help: () => `Comandos disponibles:
  whoami      → perfil de Edgar
  ls          → listar proyectos de GitHub
  open <n>    → abrir detalle del proyecto #n
  stack       → tecnologías principales
  contact     → datos de contacto directo
  chess       → ir al reto de ajedrez
  excusa      → lanzar una excusa de dev
  apertura    → ver apertura de ajedrez dev
  joke        → contar un chiste
  speedforce  → activar modo Speed Force ⚡
  theme       → alternar tema claro/oscuro
  github      → abrir perfil de GitHub
  date        → fecha y hora actual
  clear       → limpiar terminal`,
  whoami: () =>
    `Edgar León Archuleta · Desarrollador Full-Stack · ${state.user?.location || 'Culiacán, Sinaloa'} · En GitHub desde 2019`,
  ls: () =>
    state.repos.length
      ? getSortedRepos()
          .map((r, i) => `${String(i + 1).padStart(2, ' ')}. ${r.name.padEnd(28, ' ')} [${r.language || 'Web'}]`)
          .join('\n') + '\n\nEscribe "open <número>" para inspeccionar un proyecto.'
      : 'Cargando repositorios…',
  open: (arg) => {
    const r = getSortedRepos()[parseInt(arg, 10) - 1];
    if (!r) return 'Número inválido. Escribe "ls" para ver la lista numerada.';
    openProject(r.name);
    return `Abriendo ${r.name}…`;
  },
  stack: () =>
    'TypeScript · JavaScript · React · Vue · Vite · Tailwind CSS · Node.js · Express · Strapi · PostgreSQL · SQLite · AWS S3 · Java · Git',
  contact: () =>
    `Correo:   leonedgar190@gmail.com\nLinkedIn: https://www.linkedin.com/in/edgar-le%C3%B3n-archuleta-51b57128a/\nGitHub:   https://github.com/${GITHUB_USER}`,
  chess: () => {
    $('#chessCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return `Elo actual: ${playerElo}. Problema activo: "${CHESS_PUZZLES[currentPuzzleIdx].title}".`;
  },
  excusa: () => EXCUSES[Math.floor(Math.random() * EXCUSES.length)],
  apertura: () => {
    const op = OPENINGS[Math.floor(Math.random() * OPENINGS.length)];
    return `[${op.eco}] ${op.name} (Eval: ${op.eval}) — ${op.note}`;
  },
  joke: randomJoke,
  speedforce: () => {
    toggleSpeedForce();
    return document.body.classList.contains('speedforce')
      ? '⚡ Speed Force ACTIVADA. Corriendo a Mach 3.'
      : '⚡ Speed Force desactivada.';
  },
  theme: () => {
    toggleTheme();
    return `Tema cambiado a ${document.documentElement.dataset.theme === 'dark' ? 'oscuro' : 'claro'}.`;
  },
  github: () => {
    window.open(`https://github.com/${GITHUB_USER}`, '_blank', 'noopener');
    return `Abriendo github.com/${GITHUB_USER}…`;
  },
  date: () => new Date().toLocaleString('es-MX'),
  sudo: () => 'Permiso denegado: este incidente será reportado al administrador de Culiacán.',
  rm: (arg) => (arg.includes('-rf') ? 'Buen intento, pero este portafolio tiene respaldo en la Speed Force.' : 'rm: falta operando'),
  hola: () => '¡Qué onda! Escribe "help" para ver todos los comandos.',
  hello: () => '¡Qué onda! Escribe "help" para ver todos los comandos.',
  clear: () => {
    if (termOut) termOut.innerHTML = '';
    return null;
  },
};

function termPrint(text, cls = '') {
  if (!termOut) return;
  const p = document.createElement('p');
  if (cls) p.className = cls;
  p.textContent = text;
  termOut.appendChild(p);
  termOut.scrollTop = termOut.scrollHeight;
}

$('#termForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!termInput) return;
  const raw = termInput.value.trim();
  termInput.value = '';
  if (!raw) return;
  termHistory.unshift(raw);
  histIdx = -1;
  termPrint(`edgar@dev:~$ ${raw}`, 'cmd');
  const [cmd, ...rest] = raw.split(/\s+/);
  const fn = COMMANDS[cmd.toLowerCase()];
  const out = fn ? fn(rest.join(' ')) : `zsh: comando no encontrado: ${cmd}. Escribe "help".`;
  if (out) termPrint(out);
});

termInput?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && termHistory.length) {
    histIdx = Math.min(histIdx + 1, termHistory.length - 1);
    termInput.value = termHistory[histIdx];
    e.preventDefault();
  }
  if (e.key === 'ArrowDown') {
    histIdx = Math.max(histIdx - 1, -1);
    termInput.value = histIdx >= 0 ? termHistory[histIdx] : '';
    e.preventDefault();
  }
});

$('#terminal')?.addEventListener('click', () => termInput?.focus());

/* ---------------------------------------------------------
   EdgarBot · Asistente Conversacional
   --------------------------------------------------------- */
const chat = $('#chat');
const chatBody = $('#chatBody');
const chatInput = $('#chatInput');
let chatStarted = false;

const SUGGESTIONS = [
  '¿Quién es Edgar?',
  '¿Cuáles son sus mejores proyectos?',
  '¿Qué stack domina?',
  '¿Cómo lo contacto?',
  'Háblame de su ajedrez',
  'Cuéntame un chiste',
  'Activa la Speed Force',
];

function toggleChat(force) {
  if (!chat) return;
  const open = force ?? chat.hidden;
  chat.hidden = !open;
  const badge = $('#fabBadge');
  if (badge) badge.hidden = true;
  if (open) {
    if (!chatStarted) startChat();
    setTimeout(() => chatInput?.focus(), 100);
  }
}

$('#chatFab')?.addEventListener('click', () => toggleChat());
$('#chatClose')?.addEventListener('click', () => toggleChat(false));
$$('[data-open-chat]').forEach((btn) => btn.addEventListener('click', () => toggleChat(true)));

function startChat() {
  chatStarted = true;
  botSay([
    '¡Qué onda! 👋 Soy <strong>EdgarBot</strong>, el asistente del portafolio de Edgar León Archuleta.',
    'Pregúntame por sus proyectos en vivo, su experiencia con React/Vue/TypeScript, o cómo contactarlo para un proyecto.',
  ]);
  const sugBox = $('#chatSuggestions');
  if (sugBox) {
    sugBox.innerHTML = SUGGESTIONS.map((s) => `<button class="suggestion" type="button">${escapeHTML(s)}</button>`).join('');
  }
}

$('#chatSuggestions')?.addEventListener('click', (e) => {
  const b = e.target.closest('.suggestion');
  if (b) handleUserMessage(b.textContent);
});

$('#chatForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!chatInput) return;
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  handleUserMessage(text);
});

function addMsg(html, who) {
  if (!chatBody) return null;
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.innerHTML = html;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  return div;
}

let botQueue = Promise.resolve();
function botSay(messages) {
  const list = Array.isArray(messages) ? messages : [messages];
  list.forEach((m) => {
    botQueue = botQueue.then(
      () =>
        new Promise((resolve) => {
          const typing = addMsg('<span class="typing"><span></span><span></span><span></span></span>', 'bot');
          const plain = m.replace(/<[^>]+>/g, '');
          const delay = Math.min(350 + plain.length * 8, 1200);
          setTimeout(() => {
            typing?.remove();
            addMsg(m, 'bot');
            resolve();
          }, delay);
        })
    );
  });
}

function handleUserMessage(text) {
  addMsg(escapeHTML(text), 'user');
  const reply = getBotReply(text);
  botSay(reply.messages);
  if (reply.action) botQueue = botQueue.then(reply.action);
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const has = (t, ...words) => words.some((w) => t.includes(w));

function projectLink(r) {
  return `<a href="#trabajo" data-open="${escapeHTML(r.name)}">${escapeHTML(prettyName(r.name))}</a>`;
}

chatBody?.addEventListener('click', (e) => {
  const a = e.target.closest('[data-open]');
  if (a) {
    e.preventDefault();
    openProject(a.dataset.open);
  }
});

function getBotReply(input) {
  const t = normalize(input);
  const repos = state.repos;

  const mentioned = repos.find((r) => {
    const n = normalize(r.name);
    const pretty = normalize(prettyName(r.name));
    return t.includes(n) || t.includes(pretty) || (n.length > 4 && t.includes(n.replace(/[-_.]/g, '')));
  });

  if (mentioned) {
    return {
      messages: [
        `<strong>${escapeHTML(prettyName(mentioned.name))}</strong>: ${escapeHTML(mentioned.description)}`,
        `Construido con <strong>${escapeHTML(mentioned.language || 'Web')}</strong> (último push ${timeAgo(
          mentioned.pushed_at
        )}). Haz clic en ${projectLink(mentioned)} para abrir su ficha técnica y README.`,
      ],
    };
  }

  if (has(t, 'hola', 'que onda', 'hey', 'buenas', 'saludos', 'que tal', 'quiubo')) {
    return {
      messages: pick([
        '¡Qué onda! 🤙 ¿Quieres ver los proyectos más recientes de Edgar o su stack técnico?',
        '¡Hola! 👋 Estoy conectado a los repositorios de Edgar. ¿Qué te gustaría explorar?',
      ]),
    };
  }

  if (has(t, 'mejor', 'favorito', 'destacado', 'top', 'principales')) {
    const featured = ['TechPoint', 'superShop', 'float-gps', 'portafolio', 'telmex-tickets', 'iCoffee']
      .map((n) => repos.find((r) => r.name === n))
      .filter(Boolean);
    const list = featured.length ? featured : repos.slice(0, 4);
    return {
      messages: [
        'Estos son algunos de sus proyectos más completos:',
        `<ul>${list
          .map((r) => `<li>${projectLink(r)} — ${escapeHTML(r.description)}</li>`)
          .join('')}</ul>`,
        'Puedes hacer clic en cualquiera para ver su arquitectura y README.',
      ],
    };
  }

  if (has(t, 'proyecto', 'repo', 'trabajos', 'que ha hecho', 'portafolio')) {
    const recent = getSortedRepos().slice(0, 5);
    return {
      messages: [
        `Edgar cuenta con <strong>${repos.length} repositorios públicos</strong> en GitHub. Los actualizados más recientemente son:`,
        `<ul>${recent
          .map((r) => `<li>${projectLink(r)} <code>[${escapeHTML(r.language)}]</code></li>`)
          .join('')}</ul>`,
      ],
    };
  }

  if (has(t, 'stack', 'tecnolog', 'lenguaje', 'sabe', 'herramienta', 'framework', 'skills')) {
    return {
      messages: [
        'Su stack principal está enfocado en desarrollo web full-stack moderno:',
        '<strong>Frontend:</strong> TypeScript, React 19, Vue, Vite, Tailwind CSS.<br><strong>Backend y Datos:</strong> Node.js, Express, Strapi 5 (Headless CMS), PostgreSQL, SQLite, AWS S3 y Java.',
      ],
    };
  }

  if (has(t, 'quien', 'edgar', 'sobre', 'perfil', 'experiencia')) {
    return {
      messages: [
        `<strong>Edgar León Archuleta</strong> es un desarrollador full-stack en <strong>${escapeHTML(
          state.user?.location || 'Culiacán, Sinaloa'
        )}</strong>.`,
        'Diseña y construye plataformas empresariales de principio a fin: desde sistemas POS e inventario (<em>superShop</em>, <em>iCoffee</em>) y monitoreo GPS (<em>float-gps</em>) hasta sitios comerciales y gestores de tickets (<em>telmex-tickets</em>).',
      ],
    };
  }

  if (has(t, 'contrat', 'trabajo', 'chamba', 'empleo', 'freelance', 'contacto', 'contactar', 'correo', 'email', 'linkedin')) {
    return {
      messages: [
        '¡Excelente decisión! Puedes contactar a Edgar directamente por cualquiera de estos medios:',
        '<ul>' +
          '<li><strong>Correo:</strong> <a href="mailto:leonedgar190@gmail.com">leonedgar190@gmail.com</a></li>' +
          '<li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/edgar-le%C3%B3n-archuleta-51b57128a/" target="_blank" rel="noopener">/in/edgar-león-archuleta</a></li>' +
          `<li><strong>GitHub:</strong> <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">@${GITHUB_USER}</a></li>` +
          '</ul>',
      ],
      action: () => launchConfetti(60),
    };
  }

  if (has(t, 'ajedrez', 'chess', 'elo', 'tablero')) {
    return {
      messages: [
        '♟️ A Edgar le apasiona el ajedrez. En la <a href="#relax-zone">Relax Zone</a> hay un tablero interactivo con 3 problemas de mate en 1.',
        `Por cierto, tu Elo actual en la página es <strong>${playerElo}</strong>.`,
      ],
    };
  }

  if (has(t, 'flash', 'speed force', 'speedforce', 'barry', 'velocidad')) {
    return {
      messages: '⚡ Activando la Speed Force… ¡Corriendo a velocidad relámpago!',
      action: () => toggleSpeedForce(true),
    };
  }

  if (has(t, 'chiste', 'broma', 'joke', 'gracioso')) {
    return { messages: [randomJoke()] };
  }

  if (has(t, 'tema', 'oscuro', 'claro', 'dark', 'light')) {
    return { messages: 'Alternando el tema visual del portafolio… ✨', action: () => toggleTheme() };
  }

  return {
    messages: [
      'Puedo contarte sobre los <strong>proyectos</strong> de Edgar, su <strong>stack</strong>, sus datos de <strong>contacto</strong> (correo y LinkedIn) o llevarte al reto de <strong>ajedrez</strong>. ¿Qué prefieres?',
    ],
  };
}

/* ---------------------------------------------------------
   Confetti + Speed Force (Konami Code) + Easter Eggs
   --------------------------------------------------------- */
const canvas = $('#confetti');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let confettiRunning = false;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti(count = 100) {
  if (!ctx || !canvas) return;
  const isSpeedForce = document.body.classList.contains('speedforce');
  const colors = isSpeedForce
    ? ['#C8102E', '#FFD60A', '#FF4D00', '#FFFFFF']
    : ['#1534FF', '#FFD60A', '#0D0D0F', '#19C37D', '#FFFFFF'];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 240,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -16 - 4,
      size: Math.random() * 8 + 4,
      color: colors[i % colors.length],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      life: 1,
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(drawConfetti);
  }
}

function drawConfetti() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.vy += 0.4;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 0.007;
    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 40);
  if (particles.length) requestAnimationFrame(drawConfetti);
  else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function toggleSpeedForce(forceState) {
  const on =
    typeof forceState === 'boolean'
      ? document.body.classList.toggle('speedforce', forceState)
      : document.body.classList.toggle('speedforce');
  launchConfetti(140);
  toast(
    on
      ? '<i class="ph-fill ph-lightning"></i> ¡SPEED FORCE ACTIVADA! · Modo Barry Allen'
      : '<i class="ph ph-lightning"></i> Speed Force desactivada · Paleta editorial'
  );
  updateSpeedReadout();
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPos = 0;
document.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  konamiPos = key === KONAMI[konamiPos] ? konamiPos + 1 : key === KONAMI[0] ? 1 : 0;
  if (konamiPos === KONAMI.length) {
    konamiPos = 0;
    toggleSpeedForce();
  }
});

// Wordmark: 5 clics rápidos activan Speed Force
let wmClicks = 0;
let wmTimer;
$('.wordmark')?.addEventListener('click', () => {
  wmClicks++;
  clearTimeout(wmTimer);
  wmTimer = setTimeout(() => (wmClicks = 0), 900);
  if (wmClicks === 5) {
    wmClicks = 0;
    toggleSpeedForce();
  }
});

/* ---------------------------------------------------------
   Footer & Inicialización
   --------------------------------------------------------- */
function updateSpeedReadout() {
  const el = $('#speedReadout');
  if (!el) return;
  const navEntry = performance.getEntriesByType?.('navigation')?.[0];
  const ms = navEntry ? Math.max(12, Math.round(navEntry.domContentLoadedEventEnd)) : Math.round(performance.now());
  const isSF = document.body.classList.contains('speedforce');
  el.innerHTML = isSF
    ? `<i class="ph-fill ph-lightning"></i> Speed Force activa · Mach 3.2 (${ms} ms)`
    : `<i class="ph-fill ph-lightning"></i> Cargado en ${ms} ms`;
}

const currentYear = new Date().getFullYear();
if ($('#year')) $('#year').textContent = currentYear;
if ($('#yearTop')) $('#yearTop').textContent = currentYear;

loadPuzzle(0);
loadGitHub();
window.addEventListener('load', updateSpeedReadout, { once: true });
updateSpeedReadout();
