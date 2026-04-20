import { useState, useEffect, useRef } from 'react';
import { useEventTracking } from './useEventTracking.js';

export function useScrollStage(totalStages = 7) {
  const [currentStage, setCurrentStage] = useState(0);
  const [visitedStages, setVisitedStages] = useState(new Set([0]));
  const { trackEvent } = useEventTracking();
  const lastTracked = useRef(new Set([0]));

  useEffect(() => {
    const sections = document.querySelectorAll('[data-stage]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const stage = parseInt(entry.target.dataset.stage, 10);
            setCurrentStage(stage);
            setVisitedStages(prev => new Set([...prev, stage]));

            if (!lastTracked.current.has(stage)) {
              lastTracked.current.add(stage);
              trackEvent('page_view', { stage: String(stage) });
            }
          }
        });
      },
      { threshold: 0.25, rootMargin: '-10% 0px -10% 0px' }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [trackEvent]);

  return { currentStage, visitedStages };
}
