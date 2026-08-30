import { Hero, Team, Country, RankingChange } from '../types';

const STORAGE_KEYS = {
  HEROES: 'cypher_heroes_data_v1',
  TEAMS: 'cypher_teams_data_v1',
  COUNTRIES: 'cypher_countries_data_v1',
  CHANGES: 'cypher_changes_data_v1',
  IS_ADMIN: 'cypher_is_admin_v1',
  THREAT_LEVEL: 'cypher_threat_level_v1'
};

// Initial clean datasets (empty by default as requested: "remova os textos de exemplo e deixe apenas a estrutura de campos para entrada de dados")
export const initialEmptyHeroes: Hero[] = [];

export const initialEmptyTeams: Team[] = [];

export const initialEmptyCountries: Country[] = [];

export const initialEmptyChanges: RankingChange[] = [];

export const sampleDatasetHeroes: Hero[] = [
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
];

export const sampleDatasetTeams: Team[] = [
  { id: 't1', name: 'CYPHER', abbreviation: 'CYP', emblem: 'Ω', scope: 'Internacional / Global', rank: '#1', desc: 'Força de elite oficial subordinada diretamente ao Alto Conselho.', members: ['TITAN'] },
  { id: 't2', name: 'CINTILLA', abbreviation: 'CNT', emblem: '✦', scope: 'América do Sul / Global', rank: '#2', desc: 'Divisão especializada em fenômenos místicos e bioenergéticos.', members: ['ARCANA'] },
  { id: 't3', name: 'MAXWAVES', abbreviation: 'MXW', emblem: '⚡', scope: 'Ásia / Pacífico', rank: '#3', desc: 'Especialistas em alta tecnologia móvel e operações supersônicas.', members: ['SOLAR FLARE'] }
];

export const sampleDatasetCountries: Country[] = [
  { id: 'c1', name: 'Brasil', code: 'BRA', flag: '🇧🇷', rank: '1º Nacional' },
  { id: 'c2', name: 'Estados Unidos', code: 'USA', flag: '🇺🇸', rank: '2º Nacional' },
  { id: 'c3', name: 'Japão', code: 'JPN', flag: '🇯🇵', rank: '3º Nacional' }
];

export const sampleDatasetChanges: RankingChange[] = [
  { id: 'ch1', hero: 'ARCANA', change: '#04 → #01', type: 'up', date: '28/08/2026', reason: 'Conclusão bem-sucedida da Operação Eclipse.' },
  { id: 'ch2', hero: 'TITAN', change: '#01 → #02', type: 'down', date: '28/08/2026', reason: 'Perda temporária de sinal tático durante confronto.' },
  { id: 'ch3', hero: 'SOLAR FLARE', change: '#02 → #03', type: 'down', date: '28/08/2026', reason: 'Reajuste hierárquico pelo Alto Conselho.' }
];

// LocalStorage helpers
export function loadStoredHeroes(): Hero[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEROES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load heroes from localStorage', e);
  }
  return initialEmptyHeroes;
}

export function saveStoredHeroes(heroes: Hero[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HEROES, JSON.stringify(heroes));
  } catch (e) {
    console.error('Failed to save heroes to localStorage', e);
  }
}

export function loadStoredTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load teams from localStorage', e);
  }
  return initialEmptyTeams;
}

export function saveStoredTeams(teams: Team[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save teams to localStorage', e);
  }
}

export function loadStoredCountries(): Country[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUNTRIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load countries from localStorage', e);
  }
  return initialEmptyCountries;
}

export function saveStoredCountries(countries: Country[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COUNTRIES, JSON.stringify(countries));
  } catch (e) {
    console.error('Failed to save countries to localStorage', e);
  }
}

export function loadStoredChanges(): RankingChange[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHANGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load changes from localStorage', e);
  }
  return initialEmptyChanges;
}

export function saveStoredChanges(changes: RankingChange[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHANGES, JSON.stringify(changes));
  } catch (e) {
    console.error('Failed to save changes to localStorage', e);
  }
}

export function clearAllStoredData(): void {
  localStorage.removeItem(STORAGE_KEYS.HEROES);
  localStorage.removeItem(STORAGE_KEYS.TEAMS);
  localStorage.removeItem(STORAGE_KEYS.COUNTRIES);
  localStorage.removeItem(STORAGE_KEYS.CHANGES);
}
