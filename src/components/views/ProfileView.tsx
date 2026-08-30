import React, { useState } from 'react';
import { Hero, PowerType } from '../../types';
import { ArrowLeft, Fingerprint, Edit2, Trash2, Sparkles, Zap, Shield, User, Globe, Users, Lock, AlertTriangle } from 'lucide-react';
import { getPowerTypeStyle } from '../../utils/powerColors';
import { getThreatLevelStyle, formatFollowers, formatFollowersFull, formatHeroRank } from '../../utils/threatColors';

interface ProfileViewProps {
  hero: Hero | null;
  onBack: () => void;
  onEdit: (hero: Hero) => void;
  onDelete: (heroId: string) => void;
  onUpdateHero: (hero: Hero) => void;
  isAdmin: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  hero,
  onBack,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const [activePortraitTab, setActivePortraitTab] = useState<'hero' | 'civilian'>('hero');

  if (!hero) {
    return (
      <div className="space-y-4 text-center py-12">
        <div className="text-sm font-mono-cyber text-[#7e9bb5]">Nenhum herói selecionado.</div>
        <button onClick={onBack} className="hud-button px-4 py-2 text-xs font-mono-cyber cursor-pointer">
          RETORNAR AO RANKING
        </button>
      </div>
    );
  }

  // Normalizing power types
  const heroPowerTypes: PowerType[] = Array.isArray(hero.powerTypes) && hero.powerTypes.length > 0
    ? hero.powerTypes
    : hero.powerType
    ? Array.isArray(hero.powerType)
      ? hero.powerType
      : [hero.powerType]
    : ['Científico'];

  const threatStyle = getThreatLevelStyle(hero.threatLevel);

  const getStatusBadgeClass = (statusStr: string) => {
    const s = (statusStr || '').toUpperCase();
    if (s.includes('FALEC')) {
      return 'text-[#ff003c] border-[#ff003c]/40 bg-red-950/40';
    }
    if (s.includes('INATIV')) {
      return 'text-[#ffcc00] border-[#ffcc00]/40 bg-yellow-950/40';
    }
    if (s.includes('DESCON')) {
      return 'text-[#7e9bb5] border-[#7e9bb5]/40 bg-slate-900/60';
    }
    return 'text-[#00ff66] border-[#00ff66]/40 bg-green-950/40';
  };

  return (
    <div id="view-profile" className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <button
          onClick={onBack}
          className="hud-button px-3.5 py-1.5 text-xs font-mono-cyber flex items-center space-x-2 w-fit cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>RETORNAR AO RANKING</span>
        </button>

        <div className="flex items-center space-x-2">
          {!isAdmin ? (
            <span className="text-xs px-3 py-1.5 border border-[#7e9bb5]/40 text-[#7e9bb5] bg-[#05080d] rounded flex items-center gap-1.5 font-mono-cyber">
              <Lock size={12} />
              <span>MODO PÚBLICO (SOMENTE LEITURA)</span>
            </span>
          ) : (
            <>
              <button
                onClick={() => onEdit(hero)}
                className="px-3.5 py-1.5 text-xs font-mono-cyber border border-[#ffcc00] text-[#ffcc00] bg-yellow-950/20 hover:bg-yellow-950/40 rounded flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Edit2 size={14} />
                <span>EDITAR DOSSIÊ</span>
              </button>
              <button
                onClick={() => onDelete(hero.id)}
                className="px-3.5 py-1.5 text-xs font-mono-cyber border border-[#ff003c] text-[#ff003c] bg-red-950/20 hover:bg-red-950/40 rounded flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Trash2 size={14} />
                <span>EXCLUIR</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="hud-border hud-border-glow p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#09101a]">
        {/* Left Column (5 cols): 9:16 Portrait Gallery & Primary Specs */}
        <div className="lg:col-span-5 space-y-4 flex flex-col items-center text-center">
          {/* Portrait Selector Tabs if Civil Image exists */}
          {hero.civilianPortrait && (
            <div className="flex w-full max-w-xs border border-[#16283d] rounded p-1 bg-[#05080d] text-xs font-mono-cyber">
              <button
                type="button"
                onClick={() => setActivePortraitTab('hero')}
                className={`flex-1 py-1.5 rounded flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                  activePortraitTab === 'hero'
                    ? 'bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/50 font-bold'
                    : 'text-[#7e9bb5] hover:text-[#e2f1ff]'
                }`}
              >
                <Shield size={12} />
                <span>TRAJE (9:16)</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePortraitTab('civilian')}
                className={`flex-1 py-1.5 rounded flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                  activePortraitTab === 'civilian'
                    ? 'bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/50 font-bold'
                    : 'text-[#7e9bb5] hover:text-[#e2f1ff]'
                }`}
              >
                <User size={12} />
                <span>CIVIL (9:16)</span>
              </button>
            </div>
          )}

          {/* 9:16 Portrait Display Container */}
          <div className="w-full max-w-xs aspect-[9/16] border border-[#00f3ff] overflow-hidden relative shadow-[0_0_20px_rgba(0,243,255,0.2)] bg-[#05080d] rounded group">
            <img
              src={
                activePortraitTab === 'civilian' && hero.civilianPortrait
                  ? hero.civilianPortrait
                  : hero.portrait
              }
              alt={hero.codename}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
              }}
            />

