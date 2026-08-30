import React from 'react';
import { RankingChange } from '../../types';
import { Plus, TrendingUp, TrendingDown, Edit2, Trash2, Activity, Lock } from 'lucide-react';

interface ChangesViewProps {
  changes: RankingChange[];
  onOpenNewChange: () => void;
  onEditChange: (change: RankingChange) => void;
  onDeleteChange: (changeId: string) => void;
  isAdmin: boolean;
}

export const ChangesView: React.FC<ChangesViewProps> = ({
  changes,
  onOpenNewChange,
  onEditChange,
  onDeleteChange,
  isAdmin,
}) => {
  return (
    <div id="view-changes" className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#16283d] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-mono-cyber font-bold text-[#e2f1ff] tracking-wider">
              ALTERAÇÕES RECENTES NO RANKING
            </h2>
            {!isAdmin && (
              <span className="text-[10px] px-2 py-0.5 border border-[#7e9bb5]/40 text-[#7e9bb5] bg-[#05080d] rounded flex items-center gap-1 font-mono-cyber">
                <Lock size={10} />
                MODO PÚBLICO
              </span>
            )}
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber mt-1">
            REGISTRO HISTÓRICO DE PROMOÇÕES, QUEDAS HIERÁRQUICAS E REAJUSTES DO CONSELHO
          </p>
        </div>

        {isAdmin && (
          <button
            id="adminAddChangeBtn"
            onClick={onOpenNewChange}
            className="hud-button hud-button-active px-3.5 py-1.5 text-xs font-mono-cyber flex items-center space-x-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.3)]"
          >
            <Plus size={14} />
            <span>REGISTRAR MUDANÇA</span>
          </button>
        )}
      </div>

      {/* Changes List */}
      {changes.length === 0 ? (
        <div className="hud-border p-12 text-center space-y-3 bg-[#09101a]/60">
          <Activity size={32} className="mx-auto text-[#00f3ff]/40" />
          <div className="font-mono-cyber text-sm text-[#e2f1ff] font-semibold">
            NENHUMA ALTERAÇÃO REGISTRADA NO LOG
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber max-w-md mx-auto">
            Utilize o botão acima para documentar promoções, rebaixamentos e reavaliações táticas de super-humanos.
          </p>
          {isAdmin && (
            <button
              onClick={onOpenNewChange}
              className="hud-button hud-button-active px-4 py-2 text-xs font-mono-cyber inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>REGISTRAR PRIMEIRA ALTERAÇÃO</span>
            </button>
          )}
        </div>
      ) : (
        <div id="changesContainer" className="space-y-3">
          {changes.map((ch) => {
            const isUp = ch.type === 'up';

            return (
              <div
                key={ch.id}
                className="hud-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#09101a] hover:border-[#00f3ff]/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 hud-border flex items-center justify-center font-mono-cyber font-bold text-lg ${
                      isUp
                        ? 'text-[#00ff66] border-[#00ff66]/50 bg-green-950/20'
                        : 'text-[#ff003c] border-[#ff003c]/50 bg-red-950/20'
                    }`}
                  >
                    {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <h4 className="font-mono-cyber font-bold text-[#e2f1ff] text-base">{ch.hero}</h4>
                    <div className="text-xs font-mono-cyber text-[#7e9bb5]">
                      MOTIVO: <span className="text-[#e2f1ff]">{ch.reason}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                  <span
                    className={`font-mono-cyber font-bold text-sm px-3 py-1 rounded bg-[#05080d] border border-[#16283d] ${
                      isUp ? 'text-[#00ff66]' : 'text-[#ff003c]'
                    }`}
                  >
                    {ch.change}
                  </span>
                  <span className="text-xs font-mono-cyber text-[#7e9bb5]">{ch.date}</span>

                  {isAdmin && (
                    <div className="flex items-center space-x-1 pl-2">
                      <button
                        onClick={() => onEditChange(ch)}
                        className="p-1.5 text-[#ffcc00] hover:bg-yellow-950/40 rounded border border-[#ffcc00]/30 transition-colors cursor-pointer"
                        title="Editar Mudança"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => onDeleteChange(ch.id)}
                        className="p-1.5 text-[#ff003c] hover:bg-red-950/40 rounded border border-[#ff003c]/30 transition-colors cursor-pointer"
                        title="Excluir Mudança"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
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
