import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function StickyCTA({ currentStage }) {
  const visible = currentStage > 0 && currentStage < 3;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <a
            href="#stage-3"
            className="pointer-events-auto flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-white font-semibold px-5 py-3 rounded-full shadow-glow-blue transition-all hover:scale-105 active:scale-95"
          >
            <Zap size={16} className="fill-white" />
            Jump to Live Demo
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
