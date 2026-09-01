import SectionBlock from './SectionBlock';
import AnimatedAvatar from './AnimatedAvatar';
import { ScrollReveal } from './ui/ScrollReveal';
import {
  BookOpen,
  MapPin,
  Github,
  Code,
  Terminal,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { PROFILE, getSocialLink } from '@/data/constants';
import { PROJECT_COUNT } from '@/data/projects';

const AboutSection = () => {
  return (
    <SectionBlock id="about" title="About me">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
        {/* Left Column - Avatar & Quick Specs */}
        <ScrollReveal
          animation="fade-in"
          className="w-full lg:w-auto flex flex-col items-center shrink-0"
        >
          <AnimatedAvatar />

          {/* Neobrutalist Info Card */}
          <div className="w-full max-w-[256px] mt-8 border-2 border-black bg-white p-4 font-mono text-xs space-y-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <div className="flex justify-between border-b border-black/10 pb-1.5">
              <span className="text-black/50">NAME:</span>
              <span className="font-bold">{PROFILE.name.toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b border-black/10 pb-1.5">
              <span className="text-black/50">ROLE:</span>
              <span className="font-bold text-right">AI/ML ENGINEER · BUILDER</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
              <span className="text-black/50 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> LOC:
              </span>
              <span className="font-bold">INDIA [GAYA] · IST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black/50 flex items-center gap-1">
                <Github className="w-3.5 h-3.5" /> GITHUB:
              </span>
              <a
                href={getSocialLink('github').href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:bg-black hover:text-white px-1 transition-colors duration-150"
              >
                @{getSocialLink('github').href.split('/').pop()}
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column - Bio, Stats & Methodology */}
        <div className="flex-1 w-full">
          <ScrollReveal animation="stagger-fade-up" className="space-y-6">
            <p className="body-text max-w-3xl font-bold">
              I build ideas into working systems.
            </p>
            <p className="body-text max-w-3xl">
              I’m Anant Kumar — an AI/ML-focused engineer, developer, researcher, and builder who enjoys turning difficult ideas into practical things that work.
            </p>
            <p className="body-text max-w-3xl">
              I’m naturally curious and work across artificial intelligence, software engineering, data systems, DBMS, automation, robotics, and UAV technology. I like understanding a problem from first principles, designing the system behind it, and taking it from an idea to something people can actually use.
            </p>
            <p className="body-text max-w-3xl">
              I’ve worked on real-world products and client solutions, while also exploring research, intellectual property, and technical writing. My work has taken me from building software and digital platforms to experimenting with new ideas in education, AI, and emerging technology.
            </p>
            <p className="body-text max-w-3xl">
              Outside engineering, I write and think. I’m interested in poetry, philosophy, physics, and quantum ideas — subjects that let me explore questions beyond the boundaries of conventional software development. I enjoy learning across disciplines and finding unexpected connections between them.
            </p>
            <p className="body-text max-w-3xl">
              Right now, I’m also building an AI-powered learning product for children that combines education, artificial intelligence, and video generation to create more engaging and accessible learning experiences.
            </p>
            <p className="body-text max-w-3xl">
              I don’t want to simply use technology. I want to understand it, question it, build with it, and see how far an idea can go.
            </p>
            <p className="body-text max-w-3xl font-bold">
              I learn broadly. I build seriously. I keep asking why.
            </p>
          </ScrollReveal>

          {/* Stats Grid */}
          <ScrollReveal
            animation="stagger-fade-up"
            delay={0.2}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10"
          >
            <div className="border-2 border-black bg-white p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none flex flex-col justify-center">
              <div className="font-mono text-3xl sm:text-2xl lg:text-3xl font-black">₹6L+</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 mt-1 leading-tight">
                Cumulative Freelancing Revenue
              </div>
            </div>
            <div className="border-2 border-black bg-white p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none flex flex-col justify-center">
              <div className="font-mono text-3xl sm:text-2xl lg:text-3xl font-black">2</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 mt-1 leading-tight">
                Books Authored
              </div>
            </div>
            <div className="border-2 border-black bg-white p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none flex flex-col justify-center">
              <div className="font-mono text-3xl sm:text-2xl lg:text-3xl font-black">2</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 mt-1 leading-tight">
                Patent Applications Filed
              </div>
            </div>
            <div className="border-2 border-black bg-white p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 rounded-none flex flex-col justify-center">
              <div className="font-mono text-3xl sm:text-2xl lg:text-3xl font-black">3</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 mt-1 leading-tight">
                Copyright Applications Filed
              </div>
            </div>
          </ScrollReveal>

          {/* Core Principles Section */}
          <ScrollReveal
            animation="fade-up"
            delay={0.1}
            className="mt-8 border-2 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none"
          >
            <h3 className="font-mono text-xs font-bold tracking-[0.2em] uppercase mb-6 pb-2 border-b-2 border-black flex items-center gap-2">
              <Code className="w-4 h-4" />
              // CORE WORKFLOW PRINCIPLES
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 shrink-0" />
                  PROBLEM FIRST
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  Start with the problem, not the technology. Understand the user, constraints, and real objective before deciding what to build.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  BUILD TO SHIP
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  Ideas become valuable when they leave the notebook. I focus on turning concepts into functional, usable, and deployable systems.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  EVIDENCE OVER HYPE
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  I prefer working products, measurable outcomes, and real-world feedback over impressive claims and unnecessary complexity.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black shrink-0" />
                  CROSS-DISCIPLINARY THINKING
                </div>
                <p className="text-xs text-black/70 leading-relaxed font-light pl-5">
                  I connect ideas across AI, engineering, research, science, and creative work to approach problems from more than one angle.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Action CTA */}
          <ScrollReveal
            animation="scale-up"
            delay={0.2}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-3 px-6 py-3 border-2 border-black bg-white text-black text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-black hover:text-white rounded-none"
            >
              <BookOpen className="w-4 h-4" />
              <span>VIEW PROJECTS</span>
            </a>
            
            <a
              href="#achievements"
              className="group relative inline-flex items-center gap-3 px-6 py-3 border-2 border-black bg-black text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:text-black rounded-none"
            >
              <Code className="w-4 h-4" />
              <span>VIEW ACHIEVEMENTS</span>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </SectionBlock>
  );
};

export default AboutSection;
