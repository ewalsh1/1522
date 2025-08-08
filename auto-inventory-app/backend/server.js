import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.API_KEY || 'supersecretapikey123';
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: ORIGIN }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const inventoryPath = path.join(dataDir, 'inventory.json');
const modelsPath = path.join(dataDir, 'models.json');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// seed if missing
function seedIfMissing() {
  if (!fs.existsSync(inventoryPath)) {
    fs.writeFileSync(inventoryPath, JSON.stringify({ inventory: [], updatedAt: Date.now() }, null, 2));
  }
  if (!fs.existsSync(modelsPath)) {
    const seedModels = [
      {
        id: 'f150',
        make: 'Ford',
        model: 'F-150',
        year: 2025,
        basePrice: 46500,
        trims: [
          { code: 'XL', priceDelta: 0 },
          { code: 'XLT', priceDelta: 4500 },
          { code: 'Lariat', priceDelta: 11500 },
          { code: 'Platinum', priceDelta: 20000 }
        ],
        options: [
          { code: 'TowPkg', name: 'Max Tow Package', price: 1500 },
          { code: 'FX4', name: 'FX4 Off-Road', price: 1100 },
          { code: 'Moon', name: 'Twin-Panel Moonroof', price: 1700 }
        ],
        heroImage: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg'
      },
      {
        id: 'escape',
        make: 'Ford',
        model: 'Escape',
        year: 2025,
        basePrice: 32400,
        trims: [
          { code: 'Active', priceDelta: 0 },
          { code: 'ST-Line', priceDelta: 2500 },
          { code: 'Platinum', priceDelta: 6000 }
        ],
        options: [
          { code: 'AWD', name: 'All-Wheel Drive', price: 1800 },
          { code: 'Tech', name: 'Tech Pack', price: 1200 }
        ],
        heroImage: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg'
      }
    ];
    fs.writeFileSync(modelsPath, JSON.stringify({ models: seedModels, updatedAt: Date.now() }, null, 2));
  }
}
seedIfMissing();

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}
function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// --- Public API ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/models', (req, res) => {
  return res.json(readJSON(modelsPath));
});

app.get('/api/inventory', (req, res) => {
  const { type } = req.query; // 'new' | 'used' | undefined
  const db = readJSON(inventoryPath);
  let items = db.inventory;
  if (type) items = items.filter(i => i.type === type);
  res.json({ inventory: items, updatedAt: db.updatedAt });
});

// --- Admin API (requires API key) ---
function requireKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.post('/api/models', requireKey, (req, res) => {
  const { model } = req.body;
  if (!model?.id) return res.status(400).json({ error: 'model.id required' });
  const db = readJSON(modelsPath);
  const exists = db.models.find(m => m.id === model.id);
  if (exists) return res.status(409).json({ error: 'Model already exists' });
  db.models.push(model);
  db.updatedAt = Date.now();
  writeJSON(modelsPath, db);
  res.json({ ok: true, model });
});

app.post('/api/inventory', requireKey, (req, res) => {
  const { item } = req.body;
  if (!item?.vin) return res.status(400).json({ error: 'item.vin required' });
  const db = readJSON(inventoryPath);
  const exists = db.inventory.find(i => i.vin === item.vin);
  if (exists) return res.status(409).json({ error: 'Item with VIN exists' });
  const now = Date.now();
  db.inventory.push({
    id: nanoid(10),
    addedAt: now,
    ...item
  });
  db.updatedAt = now;
  writeJSON(inventoryPath, db);
  res.json({ ok: true });
});

app.patch('/api/inventory/:id', requireKey, (req, res) => {
  const db = readJSON(inventoryPath);
  const idx = db.inventory.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.inventory[idx] = { ...db.inventory[idx], ...req.body };
  db.updatedAt = Date.now();
  writeJSON(inventoryPath, db);
  res.json({ ok: true, item: db.inventory[idx] });
});

app.delete('/api/inventory/:id', requireKey, (req, res) => {
  const db = readJSON(inventoryPath);
  const before = db.inventory.length;
  db.inventory = db.inventory.filter(i => i.id != req.params.id);
  if (db.inventory.length === before) return res.status(404).json({ error: 'Not found' });
  db.updatedAt = Date.now();
  writeJSON(inventoryPath, db);
  res.json({ ok: true });
});

// Image upload (demo - saves to /uploads, return URL path)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${nanoid(6)}${ext}`);
  }
});
const upload = multer({ storage });

app.post('/api/upload', requireKey, upload.single('image'), (req, res) => {
  res.json({ ok: true, path: `/uploads/${req.file.filename}` });
});
app.use('/uploads', express.static(uploadsDir));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
