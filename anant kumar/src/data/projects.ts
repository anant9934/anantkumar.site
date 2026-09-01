// ──────────────────────────────────────────────────────────────────────────────
// Single source of truth for all project data.
// Import this file wherever you need project info (sections, hero count, etc.)
// ──────────────────────────────────────────────────────────────────────────────

export type FilterKey = 'all' | 'ai' | 'web' | 'mobile' | 'ecommerce' | 'research' | 'other';

export interface Project {
  title: string;
  isNew?: boolean;
  badge?: string;
  tagline?: string;
  description: string;
  tags: string[];
  categories: Exclude<FilterKey, 'all'>[];
  githubUrl?: string;
  liveUrl?: string;
  tier?: 1 | 2 | 3 | 4; // 1: Flagship, 2: Research/Deep Tech, 4: Experiments
}

export const PROJECTS: Project[] = [
  // ─── TIER 1: FLAGSHIP PRODUCTS ──────────────────────────────────────────────
  {
    title: 'MANGALKIT',
    tier: 1,
    tagline: 'Spiritual Commerce',
    description: 'A technology-enabled spiritual-commerce venture focused on bringing traditional Indian puja and devotional products into a modern purchasing experience.',
    tags: ['E-commerce', 'Consumer Product', 'Next.js'],
    categories: ['ecommerce', 'web'],
    liveUrl: 'https://www.mangalkit.com/',
  },
  {
    title: 'QUICKDORM',
    tier: 1,
    tagline: 'Student Commerce / Instant Delivery',
    description: 'Student-focused hyperlocal commerce and hostel delivery platform optimizing for campus-to-room delivery.',
    tags: ['Next.js', 'TypeScript', 'Vercel', 'PostgreSQL'],
    categories: ['ecommerce', 'web'],
    liveUrl: 'https://www.quickdorm.in/',
  },
  {
    title: 'STUDY LPU',
    tier: 1,
    tagline: 'EdTech / Learning Platform',
    description: 'A student-focused learning and mentorship platform combining structured academic resources, interactive assessment and a mentor ecosystem. Reached 300+ students.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    categories: ['web'],
    liveUrl: 'https://studylpu.online/',
  },
  {
    title: 'GYANMATRIX',
    tier: 1,
    tagline: 'AI Career Intelligence',
    description: 'Career-trajectory intelligence platform for Computer Science converting professional journeys into structured evidence, combining AI reasoning with human mentorship.',
    tags: ['AI/ML', 'PostgreSQL', 'Drizzle ORM'],
    categories: ['ai', 'web'],
    liveUrl: 'https://gyanmatrix.vercel.app/',
  },
  {
    title: 'GEOJEEVAN AI',
    tier: 1,
    tagline: 'AI / Environmental Intelligence',
    description: 'Location-aware preventive-health intelligence platform converting environmental and geographic signals into explainable health-risk alerts and actionable precautions.',
    tags: ['AI/ML', 'Geospatial APIs', 'Python', 'React'],
    categories: ['ai', 'web'],
    liveUrl: 'https://geojeevanai.online/',
    githubUrl: 'https://github.com/anant9934',
  },

  // ─── TIER 2: RESEARCH / DEEP TECHNICAL WORK ─────────────────────────────────
  {
    title: 'DBMS Predictive Execution',
    tier: 2,
    badge: 'Patent + Prototype',
    tagline: 'Database Engine Research',
    description: 'Research-driven database execution system exploring structural query hashing, speculative branch execution and predictive query optimization.',
    tags: ['C++', 'DBMS', 'Algorithms'],
    categories: ['research', 'web'],
    liveUrl: 'https://dbms-patent-code.vercel.app',
  },
  {
    title: 'EcoVulnAI',
    tier: 2,
    tagline: 'Ecological Risk Platform',
    description: 'Explainable ecological-risk screening framework (AHP methodology) for evaluating environmental vulnerability before major infrastructure decisions.',
    tags: ['Chart.js', 'Netlify Functions', 'JavaScript'],
    categories: ['ai', 'research'],
  },
  {
    title: 'Type I & Type II Superconductors',
    tier: 2,
    badge: 'Academic Research',
    tagline: 'Theoretical Foundations',
    description: 'Research manuscript: "Type I and Type II Superconductors: Theoretical Foundations, Material Advances, and Technological Applications".',
    tags: ['Physics', 'Research'],
    categories: ['research'],
  },
  {
    title: 'Linear Algebra & AI',
    tier: 2,
    badge: 'Systematic Review',
    tagline: 'Research Paper',
    description: 'Systematic-review work on Linear Algebra applications within Artificial Intelligence.',
    tags: ['Mathematics', 'AI/ML', 'Research'],
    categories: ['research', 'ai'],
  },
  {
    title: 'ECE / Sewage Patent',
    tier: 2,
    badge: 'In Development',
    tagline: 'Hardware/Systems Patent',
    description: 'Technical patent currently in drafting and development phase.',
    tags: ['Hardware', 'Patent'],
    categories: ['research'],
  },

  // ─── TIER 4: EXPERIMENTS / SMALLER BUILDS ───────────────────────────────────
  {
    title: 'AI Story Buddy',
    tier: 4,
    tagline: 'AI / Creative Technology',
    description: 'An AI-assisted storytelling product exploring interactive and creative applications of generative technology.',
    tags: ['AI/ML', 'Web'],
    categories: ['ai', 'web'],
    liveUrl: 'https://aistorybuddy-ten.vercel.app/',
  },
  {
    title: 'AIVORE',
    tier: 4,
    tagline: 'Digital Marketplace',
    description: 'Premium Marketplace for Experiences & Offerings combining product discovery with an AI assistant.',
    tags: ['Marketplace', 'AI/ML'],
    categories: ['ecommerce', 'ai', 'web'],
    liveUrl: 'https://ai-vore-new-one-aivore.vercel.app',
  },
  {
    title: 'Self-Surveillance Robot',
    tier: 4,
    tagline: 'Robotics + AI',
    description: 'AI-enabled surveillance robotics prototype combining physical sensing, camera monitoring and real-time telemetry with a software control interface.',
    tags: ['Python', 'ESP32-CAM', 'YOLOv8'],
    categories: ['ai', 'other'],
  },
  {
    title: 'Quantum Tunneling Simulator',
    tier: 4,
    tagline: 'Physics Simulation',
    description: 'Numerically solves Schrödinger equation, simulates de Broglie wavelength and electron tunneling probabilities.',
    tags: ['Python', 'NumPy', 'Matplotlib'],
    categories: ['other'],
  },
  {
    title: 'GiftMate AI',
    tier: 4,
    tagline: 'Emotional Commerce Platform',
    description: 'An AI Recommendation Engine fixing confusing, slow, and generic gifting. Features a live preview customization engine.',
    tags: ['React', 'Node.js', 'AI Recommendation Engine'],
    categories: ['ecommerce', 'ai', 'web'],
  },
  {
    title: 'ACOS',
    tier: 4,
    badge: 'Open Source',
    tagline: 'Chrome Extension',
    description: 'Autonomous Context Operating System — local-first LLM intelligence layer to eliminate token waste and optimize reasoning.',
    tags: ['TypeScript', 'Plasmo', 'LLM'],
    categories: ['ai', 'web'],
  },
  {
    title: 'StudySync AI',
    tier: 4,
    badge: 'India Accelerator OpenXAI',
    tagline: 'Personalized Learning',
    description: 'Personalized learning companion — shortlisted for India Accelerator OpenXAI 2025.',
    tags: ['Python', 'AI/ML', 'EdTech'],
    categories: ['ai'],
  },
  {
    title: 'ShareMaison',
    tier: 4,
    tagline: 'Web Project',
    description: 'A platform connecting people for shared living spaces.',
    tags: ['Web'],
    categories: ['web'],
  },
  {
    title: 'Frontend Learning',
    tier: 4,
    tagline: 'Skill Building',
    description: 'Repository for frontend engineering experiments and continuous learning.',
    tags: ['HTML', 'CSS', 'JS'],
    categories: ['web'],
    githubUrl: 'https://github.com/anant9934',
  },
  {
    title: 'Python Learning',
    tier: 4,
    tagline: 'Skill Building',
    description: 'Core Python concepts, data structures, and script experiments.',
    tags: ['Python'],
    categories: ['other'],
    githubUrl: 'https://github.com/anant9934',
  },
  {
    title: 'Founders Verbinden',
    tier: 4,
    badge: 'President',
    tagline: 'Founder Network',
    description: 'Entrepreneurship ecosystem connecting founders, mentors, investors, and students.',
    tags: ['Ecosystem', 'Networking'],
    categories: ['web'],
    liveUrl: 'https://founders-verbinden.vercel.app/',
  },
  {
    title: 'VadicCure',
    tier: 4,
    tagline: 'Publishing / Content',
    description: 'Health and wellness platform with authored articles including "Ayurveda: The Indian Science".',
    tags: ['Publishing', 'Ayurveda', 'Content'],
    categories: ['other'],
    liveUrl: 'https://vadiccure.blogspot.com/',
  }
];

/** Total project count — use this in HeroSection, AboutSection, etc. */
export const PROJECT_COUNT = PROJECTS.length;
