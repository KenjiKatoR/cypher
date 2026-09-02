import { PowerType } from '../types';

export interface PowerTypeStyle {
  text: string;
  bg: string;
  border: string;
  badgeClass: string;
  glow: string;
  dot: string;
  hex: string;
  label: string;
}

export const POWER_TYPE_STYLES: Record<string, PowerTypeStyle> = {
  Científico: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-500/60',
    badgeClass: 'text-cyan-300 bg-cyan-950/70 border-cyan-400/50 hover:border-cyan-400',
    glow: 'shadow-[0_0_10px_rgba(6,182,212,0.35)]',
    dot: 'bg-cyan-400',
    hex: '#22d3ee',
    label: 'Científico',
  },
  Tecnológico: {
    text: 'text-sky-400',
    bg: 'bg-sky-950/60',
    border: 'border-sky-500/60',
    badgeClass: 'text-sky-300 bg-sky-950/70 border-sky-400/50 hover:border-sky-400',
    glow: 'shadow-[0_0_10px_rgba(56,189,248,0.35)]',
    dot: 'bg-sky-400',
    hex: '#38bdf8',
    label: 'Tecnológico',
  },
  Místico: {
    text: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-500/60',
    badgeClass: 'text-purple-300 bg-purple-950/70 border-purple-400/50 hover:border-purple-400',
    glow: 'shadow-[0_0_10px_rgba(192,132,252,0.35)]',
    dot: 'bg-purple-400',
    hex: '#c084fc',
    label: 'Místico',
  },
  Cósmico: {
    text: 'text-amber-400',
    bg: 'bg-amber-950/60',
    border: 'border-amber-500/60',
    badgeClass: 'text-amber-300 bg-amber-950/70 border-amber-400/50 hover:border-amber-400',
    glow: 'shadow-[0_0_10px_rgba(251,191,36,0.35)]',
    dot: 'bg-amber-400',
    hex: '#fbbf24',
    label: 'Cósmico',
  },
  Treinamento: {
    text: 'text-orange-400',
    bg: 'bg-orange-950/60',
    border: 'border-orange-500/60',
    badgeClass: 'text-orange-300 bg-orange-950/70 border-orange-400/50 hover:border-orange-400',
    glow: 'shadow-[0_0_10px_rgba(251,146,60,0.35)]',
    dot: 'bg-orange-400',
    hex: '#fb923c',
    label: 'Treinamento',
  },
  Mutante: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-500/60',
    badgeClass: 'text-emerald-300 bg-emerald-950/70 border-emerald-400/50 hover:border-emerald-400',
    glow: 'shadow-[0_0_10px_rgba(52,211,153,0.35)]',
    dot: 'bg-emerald-400',
    hex: '#34d399',
    label: 'Mutante',
  },
  Psíquico: {
    text: 'text-pink-400',
    bg: 'bg-pink-950/60',
    border: 'border-pink-500/60',
    badgeClass: 'text-pink-300 bg-pink-950/70 border-pink-400/50 hover:border-pink-400',
    glow: 'shadow-[0_0_10px_rgba(244,114,182,0.35)]',
    dot: 'bg-pink-400',
    hex: '#f472b6',
    label: 'Psíquico',
  },
  Biológico: {
    text: 'text-lime-400',
    bg: 'bg-lime-950/60',
    border: 'border-lime-500/60',
    badgeClass: 'text-lime-300 bg-lime-950/70 border-lime-400/50 hover:border-lime-400',
    glow: 'shadow-[0_0_10px_rgba(163,230,53,0.35)]',
    dot: 'bg-lime-400',
    hex: '#a3e635',
    label: 'Biológico',
  },
  Outro: {
    text: 'text-slate-300',
    bg: 'bg-slate-900/60',
    border: 'border-slate-500/60',
    badgeClass: 'text-slate-200 bg-slate-900/70 border-slate-400/50 hover:border-slate-400',
    glow: 'shadow-[0_0_10px_rgba(148,163,184,0.25)]',
    dot: 'bg-slate-400',
    hex: '#94a3b8',
    label: 'Outro',
  },
};

export const SORTED_POWER_TYPES: PowerType[] = [
  'Biológico',
  'Científico',
  'Cósmico',
  'Místico',
  'Mutante',
  'Outro',
  'Psíquico',
  'Tecnológico',
  'Treinamento',
];

export function sortPowerTypes<T extends PowerType | string = PowerType>(types: T[] = []): T[] {
  return [...types].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function getPowerTypeStyle(powerType: string): PowerTypeStyle {
  if (POWER_TYPE_STYLES[powerType]) {
    return POWER_TYPE_STYLES[powerType];
  }
  return {
    text: 'text-cyan-400',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-500/60',
    badgeClass: 'text-cyan-300 bg-cyan-950/70 border-cyan-400/50',
    glow: 'shadow-[0_0_10px_rgba(6,182,212,0.35)]',
    dot: 'bg-cyan-400',
    hex: '#22d3ee',
    label: powerType,
  };
}
