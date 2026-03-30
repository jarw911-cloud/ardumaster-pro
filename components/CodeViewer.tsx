import React, { useState, useEffect, useRef } from 'react';
import { Code2, Play, AlertTriangle, CheckCircle, Edit3, Save, RotateCcw, Terminal } from 'lucide-react';

interface CodeViewerProps {
  finalCode: string;
  requiredLibs: string[];
}

export default function CodeViewer({ finalCode, requiredLibs }: CodeViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localCode, setLocalCode] = useState(finalCode);
  const [errors, setErrors] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sinkronisasi jika prop finalCode berubah (saat user tambah kartu di Workspace)
  // Tapi JANGAN timpa kalau user lagi asyik edit manual!
  useEffect(() => {
    if (!isEditing) {
      setLocalCode(finalCode);
      setErrors([]);
      setHasChecked(false);
    }
  }, [finalCode, isEditing]);

 const checkSyntax = () => {
    setIsChecking(true);
    setHasChecked(true);
    const newErrors: string[] = [];
    const lines = localCode.split('\n');

    let openBrackets = 0;
    let closeBrackets = 0;

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return;

      // Hitung kurung kurawal dari teks utuh
      if (trimmed.includes('{')) openBrackets++;
      if (trimmed.includes('}')) closeBrackets++;

      // PERBAIKAN: Hapus komentar inline (//) hanya untuk pengecekan titik koma
      let codeWithoutComment = trimmed;
      const commentIndex = trimmed.indexOf('//');
      if (commentIndex !== -1) {
         codeWithoutComment = trimmed.substring(0, commentIndex).trim();
      }

      // Jika baris ini ternyata isinya cuma komentar, lewati
      if (codeWithoutComment === '') return;

      // Cek kurang titik koma (Semicolon) pada kode yang sudah bersih dari komentar
      const needsSemicolon = !codeWithoutComment.endsWith(';') &&
                             !codeWithoutComment.endsWith('{') &&
                             !codeWithoutComment.endsWith('}') &&
                             !codeWithoutComment.startsWith('#') &&
                             !codeWithoutComment.startsWith('if') &&
                             !codeWithoutComment.startsWith('else if') &&
                             !codeWithoutComment.startsWith('else') &&
                             !codeWithoutComment.startsWith('void') &&
                             !codeWithoutComment.startsWith('for') &&
                             !codeWithoutComment.startsWith('while');

      // Pengecualian komentar block (/* ... */)
      if (needsSemicolon && !trimmed.includes('/*') && !trimmed.includes('*/')) {
         newErrors.push(`Baris ${i + 1}: Sepertinya kurang titik koma (;) di akhir perintah.`);
      }
    });

    if (openBrackets !== closeBrackets) {
       newErrors.push(`Struktur Kurung Kurawal { } tidak seimbang! (Buka: ${openBrackets}, Tutup: ${closeBrackets}). Ini akan membuat Arduino bingung.`);
    }

    if (!localCode.includes('void setup()')) newErrors.push("Fungsi 'void setup()' tidak ditemukan atau terhapus.");
    if (!localCode.includes('void loop()')) newErrors.push("Fungsi 'void loop()' tidak ditemukan atau terhapus.");

    // Efek delay biar kerasa seperti lagi "compile" beneran
    setTimeout(() => {
       setErrors(newErrors);
       setIsChecking(false);
    }, 1200); 
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-slate-300 relative">
      {/* HEADER TOOLBAR */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#161b22] border-b border-white/5">
         <div className="flex items-center gap-3">
            <Code2 size={16} className="text-cyan-500" />
            <span className="text-xs font-mono font-bold text-white tracking-widest">main.ino</span>
            {isEditing && <span className="bg-amber-500/20 text-amber-400 text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-widest animate-pulse border border-amber-500/30">Mode Edit</span>}
         </div>
         <div className="flex items-center gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer">
                <Edit3 size={14} /> Edit Manual
              </button>
            ) : (
              <>
                <button onClick={() => { setIsEditing(false); setLocalCode(finalCode); setErrors([]); setHasChecked(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer">
                  <RotateCcw size={14} /> Batal
                </button>
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer">
                  <Save size={14} /> Simpan
                </button>
              </>
            )}
            <button onClick={checkSyntax} disabled={isChecking} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer disabled:opacity-50">
              <Play size={14} /> {isChecking ? 'Menganalisa...' : 'Cek Error (Linter)'}
            </button>
         </div>
      </div>

      {/* EDITOR AREA */}
      <div className="flex-1 relative overflow-hidden flex bg-[#0d1117]">
        {/* Line Numbers */}
        <div className="w-10 bg-[#161b22] border-r border-white/5 text-right pr-3 pt-4 pb-4 font-mono text-[11px] text-slate-600 select-none overflow-hidden hidden sm:block">
           {localCode.split('\n').map((_, i) => <div key={i} className="leading-[1.4rem]">{i + 1}</div>)}
        </div>
        
        <textarea
           ref={textareaRef}
           value={localCode}
           onChange={e => setLocalCode(e.target.value)}
           readOnly={!isEditing}
           spellCheck="false"
           className={`flex-1 bg-transparent p-4 font-mono text-[12px] leading-[1.4rem] outline-none resize-none custom-scrollbar w-full ${!isEditing ? 'opacity-80 text-cyan-50' : 'text-emerald-300'}`}
        />
      </div>

      {/* LINTER CONSOLE TERMINAL */}
      {(hasChecked || isChecking) && (
        <div className="h-48 bg-[#010409] border-t border-white/10 p-4 overflow-y-auto custom-scrollbar relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
           <h4 className="text-[10px] font-black uppercase text-slate-500 mb-3 flex items-center gap-2 tracking-widest">
              <Terminal size={12} /> Output Console
           </h4>
           
           {isChecking ? (
             <div className="text-cyan-400 text-xs font-mono flex items-center gap-2">
               <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
               Compiler: Menganalisa struktur kode C++...
             </div>
           ) : errors.length > 0 ? (
             <div className="space-y-2">
                <div className="text-red-400 text-xs font-bold flex items-center gap-2 mb-3 bg-red-500/10 inline-flex px-3 py-1 rounded-full">
                  <AlertTriangle size={14} /> Ditemukan {errors.length} peringatan sintaks:
                </div>
                {errors.map((err, i) => (
                  <div key={i} className="text-slate-300 text-[11px] font-mono bg-[#161b22] border-l-2 border-red-500 p-2 rounded flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✖</span>
                    <span>{err}</span>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
               <CheckCircle size={16} /> [SUCCESS] Kode bebas dari error dasar. Siap dikirim ke mikrokontroler!
             </div>
           )}
        </div>
      )}
    </div>
  );
}