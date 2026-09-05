import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Persistence Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Interface definition for Server State
interface DatabaseState {
  heroes: any[];
  teams: any[];
  countries: any[];
  changes: any[];
  version: number;
  lastUpdated: string;
}

// Sample dataset fallback
const sampleDataset = {
  heroes: [
    {
      id: 'h1',
      codename: 'ARCANA',
      civilianName: 'Violet Silva',
      portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      civilianPortrait: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
      country: 'Brasil',
      team: 'CINTILLA',
      worldRank: 1,
      rankLetter: 'S',
      powerTypes: ['Místico', 'Psíquico'],
      popularity: 98,
      followers: 48500000,
      threatLevel: 'Ômega',
      status: 'Ativo',
      powersAndCompetencies: 'Manipulação de energia estelar primordial, geometria sagrada, transmutação e telecinese em escala continental.',
      bio: 'Violet Silva descobriu seus dons místicos durante escavações arqueológicas em Minas Gerais. Atualmente lidera o ranking mundial com manipulação de energia estelar e geometria sagrada.',
      history: [
        { change: '#04 → #01', date: '28/08/2026', reason: 'Conclusão bem-sucedida da Operação Eclipse.' },
        { change: '#05 → #04', date: '15/01/2026', reason: 'Reavaliação de dano colateral controlado.' }
      ]
    },
    {
      id: 'h2',
      codename: 'TITAN',
      civilianName: 'Marcus Vance',
      portrait: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      civilianPortrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      country: 'Estados Unidos',
      team: 'CYPHER',
      worldRank: 2,
      rankLetter: 'S',
      powerTypes: ['Mutante', 'Biológico'],
      popularity: 94,
      followers: 32800000,
      threatLevel: 'Global',
      status: 'Ativo',
      powersAndCompetencies: 'Superforça física de nível orbital, densidade molecular adaptativa e invulnerabilidade a armas cinéticas e balísticas.',
      bio: 'Ex-oficial de forças especiais com densidade molecular alterada artificialmente. Possui força física incomensurável e resistência balística absoluta.',
      history: [
        { change: '#01 → #02', date: '28/08/2026', reason: 'Perda temporária de sinal tático durante confronto na Zona Neutra.' }
      ]
    },
    {
      id: 'h3',
      codename: 'SOLAR FLARE',
      civilianName: 'Aiko Tanaka',
      portrait: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      civilianPortrait: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
      country: 'Japão',
      team: 'MAXWAVES',
      worldRank: 3,
      rankLetter: 'S',
      powerTypes: ['Cósmico', 'Científico'],
      popularity: 91,
      followers: 24300000,
      threatLevel: 'Interplanetário',
      status: 'Ativo',
      powersAndCompetencies: 'Geração e projeção de campos de plasma térmico, absorção de radiação solar e voo supersônico na estratosfera.',
      bio: 'Canalizadora de radiação solar concentrada. Capaz de gerar campos de plasma e voo supersônico na alta atmosfera.',
      history: [
        { change: '#02 → #03', date: '28/08/2026', reason: 'Ascensão de Arcana ao posto principal.' }
      ]
    }
  ],
  teams: [
    { id: 't1', name: 'CYPHER', abbreviation: 'CYP', emblem: 'Ω', scope: 'Internacional / Global', rank: '#1', desc: 'Força de elite oficial subordinada diretamente ao Alto Conselho.', members: ['TITAN'] },
    { id: 't2', name: 'CINTILLA', abbreviation: 'CNT', emblem: '✦', scope: 'América do Sul / Global', rank: '#2', desc: 'Divisão especializada em fenômenos místicos e bioenergéticos.', members: ['ARCANA'] },
    { id: 't3', name: 'MAXWAVES', abbreviation: 'MXW', emblem: '⚡', scope: 'Ásia / Pacífico', rank: '#3', desc: 'Especialistas em alta tecnologia móvel e operações supersônicas.', members: ['SOLAR FLARE'] }
  ],
  countries: [
    { id: 'c1', name: 'Brasil', code: 'BRA', flag: '🇧🇷', rank: '1º Nacional' },
    { id: 'c2', name: 'Estados Unidos', code: 'USA', flag: '🇺🇸', rank: '2º Nacional' },
    { id: 'c3', name: 'Japão', code: 'JPN', flag: '🇯🇵', rank: '3º Nacional' }
  ],
  changes: [
    { id: 'ch1', hero: 'ARCANA', change: '#04 → #01', type: 'up', date: '28/08/2026', reason: 'Conclusão bem-sucedida da Operação Eclipse.' },
    { id: 'ch2', hero: 'TITAN', change: '#01 → #02', type: 'down', date: '28/08/2026', reason: 'Perda temporária de sinal tático durante confronto.' },
    { id: 'ch3', hero: 'SOLAR FLARE', change: '#02 → #03', type: 'down', date: '28/08/2026', reason: 'Reajuste hierárquico pelo Alto Conselho.' }
  ]
};

