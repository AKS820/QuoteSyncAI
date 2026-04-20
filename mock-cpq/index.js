const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// CPQ quotes intentionally contain stale prices that don't match SAP
let quotes = [
  {
    quote_id: 'Q-2847', customer: 'Midwest Machining Co.', owner: 'Sarah Chen',
    created_at: '2026-04-10', expires_at: '2026-05-10', status: 'Draft',
    line_items: [
      { part_number: 'MFG-4421', description: 'Servo Motor 400W 3000RPM', qty: 4, unit_price: 847.00, total: 3388.00 },
      { part_number: 'MFG-3301', description: 'Steel Gear Module 2.0 — 30T', qty: 2, unit_price: 612.00, total: 1224.00 },
    ],
    total: 4612.00, currency: 'USD', mismatch: true
  },
  {
    quote_id: 'Q-2848', customer: 'Great Lakes Fabrication', owner: 'Mike Torres',
    created_at: '2026-04-11', expires_at: '2026-05-11', status: 'Sent',
    line_items: [
      { part_number: 'MFG-1001', description: 'CNC Precision Shaft 12mm', qty: 10, unit_price: 284.00, total: 2840.00 },
      { part_number: 'MFG-6003', description: 'Linear Guide Rail 500mm', qty: 6, unit_price: 218.00, total: 1308.00 },
    ],
    total: 4148.00, currency: 'USD', mismatch: false
  },
  {
    quote_id: 'Q-2849', customer: 'Pinnacle Industrial Supply', owner: 'Jess Park',
    created_at: '2026-04-12', expires_at: '2026-05-12', status: 'Draft',
    line_items: [
      { part_number: 'MFG-4502', description: 'Variable Frequency Drive 2.2kW', qty: 2, unit_price: 1148.00, total: 2296.00 },
      { part_number: 'MFG-8340', description: 'Safety Relay Module Dual-Channel', qty: 5, unit_price: 289.00, total: 1445.00 },
    ],
    total: 3741.00, currency: 'USD', mismatch: false
  },
  {
    quote_id: 'Q-2850', customer: 'Atlas Components LLC', owner: 'Dan Kowalski',
    created_at: '2026-04-13', expires_at: '2026-05-13', status: 'Negotiating',
    line_items: [
      { part_number: 'MFG-5001', description: 'Stainless Steel Valve DN50', qty: 8, unit_price: 342.80, total: 2742.40 },
      { part_number: 'MFG-5120', description: 'Pressure Transmitter 0-10 bar', qty: 3, unit_price: 487.50, total: 1462.50 },
    ],
    total: 4204.90, currency: 'USD', mismatch: false
  },
  {
    quote_id: 'Q-2851', customer: 'Lake Shore Industries', owner: 'Amy Walsh',
    created_at: '2026-04-14', expires_at: '2026-05-14', status: 'Draft',
    line_items: [
      { part_number: 'MFG-7832', description: 'Encoder Incremental 1000PPR', qty: 3, unit_price: 1240.00, total: 3720.00 },
      { part_number: 'MFG-6210', description: 'Ball Screw Assembly 16mm Pitch', qty: 2, unit_price: 895.00, total: 1790.00 },
    ],
    total: 5510.00, currency: 'USD', mismatch: true
  },
  {
    quote_id: 'Q-2852', customer: 'Summit Metal Works', owner: 'Carlos Rivera',
    created_at: '2026-04-15', expires_at: '2026-05-15', status: 'Sent',
    line_items: [
      { part_number: 'MFG-2210', description: 'Pneumatic Actuator 50N', qty: 6, unit_price: 437.00, total: 2622.00 },
      { part_number: 'MFG-2109', description: 'Hydraulic Seal Kit Type-B', qty: 12, unit_price: 98.75, total: 1185.00 },
    ],
    total: 3807.00, currency: 'USD', mismatch: false
  },
  {
    quote_id: 'Q-2853', customer: 'Redstone Automation Inc.', owner: 'Sarah Chen',
    created_at: '2026-04-16', expires_at: '2026-05-16', status: 'Draft',
    line_items: [
      { part_number: 'MFG-1042', description: 'Industrial Bearing Assembly 40mm', qty: 20, unit_price: 156.50, total: 3130.00 },
      { part_number: 'MFG-8001', description: 'Control Cabinet IP65 600x400', qty: 1, unit_price: 524.00, total: 524.00 },
    ],
    total: 3654.00, currency: 'USD', mismatch: false
  },
  {
    quote_id: 'Q-2854', customer: 'Apex Precision Tooling', owner: 'Mike Torres',
    created_at: '2026-04-17', expires_at: '2026-05-17', status: 'Negotiating',
    line_items: [
      { part_number: 'MFG-9001', description: 'Conveyor Belt 2m PVC', qty: 4, unit_price: 168.00, total: 672.00 },
      { part_number: 'MFG-9210', description: 'Proximity Sensor Inductive M12', qty: 15, unit_price: 84.90, total: 1273.50 },
    ],
    total: 1945.50, currency: 'USD', mismatch: false
  },
  {
    quote_id: 'Q-2855', customer: 'Central Valley MFG', owner: 'Jess Park',
    created_at: '2026-04-18', expires_at: '2026-05-18', status: 'Draft',
    line_items: [
      { part_number: 'MFG-3450', description: 'Aluminum Extrusion Profile 2040', qty: 50, unit_price: 74.20, total: 3710.00 },
    ],
    total: 3710.00, currency: 'USD', mismatch: false
  },
  {
    quote_id: 'Q-2863', customer: 'Precision Metalworks Group', owner: 'Dan Kowalski',
    created_at: '2026-04-19', expires_at: '2026-05-19', status: 'Draft',
    line_items: [
      { part_number: 'MFG-2209', description: 'Compression Spring D22 L80', qty: 8, unit_price: 456.00, total: 3648.00 },
      { part_number: 'MFG-7001', description: 'Coupling Rigid Type-D 25mm', qty: 10, unit_price: 67.40, total: 674.00 },
    ],
    total: 4322.00, currency: 'USD', mismatch: true
  },
];