            {/* Badges Over Image with Rank Letter (e.g. #S-001) */}
            <div className="absolute top-2 left-2 bg-[#05080d]/90 border border-[#00f3ff] px-2.5 py-1 font-mono-cyber text-xs text-[#00f3ff] font-bold shadow-[0_0_8px_rgba(0,243,255,0.3)] whitespace-nowrap shrink-0 inline-block">
              {formatHeroRank(hero.rankLetter, hero.worldRank)}
            </div>
            <div className={`absolute top-2 right-2 px-2.5 py-1 font-mono-cyber text-xs border rounded-xs shadow font-bold whitespace-nowrap shrink-0 ${threatStyle.bg} ${threatStyle.border} ${threatStyle.text} ${threatStyle.glow}`}>
              AMEAÇA {hero.threatLevel}
            </div>

            {/* Bottom Status Tag */}
            <div className="absolute bottom-2 inset-x-2 bg-[#05080d]/90 border border-[#16283d] p-1.5 flex justify-between items-center text-[10px] font-mono-cyber">
              <span className="text-[#7e9bb5]">
                {activePortraitTab === 'civilian' ? 'IDENTIDADE CIVIL' : 'TRAJE DE COMBATE'}
              </span>
              <span className="text-[#00f3ff] font-semibold">PROPORÇÃO 9:16</span>
            </div>
          </div>

