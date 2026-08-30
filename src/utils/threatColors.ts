import { ThreatLevel } from '../types';

export interface ThreatLevelStyle {
  text: string;
  bg: string;
  border: string;
  badgeClass: string;
  glow: string;
  label: string;
}

export const THREAT_LEVEL_OPTIONS: { value: ThreatLevel; label: string; description: string }[] = [
  { value: 'Urbano', label: 'Urbano', description: 'Impacto restrito a bairros ou perímetro de uma cidade' },
  { value: 'Nacional', label: 'Nacional', description: 'Capacidade de afetar uma nação ou território continental' },
  { value: 'Global', label: 'Global', description: 'Ameaça de escala planetária com risco à civilização' },
  { value: 'Interplanetário', label: 'Interplanetário', description: 'Capacidade de intervenção ou devastação interplanetária' },
  { value: 'Ômega', label: 'Ômega', description: 'Poder supremo incomensurável, alteração de realidade ou extinção' },
];

export const THREAT_LEVEL_STYLES: Record<string, ThreatLevelStyle> = {
  Urbano: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/50',
    badgeClass: 'text-emerald-300 bg-emerald-950/70 border-emerald-500/50',
    glow: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]',
    label: 'Urbano',
  },
  Nacional: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-950/60',
    border: 'border-yellow-500/50',
    badgeClass: 'text-yellow-300 bg-yellow-950/70 border-yellow-500/50',
    glow: 'shadow-[0_0_8px_rgba(250,204,21,0.3)]',
    label: 'Nacional',
  },
  Global: {
    text: 'text-orange-400',
    bg: 'bg-orange-950/60',
    border: 'border-orange-500/50',
    badgeClass: 'text-orange-300 bg-orange-950/70 border-orange-500/50',
    glow: 'shadow-[0_0_8px_rgba(251,146,60,0.3)]',
    label: 'Global',
  },
  Interplanetário: {
    text: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-500/50',
    badgeClass: 'text-purple-300 bg-purple-950/70 border-purple-500/50',
    glow: 'shadow-[0_0_10px_rgba(192,132,252,0.35)]',
    label: 'Interplanetário',
  },
  Ômega: {
    text: 'text-[#ff003c]',
    bg: 'bg-red-950/80',
    border: 'border-[#ff003c]/60',
    badgeClass: 'text-red-400 bg-red-950/80 border-[#ff003c]/60 font-bold',
    glow: 'shadow-[0_0_12px_rgba(255,0,60,0.45)]',
    label: 'Ômega',
  },
  // Backward compatibility mappings
  S: {
    text: 'text-[#ff003c]',
    bg: 'bg-red-950/80',
    border: 'border-[#ff003c]/60',
    badgeClass: 'text-red-400 bg-red-950/80 border-[#ff003c]/60 font-bold',
    glow: 'shadow-[0_0_12px_rgba(255,0,60,0.45)]',
    label: 'Ômega',
  },
  A: {
    text: 'text-orange-400',
    bg: 'bg-orange-950/60',
    border: 'border-orange-500/50',
    badgeClass: 'text-orange-300 bg-orange-950/70 border-orange-500/50',
    glow: 'shadow-[0_0_8px_rgba(251,146,60,0.3)]',
    label: 'Global',
  },
  B: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-950/60',
    border: 'border-yellow-500/50',
    badgeClass: 'text-yellow-300 bg-yellow-950/70 border-yellow-500/50',
    glow: 'shadow-[0_0_8px_rgba(250,204,21,0.3)]',
    label: 'Nacional',
  },
  C: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/50',
    badgeClass: 'text-emerald-300 bg-emerald-950/70 border-emerald-500/50',
    glow: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]',
    label: 'Urbano',
  },
};

export function getThreatLevelStyle(level: string): ThreatLevelStyle {
  if (THREAT_LEVEL_STYLES[level]) {
    return THREAT_LEVEL_STYLES[level];
  }
  // Try lowercase/normalized lookup
  const normalized = Object.keys(THREAT_LEVEL_STYLES).find(
    (k) => k.toLowerCase() === (level || '').toLowerCase()
  );
  if (normalized && THREAT_LEVEL_STYLES[normalized]) {
    return THREAT_LEVEL_STYLES[normalized];
  }
  return {
    text: 'text-[#ffcc00]',
    bg: 'bg-yellow-950/60',
    border: 'border-yellow-500/50',
    badgeClass: 'text-yellow-300 bg-yellow-950/70 border-yellow-500/50',
    glow: 'shadow-[0_0_8px_rgba(250,204,21,0.3)]',
    label: level || 'Nacional',
  };
}

/**
 * Format followers count to human-readable string (e.g. 14.5M, 850K, 12.4K)
 */
export function formatFollowers(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString('pt-BR');
}

export function formatFollowersFull(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('pt-BR');
}

/**
 * Hierarchical rank weight value: S (4) > A (3) > B (2) > C (1)
 */
export const RANK_LETTER_WEIGHTS: Record<string, number> = {
  S: 4,
  A: 3,
  B: 2,
  C: 1,
};

export function getRankLetterWeight(rankLetter: string | undefined | null): number {
  if (!rankLetter) return 0;
  const key = rankLetter.trim().toUpperCase();
  return RANK_LETTER_WEIGHTS[key] ?? 0;
}

/**
 * Compares two heroes hierarchically:
 * 1. Rank Letter (S > A > B > C)
 * 2. World Rank numerical position ascending (#1 before #2)
 * 3. Popularity descending as tie-breaker
 */
export function compareHeroesHierarchical(a: { rankLetter?: string; worldRank?: number; popularity?: number }, b: { rankLetter?: string; worldRank?: number; popularity?: number }): number {
  const weightA = getRankLetterWeight(a.rankLetter);
  const weightB = getRankLetterWeight(b.rankLetter);

  // If different rank letters (e.g. S vs A), higher rank letter always comes first
  if (weightA !== weightB) {
    return weightB - weightA;
  }

  // Same rank letter: compare numerical worldRank ascending
  const rankA = a.worldRank !== undefined && a.worldRank !== null && !isNaN(a.worldRank) ? a.worldRank : 9999;
  const rankB = b.worldRank !== undefined && b.worldRank !== null && !isNaN(b.worldRank) ? b.worldRank : 9999;
  if (rankA !== rankB) {
    return rankA - rankB;
  }

  // Tie breaker: popularity descending
  const popA = a.popularity ?? 0;
  const popB = b.popularity ?? 0;
  return popB - popA;
}

/**
 * Formats hero rank position with hierarchical rank letter, e.g. #S-001, #A-004, #B-015
 */
export function formatHeroRank(rankLetter: string | undefined | null, worldRank: number | undefined | null): string {
  const letter = (rankLetter || 'S').trim().toUpperCase();
  const num = worldRank !== undefined && worldRank !== null && !isNaN(worldRank) ? worldRank : 1;
  return `#${letter}-${String(num).padStart(3, '0')}`;
}
