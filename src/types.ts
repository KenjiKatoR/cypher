export type RankLetter = 'S' | 'A' | 'B' | 'C';
export type ThreatLevel = 'Urbano' | 'Nacional' | 'Global' | 'Interplanetário' | 'Ômega' | string;
export type HeroStatus = 'Ativo' | 'Inativo' | 'Desconhecido' | 'Falecido' | 'ATIVO' | 'ATIVA' | 'INATIVO' | 'INATIVA';
export type PowerType = 
  | 'Científico'
  | 'Tecnológico'
  | 'Místico'
  | 'Cósmico'
  | 'Treinamento'
  | 'Mutante'
  | 'Psíquico'
  | 'Biológico'
  | 'Outro';

export interface RankingHistoryItem {
  id?: string;
  change: string;
  date: string;
  reason: string;
}

export interface Hero {
  id: string;
  codename: string;
  civilianName: string;
  portrait: string; // 9:16 hero costume portrait
  civilianPortrait?: string; // 9:16 optional civilian portrait
  country: string;
  team: string;
  worldRank: number;
  rankLetter: RankLetter;
  powerTypes: PowerType[]; // Multi-select power types
  powerType?: PowerType | PowerType[]; // Backwards-compatibility helper
  threatLevel: ThreatLevel;
  status: HeroStatus;
  popularity: number; // 0-100 Popularity metric
  followers?: number; // Follower count
  powersAndCompetencies: string; // Powers and tactical competencies
  bio: string;
  history: RankingHistoryItem[];
  createdAt?: string;
}

export interface Team {
  id: string;
  name: string;
  emblem: string;
  scope: string;
  count?: number;
  rank: string;
  desc: string;
  members: string[]; // Hero codenames or IDs
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  heroesCount?: number;
  activeCount?: number;
  topHero?: string;
  rank: string;
}

export interface RankingChange {
  id: string;
  hero: string;
  change: string;
  type: 'up' | 'down';
  date: string;
  reason: string;
}

export type ViewType = 'inicio' | 'ranking' | 'profile' | 'heroes' | 'teams' | 'countries' | 'changes';
