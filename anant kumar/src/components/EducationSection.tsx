import SectionBlock from './SectionBlock';

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  description?: string[];
}

const education: EducationItem[] = [
  {
    degree: 'Bachelor of Technology - BTech, Artificial Intelligence and Machine Learning',
    school: 'Lovely Professional University (LPU), Phagwara, Punjab',
    year: 'Aug. 2025 – Aug. 2029',
    description: [
      'Pursuing B.Tech with specialization in Artificial Intelligence and Machine Learning.',
      'Active researcher and author, co-inventor of DBMS Predictive Execution patent initiative.',
      'President of Founders Verbinden.',
    ],
  },
  {
    degree: 'Independent Learning - Web Development, AI Tools, Prompt Engineering, Content Creation',
    school: 'Self-Taught',
    year: 'Jan. 2024 – Present',
  },
  {
    degree: 'JEE / NEET Prep',
    school: 'AAKASH INSTITUTE, Patna, Bihar',
    year: 'Mar. 2023 – Jun. 2024',
  },
  {
    degree: 'Intermediate (CBSE); 80.8%',
    school: 'Pious Mission School, Arwal, Bihar',
    year: 'Aug. 2022 – May 2024',
  },
  {
    degree: 'Matriculation (CBSE); 88%',
    school: 'Gyan Bharti Residential complex, Bodh Gaya, Bihar',
    year: 'Apr. 2020 – Jul. 2022',
  },
  {
    degree: 'Junior High School; 97.8%',
    school: 'Gurukul Public School',
    year: 'Apr. 2017 – Mar. 2020',
  },
  {
    degree: 'Primary School; 94%',
    school: 'Indian institute of Children Progress',
    year: 'Apr. 2012 – Mar. 2017',
  }
];

const EducationSection = () => (
  <SectionBlock id="education" title="Education">
    <div className="space-y-10">
      {education.map((item) => (
        <div
          key={item.degree}
          className="border-l-2 border-black/10 pl-6 py-2 hover:border-black transition-colors duration-300"
        >
          <h3 className="text-base md:text-lg font-bold text-foreground">
            {item.degree}
          </h3>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-2">
            <span className="text-sm font-medium text-foreground">
              {item.school}
            </span>
            <span className="hidden md:inline text-foreground/20">•</span>
            <span className="font-mono text-xs text-foreground/60">
              {item.year}
            </span>
          </div>
          {item.description && (
            <ul className="mt-4 space-y-2 list-disc list-outside pl-4 text-sm text-foreground/80">
              {item.description.map((point, index) => (
                <li key={index} className="leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </SectionBlock>
);

export default EducationSection;
