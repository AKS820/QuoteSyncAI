import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, ChevronRight, ExternalLink } from 'lucide-react';
import { useEventTracking } from '../hooks/useEventTracking.js';

const AGENT_URL = 'https://dl.watson-orchestrate.ibm.com';

function DropZone({ onFile, file, onClear }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }, [onFile]);

  if (file) {
    return (
      <div className="flex items-center gap-3 border border-ibm-blue/40 bg-ibm-blue/5 px-4 py-3">
        <FileText size={16} className="text-ibm-blue shrink-0" />
        <span className="text-sm font-light text-white flex-1 truncate">{file.name}</span>
        <button onClick={onClear} className="text-muted hover:text-white transition-colors shrink-0">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
        dragging ? 'border-ibm-blue bg-ibm-blue/5' : 'border-border hover:border-ibm-blue/40'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.html"
        className="hidden"
        onChange={e => e.target.files[0] && onFile(e.target.files[0])}
      />
      <Upload size={20} className="text-muted mx-auto mb-3" />
      <p className="text-sm text-white font-light mb-1">Drop your quote PDF here</p>
      <p className="text-xs text-dim font-light">or click to browse</p>
    </div>
  );
}

export default function QuoteDemoSection() {
  const [file, setFile] = useState(null);
  const { trackEvent }  = useEventTracking();

  function reset() { setFile(null); }

  function handleUseSample() {
    trackEvent('demo_sample_download');
    window.open('/sample_quote.html', '_blank');
  }

  function openAgent() {
    trackEvent('demo_agent_open', { source: file ? 'upload' : 'direct' });
    window.open(AGENT_URL, '_blank');
  }

  return (
    <section className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-8 py-16">

        <div className="mb-10">
          <div className="text-[10px] tracking-label text-ibm-blue font-semibold uppercase mb-3">Live Demo</div>
          <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
            See the agents process a real quote.
          </h2>
          <p className="text-sm text-muted font-light max-w-lg">
            Download the sample quote, then paste it into the agent — or type your own details directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left — file / sample */}
          <div>
            <div className="text-[10px] tracking-label text-muted font-semibold uppercase mb-3">Step 1 — Get a quote</div>

            <DropZone file={file} onFile={setFile} onClear={reset} />

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-dim font-light">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={handleUseSample}
              className="w-full flex items-center justify-between border border-border hover:border-ibm-blue/40 px-4 py-3 text-sm text-muted hover:text-white transition-colors font-light"
            >
              <span className="flex items-center gap-2">
                <FileText size={14} className="shrink-0" />
                Download sample quote (5 lines, 3 scenarios)
              </span>
              <ChevronRight size={14} className="shrink-0" />
            </button>

            <p className="text-[10px] text-dim font-light mt-3 leading-relaxed">
              Tests stale pricing (auto-corrected), correct pricing (approved), and an MOQ violation (held + escalated).
            </p>
          </div>

          {/* Right — open agent */}
          <div>
            <div className="text-[10px] tracking-label text-muted font-semibold uppercase mb-3">Step 2 — Run the agents</div>

            <div className="border border-border px-6 py-8 flex flex-col gap-5">
              <div className="space-y-3">
                {[
                  'Customer Verification',
                  'Part Validation',
                  'Pricing & MOQ Analysis',
                  'Order Processing',
                ].map((label, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-4 h-4 border border-border flex items-center justify-center text-[9px] font-mono text-dim shrink-0">{i + 1}</span>
                    <span className="text-sm text-dim font-light">{label}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted font-light leading-relaxed">
                Open the agent and paste your quote details — or type them directly. The workflow runs automatically.
              </p>

              <button
                onClick={openAgent}
                className="flex items-center justify-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-[#ffffff] font-semibold px-6 py-3.5 transition-colors text-sm"
              >
                <ExternalLink size={14} className="shrink-0" />
                Open live agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
