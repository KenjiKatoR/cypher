import React, { useState } from 'react';
import { Hero, PowerType, RankLetter, HeroStatus } from '../../types';
import { Search, Plus, Eye, Edit2, Trash2, Shield, Lock, User, Filter, RotateCcw } from 'lucide-react';
import { getPowerTypeStyle, POWER_TYPE_STYLES } from '../../utils/powerColors';
import { getThreatLevelStyle, formatFollowers, formatHeroRank, compareHeroesHierarchical } from '../../utils/threatColors';

interface HeroesViewProps {
  heroes: Hero[];
  onSelectHero: (heroId: string) => void;
  onEditHero: (hero: Hero) => void;
  onDeleteHero: (heroId: string) => void;
  onOpenNewHero: () => void;
  isAdmin: boolean;
}

const POWER_TYPE_OPTIONS: PowerType[] = [
  'Científico',
  'Tecnológico',
  'Místico',
  'Cósmico',
  'Treinamento',
  'Mutante',
  'Psíquico',
  'Biológico',
  'Outro',
];

export const HeroesView: React.FC<HeroesViewProps> = ({
  heroes,
  onSelectHero,
  onEditHero,
  onDeleteHero,
  onOpenNewHero,
  isAdmin,
}) => {
  const [search, setSearch] = useState('');
  const [powerTypeFilter, setPowerTypeFilter] = useState<string>('');
  const [rankFilter, setRankFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [threatFilter, setThreatFilter] = useState<string>('');

  const hasActiveFilters = Boolean(search || powerTypeFilter || rankFilter || statusFilter || threatFilter);

  const handleClearFilters = () => {
    setSearch('');
    setPowerTypeFilter('');
    setRankFilter('');
    setStatusFilter('');
    setThreatFilter('');
  };

  const filteredHeroes = heroes.filter((h) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      h.codename.toLowerCase().includes(q) ||
      h.civilianName.toLowerCase().includes(q) ||
      h.team.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q) ||
      (h.powerTypes && h.powerTypes.some((pt) => pt.toLowerCase().includes(q))) ||
      (h.powersAndCompetencies && h.powersAndCompetencies.toLowerCase().includes(q));

    // Power Type Filter
    const matchesPowerType = powerTypeFilter
      ? h.powerTypes && h.powerTypes.includes(powerTypeFilter as PowerType)
      : true;

    // Rank Hierarchical Filter
    const matchesRank = rankFilter ? h.rankLetter === rankFilter : true;

    // Operational Status Filter
    const matchesStatus = statusFilter
      ? h.status.toLowerCase().startsWith(statusFilter.toLowerCase().slice(0, 4))
      : true;

    // Threat Level Filter
    const matchesThreat = threatFilter ? h.threatLevel === threatFilter : true;

    return matchesSearch && matchesPowerType && matchesRank && matchesStatus && matchesThreat;
  });

  // Sort filtered heroes strictly by rank hierarchy (S > A > B > C, then numerical worldRank)
  filteredHeroes.sort(compareHeroesHierarchical);

  const getStatusBadge = (statusStr: string) => {
    const s = (statusStr || '').toUpperCase();
    if (s.includes('FALEC')) {
      return 'border-[#ff003c]/60 text-[#ff003c] bg-red-950/40';
    }
    if (s.includes('INATIV')) {
      return 'border-[#ffcc00]/60 text-[#ffcc00] bg-yellow-950/40';
    }
    if (s.includes('DESCON')) {
      return 'border-[#7e9bb5]/60 text-[#7e9bb5] bg-slate-900/60';
    }
    return 'border-[#00ff66]/60 text-[#00ff66] bg-green-950/40';
  };

  return (
    <div id="view-heroes" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#16283d] pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-mono-cyber font-bold text-[#e2f1ff] tracking-wider">
              BANCO DE DADOS DE HERÓIS
            </h2>
            <span className="text-xs px-2.5 py-0.5 border border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff]/10 rounded-full font-mono-cyber">
              {filteredHeroes.length} / {heroes.length} HERÓIS
            </span>
            {!isAdmin && (
              <span className="text-[10px] px-2 py-0.5 border border-[#7e9bb5]/40 text-[#7e9bb5] bg-[#05080d] rounded flex items-center gap-1 font-mono-cyber">
                <Lock size={10} />
                MODO PÚBLICO (CONSULTA)
              </span>
            )}
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber mt-1">
            ARQUIVO CENTRAL DE REGISTROS DE SUPER-HUMANOS // DOSSIÊS CLASSIFICADOS
          </p>
        </div>

        {isAdmin && (
          <button
            id="adminAddHeroBtn"
            onClick={onOpenNewHero}
            className="hud-button hud-button-active px-3.5 py-2 text-xs font-mono-cyber flex items-center space-x-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.3)]"
          >
            <Plus size={14} />
            <span>CADASTRAR NOVO HERÓI</span>
          </button>
        )}
      </div>

      {/* Filter Control Bar */}
      <div className="hud-border p-3.5 bg-[#09101a] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono-cyber text-[#7e9bb5] border-b border-[#16283d]/60 pb-2">
          <span className="flex items-center gap-1.5 text-[#00f3ff] font-semibold">
            <Filter size={13} />
            <span>SISTEMA DE FILTRAGEM MULTICRITÉRIO</span>
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-mono-cyber text-[#ffcc00] hover:text-[#00f3ff] flex items-center gap-1 cursor-pointer transition-colors bg-[#05080d] px-2.5 py-1 rounded border border-[#16283d]"
            >
              <RotateCcw size={11} />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-[#7e9bb5]" size={14} />
            <input
              id="heroesSearchInput"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar codinome, civil..."
              className="bg-[#05080d] border border-[#16283d] rounded pl-8 pr-3 py-2 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff] w-full"
            />
          </div>

          {/* Tipo de Poder */}
          <select
            id="heroesFilterPowerType"
            value={powerTypeFilter}
            onChange={(e) => setPowerTypeFilter(e.target.value)}
            className="bg-[#05080d] border border-[#16283d] rounded px-3 py-2 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff]"
          >
            <option value="">Tipo de Poder: Todos</option>
            {POWER_TYPE_OPTIONS.map((pt) => (
              <option key={pt} value={pt}>
                Poder: {pt}
              </option>
            ))}
          </select>

          {/* Rank Hierárquico (S, A, B, C) */}
          <select
            id="heroesFilterRankLetter"
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
            className="bg-[#05080d] border border-[#16283d] rounded px-3 py-2 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff]"
          >
            <option value="">Rank Hierárquico: Todos</option>
            <option value="S">Rank S (Supremo / Elite)</option>
            <option value="A">Rank A (Alto Desempenho)</option>
            <option value="B">Rank B (Intervenção Tática)</option>
            <option value="C">Rank C (Suporte / Operações)</option>
          </select>

          {/* Status Operacional */}
          <select
            id="heroesFilterStatus"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#05080d] border border-[#16283d] rounded px-3 py-2 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff]"
          >
            <option value="">Status Operacional: Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Desconhecido">Desconhecido</option>
            <option value="Falecido">Falecido</option>
          </select>

          {/* Nível de Ameaça */}
          <select
            id="heroesFilterThreat"
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="bg-[#05080d] border border-[#16283d] rounded px-3 py-2 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff]"
          >
            <option value="">Nível de Ameaça: Todos</option>
            <option value="Urbano">Ameaça: Urbano</option>
            <option value="Nacional">Ameaça: Nacional</option>
            <option value="Global">Ameaça: Global</option>
            <option value="Interplanetário">Ameaça: Interplanetário</option>
            <option value="Ômega">Ameaça: Ômega</option>
          </select>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredHeroes.length === 0 ? (
        <div className="hud-border p-12 text-center space-y-4 bg-[#09101a]/60">
          <Shield size={32} className="mx-auto text-[#00f3ff]/40" />
          <div className="font-mono-cyber text-sm text-[#e2f1ff] font-semibold">
            NENHUM REGISTRO DE HERÓI ENCONTRADO
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber max-w-md mx-auto">
            {hasActiveFilters
              ? 'Nenhum super-humano corresponde à combinação de filtros selecionados. Tente ajustar ou limpar os critérios.'
              : 'Não há heróis cadastrados no banco de dados ainda.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={handleClearFilters}
              className="hud-button px-4 py-2 text-xs font-mono-cyber inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>LIMPAR FILTROS</span>
            </button>
          ) : (
            isAdmin && (
              <button
                onClick={onOpenNewHero}
                className="hud-button hud-button-active px-4 py-2 text-xs font-mono-cyber inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>CADASTRAR PRIMEIRO HERÓI</span>
              </button>
            )
          )}
        </div>
      ) : (
        <div id="heroesGridContainer" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHeroes.map((h) => {
            const threatStyle = getThreatLevelStyle(h.threatLevel);
            const rankCode = formatHeroRank(h.rankLetter, h.worldRank);

            return (
              <div
                key={h.id}
                className="hud-border p-4 flex flex-col justify-between hover:border-[#00f3ff] transition-all group bg-[#09101a]"
              >
                <div>
                  {/* Card Top Strip with Position and Rank together: e.g. #S-001 */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-1.5 whitespace-nowrap shrink-0">
                      <span className="font-mono-cyber font-bold text-xs text-[#00f3ff] px-2 py-0.5 bg-[#05080d] border border-[#00f3ff]/40 rounded shadow-[0_0_8px_rgba(0,243,255,0.2)] whitespace-nowrap shrink-0 inline-block">
                        {rankCode}
                      </span>
                      <span className="text-[10px] font-mono-cyber px-1.5 py-0.5 bg-[#05080d] border border-[#16283d] text-[#7e9bb5] rounded whitespace-nowrap shrink-0">
                        POS #{h.worldRank}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border whitespace-nowrap shrink-0 ${threatStyle.badgeClass}`}
                    >
                      {h.threatLevel}
                    </span>
                  </div>

                  {/* Portrait Preview 9:16 */}
                  <div
                    onClick={() => onSelectHero(h.id)}
                    className="w-full aspect-[9/16] mb-3 border border-[#16283d] overflow-hidden relative group-hover:border-[#00f3ff] transition-colors cursor-pointer bg-[#05080d] rounded-sm"
                  >
                    <img
                      src={h.portrait}
                      alt={h.codename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {h.civilianPortrait && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#05080d]/85 backdrop-blur border border-[#00f3ff]/40 text-[#00f3ff] rounded font-mono-cyber">
                          2 FOTOS
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 space-y-1">
                      <div className="text-xs font-mono-cyber text-[#00f3ff] font-semibold">{h.team}</div>
                      <div className="flex items-center justify-between text-[10px] text-[#7e9bb5] font-mono-cyber">
                        <span className="flex items-center gap-1 text-[#e2f1ff]">
                          <User size={11} className="text-[#00f3ff]" />
                          <span>{formatFollowers(h.followers ?? 0)}</span>
                        </span>
                        {h.popularity !== undefined && (
                          <span>
                            POP: <span className="text-[#00f3ff] font-bold">{h.popularity}%</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <h4
                    onClick={() => onSelectHero(h.id)}
                    className="font-mono-cyber font-bold text-[#e2f1ff] text-base group-hover:text-[#00f3ff] cursor-pointer transition-colors"
                  >
                    {h.codename}
                  </h4>
                  <div className="text-xs text-[#7e9bb5] font-mono-cyber mb-2">
                    {h.civilianName} — {h.country}
                  </div>

                  {/* Power Type Badges with Congruent Colors */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono-cyber mb-3">
                    {h.powerTypes && h.powerTypes.length > 0 ? (
                      h.powerTypes.map((pt) => {
                        const style = getPowerTypeStyle(pt);
                        return (
                          <span
                            key={pt}
                            className={`px-1.5 py-0.5 border text-[10px] font-mono-cyber font-medium rounded-xs ${style.badgeClass}`}
                          >
                            {pt}
                          </span>
                        );
                      })
                    ) : (
                      <span className="px-1.5 py-0.5 bg-[#05080d] border border-[#16283d] text-[#7e9bb5]">
                        Não especificado
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 border font-semibold text-[10px] rounded-xs ${getStatusBadge(
                        h.status
                      )}`}
                    >
                      {h.status}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex space-x-1.5 pt-2 border-t border-[#16283d]">
                  <button
                    onClick={() => onSelectHero(h.id)}
                    className="hud-button w-full py-1 text-xs font-mono-cyber flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>ACESSAR FICHA</span>
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEditHero(h)}
                        className="px-2.5 py-1 text-xs font-mono-cyber border border-[#ffcc00] text-[#ffcc00] bg-yellow-950/20 hover:bg-yellow-950/40 rounded flex items-center cursor-pointer transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => onDeleteHero(h.id)}
                        className="px-2.5 py-1 text-xs font-mono-cyber border border-[#ff003c] text-[#ff003c] bg-red-950/20 hover:bg-red-950/40 rounded flex items-center cursor-pointer transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
