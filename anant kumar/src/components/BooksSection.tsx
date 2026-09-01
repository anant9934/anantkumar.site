import { motion } from 'framer-motion';
import SectionBlock from './SectionBlock';
import { BOOKS } from '@/data/books';
import { ExternalLink } from 'lucide-react';
import { playHover, playClick } from '@/hooks/useSoundEffects';

const BooksSection = () => {
  return (
    <SectionBlock id="books" title="Books" hideTitle>
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1]">
          WORDS WE WROTE.<br />
          IDEAS WE BUILT.
        </h2>
        <p className="mt-4 text-sm font-mono text-foreground/60 uppercase tracking-widest">
          Published work exploring technology, AI, and systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {BOOKS.map((book, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col sm:flex-row gap-6 p-6 border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300 rounded-none group"
          >
            {/* Book Cover Placeholder */}
            <div className="w-full sm:w-40 shrink-0 aspect-[2/3] bg-white border-2 border-black overflow-hidden flex items-center justify-center relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-300">
              {book.image ? (
                <img src={book.image} alt={book.title} className="w-full h-full object-cover grayscale contrast-110 brightness-95 group-hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="text-center p-4">
                  <div className="font-serif font-black text-xl leading-tight mb-2">{book.title}</div>
                  <div className="w-8 h-[2px] bg-amber-600 mx-auto"></div>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
                {book.title}: {book.subtitle}
              </h3>
              <p className="text-xs font-mono uppercase font-black text-black/60 mb-6">
                {book.author}
              </p>
              
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                onMouseEnter={playHover}
                className="mt-auto inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-white hover:text-black transition-all duration-300 w-fit"
              >
                View on Amazon
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionBlock>
  );
};

export default BooksSection;
