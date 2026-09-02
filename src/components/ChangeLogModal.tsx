import React, { useState, useEffect } from 'react';
import { RankingChange, Hero } from '../types';
import { X, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatHeroRank } from '../utils/threatColors';

interface ChangeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (change: RankingChange) => void;
  availableHeroes: Hero[];
  initialData?: RankingChange | null;
}

export const ChangeLogModal: React.FC<ChangeLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  availableHeroes,
  initialData,
}) => {
  const [hero, setHero] = useState('');
  const [change, setChange] = useState('');
  const [type, setType] = useState<'up' | 'down'>('up');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setHero(initialData.hero || '');
      setChange(initialData.change || '');
      setType(initialData.type || 'up');
      setReason(initialData.reason || '');
      setDate(initialData.date || '');
    } else {
      setHero(availableHeroes[0]?.codename || '');
      setChange('S-004 → S-001');
      setType('up');
      setReason('');
      setDate(new Date().toLocaleDateString('pt-BR'));
    }
  }, [initialData, isOpen, availableHeroes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero.trim() || !change.trim()) return;

    const changeToSave: RankingChange = {
      id: initialData?.id || 'ch_' + Date.now(),
      hero: hero.trim().toUpperCase(),
      change: change.trim(),
      type,
      reason: reason.trim() || 'Atualização oficial do conselho.',
      date: date.trim() || new Date().toLocaleDateString('pt-BR'),
    };

    onSave(changeToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="hud-border hud-border-glow p-6 max-w-lg w-full bg-[#09101a] space-y-4 my-8 relative">
        <div className="flex justify-between items-center border-b border-[#16283d] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="text-[#00f3ff]" size={18} />
            <h3 className="font-mono-cyber font-bold text-[#00f3ff] text-base tracking-wider">
              {initialData ? 'EDITAR ALTERAÇÃO HIERÁRQUICA' : 'REGISTRAR MUDANÇA NO RANKING'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7e9bb5] hover:text-[#00f3ff] font-mono-cyber p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono-cyber text-xs">
          <div>
            <label className="block text-[#7e9bb5] mb-1 font-medium">Codinome do Herói *:</label>
            {availableHeroes.length > 0 ? (
              <div className="space-y-1">
                <select
                  value={hero}
                  onChange={(e) => setHero(e.target.value)}
                  className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
                >
                  <option value="">Selecione um herói ou digite...</option>
                  {availableHeroes.map((h) => (
                    <option key={h.id} value={h.codename}>
                      {formatHeroRank(h.rankLetter, h.worldRank)} — {h.codename} ({h.team})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={hero}
                  onChange={(e) => setHero(e.target.value)}
                  placeholder="Ou digite o codinome diretamente..."
                  className="w-full bg-[#05080d] border border-[#16283d] p-2 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase text-[11px]"
                />
              </div>
            ) : (
              <input
                type="text"
                required
                value={hero}
                onChange={(e) => setHero(e.target.value)}
                placeholder="Ex: ARCANA"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Mudança Hierárquica *:</label>
              <input
                type="text"
                required
                value={change}
                onChange={(e) => setChange(e.target.value)}
                placeholder="Ex: S-004 → S-001 ou S-001 → S-002"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Direção do Movimento:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('up')}
                  className={`p-2 rounded border flex items-center justify-center space-x-1 font-bold ${
                    type === 'up'
                      ? 'bg-green-950/40 border-[#00ff66] text-[#00ff66]'
                      : 'bg-[#05080d] border-[#16283d] text-[#7e9bb5]'
                  }`}
                >
                  <TrendingUp size={14} />
                  <span>Subida (▲)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('down')}
                  className={`p-2 rounded border flex items-center justify-center space-x-1 font-bold ${
                    type === 'down'
                      ? 'bg-red-950/40 border-[#ff003c] text-[#ff003c]'
                      : 'bg-[#05080d] border-[#16283d] text-[#7e9bb5]'
                  }`}
                >
                  <TrendingDown size={14} />
                  <span>Queda (▼)</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#7e9bb5] mb-1 font-medium">Data do Registro:</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Ex: 28/08/2026"
              className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#7e9bb5] mb-1 font-medium">Motivo / Justificativa Tática *:</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Conclusão bem-sucedida da Operação Eclipse com contenção absoluta..."
              className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#16283d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#05080d] border border-[#16283d] text-[#7e9bb5] rounded hover:text-[#e2f1ff]"
            >
              CANCELAR
            </button>
            <button type="submit" className="hud-button hud-button-active px-5 py-2 font-bold">
              GRAVAR NO LOG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
