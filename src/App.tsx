import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Hero, Team, Country, RankingChange, ViewType } from './types';
import {
  loadStoredHeroes,
  saveStoredHeroes,
  loadStoredTeams,
  saveStoredTeams,
  loadStoredCountries,
  saveStoredCountries,
  loadStoredChanges,
  saveStoredChanges,
  sampleDatasetHeroes,
  sampleDatasetTeams,
  sampleDatasetCountries,
  sampleDatasetChanges,
  clearAllStoredData,
} from './data/storage';
import {
  fetchServerData,
  createHeroOnServer,
  updateHeroOnServer,
  deleteHeroOnServer,
  createTeamOnServer,
  updateTeamOnServer,
  deleteTeamOnServer,
  createCountryOnServer,
  updateCountryOnServer,
  deleteCountryOnServer,
  createChangeOnServer,
  updateChangeOnServer,
  deleteChangeOnServer,
  loadSampleDataOnServer,
  clearDataOnServer,
  importDataToServer,
  subscribeToRealtimeUpdates,
} from './services/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroModal } from './components/HeroModal';
import { TeamModal } from './components/TeamModal';
import { CountryModal } from './components/CountryModal';
import { ChangeLogModal } from './components/ChangeLogModal';
import { SystemModal } from './components/SystemModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { InicioView } from './components/views/InicioView';
import { RankingView } from './components/views/RankingView';
import { HeroesView } from './components/views/HeroesView';
import { ProfileView } from './components/views/ProfileView';
import { TeamsView } from './components/views/TeamsView';
import { CountriesView } from './components/views/CountriesView';
import { ChangesView } from './components/views/ChangesView';

