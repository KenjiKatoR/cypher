import React from 'react';
import { Country, Hero } from '../../types';
import { Plus, Globe, Edit2, Trash2, ArrowRight, Lock } from 'lucide-react';
import { formatHeroRank } from '../../utils/threatColors';

interface CountriesViewProps {
  countries: Country[];
  heroes: Hero[];
  onFilterByCountry: (countryName: string) => void;
  onOpenNewCountry: () => void;
  onEditCountry: (country: Country) => void;
  onDeleteCountry: (countryId: string) => void;
  isAdmin: boolean;
}

export const CountriesView: React.FC<CountriesViewProps> = ({
  countries,
  heroes,
  onFilterByCountry,
  onOpenNewCountry,
  onEditCountry,
  onDeleteCountry,
  isAdmin,
}) => {
  return (
    <div id="view-countries" className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#16283d] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-mono-cyber font-bold text-[#e2f1ff] tracking-wider">
              JURISDIÇÕES NACIONAIS
            </h2>
            {!isAdmin && (
              <span className="text-[10px] px-2 py-0.5 border border-[#7e9bb5]/40 text-[#7e9bb5] bg-[#05080d] rounded flex items-center gap-1 font-mono-cyber">
                <Lock size={10} />
                MODO PÚBLICO
              </span>
            )}
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber mt-1">
            ESTATÍSTICAS, TRATADOS BALÍSTICOS E HERÓIS VINCULADOS POR GOVERNO
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenNewCountry}
            className="hud-button hud-button-active px-3.5 py-1.5 text-xs font-mono-cyber flex items-center space-x-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,243,255,0.3)]"
          >
            <Plus size={14} />
            <span>NOVO PAÍS</span>
          </button>
        )}
      </div>

      {/* Countries Grid */}
      {countries.length === 0 ? (
        <div className="hud-border p-12 text-center space-y-3 bg-[#09101a]/60">
          <Globe size={32} className="mx-auto text-[#00f3ff]/40" />
          <div className="font-mono-cyber text-sm text-[#e2f1ff] font-semibold">
            NENHUMA JURISDIÇÃO NACIONAL REGISTRADA
          </div>
          <p className="text-xs text-[#7e9bb5] font-mono-cyber max-w-md mx-auto">
            Cadastre os países e jurisdições conveniadas ao tratado C.Y.P.H.E.R. para vincular heróis aos seus territórios.
          </p>
          {isAdmin && (
            <button
              onClick={onOpenNewCountry}
              className="hud-button hud-button-active px-4 py-2 text-xs font-mono-cyber inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>CADASTRAR PRIMEIRO PAÍS</span>
            </button>
          )}
        </div>
      ) : (
        <div id="countriesContainer" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {countries.map((c) => {
            const countryHeroes = heroes.filter(
              (h) => h.country.toLowerCase() === c.name.toLowerCase()
            );
            const activeHeroes = countryHeroes.filter((h) => (h.status || '').toUpperCase().includes('ATIV')).length;
            const topHero = [...countryHeroes].sort((a, b) => a.worldRank - b.worldRank)[0];
            const isImageUrl = c.flag && (c.flag.startsWith('http') || c.flag.startsWith('/'));

            return (
              <div
                key={c.id}
                className="hud-border p-5 space-y-3 bg-[#09101a] hover:border-[#00f3ff]/60 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#16283d] pb-3">
                    <div className="flex items-center space-x-3">
                      {isImageUrl ? (
                        <div className="w-12 h-12 aspect-square rounded border border-[#00f3ff]/50 overflow-hidden bg-[#05080d] flex-shrink-0 shadow-[0_0_8px_rgba(0,243,255,0.2)]">
                          <img
                            src={c.flag}
                            alt={c.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-3xl">{c.flag || '🌐'}</span>
                      )}
                      <div>
                        <h3 className="font-mono-cyber font-bold text-[#e2f1ff] text-lg">{c.name}</h3>
                        <span className="text-[11px] font-mono-cyber text-[#00f3ff] font-semibold">
                          {c.rank || 'Membro'}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onEditCountry(c)}
                          className="p-1.5 text-[#ffcc00] hover:bg-yellow-950/40 rounded border border-[#ffcc00]/30 transition-colors cursor-pointer"
                          title="Editar País"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteCountry(c.id)}
                          className="p-1.5 text-[#ff003c] hover:bg-red-950/40 rounded border border-[#ff003c]/30 transition-colors cursor-pointer"
                          title="Excluir País"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 font-mono-cyber text-xs pt-3">
                    <div className="flex justify-between py-0.5">
                      <span className="text-[#7e9bb5]">Heróis Registrados:</span>
                      <span className="text-[#e2f1ff] font-semibold">{countryHeroes.length}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-[#7e9bb5]">Heróis Ativos:</span>
                      <span className="text-[#00ff66] font-semibold">{activeHeroes}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-[#7e9bb5]">Melhor Colocado:</span>
                      <span className="text-[#00f3ff] font-bold">
                        {topHero ? `${topHero.codename} (${formatHeroRank(topHero.rankLetter, topHero.worldRank)})` : 'Nenhum'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onFilterByCountry(c.name)}
                  className="hud-button w-full py-1.5 text-xs font-mono-cyber mt-3 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>VER HERÓIS DESTE PAÍS</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
