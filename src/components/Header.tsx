import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { Shield, ShieldAlert, Wifi, Menu, X, PlusCircle, RefreshCw, Radio, Download, Upload } from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenNewHero: () => void;
  onExportData?: () => void;
  onImportData?: () => void;
  serverConnected?: boolean;
  isSyncing?: boolean;
  onForceSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  isAdmin,
  onToggleAdmin,
  onOpenNewHero,
  onExportData,
  onImportData,
  serverConnected = true,
  isSyncing = false,
  onForceSync,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('pt-BR') + ' — ' + now.toLocaleTimeString('pt-BR') + ' BRT';
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ViewType; label: string }[] = [
    { id: 'inicio', label: 'INÍCIO' },
    { id: 'ranking', label: 'RANKING' },
    { id: 'heroes', label: 'BANCO DE HERÓIS' },
    { id: 'teams', label: 'EQUIPES' },
    { id: 'countries', label: 'PAÍSES' },
    { id: 'changes', label: 'ALTERAÇÕES' },
  ];

  const handleNavClick = (view: ViewType) => {
    onSelectView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-[#16283d] bg-[#09101a]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            id="brand-logo"
            onClick={() => handleNavClick('inicio')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 hud-border flex items-center justify-center text-[#00f3ff] font-mono-cyber font-bold text-xl hud-border-glow group-hover:scale-105 transition-transform">
              Ω
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-mono-cyber font-bold tracking-widest text-[#e2f1ff] text-lg">
                  C.Y.P.H.E.R.
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/40 font-mono-cyber tracking-wider shrink-0">
                  SERVER-SYNC
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#00f3ff]/80 tracking-wider font-mono-cyber uppercase font-semibold">
                Cybernetic Yield Protocols and Heroic Enforcement Registry
              </p>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#7e9bb5] hover:text-[#00f3ff] p-2 border border-[#16283d] rounded"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-wrap items-center gap-1.5 text-xs font-mono-cyber">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`hud-button px-3.5 py-1.5 uppercase font-medium tracking-wider cursor-pointer ${
                currentView === item.id ? 'hud-button-active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Status, Server Live Badge, Admin Toggle & Quick Entry */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Server Sync Indicator */}
          <div
            onClick={onForceSync}
            className="hidden lg:flex items-center space-x-2 text-xs font-mono-cyber text-[#7e9bb5] px-2.5 py-1 rounded bg-[#05080d] border border-[#16283d] cursor-pointer hover:border-[#00f3ff]/50 transition-colors"
            title="Clique para sincronizar com o servidor"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                serverConnected
                  ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                  : 'bg-[#ff003c] shadow-[0_0_8px_#ff003c]'
              } ${isSyncing ? 'animate-spin' : 'animate-pulse'}`}
            ></span>
            <span>
              SERVER:{' '}
              <strong className={serverConnected ? 'text-[#00ff66]' : 'text-[#ff003c]'}>
                {serverConnected ? 'LIVE GLOBAL' : 'OFFLINE'}
              </strong>
            </span>
            {onForceSync && (
              <RefreshCw
                size={11}
                className={`text-[#00f3ff] ${isSyncing ? 'animate-spin' : 'opacity-60 hover:opacity-100'}`}
              />
            )}
          </div>

          {isAdmin && (
            <div className="hidden sm:flex items-center space-x-2">
              <button
                id="header-quick-add-hero"
                onClick={onOpenNewHero}
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-mono-cyber border border-[#00f3ff]/60 bg-[#00f3ff]/10 text-[#00f3ff] hover:bg-[#00f3ff]/20 transition-all rounded cursor-pointer"
                title="Adicionar Novo Herói ao Servidor"
              >
                <PlusCircle size={14} />
                <span>NOVO HERÓI</span>
              </button>

              {onExportData && (
                <button
                  id="header-export-btn"
                  onClick={onExportData}
                  className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-mono-cyber border border-[#00ff66]/50 bg-[#00ff66]/10 text-[#00ff66] hover:bg-[#00ff66]/20 transition-all rounded cursor-pointer"
                  title="Exportar todos os dados adicionados em arquivo JSON"
                >
                  <Download size={13} />
                  <span>EXPORTAR</span>
                </button>
              )}

              {onImportData && (
                <button
                  id="header-import-btn"
                  onClick={onImportData}
                  className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-mono-cyber border border-[#ffcc00]/50 bg-[#ffcc00]/10 text-[#ffcc00] hover:bg-[#ffcc00]/20 transition-all rounded cursor-pointer"
                  title="Importar dados de arquivo de backup JSON"
                >
                  <Upload size={13} />
                  <span>IMPORTAR</span>
                </button>
              )}
            </div>
          )}

          <button
            id="adminToggleBtn"
            onClick={onToggleAdmin}
            className={`px-3 py-1.5 rounded text-xs font-mono-cyber border transition-all flex items-center space-x-2 cursor-pointer ${
              isAdmin
                ? 'border-[#00f3ff] bg-cyan-950/40 text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                : 'border-[#16283d] bg-[#09101a] text-[#7e9bb5] hover:text-[#00f3ff] hover:border-[#00f3ff]/40'
            }`}
          >
            {isAdmin ? <ShieldAlert size={14} /> : <Shield size={14} />}
            <span id="adminToggleText" className="font-semibold">
              {isAdmin ? 'MODO ADMINISTRADOR' : 'MODO PÚBLICO'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#16283d] bg-[#09101a] p-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left hud-button px-3 py-2 text-xs uppercase font-mono-cyber ${
                currentView === item.id ? 'hud-button-active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <div className="space-y-2 pt-1 border-t border-[#16283d]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenNewHero();
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono-cyber border border-[#00f3ff]/60 bg-[#00f3ff]/10 text-[#00f3ff] rounded flex items-center space-x-2 cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>CADASTRAR NOVO HERÓI</span>
              </button>

              {onExportData && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onExportData();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-mono-cyber border border-[#00ff66]/50 bg-[#00ff66]/10 text-[#00ff66] rounded flex items-center space-x-2 cursor-pointer"
                >
                  <Download size={14} />
                  <span>EXPORTAR DADOS (JSON)</span>
                </button>
              )}

              {onImportData && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onImportData();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-mono-cyber border border-[#ffcc00]/50 bg-[#ffcc00]/10 text-[#ffcc00] rounded flex items-center space-x-2 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>IMPORTAR DADOS (JSON)</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lower Telemetry Strip */}
      <div className="bg-[#05080d]/90 border-t border-[#16283d]/60 px-4 py-1 text-[10px] font-mono-cyber text-[#7e9bb5] flex justify-between items-center">
        <div className="flex space-x-4 sm:space-x-6">
          <span className="flex items-center space-x-1">
            <Radio size={11} className="text-[#00f3ff] animate-pulse" />
            <span>CANAL SERVER-SIDE: ATIVO</span>
          </span>
          <span className="hidden sm:inline">CRIPTOGRAFIA: QUANTUM-AES256</span>
          <span id="headerAccessLevel" className={isAdmin ? 'text-[#00f3ff] font-semibold' : ''}>
            ACESSO: {isAdmin ? 'AUTORIZADO (ADMIN)' : 'PÚBLICO'}
          </span>
        </div>
        <div>
          <span>ÚLTIMA SINCRONIZAÇÃO: {currentTime || 'CARREGANDO...'}</span>
        </div>
      </div>
    </header>
  );
};
