import { Check } from 'lucide-react';

export default function ProgressIndicator({ currentStage, visitedStages, labels = [] }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-2/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-11 flex items-center">

        {/* Logo — fixed width so dots stay centered */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 w-36">
          <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center">
            <span className="text-white font-bold text-xs">Q</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">QuoteGuard</span>
        </a>

        {/* Stage dots — centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            {labels.map((label, i) => {
              const isActive = currentStage === i;
              const isVisited = visitedStages.has(i) && i < currentStage;
              return (
                <a
                  key={i}
                  href={`#stage-${i}`}
                  className={`flex items-center gap-1.5 px-3 h-11 text-[11px] font-medium transition-colors whitespace-nowrap border-r border-border first:border-l ${
                    isActive
                      ? 'text-white bg-ibm-blue/10'
                      : isVisited
                      ? 'text-muted hover:text-white'
                      : 'text-dim hover:text-muted'
                  }`}
                >
                  {isVisited && !isActive ? (
                    <Check size={9} className="text-success shrink-0" />
                  ) : (
                    <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-ibm-blue' : 'bg-dim'}`} />
                  )}
                  <span className="hidden md:block">{label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* CTA — fixed width matching logo */}
        <div className="shrink-0 w-36 flex justify-end">
          <a
            href="#stage-4"
            className="hidden sm:block bg-ibm-blue hover:bg-ibm-blue-hover text-white text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            Get Started
          </a>
        </div>

      </div>
    </nav>
  );
}
