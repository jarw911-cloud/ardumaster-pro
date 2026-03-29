import React from 'react';
import { FolderOpen } from 'lucide-react';

interface ProjectModalProps {
  show: boolean;
  onClose: () => void;
  projects: any[];
  onSelectProject: (id: string) => void;
}

export default function ProjectModal({ show, onClose, projects, onSelectProject }: ProjectModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <h3 className="text-white font-black text-sm uppercase flex items-center gap-2">
            <FolderOpen size={16} className="text-cyan-500"/> Pilih Proyek Anda
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors">✕</button>
        </div>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
          {projects.length === 0 ? (
            <p className="text-slate-500 text-xs italic text-center py-6">Belum ada proyek yang tersimpan.</p>
          ) : (
            projects.map((proj) => (
              <button key={proj.id} onClick={() => onSelectProject(proj.id)} className="w-full text-left bg-black/50 hover:bg-cyan-900/20 border border-white/5 hover:border-cyan-500/50 p-4 rounded-xl transition-all group flex justify-between items-center">
                <div>
                  <h4 className="text-cyan-400 font-bold text-sm mb-1 group-hover:text-white transition-colors">{proj.project_name}</h4>
                  <p className="text-[10px] text-slate-600 font-mono">Diperbarui: {new Date(proj.updated_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit'})}</p>
                </div>
                <FolderOpen size={14} className="text-slate-600 group-hover:text-cyan-500 transition-colors"/>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}