export default function App() {
  // Main Data States (Synced Server-Side)
  const [heroes, setHeroes] = useState<Hero[]>(() => loadStoredHeroes());
  const [teams, setTeams] = useState<Team[]>(() => loadStoredTeams());
  const [countries, setCountries] = useState<Country[]>(() => loadStoredCountries());
  const [changes, setChanges] = useState<RankingChange[]>(() => loadStoredChanges());

  // Server Connection Status
  const [serverConnected, setServerConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const serverVersionRef = useRef<number>(0);

  // App Navigation & Selected Hero
  const [currentView, setCurrentView] = useState<ViewType>('inicio');
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [rankingSearchQuery, setRankingSearchQuery] = useState<string>('');

  // Admin Mode (Public by default as requested)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [editingChange, setEditingChange] = useState<RankingChange | null>(null);

  // System Notification Modal
  const [systemModal, setSystemModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'info' | 'alert' | 'success';
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Fetch full state from server
  const syncWithServer = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsSyncing(true);
    try {
      const data = await fetchServerData();
      if (data) {
        setServerConnected(true);
        serverVersionRef.current = data.version;
        setHeroes(data.heroes || []);
        setTeams(data.teams || []);
        setCountries(data.countries || []);
        setChanges(data.changes || []);

        // Cache locally for offline resilience
        saveStoredHeroes(data.heroes || []);
        saveStoredTeams(data.teams || []);
        saveStoredCountries(data.countries || []);
        saveStoredChanges(data.changes || []);
      } else {
        setServerConnected(false);
      }
    } catch {
      setServerConnected(false);
    } finally {
      if (showIndicator) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  }, []);

  // Initial load and Real-time SSE synchronization
  useEffect(() => {
    syncWithServer();

    // Subscribe to server-side broadcast events
    const unsubscribe = subscribeToRealtimeUpdates((newVersion) => {
      if (newVersion > serverVersionRef.current) {
        syncWithServer();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [syncWithServer]);

  // System alert helper
  const showAlert = (title: string, message: string, type: 'info' | 'alert' | 'success' = 'info') => {
    setSystemModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // Toggle Admin Mode - Password protected
  const handleToggleAdmin = () => {
    if (isAdmin) {
      // Return to public mode
      setIsAdmin(false);
      showAlert(
        'MODO PÚBLICO ATIVADO',
        'O sistema retornou ao modo de consulta padrão (somente leitura).',
        'info'
      );
    } else {
      // Open password authentication modal
      setIsAdminAuthOpen(true);
    }
  };

  // Hero CRUD (Synced Server-Side)
  const handleOpenNewHero = () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingHero(null);
    setIsHeroModalOpen(true);
  };

  const handleEditHero = (hero: Hero) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingHero(hero);
    setIsHeroModalOpen(true);
  };

  const handleSaveHero = async (savedHero: Hero) => {
    const exists = heroes.some((h) => h.id === savedHero.id);

    // Optimistic local update
    setHeroes((prev) => {
      const idx = prev.findIndex((h) => h.id === savedHero.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedHero;
        return next;
      }
      return [...prev, savedHero];
    });

    if (exists) {
      await updateHeroOnServer(savedHero.id, savedHero);
      showAlert('REGISTRO ATUALIZADO (SERVER)', `O dossiê de ${savedHero.codename} foi atualizado no servidor central e sincronizado para todos os usuários.`, 'success');
    } else {
      await createHeroOnServer(savedHero);
      showAlert('NOVO HERÓI INDEXADO (SERVER)', `O herói ${savedHero.codename} foi salvo no servidor central (#${savedHero.worldRank}) e transmitido para todos os usuários.`, 'success');
    }

    // Refresh server state
    syncWithServer();

    if (selectedHeroId === savedHero.id) {
      setSelectedHeroId(savedHero.id);
    }
  };

  const handleDeleteHero = (heroId: string) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    const heroToDelete = heroes.find((h) => h.id === heroId);
    setSystemModal({
      isOpen: true,
      title: 'CONFIRMAÇÃO DE EXCLUSÃO',
      message: `Tem certeza de que deseja remover permanentemente o dossiê de ${heroToDelete?.codename || 'este herói'} do servidor central para todos os usuários?`,
      type: 'alert',
      confirmText: 'EXCLUIR REGISTRO',
      onConfirm: async () => {
        setHeroes((prev) => prev.filter((h) => h.id !== heroId));
        if (selectedHeroId === heroId) {
          setSelectedHeroId(null);
          setCurrentView('ranking');
        }
        await deleteHeroOnServer(heroId);
        syncWithServer();
        showAlert('REGISTRO REMOVIDO', 'O super-humano foi desindexado do banco de dados central.', 'info');
      },
    });
  };

  // Team CRUD (Synced Server-Side)
  const handleOpenNewTeam = () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingTeam(null);
    setIsTeamModalOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingTeam(team);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = async (savedTeam: Team) => {
    const exists = teams.some((t) => t.id === savedTeam.id);

    setTeams((prev) => {
      const idx = prev.findIndex((t) => t.id === savedTeam.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedTeam;
        return next;
      }
      return [...prev, savedTeam];
    });

    if (exists) {
      await updateTeamOnServer(savedTeam.id, savedTeam);
      showAlert('EQUIPE ATUALIZADA', `A equipe ${savedTeam.name} foi atualizada no servidor central.`, 'success');
    } else {
      await createTeamOnServer(savedTeam);
      showAlert('NOVA EQUIPE REGISTRADA', `A equipe ${savedTeam.name} foi registrada no servidor central.`, 'success');
    }
    syncWithServer();
  };

  const handleDeleteTeam = (teamId: string) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    const teamToDelete = teams.find((t) => t.id === teamId);
    setSystemModal({
      isOpen: true,
      title: 'EXCLUIR EQUIPE',
      message: `Deseja remover a equipe ${teamToDelete?.name || 'selecionada'} do banco compartilhado?`,
      type: 'alert',
      confirmText: 'EXCLUIR',
      onConfirm: async () => {
        setTeams((prev) => prev.filter((t) => t.id !== teamId));
        await deleteTeamOnServer(teamId);
        syncWithServer();
        showAlert('EQUIPE REMOVIDA', 'A aliança foi excluída do servidor central.', 'info');
      },
    });
  };

  // Country CRUD (Synced Server-Side)
  const handleOpenNewCountry = () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingCountry(null);
    setIsCountryModalOpen(true);
  };

  const handleEditCountry = (country: Country) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingCountry(country);
    setIsCountryModalOpen(true);
  };

  const handleSaveCountry = async (savedCountry: Country) => {
    const exists = countries.some((c) => c.id === savedCountry.id);

    setCountries((prev) => {
      const idx = prev.findIndex((c) => c.id === savedCountry.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedCountry;
        return next;
      }
      return [...prev, savedCountry];
    });

    if (exists) {
      await updateCountryOnServer(savedCountry.id, savedCountry);
      showAlert('JURISDIÇÃO ATUALIZADA', `O país ${savedCountry.name} foi atualizado no servidor central.`, 'success');
    } else {
      await createCountryOnServer(savedCountry);
      showAlert('NOVO PAÍS REGISTRADO', `A nação ${savedCountry.name} foi registrada no servidor central.`, 'success');
    }
    syncWithServer();
  };

  const handleDeleteCountry = (countryId: string) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    const countryToDelete = countries.find((c) => c.id === countryId);
    setSystemModal({
      isOpen: true,
      title: 'EXCLUIR JURISDIÇÃO',
      message: `Deseja remover a jurisdição ${countryToDelete?.name || 'selecionada'} do banco compartilhado?`,
      type: 'alert',
      confirmText: 'EXCLUIR',
      onConfirm: async () => {
        setCountries((prev) => prev.filter((c) => c.id !== countryId));
        await deleteCountryOnServer(countryId);
        syncWithServer();
        showAlert('JURISDIÇÃO REMOVIDA', 'O território foi desvinculado do servidor central.', 'info');
      },
    });
  };

  // Change CRUD (Synced Server-Side)
  const handleOpenNewChange = () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingChange(null);
    setIsChangeModalOpen(true);
  };

  const handleEditChange = (change: RankingChange) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setEditingChange(change);
    setIsChangeModalOpen(true);
  };

  const handleSaveChange = async (savedChange: RankingChange) => {
    const exists = changes.some((ch) => ch.id === savedChange.id);

    setChanges((prev) => {
      const idx = prev.findIndex((ch) => ch.id === savedChange.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedChange;
        return next;
      }
      return [savedChange, ...prev];
    });

    if (exists) {
      await updateChangeOnServer(savedChange.id, savedChange);
      showAlert('LOG ATUALIZADO', `Registro de alteração de ranking atualizado no servidor.`, 'success');
    } else {
      await createChangeOnServer(savedChange);
      showAlert('ALTERAÇÃO PUBLICADA', `Nova alteração registrada para ${savedChange.hero} no servidor central.`, 'success');
    }
    syncWithServer();
  };

  const handleDeleteChange = (changeId: string) => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setSystemModal({
      isOpen: true,
      title: 'EXCLUIR LOG DE ALTERAÇÃO',
      message: `Deseja excluir este registro de histórico do servidor central?`,
      type: 'alert',
      confirmText: 'EXCLUIR',
      onConfirm: async () => {
        setChanges((prev) => prev.filter((ch) => ch.id !== changeId));
        await deleteChangeOnServer(changeId);
        syncWithServer();
        showAlert('LOG EXCLUÍDO', 'O histórico foi removido do servidor.', 'info');
      },
    });
  };

  // Sample Data & Database Operations
  const handleLoadSampleData = async () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setSystemModal({
      isOpen: true,
      title: 'CARREGAR DADOS DE DEMONSTRAÇÃO (SERVER)',
      message:
        'Isso irá popular o servidor central com o conjunto padrão de 10 heróis mundiais em proporção 9:16, países, equipes e histórico tático. Todos os usuários conectados verão esses registros.',
      type: 'info',
      confirmText: 'CARREGAR NO SERVIDOR',
      onConfirm: async () => {
        setHeroes(sampleDatasetHeroes);
        setTeams(sampleDatasetTeams);
        setCountries(sampleDatasetCountries);
        setChanges(sampleDatasetChanges);
        await loadSampleDataOnServer();
        syncWithServer();
        showAlert('BANCO POPULADO', 'Os dados de demonstração foram gravados no servidor central com sucesso.', 'success');
      },
    });
  };

  const handleClearAllData = async () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    setSystemModal({
      isOpen: true,
      title: 'PURGAR BANCO DE DADOS (SERVER)',
      message:
        'ATENÇÃO: Isso irá apagar todos os heróis, equipes, países e registros de alterações do servidor central em tempo real para TODOS os usuários conectados. Deseja continuar?',
      type: 'alert',
      confirmText: 'LIMPAR TUDO (SERVER)',
      onConfirm: async () => {
        setHeroes([]);
        setTeams([]);
        setCountries([]);
        setChanges([]);
        setSelectedHeroId(null);
        clearAllStoredData();
        await clearDataOnServer();
        syncWithServer();
        showAlert('BANCO LIMPO', 'Todos os registros foram purgados do servidor central.', 'info');
      },
    });
  };

  // Export Complete Dataset to JSON File
  const handleExportData = () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }

    const exportPayload = {
      system: 'C.Y.P.H.E.R. HEROES RANKING SYSTEM',
      version: serverVersionRef.current || 1,
      exportedAt: new Date().toISOString(),
      summary: {
        heroesCount: heroes.length,
        teamsCount: teams.length,
        countriesCount: countries.length,
        changesCount: changes.length,
      },
      heroes,
      teams,
      countries,
      changes,
    };

    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '-');
    const filename = `cypher_backup_heroes_${dateStr}_${timeStr}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showAlert(
      'DADOS EXPORTADOS COM SUCESSO',
      `O backup completo foi gerado e baixado (${filename}).\n\nTotal incluído:\n• ${heroes.length} Heróis\n• ${teams.length} Equipes\n• ${countries.length} Países / Jurisdições\n• ${changes.length} Logs de Alterações`,
      'success'
    );
  };

  // Trigger File Picker for Import
  const handleTriggerImport = () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    fileInputRef.current?.click();
  };

  // Handle Selected JSON File for Import
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        const parsedHeroes: Hero[] = Array.isArray(parsed.heroes) ? parsed.heroes : [];
        const parsedTeams: Team[] = Array.isArray(parsed.teams) ? parsed.teams : [];
        const parsedCountries: Country[] = Array.isArray(parsed.countries) ? parsed.countries : [];
        const parsedChanges: RankingChange[] = Array.isArray(parsed.changes) ? parsed.changes : [];

        if (
          parsedHeroes.length === 0 &&
          parsedTeams.length === 0 &&
          parsedCountries.length === 0 &&
          parsedChanges.length === 0
        ) {
          showAlert(
            'ARQUIVO INVÁLIDO OU VAZIO',
            'O arquivo JSON selecionado não contém estruturas válidas de heróis, equipes, países ou alterações do sistema CYPHER.',
            'alert'
          );
          return;
        }

        setSystemModal({
          isOpen: true,
          title: 'CONFIRMAR IMPORTAÇÃO DE DADOS',
          message: `Arquivo: "${file.name}"\n\nConteúdo detectado para restauração:\n• ${parsedHeroes.length} Heróis\n• ${parsedTeams.length} Equipes\n• ${parsedCountries.length} Jurisdições\n• ${parsedChanges.length} Logs de Alterações\n\nDeseja aplicar estes dados ao banco de dados do servidor central e sincronizar com todos os usuários?`,
          type: 'info',
          confirmText: 'IMPORTAR E SINCRONIZAR',
          onConfirm: async () => {
            setHeroes(parsedHeroes);
            setTeams(parsedTeams);
            setCountries(parsedCountries);
            setChanges(parsedChanges);

            saveStoredHeroes(parsedHeroes);
            saveStoredTeams(parsedTeams);
            saveStoredCountries(parsedCountries);
            saveStoredChanges(parsedChanges);

            const res = await importDataToServer({
              heroes: parsedHeroes,
              teams: parsedTeams,
              countries: parsedCountries,
              changes: parsedChanges,
            });

            if (res.success) {
              syncWithServer();
              showAlert(
                'IMPORTAÇÃO CONCLUÍDA',
                `Base de dados atualizada com sucesso no servidor central!\n\nForam importados:\n• ${parsedHeroes.length} Heróis\n• ${parsedTeams.length} Equipes\n• ${parsedCountries.length} Países\n• ${parsedChanges.length} Alterações`,
                'success'
              );
            } else {
              showAlert(
                'IMPORTAÇÃO CONCLUÍDA LOCALMENTE',
                `Os dados foram importados com sucesso para o cache local do navegador. (${parsedHeroes.length} heróis, ${parsedTeams.length} equipes).`,
                'info'
              );
            }
          },
        });
      } catch (err: any) {
        showAlert(
          'ERRO AO LER ARQUIVO JSON',
          `Não foi possível processar o arquivo. Verifique se é um arquivo JSON válido no formato do sistema CYPHER. Detalhes: ${err?.message}`,
          'alert'
        );
      } finally {
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Hero Selection / Navigation helper
  const handleSelectHero = (heroId: string) => {
    setSelectedHeroId(heroId);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHeroByCodename = (codename: string) => {
    const found = heroes.find(
      (h) => h.codename.toLowerCase() === codename.toLowerCase()
    );
    if (found) {
      handleSelectHero(found.id);
    } else {
      showAlert(
        'HERÓI NÃO INDEXADO',
        `O herói "${codename}" pertence a esta divisão, mas ainda não possui ficha cadastrada no banco central.`,
        'info'
      );
    }
  };

  const handleFilterByCountry = (countryName: string) => {
    setRankingSearchQuery(countryName);
    setCurrentView('ranking');
  };

  // Find currently selected hero for profile view
  const currentSelectedHero = heroes.find((h) => h.id === selectedHeroId) || heroes[0] || null;

  return (
    <div className="min-h-screen bg-[#05080d] text-[#e2f1ff] flex flex-col font-sans selection:bg-[#00f3ff] selection:text-black">
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Top Cyber Navigation Bar */}
      <Header
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          if (view !== 'profile') setSelectedHeroId(null);
        }}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onOpenNewHero={handleOpenNewHero}
        onExportData={handleExportData}
        onImportData={handleTriggerImport}
        serverConnected={serverConnected}
        isSyncing={isSyncing}
        onForceSync={() => syncWithServer(true)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {currentView === 'inicio' && (
          <InicioView
            heroes={heroes}
            countries={countries}
            teams={teams}
            onSelectHero={handleSelectHero}
            onNavigate={(view) => setCurrentView(view)}
            onOpenNewHero={handleOpenNewHero}
            onOpenNewTeam={handleOpenNewTeam}
            onOpenNewCountry={handleOpenNewCountry}
            onExportData={handleExportData}
            onImportData={handleTriggerImport}
            isAdmin={isAdmin}
          />
        )}

        {currentView === 'ranking' && (
          <RankingView
            heroes={heroes}
            onSelectHero={handleSelectHero}
            onEditHero={handleEditHero}
            onDeleteHero={handleDeleteHero}
            onOpenNewHero={handleOpenNewHero}
            isAdmin={isAdmin}
            initialSearchQuery={rankingSearchQuery}
          />
        )}

        {currentView === 'heroes' && (
          <HeroesView
            heroes={heroes}
            onSelectHero={handleSelectHero}
            onEditHero={handleEditHero}
            onDeleteHero={handleDeleteHero}
            onOpenNewHero={handleOpenNewHero}
            isAdmin={isAdmin}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            hero={currentSelectedHero}
            onBack={() => setCurrentView('ranking')}
            onEdit={handleEditHero}
            onDelete={handleDeleteHero}
            onUpdateHero={handleSaveHero}
            isAdmin={isAdmin}
          />
        )}

        {currentView === 'teams' && (
          <TeamsView
            teams={teams}
            heroes={heroes}
            onSelectHeroByCodename={handleSelectHeroByCodename}
            onOpenNewTeam={handleOpenNewTeam}
            onEditTeam={handleEditTeam}
            onDeleteTeam={handleDeleteTeam}
            isAdmin={isAdmin}
          />
        )}

        {currentView === 'countries' && (
          <CountriesView
            countries={countries}
            heroes={heroes}
            onFilterByCountry={handleFilterByCountry}
            onOpenNewCountry={handleOpenNewCountry}
            onEditCountry={handleEditCountry}
            onDeleteCountry={handleDeleteCountry}
            isAdmin={isAdmin}
          />
        )}

        {currentView === 'changes' && (
          <ChangesView
            changes={changes}
            onOpenNewChange={handleOpenNewChange}
            onEditChange={handleEditChange}
            onDeleteChange={handleDeleteChange}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {/* Discrete Cyber Footer */}
      <Footer
        onLoadSampleData={handleLoadSampleData}
        onClearAllData={handleClearAllData}
        onExportData={handleExportData}
        onImportData={handleTriggerImport}
        isAdmin={isAdmin}
        serverConnected={serverConnected}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          showAlert(
            'MODO ADMINISTRADOR ATIVADO',
            'Chave de segurança "OADMETOP" aceita com sucesso. Acesso total para criar, editar e excluir registros concedido.',
            'success'
          );
        }}
      />

      {/* Modals for Data Entry */}
      <HeroModal
        isOpen={isHeroModalOpen}
        onClose={() => {
          setIsHeroModalOpen(false);
          setEditingHero(null);
        }}
        onSave={handleSaveHero}
        initialData={editingHero}
        availableTeams={teams}
        availableCountries={countries}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setEditingTeam(null);
        }}
        onSave={handleSaveTeam}
        initialData={editingTeam}
        availableHeroes={heroes}
      />

      <CountryModal
        isOpen={isCountryModalOpen}
        onClose={() => {
          setIsCountryModalOpen(false);
          setEditingCountry(null);
        }}
        onSave={handleSaveCountry}
        initialData={editingCountry}
      />

      <ChangeLogModal
        isOpen={isChangeModalOpen}
        onClose={() => {
          setIsChangeModalOpen(false);
          setEditingChange(null);
        }}
        onSave={handleSaveChange}
        availableHeroes={heroes}
        initialData={editingChange}
      />

      {/* Custom System HUD Modal */}
      <SystemModal
        isOpen={systemModal.isOpen}
        title={systemModal.title}
        message={systemModal.message}
        type={systemModal.type}
        confirmText={systemModal.confirmText}
        onConfirm={systemModal.onConfirm}
        onClose={() => setSystemModal((prev) => ({ ...prev, isOpen: false, onConfirm: undefined }))}
      />
    </div>
  );
}
