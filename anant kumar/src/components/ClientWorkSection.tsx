import { motion } from 'framer-motion';
import SectionBlock from './SectionBlock';
import { CLIENT_WORK } from '@/data/clientWork';

const ClientWorkSection = () => {
  return (
    <SectionBlock id="client-work" title="Client Work" hideTitle>
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
          REAL WORK.<br />
          REAL CLIENTS.<br />
          <span className="text-black">REAL MONEY.</span>
        </h2>
        <p className="mt-4 text-sm font-mono text-foreground/60 uppercase tracking-widest">
          Commercial engagements and verified client projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLIENT_WORK.map((work, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col p-8 border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200 rounded-none relative overflow-hidden group"
          >
            {/* Top Value (if any) */}
            {work.value && (
              <div className="text-3xl md:text-4xl font-black tracking-tight text-black mb-4">
                {work.value}
              </div>
            )}

            <h3 className="text-xl font-bold tracking-tight mb-1">{work.title}</h3>
            <p className="text-xs font-mono text-foreground/60 uppercase mb-auto">
              {work.category}
            </p>

            {work.description && (
              <p className="mt-4 text-sm text-foreground/80 mb-6">
                {work.description}
              </p>
            )}

            <div className="mt-8 pt-6 border-t-2 border-black flex flex-col gap-1">
              {work.attribution && (
                <span className="text-[10px] font-mono uppercase font-bold text-foreground/70">
                  {work.attribution}
                </span>
              )}
              {work.attributionType && (
                <span className="text-[10px] font-mono uppercase font-black text-black">
                  {work.attributionType}
                </span>
              )}
            </div>
            
            {work.liveUrl && (
              <a
                href={work.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                aria-label={`View ${work.title}`}
              />
            )}
          </motion.div>
        ))}
      </div>
    </SectionBlock>
  );
};

export default ClientWorkSection;
