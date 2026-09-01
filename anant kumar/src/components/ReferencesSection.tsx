import { useState } from 'react';
import { ScrollReveal } from './ui/ScrollReveal';
import { ArrowUpRight } from 'lucide-react';

type ReferenceCategory = 'All' | 'Academic' | 'Research' | 'Technical' | 'Execution';

interface Reference {
  id: string;
  name: string;
  title: string;
  relationship: string;
  recommendsFor: string;
  validates: string[];
  recommendation: string;
  linkedin: string;
  categories: Exclude<ReferenceCategory, 'All'>[];
}

const referencesData: Reference[] = [
  {
    id: '01',
    name: 'Dr. Mohit Arora',
    title: 'Associate Professor · Head of Machine Learning · Lovely Professional University',
    relationship: 'Academic / Project Mentor & Professional Reference',
    recommendsFor: 'AI/ML · Research · Software Development · Innovation · Technology Entrepreneurship',
    validates: ['Technical curiosity and initiative', 'Applied technology and innovation', 'Project ownership', 'Research-oriented thinking', 'Ability to take ideas toward practical solutions'],
    recommendation: 'I have had the opportunity to interact with and work with Anant Kumar across multiple technology and project-oriented initiatives. During this time, I have observed his development as a technically inclined student with a strong interest in innovation, software development, and applied technology.\n\nWhat distinguishes Anant is his initiative and willingness to take ideas beyond the conceptual stage. He actively explores technical solutions, works on practical projects, and demonstrates an entrepreneurial approach toward solving problems.\n\nI believe Anant has significant potential to develop into a capable technology professional and entrepreneur. His curiosity, initiative, and willingness to take responsibility are qualities that will serve him well in future academic and professional environments.',
    linkedin: 'https://in.linkedin.com/in/mohit24',
    categories: ['Academic', 'Research']
  },
  {
    id: '02',
    name: 'Gautham Mallepalli',
    title: 'Software Engineer · Cognizant (Former CSE 326 Instructor)',
    relationship: 'Course Instructor / Academic Reference',
    recommendsFor: 'Web Development · HTML · CSS · JavaScript · Software Development',
    validates: ['HTML/CSS/JavaScript', 'Web development', 'Practical technical ability', 'Problem-solving', 'Discipline and consistency', 'A+ / Excellent performance in CSE 326'],
    recommendation: 'I had the pleasure of teaching Anant Kumar in CSE 326: Internet Programming Laboratory during his first semester. He demonstrated a strong ability to understand and apply practical concepts related to HTML, CSS, JavaScript, and web development.\n\nAnant was a sincere, disciplined, and enthusiastic learner who showed good problem-solving ability and a willingness to explore new technologies.\n\nHis A+ (Excellent) performance in the course reflected his dedication, consistent effort, and ability to perform well in practical and technical work.\n\nI am confident that his strong learning attitude, technical aptitude, and initiative will help him grow into a capable software professional.',
    linkedin: 'https://in.linkedin.com/in/gautham-mallepalli-113118227',
    categories: ['Academic', 'Technical']
  },
  {
    id: '03',
    name: 'Rithik Dubey',
    title: 'Assistant Professor · Lovely Professional University (M.Tech — Software Engineering)',
    relationship: 'CSE 320 Software Engineering Faculty / Academic Reference',
    recommendsFor: 'Software Engineering · Programming · Problem Solving · Technical Learning',
    validates: ['Software engineering fundamentals', 'Practical application', 'Technical curiosity', 'Problem-solving', 'Independent learning'],
    recommendation: 'I had the opportunity to interact with Anant Kumar in the context of CSE 320, Software Engineering, at Lovely Professional University. During my interaction with him, I observed his interest in understanding software development beyond theoretical concepts.\n\nAnant demonstrates a practical mindset toward technology and is particularly interested in understanding how software ideas can be converted into useful solutions.\n\nHis willingness to learn, experiment, and take responsibility for his work makes him a promising candidate for software engineering, development, and technology-focused opportunities.\n\nI would confidently recommend Anant for roles where technical curiosity, problem-solving, and continuous learning are valued.',
    linkedin: 'https://in.linkedin.com/in/rithik-dubey-180716194',
    categories: ['Academic', 'Technical']
  },
  {
    id: '04',
    name: 'Naina Sharma',
    title: 'Assistant Professor · Lovely Professional University',
    relationship: 'PEL 121 Faculty / Academic Reference',
    recommendsFor: 'Academic Development · Technology · Independent Learning · Technical Opportunities',
    validates: ['Classroom engagement', 'Learning attitude', 'Independent exploration', 'Technical curiosity', 'Practical application'],
    recommendation: 'I had the opportunity to teach Anant Kumar in PEL 121 at Lovely Professional University. During the course, I found him to be a sincere, curious, and engaged student with a genuine interest in learning and applying concepts.\n\nAnant has a practical approach toward learning and is willing to explore beyond what is covered in the classroom. He demonstrates initiative when working on technical problems and shows an interest in understanding how concepts can be applied to real-world situations.\n\nI believe Anant has the curiosity, discipline, and technical inclination required to continue developing as a technology professional.',
    linkedin: 'https://in.linkedin.com/in/nainasharma0510',
    categories: ['Academic']
  },
  {
    id: '05',
    name: 'Akanksha Pandey',
    title: 'Computer Science Professional / Research Collaborator',
    relationship: 'DBMS Predictive Execution Patent / Research Collaborator',
    recommendsFor: 'Research · DBMS · Patent Work · Innovation · Technical Collaboration',
    validates: ['DBMS research', 'Patent collaboration', 'Technical problem-solving', 'Research discussions', 'Collaboration', 'Innovation mindset'],
    recommendation: 'I had the opportunity to work closely with Anant Kumar on our DBMS Predictive Execution research and patent work. Working with him gave me a clear understanding of his ability to approach technical problems with curiosity, persistence, and a strong solution-oriented mindset.\n\nAnant was actively involved in exploring the problem, discussing technical approaches, refining ideas, and working toward converting a complex concept into a structured and practical solution.\n\nHe combines technical learning with initiative and takes ownership of his work. He is also comfortable collaborating, discussing ideas, accepting feedback, and contributing constructively to a team.\n\nI would confidently recommend Anant for opportunities involving software development, databases, AI/ML, research, innovation, and technology-driven projects.',
    linkedin: 'https://in.linkedin.com/in/akanksha-pandey-9969411b7',
    categories: ['Research', 'Technical']
  },
  {
    id: '06',
    name: 'Kaustubh Shukla',
    title: 'Full-Stack Developer · AI/ML-focused CSE Student · LPU',
    relationship: 'DBMS Predictive Execution Patent / Technical Project Collaborator',
    recommendsFor: 'Full-Stack Development · DBMS · Research · Software Engineering · Technical Collaboration',
    validates: ['Patent collaboration', 'Technical problem-solving', 'Software development', 'Project execution', 'Team collaboration', 'Technical initiative'],
    recommendation: 'I have had the opportunity to work with Anant Kumar on the DBMS Predictive Execution patent as well as several other technical and project-related activities.\n\nAnant is someone who is comfortable working through complex technical problems rather than avoiding them. During our collaboration, he contributed to technical discussions, explored possible solutions, and remained focused on moving the work forward.\n\nOne of his strongest qualities is his initiative. He is constantly interested in exploring new technologies and thinking about how they can be applied to practical problems.\n\nBased on my experience working with him, I would recommend Anant for opportunities in software development, AI, databases, research, product development, and technology entrepreneurship.',
    linkedin: 'https://in.linkedin.com/in/kaustubhshukla9586',
    categories: ['Technical', 'Research']
  },
  {
    id: '07',
    name: 'Shivam Kumar Singh',
    title: 'Co-founder / Technology & Operations Collaborator · STUDY LPU',
    relationship: 'Long-term Co-worker / Technology, Client & Entrepreneurial Projects',
    recommendsFor: 'Leadership · Execution · Entrepreneurship · Product Development · Technology',
    validates: ['Ownership', 'Project execution', 'Client communication', 'Product thinking', 'Business thinking', 'Leadership', 'AI/software development', 'Working under uncertainty'],
    recommendation: 'I have had the opportunity to work closely with Anant Kumar across multiple technology, client, and entrepreneurial projects. Working with him has given me a clear view of his ability to take an idea from problem definition through planning, development, coordination, and final execution.\n\nAnant stands out for his ownership and execution mindset. He is willing to take responsibility for difficult or uncertain requirements and remains focused on finding a practical path forward.\n\nHe combines technical understanding with strong product and business thinking. Rather than looking at technology in isolation, he considers the end user, client requirements, scalability, and practical impact.\n\nBased on our experience working together, I would confidently recommend Anant for opportunities in technology, AI, software development, product development, entrepreneurship, and roles requiring strong ownership, problem-solving, leadership, and execution.',
    linkedin: 'https://in.linkedin.com/in/shivam-kumar-singh-lpu',
    categories: ['Execution', 'Technical']
  }
];

