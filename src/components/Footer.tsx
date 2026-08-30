import React from 'react';
import { ShieldCheck, Trash2, Database, Radio, Server, Download, Upload } from 'lucide-react';

interface FooterProps {
  onLoadSampleData: () => void;
  onClearAllData: () => void;
  onExportData?: () => void;
  onImportData?: () => void;
  isAdmin: boolean;
  serverConnected?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onLoadSampleData,
  onClearAllData,
  onExportData,
  onImportData,
  isAdmin,
  serverConnected = true,
}) => {
  return (
    <footer className="border-t border-[#16283d] bg-[#09101a]/70 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs font-mono-cyber text-[#7e9bb5] gap-3">
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={14} className="text-[#00f3ff]" />
            <span className="font-bold text-[#e2f1ff]">C.Y.P.H.E.R.</span>
          </div>
          <span className="hidden sm:inline text-[#16283d]">•</span>
          <span className="text-[10px] text-[#7e9bb5]">Cybernetic Yield Protocols and Heroic Enforcement Registry</span>
        </div>

        <div className="flex items-center space-x-4 flex-wrap justify-center">
          <span className="flex items-center space-x-1.5 text-[#00f3ff]">
            <Server size={12} />
            <span>SERVER-SIDE SHARED DATABASE</span>
          </span>

          <span className="text-[#00f3ff] flex items-center space-x-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                serverConnected ? 'bg-[#00ff66]' : 'bg-[#ff003c]'
              } animate-ping inline-block`}
            ></span>
            <span className={serverConnected ? 'text-[#00ff66]' : 'text-[#ff003c]'}>
              {serverConnected ? 'REAL-TIME SYNC ACTIVE' : 'RECONNECTING...'}
            </span>
          </span>

          {isAdmin && (
            <div className="flex items-center space-x-2 border-l border-[#16283d] pl-4 flex-wrap">
              {onExportData && (
                <>
                  <button
                    onClick={onExportData}
                    className="text-[11px] text-[#00ff66] hover:underline flex items-center space-x-1 cursor-pointer"
                    title="Exportar todos os dados adicionados em arquivo JSON"
                  >
                    <Download size={11} />
                    <span>Exportar JSON</span>
                  </button>
                  <span className="text-[#16283d]">|</span>
                </>
              )}
              {onImportData && (
                <>
                  <button
                    onClick={onImportData}
                    className="text-[11px] text-[#ffcc00] hover:underline flex items-center space-x-1 cursor-pointer"
                    title="Importar dados de arquivo de backup JSON"
                  >
                    <Upload size={11} />
                    <span>Importar JSON</span>
                  </button>
                  <span className="text-[#16283d]">|</span>
                </>
              )}
              <button
                onClick={onLoadSampleData}
                className="text-[11px] text-[#00f3ff] hover:underline flex items-center space-x-1 cursor-pointer"
                title="Carregar dataset de exemplo no servidor central"
              >
                <Database size={11} />
                <span>Carregar Amostra</span>
              </button>
              <span className="text-[#16283d]">|</span>
              <button
                onClick={onClearAllData}
                className="text-[11px] text-[#ff003c] hover:underline flex items-center space-x-1 cursor-pointer"
                title="Limpar todos os registros no servidor e reiniciar banco"
              >
                <Trash2 size={11} />
                <span>Limpar Banco</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