const syncJobs = {};

app.get('/api/cpq/quotes', (_req, res) => {
  res.json({ quotes, total: quotes.length, source: 'Salesforce CPQ', as_of: new Date().toISOString() });
});

app.post('/api/cpq/sync', (req, res) => {
  const job_id = `SYNC-${Date.now()}`;
  const mismatches = quotes.filter(q => q.mismatch);

  syncJobs[job_id] = { status: 'running', started_at: new Date().toISOString(), updated_quotes: [], job_id };

  // Apply corrections after 2s (simulate async processing)
  setTimeout(() => {
    const corrections = [
      { quote_id: 'Q-2847', part_number: 'MFG-4421', old_price: 847.00, new_price: 923.00 },
      { quote_id: 'Q-2851', part_number: 'MFG-7832', old_price: 1240.00, new_price: 1380.00 },
      { quote_id: 'Q-2863', part_number: 'MFG-2209', old_price: 456.00, new_price: 512.00 },
    ];

    corrections.forEach(c => {
      const quote = quotes.find(q => q.quote_id === c.quote_id);
      if (quote) {
        const item = quote.line_items.find(li => li.part_number === c.part_number);
        if (item) {
          item.unit_price = c.new_price;
          item.total = parseFloat((item.qty * c.new_price).toFixed(2));
        }
        quote.total = parseFloat(quote.line_items.reduce((s, li) => s + li.total, 0).toFixed(2));
        quote.mismatch = false;
      }
    });

    syncJobs[job_id] = {
      status: 'complete',
      started_at: syncJobs[job_id].started_at,
      completed_at: new Date().toISOString(),
      job_id,
      quotes_scanned: quotes.length,
      mismatches_found: mismatches.length,
      quotes_updated: corrections.length,
      errors: 0,
      updated_quotes: corrections
    };
  }, 2000);

  res.json({ job_id, status: 'running', message: 'Sync job started' });
});

app.get('/api/cpq/sync/:job_id', (req, res) => {
  const job = syncJobs[req.params.job_id];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'mock-cpq' }));

app.listen(PORT, () => console.log(`Mock CPQ running on port ${PORT}`));
