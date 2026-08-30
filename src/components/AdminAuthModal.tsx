import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, KeyRound, Eye, EyeOff, X, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage('');
      setIsSuccess(false);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'OADMETOP') {
      setIsSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } else {
      setErrorMessage('ACESSO NEGADO: Senha de segurança incorreta.');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="hud-border hud-border-glow p-6 max-w-md w-full bg-[#09101a] space-y-5 relative shadow-[0_0_30px_rgba(0,243,255,0.2)]">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#16283d] pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded border border-[#00f3ff]/60 bg-cyan-950/40 flex items-center justify-center text-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.3)]">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-mono-cyber font-bold text-[#e2f1ff] text-base tracking-wider">
                AUTENTICAÇÃO DE ALTA SEGURANÇA
              </h3>
              <p className="text-[11px] font-mono-cyber text-[#7e9bb5]">
                NÍVEL V — ALTO COMANDO C.Y.P.H.E.R.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7e9bb5] hover:text-[#00f3ff] font-mono-cyber p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info notice */}
        <div className="bg-[#05080d] border border-[#16283d] p-3 rounded text-xs font-mono-cyber text-[#7e9bb5] space-y-1">
          <div className="flex items-center space-x-1.5 text-[#00f3ff] font-semibold">
            <Lock size={13} />
            <span>MODO ADMINISTRADOR RESTRITO</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Para adicionar, editar ou excluir heróis, países, equipes e relatórios táticos, insira a chave de liberação do sistema.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono-cyber text-xs">
          <div>
            <label className="block text-[#7e9bb5] mb-1.5 font-medium flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <KeyRound size={13} className="text-[#00f3ff]" />
                <span>CHAVE DE ACESSO ADMINISTRATIVO:</span>
              </span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Insira a senha de administrador..."
                className="w-full bg-[#05080d] border border-[#16283d] p-3 rounded text-[#e2f1ff] pr-10 tracking-widest focus:border-[#00f3ff] focus:outline-none focus:shadow-[0_0_10px_rgba(0,243,255,0.25)] text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#7e9bb5] hover:text-[#00f3ff] transition-colors"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded bg-red-950/40 border border-[#ff003c] text-[#ff003c] flex items-center space-x-2 text-xs animate-shake">
              <AlertTriangle size={15} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-2.5 rounded bg-green-950/40 border border-[#00ff66] text-[#00ff66] flex items-center space-x-2 text-xs">
              <CheckCircle2 size={15} className="flex-shrink-0" />
              <span>CHAVE RECONHECIDA // ACESSO CONCEDIDO!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-[#16283d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#05080d] border border-[#16283d] text-[#7e9bb5] rounded hover:text-[#e2f1ff] hover:border-[#7e9bb5] transition-colors"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="hud-button hud-button-active px-5 py-2 font-bold flex items-center space-x-2 shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            >
              <span>AUTENTICAR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
