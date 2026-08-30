import React, { useState, useEffect } from 'react';
import { Team, Hero } from '../types';
import { X, Users, Plus, Trash2, Image as ImageIcon, Sparkles, Shield } from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Team) => void;
  initialData?: Team | null;
  availableHeroes: Hero[];
}

const SAMPLE_TEAM_EMBLEMS = [
  { name: 'Cintilla', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400' },
  { name: 'Cypher', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=400' },
  { name: 'Maxwaves', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=400' },
  { name: 'Vanguard', url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=400' },
];

export const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableHeroes,
}) => {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [emblem, setEmblem] = useState('');
  const [scope, setScope] = useState('');
  const [rank, setRank] = useState('#1');
  const [desc, setDesc] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [customMember, setCustomMember] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAbbreviation(initialData.abbreviation || '');
      setEmblem(initialData.emblem || '');
      setScope(initialData.scope || '');
      setRank(initialData.rank || '#1');
      setDesc(initialData.desc || '');
      setSelectedMembers(initialData.members || []);
    } else {
      setName('');
      setAbbreviation('');
      setEmblem('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=400');
      setScope('');
      setRank('#1');
      setDesc('');
      setSelectedMembers([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleToggleHeroMember = (codename: string) => {
    if (selectedMembers.includes(codename)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== codename));
    } else {
      setSelectedMembers([...selectedMembers, codename]);
    }
  };

  const handleAddCustomMember = () => {
    if (customMember.trim() && !selectedMembers.includes(customMember.trim().toUpperCase())) {
      setSelectedMembers([...selectedMembers, customMember.trim().toUpperCase()]);
      setCustomMember('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const teamToSave: Team = {
      id: initialData?.id || 't_' + Date.now(),
      name: name.trim().toUpperCase(),
      abbreviation: abbreviation.trim().toUpperCase() || undefined,
      emblem: emblem.trim() || 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=400',
      scope: scope.trim() || 'Internacional / Global',
      rank: rank.trim() || '#1',
      desc: desc.trim(),
      members: selectedMembers,
      count: selectedMembers.length,
    };

    onSave(teamToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="hud-border hud-border-glow p-6 max-w-2xl w-full bg-[#09101a] space-y-4 my-8 relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#16283d] pb-3 sticky -top-6 bg-[#09101a] z-10">
          <div className="flex items-center space-x-2">
            <Users className="text-[#00f3ff]" size={18} />
            <h3 className="font-mono-cyber font-bold text-[#00f3ff] text-base tracking-wider">
              {initialData ? 'EDITAR EQUIPE TÁTICA' : 'REGISTRAR NOVA EQUIPE'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7e9bb5] hover:text-[#00f3ff] font-mono-cyber p-1 rounded cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono-cyber text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#7e9bb5] mb-1 font-medium">Nome da Equipe *:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: CYPHER"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Sigla / Abreviação (Opcional):</label>
              <input
                type="text"
                maxLength={6}
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value.toUpperCase())}
                placeholder="Ex: CYP"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase font-bold tracking-wider"
              />
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Classificação Hierárquica:</label>
              <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Ex: #1, Divisão Elite"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#7e9bb5] mb-1 font-medium">Escopo / Jurisdição:</label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Ex: Internacional / América do Sul"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              />
            </div>
          </div>

          {/* Square Image 1:1 Section for Emblem */}
          <div className="space-y-2 hud-border p-3.5 bg-[#05080d]/60 rounded">
            <label className="block text-[#00f3ff] font-medium flex items-center space-x-1.5">
              <ImageIcon size={14} className="text-[#00f3ff]" />
              <span>SÍMBOLO / EMBLEMA DA EQUIPE (IMAGEM QUADRADA 1:1) *:</span>
            </label>
            <p className="text-[11px] text-[#7e9bb5]">
              Insira a URL de uma imagem quadrada (1:1) com o brasão, logotipo ou ícone oficial da equipe.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center pt-1">
              {/* 1:1 Square Preview Box */}
              <div className="w-20 h-20 aspect-square rounded border border-[#00f3ff] overflow-hidden bg-[#05080d] flex-shrink-0 flex items-center justify-center relative group shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                {emblem ? (
                  <img
                    src={emblem}
                    alt="Preview do emblema"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                ) : (
                  <div className="text-center text-[#7e9bb5] p-2">
                    <Shield size={22} className="mx-auto text-[#00f3ff]/40 mb-1" />
                    <span className="text-[9px]">1:1</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-[#00f3ff] text-center font-mono-cyber py-0.5">
                  1:1 QUADRADA
                </div>
              </div>

              {/* URL Input */}
              <div className="flex-1 w-full space-y-2">
                <input
                  type="url"
                  required
                  value={emblem}
                  onChange={(e) => setEmblem(e.target.value)}
                  placeholder="https://exemplo.com/emblema-equipe.jpg"
                  className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
                />
                
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-[#7e9bb5] flex items-center gap-1">
                    <Sparkles size={11} className="text-[#00f3ff]" />
                    <span>Emblemas Rápidos:</span>
                  </span>
                  {SAMPLE_TEAM_EMBLEMS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => setEmblem(sample.url)}
                      className="px-2 py-0.5 text-[10px] bg-[#09101a] border border-[#16283d] text-[#7e9bb5] hover:text-[#00f3ff] hover:border-[#00f3ff]/50 rounded cursor-pointer transition-colors"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#7e9bb5] mb-1 font-medium">Descrição Operacional:</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descreva a finalidade, especialidade e histórico da divisão tática..."
              className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
            ></textarea>
          </div>

          {/* Members Selection */}
          <div className="hud-border p-3 space-y-2 bg-[#05080d]/40">
            <label className="block text-[#00f3ff] font-medium">Integrantes da Equipe:</label>
            
            {availableHeroes.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] text-[#7e9bb5]">Selecione dos heróis cadastrados:</div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#09101a] border border-[#16283d] rounded">
                  {availableHeroes.map((h) => {
                    const isSelected = selectedMembers.includes(h.codename);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleToggleHeroMember(h.codename)}
                        className={`px-2 py-1 rounded text-[11px] font-mono-cyber transition-all ${
                          isSelected
                            ? 'bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]'
                            : 'bg-[#05080d] text-[#7e9bb5] border border-[#16283d] hover:text-[#e2f1ff]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {h.codename}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customMember}
                onChange={(e) => setCustomMember(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomMember();
                  }
                }}
                placeholder="Ou digite o codinome de outro membro..."
                className="flex-1 bg-[#05080d] border border-[#16283d] p-2 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase"
              />
              <button
                type="button"
                onClick={handleAddCustomMember}
                className="hud-button px-3 py-1.5 flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Adicionar</span>
              </button>
            </div>

            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedMembers.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 bg-cyan-950/60 border border-[#00f3ff]/40 text-[#00f3ff] px-2 py-0.5 rounded text-xs"
                  >
                    <span>{m}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMembers(selectedMembers.filter((item) => item !== m))}
                      className="text-[#ff003c] hover:text-red-300 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              SALVAR EQUIPE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
