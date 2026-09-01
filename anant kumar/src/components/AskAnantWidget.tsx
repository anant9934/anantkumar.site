import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DefaultChatTransport } from 'ai';

export const AskAnantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ask-anant' }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  const handleExampleClick = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* ── Floating Avatar Pill ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Ask Anant AI chat"
            className="fixed bottom-8 right-6 z-50 flex items-center gap-3 bg-black text-white border-[3px] border-black px-4 py-3 cursor-pointer
                       shadow-[5px_5px_0px_0px_rgba(0,0,0,0.25)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)]
                       hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 select-none group"
          >
            {/* Avatar circle */}
            <div className="w-9 h-9 rounded-full bg-white border-[2px] border-white overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src="/favicon.png"
                alt="Anant"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Sparkles size={18} className="hidden text-black" />
            </div>
            {/* Label */}
            <div className="flex flex-col leading-tight text-left">
              <span className="font-mono font-black text-[11px] tracking-widest uppercase">Ask Anant</span>
              <span className="font-mono text-[9px] text-white/60 tracking-wide">AI · Ask me anything</span>
            </div>
            {/* Pulse dot */}
            <span className="relative flex h-2.5 w-2.5 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed bottom-6 right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh]
                         bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                         flex flex-col overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(circle at 100% 0%, #f9f9f9 0%, #ffffff 60%)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-black bg-black text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white border-[2px] border-white/30 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src="/favicon.png"
                      alt="Anant"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-mono font-black text-[11px] tracking-widest uppercase">// ASK ANANT AI</span>
                    <span className="font-mono text-[9px] text-white/50 tracking-wide flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                      Online · Powered by AI
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border-[2px] border-white/30 hover:bg-red-500 hover:border-red-500 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-4 pt-2">
                    {/* Welcome card */}
                    <div className="border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                      <p className="font-mono font-black text-lg leading-snug tracking-tight mb-1">
                        Ask Anything<br />About Me.
                      </p>
                      <p className="font-mono text-xs text-black/50 leading-relaxed">
                        I'll answer about Anant's skills, projects, experience & more!
                      </p>
                    </div>

                    {/* Example chips */}
                    <div>
                      <span className="font-mono text-[10px] font-black tracking-widest uppercase text-black/40 block mb-2">Try asking</span>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Who is Anant Kumar?',
                          'What projects has he built?',
                          'What are his skills?',
                          'How can I contact him?',
                        ].map((ex, i) => (
                          <button
                            key={i}
                            onClick={() => handleExampleClick(ex)}
                            className="text-left px-3 py-2.5 border-[2px] border-black font-mono text-xs font-bold
                                       hover:bg-black hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                                       hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {messages.map((m) => {
                      const text = m.parts
                        ? m.parts.filter((p: {type: string}) => p.type === 'text').map((p: {text: string}) => p.text).join('')
                        : (m as {content?: string}).content || '';
                      return (
                        <div key={m.id} className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <span className="font-mono text-[9px] font-black tracking-widest uppercase opacity-40">
                            {m.role === 'user' ? 'You' : 'Anant AI'}
                          </span>
                          <div className={`px-3 py-2.5 border-[2px] border-black max-w-[88%] font-mono text-xs leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-black text-white'
                              : 'bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                          }`}>
                            {text}
                          </div>
                        </div>
                      );
                    })}
                    {isLoading && (
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-mono text-[9px] font-black tracking-widest uppercase opacity-40">Anant AI</span>
                        <div className="px-3 py-2.5 border-[2px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex gap-1 items-center">
                            {[0, 1, 2].map(i => (
                              <span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-black animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="border-t-[3px] border-black p-3 bg-white shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your question..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2.5 border-[2px] border-black font-mono text-xs focus:outline-none
                               shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-none
                               focus:translate-x-[3px] focus:translate-y-[3px] transition-all bg-white disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2.5 bg-black text-white border-[2px] border-black font-mono font-black text-xs
                               flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]
                               hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                  >
                    SEND <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
