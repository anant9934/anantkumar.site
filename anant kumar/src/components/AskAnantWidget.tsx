import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { Bot, Volume2, X, ChevronRight, SquareTerminal } from 'lucide-react';
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
    // Note: To automatically submit, we'd need to mock an event or use append() from useChat
    // For now, we'll just populate the input field to let the user hit send
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
      >
        <SquareTerminal size={32} />
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b-4 border-black">
                <span className="font-mono font-bold tracking-widest">// ASK ABOUT ME</span>
                <div className="flex gap-2">
                  <button className="p-2 border-4 border-black hover:bg-black hover:text-white transition-colors">
                    <Bot size={20} />
                  </button>
                  <button className="p-2 border-4 border-black hover:bg-black hover:text-white transition-colors">
                    <Volume2 size={20} />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 border-4 border-black bg-red-500 text-white hover:bg-red-600 transition-colors ml-4"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto font-mono flex flex-col gap-6">
                
                {messages.length === 0 ? (
                  <>
                    <h2 
                      style={{ fontFamily: "'Press Start 2P', cursive", lineHeight: '1.5' }} 
                      className="text-3xl md:text-5xl uppercase"
                    >
                      Ask Anything About Me.
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg">
                      I'll answer anything you want to know about my skills, experience, projects, or anything else!
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className="text-xs font-bold mb-1 opacity-50 uppercase">
                          {m.role === 'user' ? 'You' : 'Ask Anant AI'}
                        </span>
                        <div className={`p-4 border-4 border-black max-w-[85%] ${
                          m.role === 'user' 
                            ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' 
                            : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold mb-1 opacity-50 uppercase">Ask Anant AI</span>
                        <div className="p-4 border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <span className="animate-pulse">Thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* Input Area */}
                <div className="mt-auto pt-6">
                  <form onSubmit={handleSubmit} className="flex gap-0">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type your question..."
                      className="flex-1 p-4 border-4 border-black border-r-0 font-mono focus:outline-none focus:bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <button 
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="px-6 py-4 bg-black text-white border-4 border-black font-mono font-bold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    >
                      SEND <ChevronRight size={20} />
                    </button>
                  </form>
                </div>

                {/* Examples */}
                {messages.length === 0 && (
                  <div className="mt-8">
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
                          className="p-3 text-left border-4 border-black font-mono text-sm hover:bg-black hover:text-white hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
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
