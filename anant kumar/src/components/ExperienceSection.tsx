import SectionBlock from './SectionBlock';
import { ScrollReveal } from './ui/ScrollReveal';
import ReferencesSection from './ReferencesSection';

const experiences = [
  {
    role: 'Brand Ambassador',
    company: 'LaunchED Global',
    period: '[AUG 2025 – PRESENT]',
    description:
      'Selected as a Brand Ambassador for LaunchED Global to represent the organization at my college/university. Promote opportunities and internship programs among students.',
  },
  {
    role: 'President & CEO',
    company: 'Founders Verbinden',
    period: '[AUG 2025 – PRESENT]',
    description:
      'Provide strategic leadership and oversee the overall direction, operations, and growth of Founders Verbinden, a founder-focused startup ecosystem.',
  },
  {
    role: 'Campus Ambassador',
    company: 'Physics Wallah (PW)',
    period: '[AUG 2025 – PRESENT]',
    description:
      'Selected as a Campus Ambassador and Official PW Channel Partner. Engage with students, help them discover learning opportunities, and contribute to student outreach initiatives.',
  },
  {
    role: 'Chief Executive Officer',
    company: 'STUDY LPU',
    period: '[FEB 2026 – PRESENT]',
    description:
      'Built an education platform for academic resources, quizzes, mentorship and student-focused learning.',
  },
  {
    role: 'Lead Product Developer',
    company: 'GeoJeevan AI',
    period: '[MAR 2026 – PRESENT]',
    description:
      'Leading the development of GeoJeevan AI, a location-based preventive health platform that uses environmental data and city-level intelligence to predict risks and provide actionable guidance.',
  },
  {
    role: 'Member',
    company: 'Reddit Tech Enterprises',
    period: '[AUG 2025 – JUN 2026]',
    description:
      'Explored various programming languages, gained exposure to hackathon workflows, and learned how to participate in competitive events such as ISRO challenges and Robo Wars.',
  },
  {
    role: 'Volunteer',
    company: 'LPU-NSS',
    period: '[AUG 2025 – MAR 2026]',
    description:
      'Actively participated in community development initiatives including blood donation drives, cleanliness campaigns, and tree plantations.',
  }
];

const ExperienceSection = () => (
  <SectionBlock id="experience" title="Experience">
    <ScrollReveal animation="stagger-fade-up" className="space-y-12">
      {experiences.map((exp) => (
        <div
          key={exp.role}
          className="relative pl-8 md:pl-0 border-l md:border-l-0 border-black/20 md:grid md:grid-cols-[1fr_2fr] md:gap-8 pb-12 last:pb-0"
        >
          <div className="md:text-right md:pr-8 md:border-r border-black/20 relative">
            <div className="hidden md:block absolute top-1 -right-[5px] w-[9px] h-[9px] rounded-none bg-black"></div>
            <div className="md:hidden absolute top-1 -left-[5px] w-[9px] h-[9px] rounded-none bg-black"></div>

            <h4 className="font-mono text-xs tracking-widest text-foreground/60 uppercase mb-1">
              {exp.period}
            </h4>
            <h3 className="font-bold text-base md:text-lg">{exp.company}</h3>
          </div>

          <div className="mt-2 md:mt-0">
            <h3 className="text-base font-bold text-foreground md:hidden mb-2">
              {exp.role}
            </h3>
            <h3 className="text-lg font-bold text-foreground hidden md:block mb-3">
              {exp.role}
            </h3>
            <p className="body-text text-sm">{exp.description}</p>
          </div>
        </div>
      ))}
    </ScrollReveal>

    <ReferencesSection />
  </SectionBlock>
);

export default ExperienceSection;
