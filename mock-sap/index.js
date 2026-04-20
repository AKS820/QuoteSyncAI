const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const PRODUCTS = [
  { part_number: 'MFG-1001', description: 'CNC Precision Shaft 12mm', category: 'Mechanical', list_price: 284.00, last_updated: '2026-04-15' },
  { part_number: 'MFG-1042', description: 'Industrial Bearing Assembly 40mm', category: 'Mechanical', list_price: 156.50, last_updated: '2026-04-12' },
  { part_number: 'MFG-2109', description: 'Hydraulic Seal Kit Type-B', category: 'Hydraulics', list_price: 98.75, last_updated: '2026-04-18' },
  { part_number: 'MFG-2210', description: 'Pneumatic Actuator 50N', category: 'Pneumatics', list_price: 437.00, last_updated: '2026-04-10' },
  { part_number: 'MFG-3301', description: 'Steel Gear Module 2.0 — 30T', category: 'Mechanical', list_price: 612.00, last_updated: '2026-04-14' },
  { part_number: 'MFG-3450', description: 'Aluminum Extrusion Profile 2040', category: 'Structural', list_price: 74.20, last_updated: '2026-04-16' },
  { part_number: 'MFG-4421', description: 'Servo Motor 400W 3000RPM', category: 'Electrical', list_price: 923.00, last_updated: '2026-04-19' },
  { part_number: 'MFG-4502', description: 'Variable Frequency Drive 2.2kW', category: 'Electrical', list_price: 1148.00, last_updated: '2026-04-17' },
  { part_number: 'MFG-5001', description: 'Stainless Steel Valve DN50', category: 'Fluid Control', list_price: 342.80, last_updated: '2026-04-13' },
  { part_number: 'MFG-5120', description: 'Pressure Transmitter 0-10 bar', category: 'Instrumentation', list_price: 487.50, last_updated: '2026-04-11' },
  { part_number: 'MFG-6003', description: 'Linear Guide Rail 500mm', category: 'Motion', list_price: 218.00, last_updated: '2026-04-15' },
  { part_number: 'MFG-6210', description: 'Ball Screw Assembly 16mm Pitch', category: 'Motion', list_price: 895.00, last_updated: '2026-04-18' },
  { part_number: 'MFG-7001', description: 'Coupling Rigid Type-D 25mm', category: 'Mechanical', list_price: 67.40, last_updated: '2026-04-12' },
  { part_number: 'MFG-7832', description: 'Encoder Incremental 1000PPR', category: 'Electrical', list_price: 1380.00, last_updated: '2026-04-19' },
  { part_number: 'MFG-8001', description: 'Control Cabinet IP65 600x400', category: 'Enclosure', list_price: 524.00, last_updated: '2026-04-10' },
  { part_number: 'MFG-8340', description: 'Safety Relay Module Dual-Channel', category: 'Safety', list_price: 289.00, last_updated: '2026-04-14' },
  { part_number: 'MFG-9001', description: 'Conveyor Belt 2m PVC', category: 'Material Handling', list_price: 168.00, last_updated: '2026-04-16' },
  { part_number: 'MFG-9210', description: 'Proximity Sensor Inductive M12', category: 'Instrumentation', list_price: 84.90, last_updated: '2026-04-17' },
  { part_number: 'MFG-2209', description: 'Compression Spring D22 L80', category: 'Mechanical', list_price: 512.00, last_updated: '2026-04-19' },
  { part_number: 'MFG-0055', description: 'Lubricant Synthetic ISO 46 5L', category: 'Consumables', list_price: 48.30, last_updated: '2026-04-15' },
];

let priceList = PRODUCTS.map(p => ({ part_number: p.part_number, list_price: p.list_price }));

app.get('/api/sap/products', (_req, res) => {
  const withCurrentPrices = PRODUCTS.map(p => {
    const current = priceList.find(pl => pl.part_number === p.part_number);
    return { ...p, list_price: current ? current.list_price : p.list_price };
  });
  res.json({ products: withCurrentPrices, total: withCurrentPrices.length, source: 'SAP S/4HANA', as_of: new Date().toISOString() });
});

app.get('/api/sap/price-list', (_req, res) => {
  res.json({ price_list: priceList, effective_date: '2026-04-01', currency: 'USD', source: 'SAP Material Master' });
});

app.post('/api/sap/update-price', (req, res) => {
  const { part_number, new_price } = req.body;
  if (!part_number || new_price === undefined) {
    return res.status(400).json({ error: 'part_number and new_price required' });
  }
  const idx = priceList.findIndex(p => p.part_number === part_number);
  if (idx === -1) return res.status(404).json({ error: `Part ${part_number} not found` });

  const old_price = priceList[idx].list_price;
  priceList[idx].list_price = parseFloat(new_price);

  res.json({
    success: true,
    part_number,
    old_price,
    new_price: priceList[idx].list_price,
    updated_at: new Date().toISOString(),
    updated_by: 'QuoteSync AI Agent'
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'mock-sap' }));

app.listen(PORT, () => console.log(`Mock SAP running on port ${PORT}`));