          {/* Quick Dual Preview indicator if Civilian Portrait exists */}
          {hero.civilianPortrait && (
            <div className="flex gap-2 items-center justify-center font-mono-cyber text-[11px] text-[#7e9bb5]">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff]"></span>
              <span>Traje e Identidade Civil Cadastrados</span>
            </div>
          )}

          {/* Follower Count Quick Badge (Person icon) */}
          <div className="w-full max-w-xs hud-border p-2.5 bg-[#05080d]/80 flex items-center justify-between font-mono-cyber text-xs">
            <span className="text-[#7e9bb5] flex items-center gap-1.5">
              <User size={15} className="text-[#00f3ff]" />
              <span>Seguidores:</span>
            </span>
            <span className="text-[#00f3ff] font-bold flex items-center gap-1">
              <User size={13} className="text-[#00f3ff]" />
              <span>{formatFollowers(hero.followers ?? 0)}</span>
              <span className="text-[10px] text-[#7e9bb5] font-normal">
                ({formatFollowersFull(hero.followers ?? 0)})
              </span>
            </span>
          </div>

          {/* Attributes List */}
          <div className="w-full space-y-2.5 font-mono-cyber text-xs border-t border-[#16283d] pt-4 text-left">
            <div className="flex justify-between py-1 border-b border-[#16283d]/40">
              <span className="text-[#7e9bb5] flex items-center gap-1.5">
                <User size={13} className="text-[#7e9bb5]" /> Nome Civil:
              </span>
              <span className="text-[#e2f1ff] font-semibold">{hero.civilianName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#16283d]/40">
              <span className="text-[#7e9bb5] flex items-center gap-1.5">
                <Globe size={13} className="text-[#7e9bb5]" /> País / Jurisdição:
              </span>
              <span className="text-[#e2f1ff]">{hero.country}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#16283d]/40">
              <span className="text-[#7e9bb5] flex items-center gap-1.5">
                <Users size={13} className="text-[#7e9bb5]" /> Equipe Tática:
              </span>
              <span className="text-[#00f3ff] font-semibold">{hero.team}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#16283d]/40">
              <span className="text-[#7e9bb5]">Nível de Ameaça:</span>
              <span
                className={`px-2 py-0.5 border rounded text-[11px] font-bold ${threatStyle.badgeClass}`}
              >
                {hero.threatLevel}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#16283d]/40">
              <span className="text-[#7e9bb5]">Status Operacional:</span>
              <span
                className={`px-2 py-0.5 border rounded text-[11px] font-bold ${getStatusBadgeClass(
                  hero.status
                )}`}
              >
                {hero.status}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#7e9bb5]">Rank Hierárquico:</span>
              <span className="text-[#00f3ff] font-bold">CLASSE {hero.rankLetter}</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Telemetry, Powers, and Bio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Identity */}
          <div>
            <div className="flex items-center space-x-2 text-[#00f3ff] font-mono-cyber text-xs mb-1">
              <Fingerprint size={16} />
              <span>
                REGISTRO CONFIDENCIAL C.Y.P.H.E.R. // DOSSIÊ {formatHeroRank(hero.rankLetter, hero.worldRank)}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-mono-cyber font-bold text-[#e2f1ff] tracking-wide">
              {hero.codename}
            </h2>
            <div className="text-sm font-mono-cyber text-[#7e9bb5] mt-0.5">
              {hero.civilianName} — Jurisdição {hero.country}
            </div>
          </div>

          {/* Power Types Multi-Badges with Congruent Colors */}
          <div className="space-y-2">
            <div className="text-[#7e9bb5] font-mono-cyber text-xs flex items-center space-x-1.5">
              <Zap size={14} className="text-[#00f3ff]" />
              <span>CATEGORIAS DE PODER:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {heroPowerTypes.map((pt, idx) => {
                const style = getPowerTypeStyle(pt);
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded border font-mono-cyber text-xs font-semibold flex items-center gap-1.5 ${style.badgeClass} ${style.glow}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                    <span>{pt}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Dual Metrics Grid: Quantidade de Seguidores (com Ícone de Pessoa) + Popularidade Pública */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantidade de Seguidores com Ícone de Pessoa */}
            <div className="hud-border p-4 bg-[#05080d]/80 space-y-2.5 font-mono-cyber">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#00f3ff] font-bold flex items-center space-x-1.5">
                  <User size={15} className="text-[#00f3ff]" />
                  <span>QUANTIDADE DE SEGUIDORES</span>
                </span>
                <span className="text-sm font-bold text-[#00f3ff] bg-[#09101a] px-2.5 py-0.5 rounded border border-[#00f3ff]/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                  {formatFollowers(hero.followers ?? 0)}
                </span>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <div className="p-2 bg-[#09101a] border border-[#00f3ff]/30 rounded text-[#00f3ff]">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-base font-bold text-[#e2f1ff]">
                    {formatFollowersFull(hero.followers ?? 0)}
                  </div>
                  <div className="text-[10px] text-[#7e9bb5]">Usuários e redes de monitoramento</div>
                </div>
              </div>
              <div className="text-[10px] text-[#7e9bb5] border-t border-[#16283d]/50 pt-2 flex items-center justify-between">
                <span>Alcance Público Digital</span>
                <span className="text-[#00f3ff] font-semibold">Monitoramento C.Y.P.H.E.R.</span>
              </div>
            </div>

            {/* Popularidade Pública */}
            <div className="hud-border p-4 bg-[#05080d]/80 space-y-2.5 font-mono-cyber">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#00f3ff] font-bold flex items-center space-x-1.5">
                  <Sparkles size={14} />
                  <span>ÍNDICE DE POPULARIDADE</span>
                </span>
                <span className="text-sm font-bold text-[#00f3ff] bg-[#09101a] px-2.5 py-0.5 rounded border border-[#00f3ff]/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                  {hero.popularity ?? 0}%
                </span>
              </div>
              <div className="w-full bg-[#16283d] h-2.5 overflow-hidden rounded mt-2">
                <div
                  className="bg-gradient-to-r from-[#00f3ff]/70 to-[#00f3ff] h-full shadow-[0_0_12px_#00f3ff] transition-all duration-700"
                  style={{ width: `${hero.popularity ?? 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#7e9bb5] border-t border-[#16283d]/50 pt-2">
                <span>Aceitação</span>
                <span className="text-[#00f3ff]">
                  {(hero.popularity ?? 0) >= 80
                    ? 'Ícone Cultural'
                    : (hero.popularity ?? 0) >= 50
                    ? 'Notoriedade Alta'
                    : 'Operação Restrita'}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Powers and Competencies ("Poderes e Competências") */}
          <div className="space-y-2">
            <h4 className="font-mono-cyber font-bold text-[#00f3ff] text-xs tracking-wider border-b border-[#16283d] pb-1 flex items-center space-x-1.5">
              <Zap size={14} />
              <span>PODERES & COMPETÊNCIAS TÁTICAS</span>
            </h4>
            <div className="text-xs font-mono-cyber text-[#e2f1ff] leading-relaxed bg-[#05080d]/60 p-4 border border-[#00f3ff]/30 rounded whitespace-pre-line shadow-[inset_0_0_12px_rgba(0,243,255,0.05)]">
              {hero.powersAndCompetencies || 'Nenhum relatório de poderes e competências cadastrado para este herói.'}
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <h4 className="font-mono-cyber font-bold text-[#00f3ff] text-xs tracking-wider border-b border-[#16283d] pb-1 flex items-center space-x-1.5">
              <span>BIOGRAFIA & HISTÓRICO DE ORIGEM</span>
            </h4>
            <p className="text-xs font-mono-cyber text-[#e2f1ff] leading-relaxed bg-[#05080d]/50 p-4 border border-[#16283d] rounded whitespace-pre-line">
              {hero.bio || 'Sem biografia detalhada registrada no sistema central.'}
            </p>
          </div>

          {/* Ranking History */}
          <div className="space-y-2">
            <h4 className="font-mono-cyber font-bold text-[#00f3ff] text-xs tracking-wider border-b border-[#16283d] pb-1">
              HISTÓRICO DE ALTERAÇÕES NO RANKING
            </h4>
            <div className="space-y-2">
              {(hero.history || []).map((hist, idx) => (
                <div
                  key={idx}
                  className="hud-border p-2.5 text-xs font-mono-cyber flex justify-between items-center bg-[#05080d]/60"
                >
                  <div>
                    <span className="text-[#00f3ff] font-bold">{hist.change}</span> —{' '}
                    <span className="text-[#e2f1ff]">{hist.reason}</span>
                  </div>
                  <div className="text-[#7e9bb5] text-[10px] whitespace-nowrap ml-2">{hist.date}</div>
                </div>
              ))}
              {(!hero.history || hero.history.length === 0) && (
                <div className="text-xs font-mono-cyber text-[#7e9bb5] p-2 bg-[#05080d]/40 border border-[#16283d]">
                  Sem histórico recente registrado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
