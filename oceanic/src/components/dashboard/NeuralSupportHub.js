"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Webhook,
  Loader2
} from "lucide-react";

export const NeuralSupportHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Senior Officer online. How can I assist with situational maritime intelligence?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, context: "Maritime Support Inquiry" })
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.insight || "Neural link stable. Inquiry acknowledged." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Communication blackout. Neural link lost." }]);
    } finally {
      setLoading(false);
    }
  };

  const dispatchWebhook = async () => {
    const lastMsg = messages[messages.length - 1];
    try {
      await fetch("/api/ai/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          event: "SUPPORT_DISPATCH",
          query: lastMsg.text,
          timestamp: new Date().toISOString()
        })
      });
      alert("Situational Dispatch Success: Intelligence dispatched to command webhook.");
    } catch (err) {
      alert("Dispatch Failure: Neural sync error.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 p-5 bg-blue-600 rounded-[28px] shadow-3xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all z-[100] group"
      >
        <MessageSquare className="w-8 h-8 text-white" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#0a1016] animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-32 right-10 w-[420px] h-[600px] bg-[#0f172a]/95 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-5xl z-[100] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-blue-600/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-operational text-white uppercase italic leading-none">Neural Support</h3>
                  <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">Officer Llama-3.3 // Alpha</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div 
              ref={scrollRef}
              className="flex-grow p-8 overflow-y-auto space-y-6 no-scrollbar"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-[24px] text-[13px] font-bold leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-full flex gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 space-y-4">
              <div className="flex gap-2">
                <button 
                  onClick={dispatchWebhook}
                  className="p-4 glass-premium rounded-2xl border border-white/10 text-blue-400 hover:bg-white/5"
                  title="Dispatch to Webhook"
                >
                  <Webhook size={20} />
                </button>
                <div className="relative flex-grow">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Situational inquiry..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-12 text-[12px] font-bold text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-white/20"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-white transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Sync Secured // 256-bit AES</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
