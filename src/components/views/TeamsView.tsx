import React from 'react';
import { Team, Hero } from '../../types';
import { Plus, Users, Edit2, Trash2, Shield, Lock } from 'lucide-react';
import { formatHeroRank } from '../../utils/threatColors';

interface TeamsViewProps {
  teams: Team[];
  heroes: Hero[];
  onSelectHeroByCodename: (codename: string) => void;
  onOpenNewTeam: () => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  isAdmin: boolean;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  heroes,
  onSelectHeroByCodename,
  onOpenNewTeam,
  onEditTeam,
  onDeleteTeam,
  isAdmin,
}) => {
  return (
    <div id="view-teams" className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#16283d] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-mono-cyber font-bold text-[#e2f1ff] tracking-wider">
              ALIANÇAS E EQUIPES TÁTICAS
            </h2>
            {!isAdmin && (
              <span className="text-[10px] px-2 py-0.5 border border-[#7e9bb5]/40 text-[#7e9bb5] bg-[#05080d] rounded flex items-center gap-1 font-mono-cyber">
                <Lock size={10} />
                MODO PÚBLICO
              </span>
            )}
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber mt-1">
            GRUPOS DE INTERVENÇÃO, FORÇAS ESPECIAIS E COOPERAÇÃO INTERNACIONAL
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenNewTeam}
            className="hud-button hud-button-active px-3.5 py-1.5 text-xs font-mono-cyber flex items-center space-x-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.3)]"
          >
            <Plus size={14} />
            <span>NOVA EQUIPE</span>
          </button>
        )}
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="hud-border p-12 text-center space-y-3 bg-[#09101a]/60">
          <Users size={32} className="mx-auto text-[#00f3ff]/40" />
          <div className="font-mono-cyber text-sm text-[#e2f1ff] font-semibold">
            NENHUMA EQUIPE TÁTICA REGISTRADA
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber max-w-md mx-auto">
            Organize alianças e forças especiais cadastrando as equipes responsáveis pela contenção de ameaças.
          </p>
          {isAdmin && (
            <button
              onClick={onOpenNewTeam}
              className="hud-button hud-button-active px-4 py-2 text-xs font-mono-cyber inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>CADASTRAR PRIMEIRA EQUIPE</span>
            </button>
          )}
        </div>
      ) : (
        <div id="teamsContainer" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((t) => {
            // Count registered heroes in this team
            const teamHeroes = heroes.filter(
              (h) => h.team.toUpperCase() === t.name.toUpperCase()
            );

            // Combine specified members and registered heroes
            const allMemberNames = Array.from(
              new Set([...(t.members || []), ...teamHeroes.map((h) => h.codename)])
            );

            const isImageUrl = t.emblem && (t.emblem.startsWith('http') || t.emblem.startsWith('/'));

            return (
              <div key={t.id} className="hud-border p-5 space-y-4 bg-[#09101a] hover:border-[#00f3ff]/60 transition-colors">
                <div className="flex justify-between items-start border-b border-[#16283d] pb-3">
                  <div className="flex items-center space-x-3">
                    {isImageUrl ? (
                      <div className="w-12 h-12 aspect-square rounded border border-[#00f3ff]/60 overflow-hidden bg-[#05080d] flex-shrink-0 shadow-[0_0_8px_rgba(0,243,255,0.25)]">
                        <img
                          src={t.emblem}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 hud-border flex items-center justify-center text-[#00f3ff] font-mono-cyber font-bold text-lg hud-border-glow bg-[#05080d]">
                        {t.emblem || 'Ω'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="font-mono-cyber font-bold text-[#e2f1ff] text-lg">{t.name}</h3>
                        {t.abbreviation && (
                          <span className="text-[10px] font-mono-cyber px-1.5 py-0.5 bg-[#05080d] border border-[#00f3ff]/40 text-[#00f3ff] rounded font-bold">
                            {t.abbreviation}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#7e9bb5] font-mono-cyber">{t.scope}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded bg-[#05080d] border border-[#00f3ff] text-[#00f3ff] font-mono-cyber text-xs font-bold">
                      {t.rank}
                    </span>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEditTeam(t)}
                          className="p-1.5 text-[#ffcc00] hover:bg-yellow-950/40 rounded border border-[#ffcc00]/30 transition-colors cursor-pointer"
                          title="Editar Equipe"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteTeam(t.id)}
                          className="p-1.5 text-[#ff003c] hover:bg-red-950/40 rounded border border-[#ff003c]/30 transition-colors cursor-pointer"
                          title="Excluir Equipe"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs font-mono-cyber text-[#e2f1ff] leading-relaxed">
                  {t.desc || 'Divisão tática atuando em cooperação com o Alto Conselho.'}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#16283d]">
                  <div className="text-xs font-mono-cyber text-[#7e9bb5] flex justify-between">
                    <span>INTEGRANTES ({allMemberNames.length}):</span>
                    <span className="text-[#00f3ff]">{teamHeroes.length} heróis com dossiê</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {allMemberNames.map((m, idx) => {
                      const heroObj = heroes.find(
                        (x) => x.codename.toUpperCase() === m.toUpperCase()
                      );
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (heroObj) onSelectHeroByCodename(m);
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-mono-cyber transition-colors cursor-pointer ${
                            heroObj
                              ? 'bg-[#05080d] border border-[#00f3ff]/50 text-[#00f3ff] hover:bg-[#00f3ff]/20 shadow-[0_0_6px_rgba(0,243,255,0.15)]'
                              : 'bg-[#05080d] border border-[#16283d] text-[#7e9bb5]'
                          }`}
                          title={heroObj ? `Acessar dossiê de ${m}` : 'Membro não cadastrado no banco'}
                        >
                          {m} {heroObj && `(${formatHeroRank(heroObj.rankLetter, heroObj.worldRank)})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
