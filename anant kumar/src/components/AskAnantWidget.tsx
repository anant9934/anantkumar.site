import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { Bot, Volume2, X, ChevronRight, MessageSquareTerminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AskAnantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat({
    api: '/api/ask-anant',
    initialMessages: [],
  });

  // Inject pixel font dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleExampleClick = (text: string) => {
    setInput(text);
  };

  return (
    <>
      {/* Floating Trigger Button (Moved up slightly to avoid footer overlap) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-black text-white p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
      >
        <MessageSquareTerminal size={32} />
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            style={{
              backgroundColor: '#f4f4f4',
              backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl bg-white border-[10px] border-black flex flex-col max-h-[90vh] shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b-[3px] border-black">
                <span className="font-mono font-bold tracking-widest text-sm md:text-base">// ASK ABOUT ME</span>
                <div className="flex gap-2">
                  <button className="p-2 border-[3px] border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                    <Bot size={20} />
                  </button>
                  <button className="p-2 border-[3px] border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                    <Volume2 size={20} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 ml-4 border-[3px] border-black hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-10 flex-1 overflow-y-auto font-mono flex flex-col gap-8 bg-[#fdfdfd]">
                
                {messages.length === 0 ? (
                  <div className="mt-4 mb-4">
                    <h2 
                      style={{ fontFamily: "'Press Start 2P', cursive", lineHeight: '1.4' }} 
                      className="text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter"
                    >
                      Ask Anything<br/>About Me.
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl mt-8 font-mono">
                      I'll answer anything you want to know about my skills, experience, projects, or anything else!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className="text-xs font-bold mb-2 tracking-widest uppercase opacity-60">
                          {m.role === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <div className={`p-4 md:p-5 border-[3px] border-black max-w-[85%] text-sm md:text-base leading-relaxed ${
                          m.role === 'user' 
                            ? 'bg-black text-white' 
                            : 'bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold mb-2 tracking-widest uppercase opacity-60">AI Assistant</span>
                        <div className="p-4 border-[3px] border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                          <span className="animate-pulse">Typing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* Input Area */}
                <div className="mt-auto pt-6 border-t-[3px] border-black border-dashed">
                  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type your question..."
                      className="flex-1 p-4 md:p-5 border-[3px] border-black font-mono focus:outline-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[6px] focus:translate-y-[6px] transition-all bg-white"
                    />
                    <button 
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="px-8 py-4 md:py-5 bg-black text-white border-[3px] border-black font-mono font-bold tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 disabled:opacity-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]"
                    >
                      SEND <ChevronRight size={20} strokeWidth={3} />
                    </button>
                  </form>
                </div>

                {/* Examples */}
                {messages.length === 0 && (
                  <div className="mt-6">
                    <span className="font-bold text-sm tracking-widest uppercase block mb-4">EXAMPLES</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "What are your skills?",
                        "What projects have you built?",
                        "Tell me about your experience",
                        "What are your hobbies?"
                      ].map((example, i) => (
                        <button
                          key={i}
                          onClick={() => handleExampleClick(example)}
                          className="p-4 text-left border-[3px] border-black font-mono text-sm font-bold tracking-tight bg-white hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
