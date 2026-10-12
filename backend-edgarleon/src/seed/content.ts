export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

type Localized<T> = Record<Locale, T>;

export const PROFILE = {
  shared: {
    name: 'Edgar León Archuleta',
    email: 'leonedgar190@gmail.com',
    location: 'Culiacán, Sinaloa',
    socialLinks: [
      { label: 'GitHub', url: 'https://github.com/EdgarLeonArchuleta19' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/edgar-leon-archuleta' },
    ],
  },
  localized: {
    en: {
      role: 'Computer Systems Engineer',
      bio: 'Computer Systems Engineer (class of 2025) with experience building and evolving full-stack web and mobile applications. I helped modernize legacy financial systems using Vue.js, Laravel and PostgreSQL, and shipped REST APIs, production Android apps and scalable business solutions.\n\nI work comfortably with Java-based mobile development, modern front-end tooling and agile Scrum. My focus is always the same: efficient, maintainable, well-tested products that move the needle for the business.',
    },
    es: {
      role: 'Ingeniero en Sistemas Computacionales',
      bio: 'Ingeniero en Sistemas Computacionales (egresado 2025) con experiencia desarrollando y evolucionando aplicaciones web y móviles full-stack. Participé en la modernización de sistemas financieros legacy con Vue.js, Laravel y PostgreSQL, y lancé APIs REST, apps Android en producción y soluciones empresariales escalables.\n\nTrabajo con comodidad en desarrollo móvil con Java, tecnologías web modernas y metodologías ágiles Scrum. Mi enfoque es siempre el mismo: productos eficientes, mantenibles y bien probados que muevan la aguja del negocio.',
    },
  } satisfies Localized<{ role: string; bio: string }>,
};

export const CATEGORIES: Array<{ key: string; name: Localized<string> }> = [
  { key: 'frontend', name: { en: 'Frontend', es: 'Frontend' } },
  { key: 'backend', name: { en: 'Backend', es: 'Backend' } },
  { key: 'databases', name: { en: 'Databases', es: 'Bases de datos' } },
  { key: 'tools', name: { en: 'Tools', es: 'Herramientas' } },
  { key: 'mobile', name: { en: 'Mobile', es: 'Móvil' } },
];

export const SKILLS = [
  { key: 'react', name: 'React', level: 'avanzado', category: 'frontend' },
  { key: 'vue', name: 'Vue.js', level: 'avanzado', category: 'frontend' },
  { key: 'tailwind', name: 'Tailwind CSS', level: 'aplicado', category: 'frontend' },
  { key: 'laravel', name: 'Laravel', level: 'avanzado', category: 'backend' },
  { key: 'nodejs', name: 'Node.js', level: 'aplicado', category: 'backend' },
  { key: 'strapi', name: 'Strapi', level: 'aplicado', category: 'backend' },
  { key: 'postgresql', name: 'PostgreSQL', level: 'avanzado', category: 'databases' },
  { key: 'mysql', name: 'MySQL', level: 'aplicado', category: 'databases' },
  { key: 'android', name: 'Android / Java', level: 'avanzado', category: 'mobile' },
  { key: 'git', name: 'Git', level: 'dominado', category: 'tools' },
  { key: 'scrum', name: 'Scrum', level: 'aplicado', category: 'tools' },
] as const;

export type SkillKey = (typeof SKILLS)[number]['key'];

interface SeedProject {
  slug: string;
  coverAsset: string;
  shared: { order: number; year: string; repositoryUrl: string; liveUrl: string };
  skills: SkillKey[];
  localized: Localized<{ title: string; description: string }>;
}

export const PROJECTS: SeedProject[] = [
  {
    slug: 'icoffee-pos',
    coverAsset: 'icoffee-pos.png',
    shared: {
      order: 1,
      year: '2024',
      repositoryUrl: 'https://github.com/EdgarLeonArchuleta19/iCoffee',
      liveUrl: 'https://edgarleonarchuleta19.github.io/iCoffee/',
    },
    skills: ['react', 'vue', 'tailwind', 'laravel', 'postgresql', 'git'],
    localized: {
      en: {
        title: 'iCoffee',
        description: 'iCoffee is an all-in-one point-of-sale system built for coffee shops that want one tool for everything: counter sales, an online storefront and delivery orders.\n\nIt ships with a full product and inventory catalog, order tracking, per-user roles and a dashboard that gives owners a live view of revenue and top products. Built to feel fast and stay simple on a busy counter.\n\nStack: Vue.js + Laravel frontend with a PostgreSQL database, consumed through a clean REST API.',
      },
      es: {
        title: 'iCoffee',
        description: 'iCoffee es un punto de venta todo-en-uno para cafeterías que quieren una sola herramienta para todo: ventas en mostrador, tienda en línea y pedidos de entrega.\n\nIncluye un catálogo completo de productos e inventario, seguimiento de pedidos, roles por usuario y un panel que le da al dueño una vista en vivo de ingresos y productos más vendidos. Está diseñado para sentirse rápido y simple detrás de un mostrador ocupado.\n\nStack: frontend con Vue.js + Laravel sobre PostgreSQL, consumido a través de una API REST limpia.',
      },
    },
  },
  {
    slug: 'support-tickets',
    coverAsset: 'support-tickets.png',
    shared: {
      order: 2,
      year: '2024',
      repositoryUrl: 'https://github.com/EdgarLeonArchuleta19/Telmex',
      liveUrl: '',
    },
    skills: ['laravel', 'vue', 'mysql', 'nodejs', 'scrum', 'git'],
    localized: {
      en: {
        title: 'Support Tickets',
        description: 'A support platform for managing IT tickets end to end: creation, triage, and role-based inboxes for both support agents and end users.\n\nEach ticket moves through statuses and priorities with a complete history, so nothing gets lost. Reports give the team visibility into resolution time and workload, while the admin area keeps users and categories under control.\n\nStack: Vue.js + Laravel backend, MySQL for persistence and Node.js for the real-time notification layer.',
      },
      es: {
        title: 'Tickets',
        description: 'Una plataforma de soporte para gestionar tickets de TI de principio a fin: creación, clasificación y bandejas por rol tanto para agentes de soporte como para usuarios finales.\n\nCada ticket avanza por estados y prioridades con un historial completo, para que nada se pierda. Los reportes dan visibilidad del tiempo de resolución y la carga de trabajo, mientras el área administrativa mantiene controlados usuarios y categorías.\n\nStack: Vue.js + Laravel, MySQL como persistencia y Node.js para la capa de notificaciones en tiempo real.',
      },
    },
  },
  {
    slug: 'floa-gps',
    coverAsset: 'floa-gps.png',
    shared: {
      order: 3,
      year: '2026',
      repositoryUrl: 'https://github.com/EdgarLeonArchuleta19/float-gps',
      liveUrl: 'https://edgarleonarchuleta19.github.io/floa-web/',
    },
    skills: ['react', 'nodejs', 'postgresql', 'android', 'git'],
    localized: {
      en: {
        title: 'Floa GPS',
        description: 'A fleet management and tracking platform that helps you see exactly where your vehicles are in real time.\n\nIt combines an interactive map with geofences and alerts for unusual movements, plus fleet administration, driver assignments and advanced reporting for operations teams.\n\nStack: React frontend over a Node.js API, PostgreSQL for geographic data and an Android companion app built in Java.',
      },
      es: {
        title: 'Floa GPS',
        description: 'Una plataforma de administración y seguimiento de flotas que te permite ver exactamente dónde están tus vehículos en tiempo real.\n\nCombina un mapa interactivo con geocercas y alertas de movimientos poco habituales, además de administración de flota, asignación de conductores y reportes avanzados para equipos de operaciones.\n\nStack: frontend React sobre una API de Node.js, PostgreSQL para datos geográficos y una app Android complementaria en Java.',
      },
    },
  },
];
