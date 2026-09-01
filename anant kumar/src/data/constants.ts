// ──────────────────────────────────────
// Single source of truth for all profile data
// ──────────────────────────────────────

export const PROFILE = {
  name: 'Anant Kumar',
  shortName: 'Anant Kumar',
  alias: 'Anant',
  title: 'AI/ML Engineer & Founder',
  email: '720anant@gmail.com',
  phone: '+917209536120',
  website: 'anantkumar.site',
  blogHost: 'anantkumar.site', // Fallback since no blog
  formspreeId: 'mjgzokro', // Formspree Form ID
} as const;

export const SOCIAL_LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/anant9934',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/quantumanant01',
  },
  {
    id: 'blog',
    label: 'Blog',
    href: 'https://vadiccure.blogspot.com/',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:720anant@gmail.com',
  },
] as const;

export type SocialLinkId = (typeof SOCIAL_LINKS)[number]['id'];

/** Helper to get a social link by id */
export const getSocialLink = (id: SocialLinkId) =>
  SOCIAL_LINKS.find((link) => link.id === id)!;
