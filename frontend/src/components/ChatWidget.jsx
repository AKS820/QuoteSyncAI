import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, ChevronDown, Loader } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const WELCOME = "Hi! I'm Quinn, your QuoteGuard assistant. Ask me anything about how this works, pricing, or whether it's right for your team.";
const QUICK_QUESTIONS = [
  'How long does setup take?',
  'What systems do you support?',
  'How much does it cost?',
  'What if a detection run fails?',
];

function BubbleTyping() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center shrink-0">
        <Bot size={12} className="text-white" />
      </div>
      <div className="bg-surface border border-border px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-muted rounded-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center shrink-0">
          <Bot size={12} className="text-white" />
        </div>
      )}
      <div className={`max-w-[85%] px-4 py-2.5 text-sm font-light leading-relaxed ${
        isUser
          ? 'bg-ibm-blue text-white'
          : 'bg-surface border border-border text-white'
      }`}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');
    const nextMessages = [...messages, { role: 'user', content: userText }];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      const reply = data.reply || "I'm having trouble connecting right now. Try again in a moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm temporarily offline. Scroll down to see pricing and setup details directly on the page." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] max-h-[560px] bg-surface-2 border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-7 h-7 bg-ibm-blue flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success border border-surface-2 rounded-full" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">Quinn</div>
                  <div className="text-[10px] text-muted font-light">QuoteGuard Assistant</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-white transition-colors p-1">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide min-h-0">
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {loading && <BubbleTyping />}
              <div ref={endRef} />
            </div>

            {/* Quick questions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-muted font-light mb-2">Common questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-2.5 py-1.5 border border-border hover:border-ibm-blue/40 text-muted hover:text-white transition-colors font-light"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 bg-surface border border-border px-3 py-2 focus-within:border-ibm-blue transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask Quinn anything..."
                  className="flex-1 bg-transparent text-sm font-light outline-none placeholder-muted"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-6 h-6 bg-ibm-blue hover:bg-ibm-blue-hover disabled:opacity-30 flex items-center justify-center transition-colors shrink-0"
                >
                  {loading ? <Loader size={11} className="animate-spin text-white" /> : <Send size={11} className="text-white" />}
                </button>
              </div>
              <p className="text-center text-[10px] text-dim font-light mt-2">Powered by Claude · QuoteGuard</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-12 h-12 bg-ibm-blue hover:bg-ibm-blue-hover flex items-center justify-center transition-colors"
        aria-label="Chat with Quinn"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown size={20} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-danger flex items-center justify-center text-white text-[9px] font-bold"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
