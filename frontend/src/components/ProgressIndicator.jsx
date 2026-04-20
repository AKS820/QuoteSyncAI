import { Check } from 'lucide-react';

export default function ProgressIndicator({ currentStage, visitedStages, labels }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090E]/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-ibm-blue rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">QuoteSync AI</span>
        </a>

        {/* Stage pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {labels.map((label, i) => {
            const isActive = currentStage === i;
            const isVisited = visitedStages.has(i) && i < currentStage;
            return (
              <a
                key={i}
                href={`#stage-${i}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-ibm-blue text-white'
                    : isVisited
                    ? 'text-muted hover:text-white'
                    : 'text-border-bright hover:text-muted'
                }`}
              >
                {isVisited && !isActive ? (
                  <Check size={10} className="text-success shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${isActive ? 'bg-white/20' : 'bg-surface-3'}`}>
                    {i}
                  </span>
                )}
                <span className="hidden md:block">{label}</span>
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <a
          href="#stage-6"
          className="shrink-0 hidden sm:block bg-ibm-blue hover:bg-ibm-blue-hover text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
