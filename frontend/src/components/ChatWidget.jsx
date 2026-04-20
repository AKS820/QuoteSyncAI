import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, ChevronDown, Loader } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const WELCOME = "Hi! I'm Quinn, your QuoteSync AI assistant. Ask me anything about how this works, pricing, or whether it's right for your team.";

const QUICK_QUESTIONS = [
  'How long does setup take?',
  'What systems do you support?',
  'How much does it cost?',
  'What if a sync fails?',
];

function BubbleTyping() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-7 h-7 bg-ibm-blue rounded-full flex items-center justify-center shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-surface-2 border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-muted rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 bg-ibm-blue rounded-full flex items-center justify-center shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-ibm-blue text-white rounded-br-sm'
          : 'bg-surface-2 border border-border text-white rounded-bl-sm'
      }`}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME }
  ]);
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

    const userMsg = { role: 'user', content: userText };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      const reply = data.reply || "I'm having trouble connecting right now. Try asking me again in a moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm temporarily offline. Check back in a moment — or scroll down to see pricing and setup details directly on the page." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] max-h-[560px] bg-[#111118] border border-border rounded-2xl shadow-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-surface">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 bg-ibm-blue rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success border-2 border-[#111118] rounded-full" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">Quinn</div>
                  <div className="text-xs text-muted">QuoteSync AI Assistant</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide min-h-0">
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {loading && <BubbleTyping />}
              <div ref={endRef} />
            </div>

            {/* Quick questions (show when only welcome message) */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted mb-2">Common questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-2.5 py-1.5 bg-surface-2 border border-border hover:border-ibm-blue/40 rounded-lg text-muted hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-3 py-2 focus-within:border-ibm-blue transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask Quinn anything..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder-muted"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 bg-ibm-blue hover:bg-ibm-blue-hover disabled:opacity-30 rounded-lg flex items-center justify-center transition-all shrink-0"
                >
                  {loading ? <Loader size={12} className="animate-spin text-white" /> : <Send size={12} className="text-white" />}
                </button>
              </div>
              <p className="text-center text-xs text-muted mt-2 opacity-60">Powered by Claude · QuoteSync AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-4 sm:right-6 z-50 w-13 h-13 bg-ibm-blue hover:bg-ibm-blue-hover rounded-full shadow-glow-blue flex items-center justify-center transition-colors"
        style={{ width: 52, height: 52 }}
        aria-label="Chat with Quinn"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <ChevronDown size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare size={22} className="text-white fill-white/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
