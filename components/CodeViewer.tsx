import React from 'react';
import { Info } from 'lucide-react';

interface CodeViewerProps {
  finalCode: string;
  requiredLibs: string[];
}

export default function CodeViewer({ finalCode, requiredLibs }: CodeViewerProps) {
  return (
    <div className="flex-1 relative bg-black/20 flex flex-col h-full animate-in fade-in">
      {requiredLibs.length > 0 && (
        <div className="bg-emerald-900/10 border-b border-emerald-500/20 p-4">
           <h3 className="text-xs font-black text-emerald-400 uppercase mb-2 flex items-center gap-2 tracking-widest">
              <Info size={14}/> Wajib Download di Arduino IDE
           </h3>
           <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
              Buka Arduino IDE {'>'} Sketch {'>'} Include Library {'>'} Manage Libraries... lalu cari:
           </p>
           <div className="flex flex-wrap gap-2">
              {requiredLibs.map(lib => (
                 <span key={lib} className="bg-black/50 text-emerald-300 px-2 py-1 rounded text-[10px] font-mono font-bold border border-emerald-500/10">{lib}</span>
              ))}
           </div>
        </div>
      )}
      <pre className="p-8 font-mono text-xs text-cyan-400 leading-relaxed overflow-auto flex-1 custom-scrollbar selection:bg-cyan-500/20">
        {finalCode}
      </pre>
    </div>
  );
}