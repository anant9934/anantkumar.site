export interface ClientWork {
  value?: string;
  title: string;
  category: string;
  attribution?: string;
  attributionType?: 'JOINT CLIENT WORK' | 'INDIVIDUAL CLIENT WORK' | 'CUMULATIVE';
  liveUrl?: string;
  description?: string;
}

export const CLIENT_WORK: ClientWork[] = [
  {
    value: '₹60,000',
    title: 'Sai Enterprises E-Rickshaw',
    category: 'Commercial Client Work / Business Website',
    attribution: 'ANANT KUMAR × SHIVAM KUMAR SINGH',
    attributionType: 'JOINT CLIENT WORK',
    liveUrl: 'https://sai-enterprises-pi.vercel.app/',
  },
  {
    value: '₹1,50,000/yr',
    title: 'Aditya TVS (Annual Engagement)',
    category: 'Commercial Client Work / Client Retainer',
    attribution: 'ANANT KUMAR × SHIVAM KUMAR SINGH',
    attributionType: 'JOINT CLIENT WORK',
    description: 'Website maintenance, inventory management, and social-media marketing.',
  },
  {
    title: 'Gym Alpha Gold',
    category: 'Client / Business Website',
    attribution: 'ANANT KUMAR',
    attributionType: 'INDIVIDUAL CLIENT WORK',
    liveUrl: 'https://gym-alpha-gold.vercel.app/',
    description: 'Conversion-focused digital presence for a fitness business, designed around service presentation and lead generation.',
  },
  {
    title: 'School Management System',
    category: 'EdTech / Management Software',
    attribution: 'ANANT KUMAR',
    attributionType: 'INDIVIDUAL CLIENT WORK',
    liveUrl: 'https://school-management-system-nine-blush.vercel.app/',
  },
  {
    title: 'Home Tuition Platform',
    category: 'Education Technology',
    attribution: 'ANANT KUMAR',
    attributionType: 'INDIVIDUAL CLIENT WORK',
    liveUrl: 'https://home-tution-weld.vercel.app/',
  },
  {
    value: '₹6L+',
    title: 'Cumulative Value',
    category: 'Reported cumulative project & freelance work value',
    attributionType: 'CUMULATIVE',
  },
];