// In-memory cache + disk sync
let db: DatabaseState = {
  heroes: [],
  teams: [],
  countries: [],
  changes: [],
  version: 1,
  lastUpdated: new Date().toISOString()
};

// Connected SSE clients for live broadcasts across all connected users
const sseClients = new Set<express.Response>();

function broadcastUpdate(type: string, payload?: any) {
  const message = `data: ${JSON.stringify({ type, version: db.version, lastUpdated: db.lastUpdated, payload })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

function loadDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      db = {
        heroes: Array.isArray(parsed.heroes) ? parsed.heroes : [],
        teams: Array.isArray(parsed.teams) ? parsed.teams : [],
        countries: Array.isArray(parsed.countries) ? parsed.countries : [],
        changes: Array.isArray(parsed.changes) ? parsed.changes : [],
        version: typeof parsed.version === 'number' ? parsed.version : 1,
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
      console.log(`[DB] Loaded server database with ${db.heroes.length} heroes, ${db.teams.length} teams, ${db.countries.length} countries.`);
    } else {
      // Initialize clean structure
      saveDatabase();
      console.log('[DB] Initialized clean server database.');
    }
  } catch (err) {
    console.error('[DB] Error loading database:', err);
  }
}

function saveDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.version = (db.version || 0) + 1;
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    broadcastUpdate('SYNC_UPDATE', { version: db.version, lastUpdated: db.lastUpdated });
  } catch (err) {
    console.error('[DB] Error saving database:', err);
  }
}

// Initialize database on startup
loadDatabase();

// --- SERVER-SIDE API ROUTES ---

// Health & Telemetry
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    connectedClients: sseClients.size,
    counts: {
      heroes: db.heroes.length,
      teams: db.teams.length,
      countries: db.countries.length,
      changes: db.changes.length
    },
    version: db.version
  });
});

// Full state query (GET /api/data)
app.get('/api/data', (req, res) => {
  res.json({
    heroes: db.heroes,
    teams: db.teams,
    countries: db.countries,
    changes: db.changes,
    version: db.version,
    lastUpdated: db.lastUpdated
  });
});

// SSE Live Real-Time Stream for all users
app.get('/api/sync/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', version: db.version })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// HEROES ENDPOINTS
app.post('/api/heroes', (req, res) => {
  const newHero = req.body;
  if (!newHero || !newHero.codename) {
    return res.status(400).json({ error: 'Codename is required' });
  }
  if (!newHero.id) {
    newHero.id = 'h_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  // Check if rank conflict or update
  db.heroes.push(newHero);
  
  // Also log ranking change automatically
  const changeEntry = {
    id: 'ch_' + Date.now(),
    hero: newHero.codename,
    change: `#${String(newHero.worldRank || 1).padStart(2, '0')} (Inclusão)`,
    type: 'up',
    date: new Date().toLocaleDateString('pt-BR'),
    reason: 'Homologação de novo super-humano no ranking mundial.'
  };
  db.changes.unshift(changeEntry);

  saveDatabase();
  res.status(201).json({ success: true, hero: newHero, version: db.version });
});

app.put('/api/heroes/:id', (req, res) => {
  const { id } = req.params;
  const updatedHero = req.body;
  const index = db.heroes.findIndex((h) => h.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Hero not found' });
  }

  db.heroes[index] = { ...db.heroes[index], ...updatedHero, id };
  saveDatabase();
  res.json({ success: true, hero: db.heroes[index], version: db.version });
});

app.delete('/api/heroes/:id', (req, res) => {
  const { id } = req.params;
  const prevCount = db.heroes.length;
  db.heroes = db.heroes.filter((h) => h.id !== id);

  if (db.heroes.length === prevCount) {
    return res.status(404).json({ error: 'Hero not found' });
  }

  saveDatabase();
  res.json({ success: true, message: 'Hero removed', version: db.version });
});

