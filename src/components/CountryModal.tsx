import React, { useState, useEffect, useRef } from 'react';
import { Country } from '../types';
import { X, Globe, Image as ImageIcon, Sparkles, Upload, Loader2 } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (country: Country) => void;
  initialData?: Country | null;
}

const SAMPLE_COUNTRY_FLAGS = [
  { name: 'Brasil', code: 'BRA', url: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&q=80&w=400' },
  { name: 'Estados Unidos', code: 'USA', url: 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?auto=format&fit=crop&q=80&w=400' },
  { name: 'Japão', code: 'JPN', url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Reino Unido', code: 'GBR', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=400' },
  { name: 'União Europeia', code: 'EUR', url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400' },
];

export const CountryModal: React.FC<CountryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [flag, setFlag] = useState('');
  const [rank, setRank] = useState('1º Nacional');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const optimizedDataUrl = await processImageFile(file, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.88,
      });
      setFlag(optimizedDataUrl);
    } catch (err: any) {
      console.error('Erro ao processar imagem:', err);
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCode(initialData.code || '');
      setFlag(initialData.flag || '');
      setRank(initialData.rank || '1º Nacional');
    } else {
      setName('');
      setCode('');
      setFlag('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400');
      setRank('1º Nacional');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const countryToSave: Country = {
      id: initialData?.id || 'c_' + Date.now(),
      name: name.trim(),
      code: code.trim().toUpperCase() || undefined,
      flag: flag.trim() || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400',
      rank: rank.trim() || 'Jurisdição Registrada',
    };

    onSave(countryToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="hud-border hud-border-glow p-6 max-w-lg w-full bg-[#09101a] space-y-4 my-8 relative">
        <div className="flex justify-between items-center border-b border-[#16283d] pb-3">
          <div className="flex items-center space-x-2">
            <Globe className="text-[#00f3ff]" size={18} />
            <h3 className="font-mono-cyber font-bold text-[#00f3ff] text-base tracking-wider">
              {initialData ? 'EDITAR PAÍS / JURISDIÇÃO' : 'REGISTRAR NOVO PAÍS'}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[#7e9bb5] mb-1 font-medium">Nome do País *:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Brasil, Japão, Estados Unidos..."
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#7e9bb5] mb-1 font-medium">Abreviação / Sigla *:</label>
              <input
                type="text"
                required
                maxLength={5}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: BRA"
                className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none uppercase font-bold tracking-wider"
              />
            </div>
          </div>

          {/* Square Image 1:1 Section */}
          <div className="space-y-2 hud-border p-3.5 bg-[#05080d]/60 rounded">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <label className="block text-[#00f3ff] font-medium flex items-center space-x-1.5">
                <ImageIcon size={14} className="text-[#00f3ff]" />
                <span>BANDEIRA / BRASÃO NACIONAL (IMAGEM QUADRADA 1:1) *:</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="country-flag-upload-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="sr-only"
                />
                <label
                  htmlFor="country-flag-upload-input"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-[#05080d] border border-[#00f3ff]/60 text-[#00f3ff] text-[10px] rounded hover:bg-[#00f3ff]/20 flex items-center space-x-1 cursor-pointer transition-colors shadow-[0_0_6px_rgba(0,243,255,0.2)]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={11} className="animate-spin text-[#00f3ff]" />
                      <span>PROCESSANDO...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={11} />
                      <span>ENVIAR ARQUIVO</span>
                    </>
                  )}
                </label>
                {flag && (
                  <button
                    type="button"
                    onClick={() => setFlag('')}
                    className="px-2 py-1 bg-[#05080d] border border-[#ff003c]/40 text-[#ff003c] text-[10px] rounded hover:bg-[#ff003c]/20 cursor-pointer"
                  >
                    LIMPAR
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-[#7e9bb5]">
              Insira a URL de uma imagem na proporção quadrada (1:1), envie um arquivo local ou escolha um exemplo rápido.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center pt-1">
              {/* 1:1 Square Preview Box */}
              <div className="w-20 h-20 aspect-square rounded border border-[#00f3ff] overflow-hidden bg-[#05080d] flex-shrink-0 flex items-center justify-center relative group shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                {flag ? (
                  <img
                    src={flag}
                    alt="Preview da bandeira"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                ) : (
                  <div className="text-center text-[#7e9bb5] p-2">
                    <Globe size={22} className="mx-auto text-[#00f3ff]/40 mb-1" />
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
                  type="text"
                  required
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="https://exemplo.com/bandeira-quadrada.jpg ou envie um arquivo"
                  className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
                />
                
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-[#7e9bb5] flex items-center gap-1">
                    <Sparkles size={11} className="text-[#00f3ff]" />
                    <span>Exemplos Rápidos:</span>
                  </span>
                  {SAMPLE_COUNTRY_FLAGS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => setFlag(sample.url)}
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
            <label className="block text-[#7e9bb5] mb-1 font-medium">Classificação / Rótulo:</label>
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="Ex: 1º Nacional, Setor Estratégico"
              className="w-full bg-[#05080d] border border-[#16283d] p-2.5 rounded text-[#e2f1ff] focus:border-[#00f3ff] focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#16283d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#05080d] border border-[#16283d] text-[#7e9bb5] rounded hover:text-[#e2f1ff] cursor-pointer"
            >
              CANCELAR
            </button>
            <button type="submit" className="hud-button hud-button-active px-5 py-2 font-bold cursor-pointer">
              SALVAR PAÍS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
