import React from 'react';
import { BookOpen } from 'lucide-react';

interface ExplanationViewerProps {
  text: string;
}

export default function ExplanationViewer({ text }: ExplanationViewerProps) {
  // Fungsi sederhana untuk mengubah markdown-like text menjadi HTML sederhana
  const formattedText = text.split('\n').map((line, i) => {
    if (line.startsWith('###')) return <h3 key={i} className="text-cyan-400 font-black text-sm uppercase mt-6 mb-2 tracking-widest">{line.replace('###', '')}</h3>;
    if (line.startsWith('*')) return <li key={i} className="text-slate-300 text-xs ml-4 mb-1 list-none flex gap-2"><span className="text-cyan-500">•</span> {line.replace('*', '')}</li>;
    if (line.startsWith('**')) return <p key={i} className="text-slate-200 text-xs font-bold mt-4">{line.replace(/\*\*/g, '')}</p>;
    return <p key={i} className="text-slate-400 text-xs leading-relaxed">{line}</p>;
  });

  return (
    <div className="flex-1 w-full p-8 overflow-auto custom-scrollbar bg-slate-900/50 animate-in fade-in">
      <div className="max-w-2xl mx-auto bg-black/40 border border-white/5 p-8 rounded-[2rem] shadow-2xl">
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <BookOpen className="text-cyan-500" size={20} />
            <h2 className="text-white font-black uppercase text-sm tracking-tighter">Cara Kerja Sistem</h2>
        </div>
        <div className="space-y-1">
          {formattedText}
        </div>
      </div>
    </div>
  );
}