const ReferenceCard = ({ item }: { item: Reference }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border-2 border-black bg-white p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 flex flex-col justify-between rounded-none">
      <div>
        <div className="font-mono text-[10px] text-black/50 mb-2 border-b-2 border-black/10 inline-block">│ {item.id} │</div>
        <h3 className="font-bold text-lg uppercase tracking-tight leading-tight border-b-2 border-black pb-2 mb-3">
          {item.name}
        </h3>
        <div className="text-xs font-mono mb-4 text-black/80 font-semibold">{item.title}</div>
        
        <div className="space-y-4 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-black/50 block mb-1">RECOMMENDS</span>
            <span className="text-xs font-mono bg-black/5 px-2 py-1 inline-block border-l-2 border-black">{item.recommendsFor}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-black/50 block mb-1.5">VALIDATES</span>
            <div className="flex flex-wrap gap-1.5">
               {item.validates.map(v => (
                 <span key={v} className="text-[10px] border border-black/20 px-1.5 py-0.5 bg-white uppercase font-medium">{v}</span>
               ))}
            </div>
          </div>
        </div>
        
        <div className="relative mt-2">
          <div className={`text-sm leading-relaxed italic border-l-2 border-black/30 pl-4 font-serif text-black/80 whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}>
            "{item.recommendation}"
          </div>
          {!expanded && (
             <button onClick={() => setExpanded(true)} className="text-[10px] font-bold mt-3 border-b border-black text-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
               [ READ FULL → ]
             </button>
          )}
          {expanded && (
             <button onClick={() => setExpanded(false)} className="text-[10px] font-bold mt-3 border-b border-black text-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
               [ COLLAPSE ← ]
             </button>
          )}
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t-2 border-black/10 flex justify-end">
        <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold font-mono hover:bg-black hover:text-white px-2 py-1 flex items-center gap-1 transition-colors border border-black">
          [ LinkedIn <ArrowUpRight className="w-3 h-3" /> ]
        </a>
      </div>
    </div>
  );
};

const ReferencesSection = () => {
  const [activeCategory, setActiveCategory] = useState<ReferenceCategory>('All');
  const categories: ReferenceCategory[] = ['All', 'Academic', 'Research', 'Technical', 'Execution'];
  
  const filteredReferences = referencesData.filter(ref => 
    activeCategory === 'All' ? true : ref.categories.includes(activeCategory)
  );

  return (
    <div id="references" className="mt-24 pt-16 border-t-2 border-black/10">
      <div className="mb-10 text-center md:text-left">
        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight inline-block border-b-2 border-black pb-2">
          References & Recommendations
        </h3>
      </div>
      <div className="w-full mb-10">
        <ScrollReveal className="flex flex-wrap items-center gap-2 mb-8">
          <div className="font-mono text-xs font-bold text-black/50 mr-2 uppercase flex items-center gap-2">
            <span>// FILTER:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-1.5 font-mono text-[10px] uppercase font-bold transition-all duration-200 border-2 rounded-none
                  ${
                    activeCategory === cat
                      ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white text-black border-black/20 hover:border-black hover:bg-black/5'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-auto font-mono text-[10px] font-bold text-black/50 border-b border-black/10 pb-0.5">
            {filteredReferences.length.toString().padStart(2, '0')} REFERENCES FOUND
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReferences.map((ref, i) => (
            <ScrollReveal key={ref.id} animation="fade-up" delay={i * 0.1}>
              <ReferenceCard item={ref} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferencesSection;