// TEAMS ENDPOINTS
app.post('/api/teams', (req, res) => {
  const newTeam = req.body;
  if (!newTeam || !newTeam.name) {
    return res.status(400).json({ error: 'Team name is required' });
  }
  if (!newTeam.id) {
    newTeam.id = 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  db.teams.push(newTeam);
  saveDatabase();
  res.status(201).json({ success: true, team: newTeam, version: db.version });
});

app.put('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  const updatedTeam = req.body;
  const index = db.teams.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Team not found' });
  }

  db.teams[index] = { ...db.teams[index], ...updatedTeam, id };
  saveDatabase();
  res.json({ success: true, team: db.teams[index], version: db.version });
});

app.delete('/api/teams/:id', (req, res) => {
  const { id } = req.params;
  db.teams = db.teams.filter((t) => t.id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Team removed', version: db.version });
});

// COUNTRIES ENDPOINTS
app.post('/api/countries', (req, res) => {
  const newCountry = req.body;
  if (!newCountry || !newCountry.name) {
    return res.status(400).json({ error: 'Country name is required' });
  }
  if (!newCountry.id) {
    newCountry.id = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  db.countries.push(newCountry);
  saveDatabase();
  res.status(201).json({ success: true, country: newCountry, version: db.version });
});

app.put('/api/countries/:id', (req, res) => {
  const { id } = req.params;
  const updatedCountry = req.body;
  const index = db.countries.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Country not found' });
  }

  db.countries[index] = { ...db.countries[index], ...updatedCountry, id };
  saveDatabase();
  res.json({ success: true, country: db.countries[index], version: db.version });
});

app.delete('/api/countries/:id', (req, res) => {
  const { id } = req.params;
  db.countries = db.countries.filter((c) => c.id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Country removed', version: db.version });
});

// CHANGES LOG ENDPOINTS
app.post('/api/changes', (req, res) => {
  const newChange = req.body;
  if (!newChange.id) {
    newChange.id = 'ch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }
  db.changes.unshift(newChange);
  saveDatabase();
  res.status(201).json({ success: true, change: newChange, version: db.version });
});

app.put('/api/changes/:id', (req, res) => {
  const { id } = req.params;
  const updatedChange = req.body;
  const index = db.changes.findIndex((ch) => ch.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Change not found' });
  }
  db.changes[index] = { ...db.changes[index], ...updatedChange, id };
  saveDatabase();
  res.json({ success: true, change: db.changes[index], version: db.version });
});

app.delete('/api/changes/:id', (req, res) => {
  const { id } = req.params;
  db.changes = db.changes.filter((ch) => ch.id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Change removed', version: db.version });
});

// BULK ACTIONS (Sample data, Clear database, Import backup)
app.post('/api/load-sample', (req, res) => {
  db.heroes = JSON.parse(JSON.stringify(sampleDataset.heroes));
  db.teams = JSON.parse(JSON.stringify(sampleDataset.teams));
  db.countries = JSON.parse(JSON.stringify(sampleDataset.countries));
  db.changes = JSON.parse(JSON.stringify(sampleDataset.changes));
  saveDatabase();
  res.json({ success: true, message: 'Sample dataset loaded server-side', data: db });
});

app.post('/api/clear-data', (req, res) => {
  db.heroes = [];
  db.teams = [];
  db.countries = [];
  db.changes = [];
  saveDatabase();
  res.json({ success: true, message: 'Server database reset to clean structure', data: db });
});

app.post('/api/import-data', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    if (Array.isArray(payload.heroes)) {
      db.heroes = payload.heroes;
    }
    if (Array.isArray(payload.teams)) {
      db.teams = payload.teams;
    }
    if (Array.isArray(payload.countries)) {
      db.countries = payload.countries;
    }
    if (Array.isArray(payload.changes)) {
      db.changes = payload.changes;
    }

    saveDatabase();
    res.json({
      success: true,
      message: 'Data successfully imported to server',
      version: db.version,
      counts: {
        heroes: db.heroes.length,
        teams: db.teams.length,
        countries: db.countries.length,
        changes: db.changes.length,
      },
      data: db,
    });
  } catch (err: any) {
    console.error('[API] Error importing data:', err);
    res.status(500).json({ error: 'Failed to import data', details: err?.message });
  }
});

// --- VITE & STATIC SERVING INTEGRATION ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[C.Y.P.H.E.R. Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
