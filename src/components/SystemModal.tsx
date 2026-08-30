import React from 'react';
import { Terminal, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface SystemModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'info' | 'alert' | 'success';
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const SystemModal: React.FC<SystemModalProps> = ({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  onConfirm,
  confirmText = 'CONFIRMAR',
  cancelText = 'CANCELAR',
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="text-[#ffcc00]" size={20} />;
      case 'success':
        return <CheckCircle2 className="text-[#00ff66]" size={20} />;
      default:
        return <Terminal className="text-[#00f3ff]" size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="hud-border hud-border-glow p-6 max-w-md w-full bg-[#09101a] space-y-4 relative">
        <div className="flex items-center space-x-3 text-[#00f3ff] font-mono-cyber font-bold text-base border-b border-[#16283d] pb-3">
          {getIcon()}
          <span id="modalTitle">{title}</span>
        </div>
        <p id="modalMessage" className="text-xs font-mono-cyber text-[#e2f1ff] leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="flex justify-end space-x-2 pt-2 border-t border-[#16283d]/50">
          {onConfirm && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#05080d] border border-[#16283d] text-[#7e9bb5] hover:text-[#e2f1ff] text-xs font-mono-cyber rounded"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className="hud-button hud-button-active px-4 py-2 text-xs font-mono-cyber font-bold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
