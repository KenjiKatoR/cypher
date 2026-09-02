import React, { useState, useEffect, useRef } from 'react';
import { Hero, RankLetter, ThreatLevel, HeroStatus, PowerType, Team, Country } from '../types';
import { X, Image as ImageIcon, Sparkles, Check, User, Shield, Zap, Users, AlertTriangle, Upload } from 'lucide-react';
import { getPowerTypeStyle, SORTED_POWER_TYPES, sortPowerTypes } from '../utils/powerColors';
import { THREAT_LEVEL_OPTIONS, getThreatLevelStyle, formatFollowers, formatFollowersFull, formatHeroRank } from '../utils/threatColors';

interface HeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hero: Hero) => void;
  initialData?: Hero | null;
  availableTeams: Team[];
  availableCountries: Country[];
}

const ALL_POWER_TYPES: PowerType[] = SORTED_POWER_TYPES;

export const HeroModal: React.FC<HeroModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableTeams,
  availableCountries,
}) => {
  const [codename, setCodename] = useState('');
  const [civilianName, setCivilianName] = useState('');
  const [country, setCountry] = useState('');
  const [team, setTeam] = useState('');
  const [worldRank, setWorldRank] = useState<number | ''>('');
  const [rankLetter, setRankLetter] = useState<RankLetter>('S');
  const [powerTypes, setPowerTypes] = useState<PowerType[]>(['Científico']);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('Global');
  const [status, setStatus] = useState<HeroStatus>('Ativo');
  const [popularity, setPopularity] = useState<number>(85);
  const [followers, setFollowers] = useState<number | ''>(12500000);
  const [portrait, setPortrait] = useState('');
  const [civilianPortrait, setCivilianPortrait] = useState('');
  const [squarePortrait, setSquarePortrait] = useState('');
  const [powersAndCompetencies, setPowersAndCompetencies] = useState('');
  const [bio, setBio] = useState('');

  const portraitFileInputRef = useRef<HTMLInputElement>(null);
  const civilianFileInputRef = useRef<HTMLInputElement>(null);
  const squareFileInputRef = useRef<HTMLInputElement>(null);

  const handlePortraitFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter menos de 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPortrait(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCivilianFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter menos de 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCivilianPortrait(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSquareFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter menos de 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSquarePortrait(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (initialData) {
      setCodename(initialData.codename || '');
      setCivilianName(initialData.civilianName || '');
      setCountry(initialData.country || '');
      setTeam(initialData.team || '');
      setWorldRank(initialData.worldRank || 1);
      setRankLetter(initialData.rankLetter || 'S');

      // Handle power types (supporting either array or legacy single string)
      if (Array.isArray(initialData.powerTypes) && initialData.powerTypes.length > 0) {
        setPowerTypes(sortPowerTypes(initialData.powerTypes as PowerType[]));
      } else if (initialData.powerType) {
        setPowerTypes(sortPowerTypes((Array.isArray(initialData.powerType) ? initialData.powerType : [initialData.powerType]) as PowerType[]));
      } else {
        setPowerTypes(['Científico']);
      }

      // Map legacy threat levels if necessary
      const currentThreat = initialData.threatLevel || 'Global';
      if (currentThreat === 'S') setThreatLevel('Ômega');
      else if (currentThreat === 'A') setThreatLevel('Global');
      else if (currentThreat === 'B') setThreatLevel('Nacional');
      else if (currentThreat === 'C') setThreatLevel('Urbano');
      else setThreatLevel(currentThreat);
      
      // Normalize legacy status
      const initialStatus = (initialData.status || 'Ativo').toUpperCase();
      if (initialStatus.includes('INATIV')) {
        setStatus('Inativo');
      } else if (initialStatus.includes('DESCON')) {
        setStatus('Desconhecido');
      } else if (initialStatus.includes('FALEC')) {
        setStatus('Falecido');
      } else {
        setStatus('Ativo');
      }

      setPopularity(initialData.popularity ?? 85);
      setFollowers(initialData.followers !== undefined ? initialData.followers : 10000000);
      setPortrait(initialData.portrait || '');
      setCivilianPortrait(initialData.civilianPortrait || '');
      setSquarePortrait(initialData.squarePortrait || '');
      setPowersAndCompetencies(initialData.powersAndCompetencies || '');
      setBio(initialData.bio || '');
    } else {
      // Clean blank state for new hero entry
      setCodename('');
      setCivilianName('');
      setCountry('');
      setTeam('');
      setWorldRank('');
      setRankLetter('S');
      setPowerTypes(['Científico']);
      setThreatLevel('Global');
      setStatus('Ativo');
      setPopularity(80);
      setFollowers(10000000);
      setPortrait('');
      setCivilianPortrait('');
      setSquarePortrait('');
      setPowersAndCompetencies('');
      setBio('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const togglePowerType = (type: PowerType) => {
    if (powerTypes.includes(type)) {
      // Don't allow empty if only 1, unless user adds another
      if (powerTypes.length > 1) {
        setPowerTypes(powerTypes.filter((t) => t !== type));
      }
    } else {
      setPowerTypes([...powerTypes, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codename.trim()) return;

    const rankNum = typeof worldRank === 'number' ? worldRank : 1;
    const portraitUrl =
      portrait.trim() ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600`;

    const parsedFollowers = typeof followers === 'number' ? followers : 0;
    const sortedTypes = sortPowerTypes<PowerType>(powerTypes.length > 0 ? powerTypes : ['Científico']);

    const heroToSave: Hero = {
      id: initialData?.id || 'h_' + Date.now(),
      codename: codename.trim().toUpperCase(),
      civilianName: civilianName.trim(),
      country: country.trim() || 'Internacional',
      team: team.trim().toUpperCase() || 'INDEPENDENTE',
      worldRank: rankNum,
      rankLetter,
      powerTypes: sortedTypes,
      powerType: sortedTypes[0] || 'Científico',
      threatLevel,
      status,
      popularity: Number(popularity),
      followers: parsedFollowers,
      portrait: portraitUrl,
      civilianPortrait: civilianPortrait.trim() || undefined,
      squarePortrait: squarePortrait.trim() || undefined,
      powersAndCompetencies: powersAndCompetencies.trim(),
      bio: bio.trim(),
      history: initialData?.history || [
        {
          change: `#${String(rankNum).padStart(3, '0')} (Inclusão)`,
          date: new Date().toLocaleDateString('pt-BR'),
          reason: 'Registro inicial homologado no sistema central C.Y.P.H.E.R.',
        },
      ],
    };

    onSave(heroToSave);
    onClose();
  };

  const currentThreatStyle = getThreatLevelStyle(threatLevel);

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="hud-border hud-border-glow p-6 max-w-4xl w-full bg-[#09101a] space-y-5 my-8 relative max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-[#16283d] pb-3 sticky -top-6 bg-[#09101a] z-10">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-[#00f3ff] animate-pulse"></div>
            <h3 id="heroModalTitle" className="font-mono-cyber font-bold text-[#00f3ff] text-lg tracking-wider">
              {initialData ? 'EDITAR REGISTRO DE HERÓI' : 'REGISTRAR NOVO HERÓI'}
            </h3>
          </div>
          <button
            id="close-hero-modal"
            type="button"
            onClick={onClose}
            className="text-[#7e9bb5] hover:text-[#00f3ff] font-mono-cyber p-1 rounded cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-mono-cyber text-xs">
          {/* Main Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Codinome *:</label>
              <input
                id="formCodename"
                type="text"
                required
                value={codename}
                onChange={(e) => setCodename(e.target.value)}
                placeholder="Ex: ARCANA"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Nome Civil *:</label>
              <input
                id="formCivilian"
                type="text"
                required
                value={civilianName}
                onChange={(e) => setCivilianName(e.target.value)}
                placeholder="Ex: Violet Silva"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">País *:</label>
              <input
                id="formCountry"
                type="text"
                list="country-suggestions"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ex: Brasil"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              />
              <datalist id="country-suggestions">
                {availableCountries.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Equipe *:</label>
              <input
                id="formTeam"
                type="text"
                list="team-suggestions"
                required
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Ex: CYPHER"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase"
              />
              <datalist id="team-suggestions">
                {availableTeams.map((t) => (
                  <option key={t.id} value={t.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium flex items-center justify-between">
                <span>Ranking Mundial *:</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#00f3ff]/15 text-[#00f3ff] border border-[#00f3ff]/40 rounded font-mono-cyber font-bold">
                  {formatHeroRank(rankLetter, typeof worldRank === 'number' ? worldRank : 1)}
                </span>
              </label>
              <input
                id="formWorldRank"
                type="number"
                min="1"
                max="999"
                required
                value={worldRank}
                onChange={(e) => setWorldRank(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="Ex: 1"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium flex items-center justify-between">
                <span>Rank Hierárquico:</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#05080d] text-[#00f3ff] border border-[#16283d] rounded font-bold">
                  CLASSE {rankLetter}
                </span>
              </label>
              <select
                id="formRankLetter"
                value={rankLetter}
                onChange={(e) => setRankLetter(e.target.value as RankLetter)}
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              >
                <option value="S">Rank S (Supremo / Elite Mundial)</option>
                <option value="A">Rank A (Alto Desempenho)</option>
                <option value="B">Rank B (Intervenção Tática)</option>
                <option value="C">Rank C (Suporte e Operações)</option>
              </select>
            </div>

            {/* Nível de Ameaça com Opções Padronizadas: Urbano, Nacional, Global, Interplanetário, Ômega */}
            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium flex items-center justify-between">
                <span>Nível de Ameaça:</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border ${currentThreatStyle.badgeClass}`}>
                  {threatLevel}
                </span>
              </label>
              <select
                id="formThreatLevel"
                value={threatLevel}
                onChange={(e) => setThreatLevel(e.target.value as ThreatLevel)}
                className={`w-full bg-[#05080d] border p-2.5 rounded text-[#e2f1ff] focus:outline-none ${currentThreatStyle.border} focus:border-[#00f3ff]`}
              >
                {THREAT_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} — {opt.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Status Operacional:</label>
              <select
                id="formStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value as HeroStatus)}
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Desconhecido">Desconhecido</option>
                <option value="Falecido">Falecido</option>
              </select>
            </div>
          </div>

          {/* Nova Aba/Seção: Quantidade de Seguidores (com Ícone de Pessoa) */}
          <div className="hud-border p-4 bg-[#05080d]/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-[#00f3ff] font-medium flex items-center space-x-1.5">
                <User size={16} className="text-[#00f3ff]" />
                <span>QUANTIDADE DE SEGUIDORES (ENGAJAMENTO PÚBLICO) *</span>
              </label>
              <div className="flex items-center space-x-2 bg-[#09101a] px-3 py-1 rounded border border-[#00f3ff]/40">
                <User size={13} className="text-[#00f3ff]" />
                <span className="text-[#00f3ff] font-bold text-xs">
                  {typeof followers === 'number' ? `${formatFollowersFull(followers)} (${formatFollowers(followers)})` : '0'}
                </span>
                <span className="text-[10px] text-[#7e9bb5]">seguidores</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8">
                <input
                  id="formFollowers"
                  type="number"
                  min="0"
                  max="10000000000"
                  step="1000"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="Ex: 12500000 (12.5M)"
                  className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="sm:col-span-4 flex flex-wrap gap-1.5">
                {[
                  { label: '500K', val: 500000 },
                  { label: '5M', val: 5000000 },
                  { label: '15M', val: 15000000 },
                  { label: '50M', val: 50000000 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setFollowers(p.val)}
                    className="px-2.5 py-1 text-[11px] bg-[#09101a] border border-[#16283d] hover:border-[#00f3ff] text-[#7e9bb5] hover:text-[#00f3ff] rounded font-mono-cyber cursor-pointer transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[#7e9bb5]">
              Métrica oficial de alcance em redes táticas, transmissões globais e monitoramento de audiência civil.
            </p>
          </div>

          {/* Tipo de Poder: Multi-Select Chips */}
          <div className="hud-border p-4 bg-[#05080d]/60 space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[#00f3ff] font-medium flex items-center space-x-1.5">
                <Zap size={14} className="text-[#00f3ff]" />
                <span>TIPO DE PODER (SELEÇÃO MÚLTIPLA) *</span>
              </label>
              <span className="text-[10px] text-[#7e9bb5]">
                {powerTypes.length} {powerTypes.length === 1 ? 'categoria selecionada' : 'categorias selecionadas'}
              </span>
            </div>
            <p className="text-[11px] text-[#7e9bb5]">
              Selecione uma ou mais origens/naturezas de poder para este registro:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_POWER_TYPES.map((type) => {
                const isSelected = powerTypes.includes(type);
                const style = getPowerTypeStyle(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => togglePowerType(type)}
                    className={`px-3 py-1.5 rounded text-xs font-mono-cyber flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? `${style.bg} ${style.border} ${style.text} border font-bold ${style.glow}`
                        : 'bg-[#09101a] border border-[#16283d] text-[#7e9bb5] hover:border-[#7e9bb5] hover:text-[#e2f1ff]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${isSelected ? style.dot : 'bg-[#16283d]'}`}
                    ></span>
                    <span>{type}</span>
                    {isSelected && <Check size={12} className={style.text} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popularity Metric */}
          <div className="hud-border p-4 bg-[#05080d]/60 space-y-2">
            <div className="flex justify-between items-center text-[#7e9bb5]">
              <span className="text-[#00f3ff] font-semibold flex items-center space-x-1.5">
                <Sparkles size={14} />
                <span>ÍNDICE DE POPULARIDADE PÚBLICA (0 A 100%)</span>
              </span>
              <span className="text-[#00f3ff] font-bold text-sm bg-[#09101a] px-2.5 py-0.5 rounded border border-[#00f3ff]/30">
                {popularity}%
              </span>
            </div>
            <input
              id="formPopularity"
              type="range"
              min="0"
              max="100"
              value={popularity}
              onChange={(e) => setPopularity(parseInt(e.target.value))}
              className="w-full accent-[#00f3ff] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#7e9bb5]">
              <span>0% (Operação Oculta / Baixa Aprovação)</span>
              <span>50% (Notoriedade Média)</span>
              <span>100% (Ícone Global Supremo)</span>
            </div>
          </div>

          {/* Image Inputs: Traje (9:16), Civil (9:16), Destaque Início (1:1) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Primary Hero Portrait (9:16) */}
            <div className="hud-border p-4 bg-[#05080d]/50 space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <label className="text-[#00f3ff] font-semibold flex items-center space-x-1.5">
                    <Shield size={14} />
                    <span>RETRATO TRAJE (9:16) *</span>
                  </label>
                  <span className="text-[10px] text-[#00f3ff] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-[#00f3ff]/30">
                    9:16
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={portraitFileInputRef}
                    onChange={handlePortraitFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => portraitFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-[#05080d] border border-[#00f3ff]/60 text-[#00f3ff] text-[10px] rounded hover:bg-[#00f3ff]/20 flex items-center space-x-1 cursor-pointer transition-colors shadow-[0_0_6px_rgba(0,243,255,0.2)] font-mono-cyber"
                  >
                    <Upload size={11} />
                    <span>ENVIAR ARQUIVO</span>
                  </button>
                </div>
              </div>

              {/* 9:16 Image Preview Box */}
              <div className="flex gap-3 items-start">
                <div className="w-20 aspect-[9/16] border border-[#00f3ff]/60 bg-[#05080d] overflow-hidden relative shrink-0 rounded">
                  {portrait ? (
                    <img
                      src={portrait}
                      alt="Preview Traje"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#7e9bb5] p-1 text-center text-[10px]">
                      <ImageIcon size={18} className="mb-1 text-[#00f3ff]/50" />
                      <span>9:16</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    id="formPortrait"
                    type="url"
                    value={portrait}
                    onChange={(e) => setPortrait(e.target.value)}
                    placeholder="https://exemplo.com/traje.jpg ou envie um arquivo"
                    className="w-full bg-[#05080d] border border-[#16283d] p-2 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none text-xs"
                  />
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      type="button"
                      onClick={() => portraitFileInputRef.current?.click()}
                      className="px-2 py-1 bg-[#05080d] border border-[#00f3ff]/60 text-[#00f3ff] hover:bg-[#00f3ff]/20 rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Upload size={12} />
                      <span>Enviar Arquivo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPortrait(
                          `https://images.unsplash.com/photo-${[
                            '1534528741775-53994a69daeb',
                            '1507003211169-0a1dd7228f2d',
                            '1517841905240-472988babdf9',
                            '1524504388940-b1c1722653e1',
                            '1500648767791-00dcc994a43e',
                          ][Math.floor(Math.random() * 5)]}?auto=format&fit=crop&q=80&w=600`
                        )
                      }
                      className="px-2 py-1 bg-[#16283d] text-[#00f3ff] hover:bg-[#16283d]/80 rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <ImageIcon size={12} />
                      <span>Exemplo</span>
                    </button>
                    {portrait && (
                      <button
                        type="button"
                        onClick={() => setPortrait('')}
                        className="px-2 py-1 text-[#ff003c] hover:bg-red-950/30 rounded text-[11px] cursor-pointer"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[#7e9bb5]">
                    Traje oficial. Usado no Ranking, Catálogo e Dossiê.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Civilian Portrait (9:16 - Optional) */}
            <div className="hud-border p-4 bg-[#05080d]/50 space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <label className="text-[#ffcc00] font-semibold flex items-center space-x-1.5">
                    <User size={14} />
                    <span>RETRATO CIVIL (9:16)</span>
                  </label>
                  <span className="text-[10px] text-[#ffcc00] px-1.5 py-0.5 rounded bg-yellow-950/40 border border-[#ffcc00]/30">
                    9:16
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={civilianFileInputRef}
                    onChange={handleCivilianFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => civilianFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-[#05080d] border border-[#ffcc00]/60 text-[#ffcc00] text-[10px] rounded hover:bg-[#ffcc00]/20 flex items-center space-x-1 cursor-pointer transition-colors shadow-[0_0_6px_rgba(255,204,0,0.2)] font-mono-cyber"
                  >
                    <Upload size={11} />
                    <span>ENVIAR ARQUIVO</span>
                  </button>
                </div>
              </div>

              {/* 9:16 Civil Image Preview Box */}
              <div className="flex gap-3 items-start">
                <div className="w-20 aspect-[9/16] border border-[#ffcc00]/60 bg-[#05080d] overflow-hidden relative shrink-0 rounded">
                  {civilianPortrait ? (
                    <img
                      src={civilianPortrait}
                      alt="Preview Civil"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#7e9bb5] p-1 text-center text-[10px]">
                      <User size={18} className="mb-1 text-[#ffcc00]/50" />
                      <span>Civil</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    id="formCivilianPortrait"
                    type="url"
                    value={civilianPortrait}
                    onChange={(e) => setCivilianPortrait(e.target.value)}
                    placeholder="https://exemplo.com/civil.jpg (Opcional) ou envie um arquivo"
                    className="w-full bg-[#05080d] border border-[#16283d] p-2 rounded text-[#e2f1ff] focus:border-[#ffcc00] focus:outline-none text-xs"
                  />
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      type="button"
                      onClick={() => civilianFileInputRef.current?.click()}
                      className="px-2 py-1 bg-[#05080d] border border-[#ffcc00]/60 text-[#ffcc00] hover:bg-[#ffcc00]/20 rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Upload size={12} />
                      <span>Enviar Arquivo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCivilianPortrait(
                          `https://images.unsplash.com/photo-${[
                            '1494790108377-be9c29b29330',
                            '1500648767791-00dcc994a43e',
                            '1534528741775-53994a69daeb',
                            '1507003211169-0a1dd7228f2d',
                          ][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=600`
                        )
                      }
                      className="px-2 py-1 bg-[#16283d] text-[#ffcc00] hover:bg-[#16283d]/80 rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <User size={12} />
                      <span>Exemplo</span>
                    </button>
                    {civilianPortrait && (
                      <button
                        type="button"
                        onClick={() => setCivilianPortrait('')}
                        className="px-2 py-1 text-[#ff003c] hover:bg-red-950/30 rounded text-[11px] cursor-pointer"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[#7e9bb5]">
                    Identidade civil sem traje, para vigilância e dossiê.
                  </p>
                </div>
              </div>
            </div>

            {/* 1:1 Square Portrait for Top 3 / Top 10 in Home View */}
            <div className="hud-border p-4 bg-[#05080d]/50 space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <label className="text-[#00ff66] font-semibold flex items-center space-x-1.5">
                    <Sparkles size={14} />
                    <span>DESTAQUE INÍCIO (1:1)</span>
                  </label>
                  <span className="text-[10px] text-[#00ff66] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-[#00ff66]/30">
                    1:1 Quadrada
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={squareFileInputRef}
                    onChange={handleSquareFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => squareFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-[#05080d] border border-[#00ff66]/60 text-[#00ff66] text-[10px] rounded hover:bg-[#00ff66]/20 flex items-center space-x-1 cursor-pointer transition-colors shadow-[0_0_6px_rgba(0,255,102,0.2)] font-mono-cyber"
                  >
                    <Upload size={11} />
                    <span>ENVIAR ARQUIVO</span>
                  </button>
                </div>
              </div>

              {/* 1:1 Square Image Preview Box */}
              <div className="flex gap-3 items-start">
                <div className="w-20 aspect-square border border-[#00ff66]/60 bg-[#05080d] overflow-hidden relative shrink-0 rounded">
                  {squarePortrait ? (
                    <img
                      src={squarePortrait}
                      alt="Preview Destaque 1:1"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#7e9bb5] p-1 text-center text-[10px]">
                      <Sparkles size={18} className="mb-1 text-[#00ff66]/50" />
                      <span>1:1 Início</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    id="formSquarePortrait"
                    type="url"
                    value={squarePortrait}
                    onChange={(e) => setSquarePortrait(e.target.value)}
                    placeholder="https://exemplo.com/foto-1x1.jpg (Opcional) ou envie um arquivo"
                    className="w-full bg-[#05080d] border border-[#16283d] p-2 rounded text-[#e2f1ff] focus:border-[#00ff66] focus:outline-none text-xs"
                  />
                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      type="button"
                      onClick={() => squareFileInputRef.current?.click()}
                      className="px-2 py-1 bg-[#05080d] border border-[#00ff66]/60 text-[#00ff66] hover:bg-[#00ff66]/20 rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Upload size={12} />
                      <span>Enviar Arquivo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSquarePortrait(
                          `https://images.unsplash.com/photo-${[
                            '1534528741775-53994a69daeb',
                            '1507003211169-0a1dd7228f2d',
                            '1517841905240-472988babdf9',
                            '1500648767791-00dcc994a43e',
                          ][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=600`
                        )
                      }
                      className="px-2 py-1 bg-[#16283d] text-[#00ff66] hover:bg-[#16283d]/80 rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles size={12} />
                      <span>Exemplo</span>
                    </button>
                    {squarePortrait && (
                      <button
                        type="button"
                        onClick={() => setSquarePortrait('')}
                        className="px-2 py-1 text-[#ff003c] hover:bg-red-950/30 rounded text-[11px] cursor-pointer"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[#7e9bb5]">
                    Exibida apenas no TOP 3 e TOP 10 da aba Início. Em nenhum outro lugar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Field: Powers & Competencies ("Poderes e Competências") */}
          <div>
            <label className="block text-[#00f3ff] mb-1 font-medium flex items-center space-x-1.5">
              <Zap size={14} />
              <span>PODERES E COMPETÊNCIAS *</span>
            </label>
            <textarea
              id="formPowersAndCompetencies"
              rows={3}
              required
              value={powersAndCompetencies}
              onChange={(e) => setPowersAndCompetencies(e.target.value)}
              placeholder="Descreva detalhadamente os poderes ativos, habilidades de combate, competências táticas, resistências físicas, maestria bélica e capacidades especiais..."
              className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
            ></textarea>
          </div>

          {/* Biography / Origin */}
          <div>
            <label className="block text-[#7e9bb5] mb-1 font-medium">Biografia / Dossiê Descritivo:</label>
            <textarea
              id="formBio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Descreva a história de origem, histórico operacional e atuação deste super-humano..."
              className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#16283d]">
            <button
              id="cancel-hero-form"
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#05080d] border border-[#16283d] text-[#7e9bb5] rounded hover:text-[#e2f1ff] cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              id="submit-hero-form"
              type="submit"
              className="hud-button hud-button-active px-5 py-2 cursor-pointer font-bold"
            >
              SALVAR REGISTRO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

