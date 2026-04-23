import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const STAGE_IDS = ['hero', 'why', 'what', 'win-story'];

export default function ProgressIndicator({ currentStage, visitedStages, labels = [] }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-2/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-11 flex items-center gap-0">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 mr-6">
          <div className="w-6 h-6 bg-ibm-blue flex items-center justify-center">
            <span className="text-white font-bold text-xs">Q</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">QuoteGuard</span>
        </a>

        {/* Divider */}
        <div className="h-4 w-px bg-border shrink-0" />

        {/* Product tabs */}
        <div className="h-11 flex items-center px-4 text-xs text-white font-medium border-b-2 border-ibm-blue">
          Overview
        </div>
        <Link
          to="/pricing"
          className="h-11 flex items-center px-4 text-xs text-muted hover:text-white transition-colors border-b-2 border-transparent"
        >
          Pricing
        </Link>

        {/* Divider */}
        <div className="h-4 w-px bg-border shrink-0 mx-2" />

        {/* Scroll stage dots */}
        <div className="hidden md:flex items-center flex-1">
          {labels.map((label, i) => {
            const isActive = currentStage === i;
            const isVisited = visitedStages.has(i) && i < currentStage;
            return (
              <a
                key={i}
                href={`#${STAGE_IDS[i] ?? `stage-${i}`}`}
                className={`flex items-center gap-1.5 px-2.5 h-11 text-[11px] transition-colors whitespace-nowrap ${
                  isActive ? 'text-white' : isVisited ? 'text-muted hover:text-white' : 'text-dim hover:text-muted'
                }`}
              >
                {isVisited && !isActive ? (
                  <Check size={9} className="text-success shrink-0" />
                ) : (
                  <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-ibm-blue' : 'bg-dim'}`} />
                )}
                <span>{label}</span>
              </a>
            );
          })}
        </div>

        {/* Trial CTA */}
        <a
          href={import.meta.env.VITE_IBM_TRIAL_URL || 'https://www.ibm.com/account/reg/us-en/signup?formid=urx-52753'}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 bg-ibm-blue hover:bg-ibm-blue-hover text-white text-xs font-semibold px-3 py-1.5 transition-colors shrink-0"
        >
          Start free trial
        </a>

      </div>
    </nav>
  );
}
