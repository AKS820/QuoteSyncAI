import { useScrollStage } from '../hooks/useScrollStage.js';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import StickyCTA from '../components/StickyCTA.jsx';
import Hero from '../components/Hero.jsx';
import VideoGallery from '../components/VideoGallery.jsx';
import DiscoveryFlow from '../components/DiscoveryFlow.jsx';
import DemoEnvironment from '../components/DemoEnvironment.jsx';
import ImplementationGuide from '../components/ImplementationGuide.jsx';
import ROICalculator from '../components/ROICalculator.jsx';
import PricingSection from '../components/PricingSection.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

const STAGE_LABELS = [
  'Overview',
  'How It Works',
  'Your Fit',
  'Live Demo',
  'Setup Guide',
  'ROI Calculator',
  'Pricing',
];

export default function Landing() {
  const { currentStage, visitedStages } = useScrollStage(7);

  return (
    <div className="min-h-screen bg-[#09090E]">
      <ProgressIndicator
        currentStage={currentStage}
        visitedStages={visitedStages}
        labels={STAGE_LABELS}
      />

      <StickyCTA currentStage={currentStage} />

      <section id="stage-0" data-stage="0">
        <Hero />
      </section>

      <section id="stage-1" data-stage="1">
        <VideoGallery />
      </section>

      <section id="stage-2" data-stage="2">
        <DiscoveryFlow />
      </section>

      <section id="stage-3" data-stage="3">
        <DemoEnvironment />
      </section>

      <section id="stage-4" data-stage="4">
        <ImplementationGuide />
      </section>

      <section id="stage-5" data-stage="5">
        <ROICalculator />
      </section>

      <section id="stage-6" data-stage="6">
        <PricingSection />
      </section>

      <ChatWidget />
    </div>
  );
}
