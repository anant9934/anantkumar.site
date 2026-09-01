import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { X, ChevronRight, RotateCcw, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DefaultChatTransport } from 'ai';

export const AskAnantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/ask-anant' }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  const handleExampleClick = (text: string) => {
    sendMessage({ text });
    setInput('');
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <>
      {/* ── Floating Avatar Pill Trigger ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, y: 24, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open Ask Anant AI Chat"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black text-white border-[3px] border-black px-4 py-2.5 cursor-pointer
                       shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
                       hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 select-none group rounded-none"
          >
            {/* Avatar container with glowing border */}
            <div className="relative w-10 h-10 rounded-full bg-zinc-900 border-2 border-yellow-400 overflow-hidden shrink-0 flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.6)]">
              <img
                src="/ai-avatar.png"
                alt="Anant AI"
                className="w-full h-full object-cover object-center scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.png';
                }}
              />
            </div>

            {/* Label */}
            <div className="flex flex-col leading-tight text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-xs tracking-wider uppercase text-white">Ask Anant</span>
                <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
              </div>
              <span className="font-mono text-[10px] text-zinc-400 tracking-wide">AI · Ask me anything</span>
            </div>

            {/* Live Green Online Dot */}
            <span className="relative flex h-2.5 w-2.5 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Modal Dialog ───────────────────────────────────────────────── */}
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
              className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[440px] max-h-[85vh] sm:max-h-[660px] h-[600px]
                         bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
                         flex flex-col overflow-hidden font-mono"
            >
              {/* Top Branded Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-black bg-black text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-zinc-900 border-2 border-yellow-400 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(250,204,21,0.5)]">
                    <img
                      src="/ai-avatar.png"
                      alt="Anant AI"
                      className="w-full h-full object-cover object-center scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/favicon.png';
                      }}
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs tracking-wider uppercase text-white">ASK ANANT AI</span>
                      <span className="text-[9px] bg-yellow-400 text-black font-black px-1 py-0.2 rounded-none">v2.0</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 tracking-wide flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Online · Ready to answer
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button
                      onClick={handleReset}
                      title="Clear chat"
                      className="p-1.5 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700 transition-colors"
                      aria-label="Clear chat"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 border-2 border-white/20 hover:bg-red-500 hover:border-red-500 transition-colors text-white"
                    aria-label="Close chat"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Messages Body Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0 bg-[#fafafa]">
                {messages.length === 0 ? (
                  <div className="flex flex-col gap-4 pt-2">
                    {/* Welcome Card */}
                    <div className="border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-black uppercase tracking-wider text-black">Interactive AI Assistant</span>
                      </div>
                      <p className="font-black text-xl leading-tight tracking-tight mb-2 text-black">
                        Ask Anything About Anant.
                      </p>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        I have full knowledge of Anant's AI/ML engineering work, startups (MangalKit, Study LPU, GeoJeevan AI), research patents, experience, and certifications.
                      </p>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 block mb-2">
                        Suggested questions:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Who is Anant Kumar?',
                          'What are his flagship projects?',
                          'What are his key AI & engineering skills?',
                          'Tell me about his patents & research',
                          'How can I get in touch to hire him?',
                        ].map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleExampleClick(prompt)}
                            className="text-left px-3 py-2.5 border-[2px] border-black text-xs font-bold bg-white text-black
                                       hover:bg-black hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                                       hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-between group"
                          >
                            <span>{prompt}</span>
                            <ChevronRight size={14} className="text-zinc-400 group-hover:text-white transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {messages.map((m) => {
                      let text = '';
                      if (m.parts && Array.isArray(m.parts)) {
                        text = (m.parts as Array<{ type: string; text?: string }>)
                          .filter((p) => p.type === 'text')
                          .map((p) => p.text ?? '')
                          .join('');
                      } else if ((m as unknown as { content?: string }).content) {
                        text = (m as unknown as { content: string }).content;
                      }

                      const isUser = m.role === 'user';

                      return (
                        <div key={m.id} className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase opacity-50 px-1">
                            {!isUser && <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400"></span>}
                            <span>{isUser ? 'You' : 'Anant AI'}</span>
                          </div>
                          <div
                            className={`px-3.5 py-2.5 border-[2px] border-black max-w-[88%] text-xs leading-relaxed whitespace-pre-wrap ${
                              isUser
                                ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]'
                                : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                          >
                            {text}
                          </div>
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-50 px-1">Anant AI</span>
                        <div className="px-4 py-3 border-[2px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-600">Thinking</span>
                          <div className="flex gap-1 items-center ml-1">
                            {[0, 1, 2].map((i) => (
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

                    {error && (
                      <div className="p-3 border-[2px] border-red-600 bg-red-50 text-red-700 text-xs font-bold">
                        Failed to get a response. Please check your connection and try again.
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Bottom Input Area */}
              <div className="border-t-[3px] border-black p-3 bg-white shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2.5 border-[2px] border-black text-xs font-bold focus:outline-none
                               shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-none
                               focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2.5 bg-black text-white border-[2px] border-black font-black text-xs
                               flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]
                               hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                  >
                    <span>SEND</span>
                    <Send size={12} strokeWidth={2.5} />
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
