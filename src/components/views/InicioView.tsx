import React from 'react';
import { Hero, Country, Team, ViewType } from '../../types';
import { Trophy, Star, AlertTriangle, ArrowRight, Plus, Users, Globe, Shield, Sparkles, Lock, BookOpen, Download, Upload } from 'lucide-react';
import { formatHeroRank, compareHeroesHierarchical } from '../../utils/threatColors';

interface InicioViewProps {
  heroes: Hero[];
  countries: Country[];
  teams: Team[];
  onSelectHero: (heroId: string) => void;
  onNavigate: (view: ViewType) => void;
  onOpenNewHero: () => void;
  onOpenNewTeam: () => void;
  onOpenNewCountry: () => void;
  onExportData?: () => void;
  onImportData?: () => void;
  isAdmin: boolean;
}

export const InicioView: React.FC<InicioViewProps> = ({
  heroes,
  countries,
  teams,
  onSelectHero,
  onNavigate,
  onOpenNewHero,
  onOpenNewTeam,
  onOpenNewCountry,
  onExportData,
  onImportData,
  isAdmin,
}) => {
  // Sort heroes strictly by rank hierarchy (S > A > B > C, then numerical worldRank)
  const sortedHeroes = [...heroes].sort(compareHeroesHierarchical);
  const activeHeroesCount = heroes.filter((h) => (h.status || '').toUpperCase().includes('ATIV')).length;
  const top3 = sortedHeroes.slice(0, 3);
  const top10 = sortedHeroes.slice(0, 10);

  return (
    <div id="view-inicio" className="space-y-6">
      {/* Alerta do Sistema / Banner */}
      <div className="hud-border hud-border-glow p-6 relative overflow-hidden bg-[#09101a]">
        <div className="absolute -right-10 -bottom-10 text-[#00f3ff]/5 text-9xl font-mono-cyber font-bold select-none pointer-events-none">
          C.Y.P.H.E.R.
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-[#00f3ff] font-mono-cyber text-xs tracking-widest uppercase mb-1 flex items-center flex-wrap gap-1.5">
                <span className="w-2 h-2 bg-[#00f3ff] inline-block animate-pulse shrink-0"></span>
                <span className="font-semibold">CYBERNETIC YIELD PROTOCOLS AND HEROIC ENFORCEMENT REGISTRY</span>
                {!isAdmin && (
                  <span className="text-[10px] px-2 py-0.5 border border-[#7e9bb5]/40 text-[#7e9bb5] bg-[#05080d] rounded flex items-center gap-1 font-mono-cyber normal-case shrink-0">
                    <Lock size={10} />
                    Modo Público (Leitura)
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-4xl font-mono-cyber font-bold text-[#e2f1ff] tracking-wider">
                C.Y.P.H.E.R. HEROES RANKING
              </h2>
            </div>
            <div className="bg-[#05080d] border border-[#00f3ff]/30 px-4 py-2 rounded text-right font-mono-cyber">
              <div className="text-[10px] text-[#7e9bb5]">NÍVEL GLOBAL DE AMEAÇA</div>
              <div className="text-[#ffcc00] font-bold text-sm tracking-widest flex items-center justify-end space-x-1">
                <AlertTriangle size={14} className="text-[#ffcc00]" />
                <span>GRAU III — ALERTA ELEVADO</span>
              </div>
            </div>
          </div>
          <p className="text-[#7e9bb5] text-sm max-w-3xl leading-relaxed font-sans">
            Sistema oficial de monitoramento, avaliação balística e classificação mundial de super-humanos.
            Estrutura centralizada para registro e dossiês de inteligência.
          </p>

          {/* Quick Registration Bar (Admin Only) */}
          {isAdmin && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-banner-add-btn"
                onClick={onOpenNewHero}
                className="hud-button px-4 py-2 text-xs font-mono-cyber flex items-center space-x-2 hud-button-active shadow-[0_0_12px_rgba(0,243,255,0.3)] cursor-pointer"
              >
                <Plus size={14} />
                <span>CADASTRAR NOVO HERÓI</span>
              </button>
              <button
                onClick={onOpenNewTeam}
                className="hud-button px-3.5 py-2 text-xs font-mono-cyber flex items-center space-x-1.5 cursor-pointer"
              >
                <Users size={14} />
                <span>REGISTRAR EQUIPE</span>
              </button>
              <button
                onClick={onOpenNewCountry}
                className="hud-button px-3.5 py-2 text-xs font-mono-cyber flex items-center space-x-1.5 cursor-pointer"
              >
                <Globe size={14} />
                <span>REGISTRAR PAÍS</span>
              </button>
              {onExportData && (
                <button
                  id="banner-export-btn"
                  onClick={onExportData}
                  className="px-3.5 py-2 text-xs font-mono-cyber flex items-center space-x-1.5 border border-[#00ff66]/50 bg-[#00ff66]/10 text-[#00ff66] hover:bg-[#00ff66]/20 transition-all rounded cursor-pointer shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                  title="Exportar todos os dados em arquivo JSON"
                >
                  <Download size={14} />
                  <span>EXPORTAR DADOS (JSON)</span>
                </button>
              )}
              {onImportData && (
                <button
                  id="banner-import-btn"
                  onClick={onImportData}
                  className="px-3.5 py-2 text-xs font-mono-cyber flex items-center space-x-1.5 border border-[#ffcc00]/50 bg-[#ffcc00]/10 text-[#ffcc00] hover:bg-[#ffcc00]/20 transition-all rounded cursor-pointer shadow-[0_0_10px_rgba(255,204,0,0.2)]"
                  title="Importar dados de arquivo JSON"
                >
                  <Upload size={14} />
                  <span>IMPORTAR DADOS (JSON)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas Globais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="hud-border p-4 text-center group hover:border-[#00f3ff]/50 transition-colors bg-[#09101a]">
          <div className="text-xs font-mono-cyber text-[#7e9bb5] mb-1">HERÓIS REGISTRADOS</div>
          <div id="statTotalHeroes" className="text-2xl md:text-3xl font-mono-cyber font-bold text-[#00f3ff]">
            {String(heroes.length).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-[#00ff66] mt-1 font-mono-cyber">
            ▲ {heroes.length > 0 ? '100% INDEXADOS' : 'AGUARDANDO REGISTROS'}
          </div>
        </div>

        <div className="hud-border p-4 text-center group hover:border-[#00ff66]/50 transition-colors bg-[#09101a]">
          <div className="text-xs font-mono-cyber text-[#7e9bb5] mb-1">HERÓIS ATIVOS</div>
          <div id="statActiveHeroes" className="text-2xl md:text-3xl font-mono-cyber font-bold text-[#00ff66]">
            {String(activeHeroesCount).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-[#7e9bb5] mt-1 font-mono-cyber">EM MISSÃO OU PRONTIDÃO</div>
        </div>

        <div className="hud-border p-4 text-center group hover:border-[#00f3ff]/50 transition-colors bg-[#09101a]">
          <div className="text-xs font-mono-cyber text-[#7e9bb5] mb-1">PAÍSES REGISTRADOS</div>
          <div id="statTotalCountries" className="text-2xl md:text-3xl font-mono-cyber font-bold text-[#e2f1ff]">
            {String(countries.length).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-[#00f3ff] mt-1 font-mono-cyber">JURISDIÇÕES PARCEIRAS</div>
        </div>

        <div className="hud-border p-4 text-center group hover:border-[#ffcc00]/50 transition-colors bg-[#09101a]">
          <div className="text-xs font-mono-cyber text-[#7e9bb5] mb-1">EQUIPES REGISTRADAS</div>
          <div id="statTotalTeams" className="text-2xl md:text-3xl font-mono-cyber font-bold text-[#ffcc00]">
            {String(teams.length).padStart(2, '0')}
          </div>
          <div className="text-[10px] text-[#7e9bb5] mt-1 font-mono-cyber">ALIANÇAS TÁTICAS</div>
        </div>
      </div>

      {/* Pódio do Ranking Mundial (#01, #02, #03) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-[#16283d] pb-2">
          <h3 className="font-mono-cyber font-bold text-[#00f3ff] tracking-wider flex items-center space-x-2 text-sm sm:text-base">
            <Trophy size={18} className="text-[#00f3ff]" />
            <span>PÓDIO MUNDIAL — TOP 3</span>
          </h3>
          <button
            onClick={() => onNavigate('ranking')}
            className="text-xs font-mono-cyber text-[#00f3ff] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>VER RANKING COMPLETO</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {top3.length === 0 ? (
          <div className="hud-border p-8 text-center space-y-3 bg-[#09101a]/50">
            <div className="text-3xl text-[#7e9bb5] font-mono-cyber">#000</div>
            <div className="text-sm font-mono-cyber text-[#e2f1ff] font-semibold">
              NENHUM HERÓI REGISTRADO NO PÓDIO
            </div>
            <p className="text-xs text-[#7e9bb5] font-mono-cyber max-w-md mx-auto">
              A estrutura do sistema está pronta. Cadastre os primeiros heróis para visualizar automaticamente as classificações mundiais.
            </p>
            {isAdmin && (
              <button
                onClick={onOpenNewHero}
                className="hud-button hud-button-active px-4 py-2 text-xs font-mono-cyber inline-flex items-center space-x-1.5 mt-2 cursor-pointer"
              >
                <Plus size={14} />
                <span>REGISTRAR PRIMEIRO HERÓI</span>
              </button>
            )}
          </div>
        ) : (
          <div id="podiumContainer" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
            {/* Slot #2 (Rank 2) */}
            {top3[1] ? (
              <div
                onClick={() => onSelectHero(top3[1].id)}
                className="hud-border p-4 relative flex flex-col items-center text-center hover:border-[#00f3ff] transition-all cursor-pointer group bg-[#09101a]"
              >
                <div className="absolute top-2 left-2 font-mono-cyber font-bold text-xs text-[#00f3ff] bg-[#05080d] px-2 py-0.5 rounded border border-[#16283d] whitespace-nowrap shrink-0 inline-block">
                  {formatHeroRank(top3[1].rankLetter, top3[1].worldRank)}
                </div>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] rounded font-mono-cyber bg-[#16283d] text-[#e2f1ff] whitespace-nowrap shrink-0">
                  RANK 2º
                </span>
                <div className="w-24 h-24 my-3 overflow-hidden border border-[#16283d] group-hover:border-[#00f3ff] transition-colors relative bg-[#05080d] rounded-xs">
                  <img
                    src={top3[1].squarePortrait || top3[1].portrait}
                    alt={top3[1].codename}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>
                <h4 className="font-mono-cyber font-bold text-[#e2f1ff] text-base mt-1 group-hover:text-[#00f3ff]">
                  {top3[1].codename}
                </h4>
                <div className="text-xs text-[#7e9bb5] font-mono-cyber mb-2">{top3[1].civilianName}</div>
                <div className="flex items-center space-x-2 text-xs font-mono-cyber">
                  <span className="px-2 py-0.5 rounded bg-[#05080d] border border-[#16283d] text-[#00f3ff] whitespace-nowrap">
                    {top3[1].country}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#05080d] border border-[#16283d] text-[#ffcc00] whitespace-nowrap">
                    AMEAÇA {top3[1].threatLevel}
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={isAdmin ? onOpenNewHero : undefined}
                className={`hud-border p-6 border-dashed border-[#16283d] flex flex-col items-center justify-center text-center text-[#7e9bb5] transition-all bg-[#09101a] ${
                  isAdmin ? 'hover:text-[#00f3ff] hover:border-[#00f3ff] cursor-pointer' : ''
                }`}
              >
                <span className="font-mono-cyber text-sm whitespace-nowrap">S-002 — VAGO</span>
                {isAdmin && <p className="text-[11px] font-mono-cyber mt-1 whitespace-nowrap">+ Adicionar Herói Rank 2</p>}
              </div>
            )}

            {/* Slot #1 (Rank 1 - Champion) */}
            {top3[0] ? (
              <div
                onClick={() => onSelectHero(top3[0].id)}
                className="hud-border hud-border-glow border-[#00f3ff] bg-cyan-950/20 p-5 relative flex flex-col items-center text-center hover:scale-[1.02] transition-all cursor-pointer group md:-mt-3"
              >
                <div className="absolute top-2 left-2 font-mono-cyber font-bold text-xs text-[#00f3ff] flex items-center space-x-1 bg-[#05080d] px-2 py-0.5 rounded border border-[#00f3ff]/40 shadow-[0_0_8px_rgba(0,243,255,0.25)] whitespace-nowrap shrink-0 inline-block">
                  <Trophy size={13} className="text-[#ffcc00] shrink-0" />
                  <span className="whitespace-nowrap">{formatHeroRank(top3[0].rankLetter, top3[0].worldRank)}</span>
                </div>
                <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded font-mono-cyber bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/40 font-bold animate-pulse whitespace-nowrap shrink-0">
                  CAMPEÃO MUNDIAL
                </span>
                <div className="w-28 h-28 my-3 overflow-hidden border-2 border-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.4)] relative bg-[#05080d] rounded-xs">
                  <img
                    src={top3[0].squarePortrait || top3[0].portrait}
                    alt={top3[0].codename}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>
                <h4 className="font-mono-cyber font-bold text-[#e2f1ff] text-lg mt-1 group-hover:text-[#00f3ff]">
                  {top3[0].codename}
                </h4>
                <div className="text-xs text-[#7e9bb5] font-mono-cyber mb-2">{top3[0].civilianName}</div>
                <div className="flex items-center space-x-2 text-xs font-mono-cyber">
                  <span className="px-2 py-0.5 rounded bg-[#05080d] border border-[#00f3ff]/40 text-[#00f3ff] font-semibold whitespace-nowrap">
                    {top3[0].country}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#05080d] border border-[#ff003c]/40 text-[#ff003c] font-semibold whitespace-nowrap">
                    AMEAÇA {top3[0].threatLevel}
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={isAdmin ? onOpenNewHero : undefined}
                className={`hud-border p-6 border-dashed border-[#00f3ff]/60 flex flex-col items-center justify-center text-center text-[#00f3ff] bg-cyan-950/20 ${
                  isAdmin ? 'cursor-pointer' : ''
                }`}
              >
                <Trophy size={24} className="text-[#ffcc00] mb-1" />
                <span className="font-mono-cyber font-bold text-sm whitespace-nowrap">S-001 — VAGO</span>
                {isAdmin && <p className="text-[11px] font-mono-cyber mt-1 whitespace-nowrap">+ Cadastrar Herói Líder (01)</p>}
              </div>
            )}

            {/* Slot #3 (Rank 3) */}
            {top3[2] ? (
              <div
                onClick={() => onSelectHero(top3[2].id)}
                className="hud-border p-4 relative flex flex-col items-center text-center hover:border-[#00f3ff] transition-all cursor-pointer group bg-[#09101a]"
              >
                <div className="absolute top-2 left-2 font-mono-cyber font-bold text-xs text-[#00f3ff] bg-[#05080d] px-2 py-0.5 rounded border border-[#16283d] whitespace-nowrap shrink-0 inline-block">
                  {formatHeroRank(top3[2].rankLetter, top3[2].worldRank)}
                </div>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] rounded font-mono-cyber bg-[#16283d] text-[#e2f1ff] whitespace-nowrap shrink-0">
                  RANK 3º
                </span>
                <div className="w-24 h-24 my-3 overflow-hidden border border-[#16283d] group-hover:border-[#00f3ff] transition-colors relative bg-[#05080d] rounded-xs">
                  <img
                    src={top3[2].squarePortrait || top3[2].portrait}
                    alt={top3[2].codename}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>
                <h4 className="font-mono-cyber font-bold text-[#e2f1ff] text-base mt-1 group-hover:text-[#00f3ff]">
                  {top3[2].codename}
                </h4>
                <div className="text-xs text-[#7e9bb5] font-mono-cyber mb-2">{top3[2].civilianName}</div>
                <div className="flex items-center space-x-2 text-xs font-mono-cyber">
                  <span className="px-2 py-0.5 rounded bg-[#05080d] border border-[#16283d] text-[#00f3ff] whitespace-nowrap">
                    {top3[2].country}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#05080d] border border-[#16283d] text-[#ffcc00] whitespace-nowrap">
                    AMEAÇA {top3[2].threatLevel}
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={isAdmin ? onOpenNewHero : undefined}
                className={`hud-border p-6 border-dashed border-[#16283d] flex flex-col items-center justify-center text-center text-[#7e9bb5] transition-all bg-[#09101a] ${
                  isAdmin ? 'hover:text-[#00f3ff] hover:border-[#00f3ff] cursor-pointer' : ''
                }`}
              >
                <span className="font-mono-cyber text-sm whitespace-nowrap">S-003 — VAGO</span>
                {isAdmin && <p className="text-[11px] font-mono-cyber mt-1 whitespace-nowrap">+ Adicionar Herói Rank 3</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top 10 Lista Rápida */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center border-b border-[#16283d] pb-2">
          <h3 className="font-mono-cyber font-bold text-[#e2f1ff] tracking-wider flex items-center space-x-2 text-sm sm:text-base">
            <Sparkles size={16} className="text-[#00f3ff]" />
            <span>DESTAQUES DO TOP 10</span>
          </h3>
          <span className="text-xs text-[#7e9bb5] font-mono-cyber">
            {top10.length} {top10.length === 1 ? 'REGISTRO' : 'REGISTROS'}
          </span>
        </div>

        {top10.length === 0 ? (
          <div className="hud-border p-6 text-center text-[#7e9bb5] font-mono-cyber text-xs bg-[#09101a]">
            Nenhum super-humano cadastrado no sistema ainda.
          </div>
        ) : (
          <div id="top10ListContainer" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {top10.map((h) => (
              <div
                key={h.id}
                onClick={() => onSelectHero(h.id)}
                className="hud-border p-3 flex items-center justify-between hover:border-[#00f3ff] transition-colors cursor-pointer group bg-[#09101a]"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono-cyber font-bold text-[#00f3ff] text-xs px-2 py-0.5 bg-[#05080d] border border-[#00f3ff]/30 rounded whitespace-nowrap shrink-0 inline-block">
                    {formatHeroRank(h.rankLetter, h.worldRank)}
                  </span>
                  <div className="w-10 h-10 border border-[#16283d] overflow-hidden group-hover:border-[#00f3ff] transition-colors rounded-xs shrink-0">
                    <img
                      src={h.squarePortrait || h.portrait}
                      alt={h.codename}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono-cyber font-bold text-[#e2f1ff] text-sm group-hover:text-[#00f3ff] truncate">
                      {h.codename}
                    </div>
                    <div className="text-[10px] text-[#7e9bb5] font-mono-cyber truncate">
                      {h.team} | {h.country}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono-cyber shrink-0 pl-2">
                  <div className="text-xs text-[#00f3ff] font-semibold whitespace-nowrap">POS {h.worldRank}</div>
                  <div className="text-[10px] text-[#ffcc00] whitespace-nowrap">AMEAÇA: {h.threatLevel}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
