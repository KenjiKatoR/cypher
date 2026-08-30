import { Hero, Team, Country, RankingChange } from '../types';

export interface ServerDataResponse {
  heroes: Hero[];
  teams: Team[];
  countries: Country[];
  changes: RankingChange[];
  version: number;
  lastUpdated: string;
}

// Fetch all data from server
export async function fetchServerData(): Promise<ServerDataResponse | null> {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Could not fetch data from server, using local cache:', err);
    return null;
  }
}

// Check server health
export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    return res.ok;
  } catch {
    return false;
  }
}

// Hero API
export async function createHeroOnServer(hero: Partial<Hero>): Promise<Hero | null> {
  try {
    const res = await fetch('/api/heroes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.hero;
  } catch (err) {
    console.error('[API] Error creating hero on server:', err);
    return null;
  }
}

export async function updateHeroOnServer(id: string, hero: Partial<Hero>): Promise<Hero | null> {
  try {
    const res = await fetch(`/api/heroes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.hero;
  } catch (err) {
    console.error('[API] Error updating hero on server:', err);
    return null;
  }
}

export async function deleteHeroOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/heroes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('[API] Error deleting hero on server:', err);
    return false;
  }
}

// Team API
export async function createTeamOnServer(team: Partial<Team>): Promise<Team | null> {
  try {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.team;
  } catch (err) {
    console.error('[API] Error creating team on server:', err);
    return null;
  }
}

export async function updateTeamOnServer(id: string, team: Partial<Team>): Promise<Team | null> {
  try {
    const res = await fetch(`/api/teams/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.team;
  } catch (err) {
    console.error('[API] Error updating team on server:', err);
    return null;
  }
}

export async function deleteTeamOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/teams/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('[API] Error deleting team on server:', err);
    return false;
  }
}

// Country API
export async function createCountryOnServer(country: Partial<Country>): Promise<Country | null> {
  try {
    const res = await fetch('/api/countries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(country),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.country;
  } catch (err) {
    console.error('[API] Error creating country on server:', err);
    return null;
  }
}

export async function updateCountryOnServer(id: string, country: Partial<Country>): Promise<Country | null> {
  try {
    const res = await fetch(`/api/countries/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(country),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.country;
  } catch (err) {
    console.error('[API] Error updating country on server:', err);
    return null;
  }
}

export async function deleteCountryOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/countries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('[API] Error deleting country on server:', err);
    return false;
  }
}

// Ranking Change API
export async function createChangeOnServer(change: Partial<RankingChange>): Promise<RankingChange | null> {
  try {
    const res = await fetch('/api/changes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(change),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.change;
  } catch (err) {
    console.error('[API] Error creating change log on server:', err);
    return null;
  }
}

export async function updateChangeOnServer(id: string, change: Partial<RankingChange>): Promise<RankingChange | null> {
  try {
    const res = await fetch(`/api/changes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(change),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.change;
  } catch (err) {
    console.error('[API] Error updating change log on server:', err);
    return null;
  }
}

export async function deleteChangeOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/changes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error('[API] Error deleting change log on server:', err);
    return false;
  }
}

// Load sample dataset onto server
export async function loadSampleDataOnServer(): Promise<ServerDataResponse | null> {
  try {
    const res = await fetch('/api/load-sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('[API] Error loading sample data on server:', err);
    return null;
  }
}

// Reset server database
export async function clearDataOnServer(): Promise<boolean> {
  try {
    const res = await fetch('/api/clear-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch (err) {
    console.error('[API] Error clearing data on server:', err);
    return false;
  }
}

// Import full dataset onto server
export async function importDataToServer(payload: {
  heroes?: Hero[];
  teams?: Team[];
  countries?: Country[];
  changes?: RankingChange[];
}): Promise<{ success: boolean; version?: number; counts?: any; message?: string }> {
  try {
    const res = await fetch('/api/import-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      success: true,
      version: data.version,
      counts: data.counts,
      message: data.message,
    };
  } catch (err) {
    console.error('[API] Error importing dataset to server:', err);
    return { success: false };
  }
}

// Real-time synchronization helper with Server-Sent Events (SSE) and polling fallback
export function subscribeToRealtimeUpdates(onUpdate: (version: number) => void): () => void {
  let eventSource: EventSource | null = null;
  let pollInterval: any = null;
  let isClosed = false;

  function connectSSE() {
    if (isClosed) return;
    try {
      eventSource = new EventSource('/api/sync/events');
      
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.version) {
            onUpdate(payload.version);
          }
        } catch (e) {
          console.error('[SSE] Message parse error', e);
        }
      };

      eventSource.onerror = () => {
        console.warn('[SSE] Disconnected, reconnecting in 3s...');
        eventSource?.close();
        if (!isClosed) {
          setTimeout(connectSSE, 3000);
        }
      };
    } catch {
      // Fallback
    }
  }

  connectSSE();

  // Polling fallback every 4 seconds to guarantee sync across all browsers
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        if (data.version) {
          onUpdate(data.version);
        }
      }
    } catch {
      // ignore
    }
  }, 4000);

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
    }
    if (pollInterval) {
      clearInterval(pollInterval);
    }
  };
}
