import React, { useState, useEffect } from 'react';
import { Hero } from '../../types';
import { Search, Filter, ArrowUpDown, Plus, Eye, Edit2, Trash2, ShieldAlert, Lock, User, Sparkles, RotateCcw } from 'lucide-react';
import { getPowerTypeStyle, sortPowerTypes } from '../../utils/powerColors';
import { getThreatLevelStyle, formatFollowers, formatHeroRank, compareHeroesHierarchical } from '../../utils/threatColors';

interface RankingViewProps {
  heroes: Hero[];
  onSelectHero: (heroId: string) => void;
  onEditHero: (hero: Hero) => void;
  onDeleteHero: (heroId: string) => void;
  onOpenNewHero: () => void;
  isAdmin: boolean;
  initialSearchQuery?: string;
}

export const RankingView: React.FC<RankingViewProps> = ({
  heroes,
  onSelectHero,
  onEditHero,
  onDeleteHero,
  onOpenNewHero,
  isAdmin,
  initialSearchQuery = '',
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [rankLetterFilter, setRankLetterFilter] = useState('');
  const [threatFilter, setThreatFilter] = useState('');
  const [sortBy, setSortBy] = useState<'hierarchical' | 'popularity' | 'followers'>('hierarchical');

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const hasActiveFilters = Boolean(search || rankLetterFilter || threatFilter || sortBy !== 'hierarchical');

  const handleClearFilters = () => {
    setSearch('');
    setRankLetterFilter('');
    setThreatFilter('');
    setSortBy('hierarchical');
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

    const matchesRank = rankLetterFilter ? h.rankLetter === rankLetterFilter : true;
    const matchesThreat = threatFilter ? h.threatLevel === threatFilter : true;
    return matchesSearch && matchesRank && matchesThreat;
  });

  // Sorting strictly enforcing hierarchy: S > A > B > C, then numerical worldRank
  filteredHeroes.sort((a, b) => {
    if (sortBy === 'popularity') return (b.popularity ?? 0) - (a.popularity ?? 0);
    if (sortBy === 'followers') return (b.followers ?? 0) - (a.followers ?? 0);
    return compareHeroesHierarchical(a, b);
  });

  const getStatusBadgeClass = (statusStr: string) => {
    const s = (statusStr || '').toUpperCase();
    if (s.includes('FALEC')) {
      return 'text-[#ff003c] bg-red-950/40 border-[#ff003c]/40';
    }
    if (s.includes('INATIV')) {
      return 'text-[#ffcc00] bg-yellow-950/40 border-[#ffcc00]/40';
    }
    if (s.includes('DESCON')) {
      return 'text-[#7e9bb5] bg-slate-900/60 border-[#7e9bb5]/40';
    }
    return 'text-[#00ff66] bg-green-950/40 border-[#00ff66]/40';
  };

  return (
    <div id="view-ranking" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#16283d] pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-mono-cyber font-bold text-[#e2f1ff] tracking-wider">
              RANKING MUNDIAL DE HERÓIS
            </h2>
            <span className="text-xs px-2.5 py-0.5 border border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff]/10 rounded-full font-mono-cyber">
              {filteredHeroes.length} REGISTRADOS
            </span>
            {!isAdmin && (
              <span className="text-[10px] px-2 py-0.5 border border-[#7e9bb5]/40 text-[#7e9bb5] bg-[#05080d] rounded flex items-center gap-1 font-mono-cyber">
                <Lock size={10} />
                MODO PÚBLICO
              </span>
            )}
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber mt-1">
            ORDENAÇÃO HIERÁRQUICA C.Y.P.H.E.R. // RANK S &gt; RANK A &gt; RANK B &gt; RANK C
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-2.5 top-2.5 text-[#7e9bb5]" size={14} />
            <input
              id="rankingSearchInput"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar codinome, civil, país..."
              className="bg-[#09101a] border border-[#16283d] rounded pl-8 pr-3 py-1.5 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff] w-full"
            />
          </div>

          <select
            id="rankingFilterRankLetter"
            value={rankLetterFilter}
            onChange={(e) => setRankLetterFilter(e.target.value)}
            className="bg-[#09101a] border border-[#16283d] rounded px-3 py-1.5 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff]"
          >
            <option value="">Rank: Todos (S &gt; A &gt; B &gt; C)</option>
            <option value="S">Classe S (Supremo)</option>
            <option value="A">Classe A (Alto Desempenho)</option>
            <option value="B">Classe B (Intervenção Tática)</option>
            <option value="C">Classe C (Suporte e Operações)</option>
          </select>

          <select
            id="rankingFilterThreat"
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="bg-[#09101a] border border-[#16283d] rounded px-3 py-1.5 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff]"
          >
            <option value="">Ameaça: Todos</option>
            <option value="Urbano">Ameaça: Urbano</option>
            <option value="Nacional">Ameaça: Nacional</option>
            <option value="Global">Ameaça: Global</option>
            <option value="Interplanetário">Ameaça: Interplanetário</option>
            <option value="Ômega">Ameaça: Ômega</option>
          </select>

          <select
            id="rankingSortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#09101a] border border-[#16283d] rounded px-3 py-1.5 text-xs font-mono-cyber text-[#e2f1ff] focus:outline-none focus:border-[#00f3ff]"
          >
            <option value="hierarchical">Ordenar: Hierarquia (S &gt; A &gt; B &gt; C)</option>
            <option value="popularity">Ordenar: Popularidade</option>
            <option value="followers">Ordenar: Seguidores</option>
          </select>

          {hasActiveFilters && (
            <button
              id="rankingClearFiltersBtn"
              onClick={handleClearFilters}
              className="text-xs font-mono-cyber text-[#ffcc00] hover:text-[#00f3ff] flex items-center gap-1 cursor-pointer transition-colors bg-[#05080d] px-2.5 py-1.5 rounded border border-[#16283d] hover:border-[#ffcc00]/50 shrink-0 shadow-sm"
              title="Limpar todos os filtros e busca"
            >
              <RotateCcw size={12} />
              <span>Limpar Filtros</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenNewHero}
              className="hud-button hud-button-active px-3 py-1.5 text-xs font-mono-cyber flex items-center space-x-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.3)]"
            >
              <Plus size={14} />
              <span>NOVO HERÓI</span>
            </button>
          )}
        </div>
      </div>

      {/* Ranking Table */}
      <div className="hud-border overflow-x-auto bg-[#09101a]/80">
        <table className="w-full text-left font-mono-cyber text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#16283d] text-[#00f3ff] bg-[#09101a]">
              <th className="p-3">POS</th>
              <th className="p-3">RETRATO (9:16)</th>
              <th className="p-3">CODINOME / CIVIL</th>
              <th className="p-3">EQUIPE / PAÍS</th>
              <th className="p-3">TIPO DE PODER</th>
              <th className="p-3 text-center">SEGUIDORES</th>
              <th className="p-3 text-center">POPULARIDADE</th>
              <th className="p-3 text-center">AMEAÇA</th>
              <th className="p-3 text-center">STATUS</th>
              <th className="p-3 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody id="rankingTableBody" className="divide-y divide-[#16283d]/50">
            {filteredHeroes.map((h, idx) => {
              const displayPosition = idx + 1;
              const threatStyle = getThreatLevelStyle(h.threatLevel);
              return (
                <tr
                  key={h.id}
                  className="hover:bg-[#00f3ff]/5 transition-colors border-b border-[#16283d]/30"
                >
                  {/* Position Badge with Rank Letter (e.g. #S-001) */}
                  <td className="p-3 font-bold text-sm text-[#00f3ff] whitespace-nowrap shrink-0">
                    <div className="flex items-center space-x-2 whitespace-nowrap shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded font-mono-cyber whitespace-nowrap shrink-0 ${
                          displayPosition === 1
                            ? 'bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00] shadow-[0_0_8px_rgba(255,204,0,0.25)]'
                            : displayPosition === 2
                            ? 'bg-slate-300/20 text-slate-200 border border-slate-300'
                            : displayPosition === 3
                            ? 'bg-amber-700/20 text-amber-500 border border-amber-600'
                            : 'bg-[#05080d] border border-[#16283d] text-[#00f3ff]'
                        }`}
                      >
                        {formatHeroRank(h.rankLetter, h.worldRank)}
                      </span>
                      <span className="text-[10px] text-[#7e9bb5] font-mono-cyber whitespace-nowrap shrink-0">
                        {displayPosition}º
                      </span>
                    </div>
                  </td>

                  {/* Portrait thumbnail in 9:16 */}
                  <td className="p-3">
                    <div
                      onClick={() => onSelectHero(h.id)}
                      className="w-10 h-16 aspect-[9/16] rounded border border-[#16283d] overflow-hidden cursor-pointer hover:border-[#00f3ff] transition-colors relative bg-[#05080d]"
                    >
                      <img
                        src={h.portrait}
                        alt={h.codename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      {h.civilianPortrait && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00f3ff] rounded-tl-sm" title="2 fotos disponíveis"></div>
                      )}
                    </div>
                  </td>

                  {/* Codename & Civilian */}
                  <td className="p-3">
                    <div
                      onClick={() => onSelectHero(h.id)}
                      className="font-bold text-[#e2f1ff] cursor-pointer hover:text-[#00f3ff] transition-colors flex items-center space-x-1.5"
                    >
                      <span>{h.codename}</span>
                      <span className="text-[10px] px-1 py-0.2 bg-[#05080d] border border-[#00f3ff]/30 text-[#00f3ff] rounded">
                        {h.rankLetter}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#7e9bb5]">{h.civilianName}</div>
                  </td>

                  {/* Team & Country */}
                  <td className="p-3">
                    <div className="font-semibold text-[#e2f1ff]">{h.team || 'INDEPENDENTE'}</div>
                    <div className="text-[10px] text-[#7e9bb5]">{h.country}</div>
                  </td>

                  {/* Power Types with Congruent Badges */}
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {h.powerTypes && h.powerTypes.length > 0 ? (
                        sortPowerTypes(h.powerTypes).map((pt) => {
                          const style = getPowerTypeStyle(pt);
                          return (
                            <span
                              key={pt}
                              className={`px-1.5 py-0.5 rounded border text-[10px] font-mono-cyber ${style.badgeClass}`}
                            >
                              {pt}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-[#7e9bb5]">—</span>
                      )}
                    </div>
                  </td>

                  {/* Followers with Person Icon */}
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono-cyber text-[#e2f1ff] bg-[#05080d] px-2 py-0.5 rounded border border-[#16283d]">
                      <User size={12} className="text-[#00f3ff]" />
                      <span className="font-semibold">{formatFollowers(h.followers ?? 0)}</span>
                    </span>
                  </td>

                  {/* Popularity */}
                  <td className="p-3 text-center text-[#00f3ff] font-semibold">
                    {h.popularity ?? 0}%
                  </td>

                  {/* Threat Level */}
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded font-bold border text-[11px] ${threatStyle.badgeClass}`}
                    >
                      {h.threatLevel}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${getStatusBadgeClass(
                        h.status
                      )}`}
                    >
                      {h.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onSelectHero(h.id)}
                        className="hud-button px-2.5 py-1 text-[10px] flex items-center space-x-1 cursor-pointer"
                        title="Ver Dossiê do Herói"
                      >
                        <Eye size={12} />
                        <span>VER</span>
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEditHero(h)}
                            className="px-2.5 py-1 text-[10px] border border-[#ffcc00] text-[#ffcc00] bg-yellow-950/20 hover:bg-yellow-950/40 rounded flex items-center space-x-1 font-mono-cyber cursor-pointer transition-colors"
                            title="Editar Registro"
                          >
                            <Edit2 size={12} />
                            <span>EDIT</span>
                          </button>
                          <button
                            onClick={() => onDeleteHero(h.id)}
                            className="px-2.5 py-1 text-[10px] border border-[#ff003c] text-[#ff003c] bg-red-950/20 hover:bg-red-950/40 rounded flex items-center space-x-1 font-mono-cyber cursor-pointer transition-colors"
                            title="Excluir Registro"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
