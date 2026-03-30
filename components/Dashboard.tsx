"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Cpu, Thermometer, Zap, Variable, GitMerge, Copy, Download, Eraser, Code2, Cable, Terminal, BookOpen, LayoutTemplate, X, Usb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BOARD_PINS, SENSORS_DB, ACTUATORS_DB, isPinSupported, PROJECT_TEMPLATES } from '@/lib/constants';
import { generateArduinoCode } from '@/lib/codeGenerator';
import { generateExplanation } from '@/lib/explanationGenerator';
import ProjectModal from '@/components/ProjectModal';
import CodeViewer from '@/components/CodeViewer';
import WiringViewer from '@/components/WiringViewer';
import ElementCard from '@/components/ElementCard';
import ExplanationViewer from '@/components/ExplanationViewer';

export default function Dashboard({ username }: { username: string }) {
  const [board, setBoard] = useState("Arduino Uno R3");
  const [elements, setElements] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("Proyek Micromice Kang Mas");
  const [baudRate, setBaudRate] = useState("9600");
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'wiring' | 'explanation'>('code');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- MENDENGARKAN PERINTAH DARI NAVBAR (page.tsx) ---
  useEffect(() => {
    const handleDashboardAction = (e: any) => {
      const action = e.detail;
      if (action === 'new') {
        if(window.confirm("Bikin proyek kosong? Workspace akan terhapus.")) { setElements([]); setProjectName("Proyek Baru"); }
      } else if (action === 'template') {
        setShowTemplateModal(true);
      } else if (action === 'openCloud') {
        fetchProjectList();
      } else if (action === 'saveCloud') {
        saveToCloud();
      } else if (action === 'exportLocal') {
        handleExportLocal();
      } else if (action === 'importLocal') {
        fileInputRef.current?.click();
      }
    };

    window.addEventListener('dashboardAction', handleDashboardAction);
    return () => window.removeEventListener('dashboardAction', handleDashboardAction);
  }, [elements, projectName, board]); // Dependencies diperbarui

  useEffect(() => {
    if (elements.length === 0) return;
    setElements(prev => prev.map(el => {
        if (['Variable', 'Logic', 'Utility'].includes(el.kind)) return el;
        const used = prev.filter(x => x.id !== el.id).map(x => x.pin);
        const auto = getAutoAssignedPins(el.kind, el.type, used, board);
        return { ...el, ...auto };
    }));
  }, [board]);

  const saveToCloud = async () => {
    setIsSyncing(true);
    const { error } = await supabase.from('ardumaster_projects').upsert({ 
        username, project_name: projectName, elements, updated_at: new Date() 
    }, { onConflict: 'username, project_name' });
    setIsSyncing(false);
    if (!error) alert("Mendarat dengan aman di database Cloud!");
    else alert("Waduh, gagal simpan: " + error.message);
  };

  const fetchProjectList = async () => {
    setIsSyncing(true);
    const { data, error } = await supabase.from('ardumaster_projects').select('id, project_name, updated_at').eq('username', username).order('updated_at', { ascending: false });
    setIsSyncing(false);
    if (!error) { setSavedProjects(data || []); setShowOpenModal(true); }
  };

  const handleExportLocal = () => {
    const data = { projectName, board, elements };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.ardumaster`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsed = JSON.parse(event.target?.result as string);
            if (parsed.elements) {
                setElements(parsed.elements);
                if (parsed.projectName) setProjectName(parsed.projectName);
                if (parsed.board) setBoard(parsed.board);
                alert("Proyek berhasil dimuat dari file komputer!");
            } else {
                alert("Format file tidak dikenali!");
            }
        } catch (err) {
            alert("Gagal membaca file.");
        }
        if(fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleDirectUpload = async () => {
    try {
      if (!('serial' in navigator)) { alert("Browser tidak mendukung Web Serial API."); return; }
      await (navigator as any).serial.requestPort();
      alert("Arduino terdeteksi!");
    } catch (err: any) {
      alert("Gagal koneksi USB.");
    }
  };

  const usedPins = useMemo(() => {
    const pins: any[] = [];
    elements.forEach(el => {
      ['pin', 'pin2', 'pin3', 'pin4', 'pin5'].forEach(k => {
        if (el[k] && !['Logic', 'Variable', 'Utility'].includes(el.kind)) pins.push({ device: el.name, pin: el[k] });
      });
    });
    return pins;
  }, [elements]);

  const requiredLibs = useMemo(() => {
    const libs = new Set<string>();
    elements.forEach(el => {
      const db = el.kind === 'Sensor' ? SENSORS_DB : el.kind === 'Actuator' ? ACTUATORS_DB : null;
      const found = db?.find(x => x.name === el.type);
      if (found && found.lib !== "None") libs.add(found.lib);
    });
    return Array.from(libs);
  }, [elements]);

  const finalCode = useMemo(() => generateArduinoCode(elements, projectName, username, baudRate, requiredLibs), [elements, projectName, username, baudRate, requiredLibs]);
  const explanationText = useMemo(() => generateExplanation(elements, board), [elements, board]);

  const getAutoAssignedPins = (kind: string, type: string, currentUsed: string[], targetBoard: string = board) => {
    const db = kind === 'Sensor' ? SENSORS_DB.find(x => x.name === type) : ACTUATORS_DB.find(x => x.name === type);
    const newPins: any = {};
    const tempUsed = [...currentUsed];
    db?.pinTypes.forEach((req, i) => {
        const key = i === 0 ? 'pin' : `pin${i+1}`;
        const p = BOARD_PINS[targetBoard]?.find(p => !tempUsed.includes(p) && isPinSupported(targetBoard, p, req));
        newPins[key] = p || "";
        if (p) tempUsed.push(p);
    });
    return newPins;
  };

  const addElement = (kind: string) => {
    if (elements.length >= 12) return alert("Batas maksimal 12 kartu ya Kang Mas!");
    const count = elements.filter(e => e.kind === kind).length + 1;
    let newEl: any = { id: Date.now(), kind, name: `${kind.toLowerCase()}_${count}` };
    
    if (kind === 'Variable') { newEl.varType = 'float'; newEl.value = '0'; newEl.sourceSensor = ''; }
    else if (kind === 'Logic') { newEl.source = ""; newEl.operator = ">"; newEl.threshold = "100"; newEl.target = ""; newEl.actionTrue = "HIGH"; newEl.actionFalse = "LOW"; }
    else if (kind === 'Utility') { newEl.type = "Serial Print"; newEl.value = "Data"; newEl.source = ""; }
    else {
        newEl.type = kind === 'Sensor' ? SENSORS_DB[0].name : ACTUATORS_DB[0].name;
        const auto = getAutoAssignedPins(kind, newEl.type, usedPins.map(p => p.pin));
        newEl = { ...newEl, ...auto };
    }
    setElements([...elements, newEl]);
  };

  const updateEl = (id: number, data: any) => setElements(elements.map(e => e.id === id ? { ...e, ...data } : e));
  const removeEl = (id: number) => setElements(elements.filter(e => e.id !== id));
  const moveEl = (id: number, direction: 'up' | 'down') => {
      const index = elements.findIndex(e => e.id === id);
      if (direction === 'up' && index > 0) {
          const newEls = [...elements];
          [newEls[index], newEls[index - 1]] = [newEls[index - 1], newEls[index]];
          setElements(newEls);
      } else if (direction === 'down' && index < elements.length - 1) {
          const newEls = [...elements];
          [newEls[index], newEls[index + 1]] = [newEls[index + 1], newEls[index]];
          setElements(newEls);
      }
  };

  return (
    <div className="w-full relative">
      <input type="file" accept=".ardumaster,.json" ref={fileInputRef} onChange={handleImportLocal} className="hidden" />

      <ProjectModal show={showOpenModal} onClose={() => setShowOpenModal(false)} projects={savedProjects} onSelectProject={(id) => {
          const p = savedProjects.find(x => x.id === id);
          if(p) { setElements(p.elements || []); setProjectName(p.project_name); }
          setShowOpenModal(false);
      }} />

      {showTemplateModal && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative">
              <button onClick={() => setShowTemplateModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"><X size={24}/></button>
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2.5 bg-purple-500/20 rounded-xl"><LayoutTemplate size={20} className="text-purple-400"/></div>
                 <h2 className="text-xl font-black text-white uppercase tracking-wider">Template Proyek</h2>
              </div>
              <p className="text-xs text-slate-400 mb-8 ml-14">Pilih resep kodingan siap pakai untuk memulai belajar dengan cepat.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {PROJECT_TEMPLATES.map(template => (
                   <div key={template.id} onClick={() => {
                       if (elements.length > 0 && !window.confirm("Memuat template akan menghapus workspace. Lanjutkan?")) return;
                       setBoard(template.board); setProjectName(template.name);
                       setElements(template.elements.map((el: any) => ({ ...el, id: Date.now() + Math.random() })));
                       setShowTemplateModal(false);
                   }} className="group bg-black/40 hover:bg-purple-900/20 border border-white/5 hover:border-purple-500/30 p-6 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 active:scale-95 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-300 group-hover:text-purple-300 uppercase mb-3 leading-tight">{template.name}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{template.description}</p>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600 group-hover:text-purple-400 pt-4 border-t border-white/5">
                         <span>{template.elements.length} Komponen</span>
                         <span>Gunakan Template &rarr;</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <input value={projectName} onChange={e => setProjectName(e.target.value)} className="bg-transparent border-none text-xl lg:text-2xl font-black text-white outline-none w-full uppercase mb-4 focus:text-cyan-500 transition-colors" placeholder="Nama Proyek..." />
            <div className="flex flex-col xl:flex-row gap-2 mb-8">
                <select value={board} onChange={e => setBoard(e.target.value)} className="bg-black/30 p-2.5 rounded-xl text-xs font-black uppercase border border-white/5 text-slate-500 outline-none flex-1 cursor-pointer hover:border-white/10 transition-colors">
                  {Object.keys(BOARD_PINS).map(b => <option key={b}>{b}</option>)}
                </select>
                <select value={baudRate} onChange={e => setBaudRate(e.target.value)} className="bg-black/30 p-2.5 rounded-xl text-xs font-black uppercase border border-white/5 text-slate-500 outline-none w-full xl:w-32 cursor-pointer hover:border-white/10 transition-colors">
                  {["9600", "115200"].map(b => <option key={b} value={b}>{b} BPS</option>)}
                </select>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-8">
              <button onClick={() => addElement('Sensor')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-900/20 active:scale-95 transition-all text-[8px] font-black uppercase cursor-pointer group"><Thermometer size={14} className="text-slate-500 group-hover:text-cyan-400"/> Sensor</button>
              <button onClick={() => addElement('Actuator')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-900/20 active:scale-95 transition-all text-[8px] font-black uppercase cursor-pointer group"><Zap size={14} className="text-slate-500 group-hover:text-emerald-400"/> Aktuator</button>
              <button onClick={() => addElement('Variable')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-amber-500/50 hover:bg-amber-900/20 active:scale-95 transition-all text-[8px] font-black uppercase cursor-pointer group"><Variable size={14} className="text-slate-500 group-hover:text-amber-400"/> Var</button>
              <button onClick={() => addElement('Logic')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-purple-500/50 hover:bg-purple-900/20 active:scale-95 transition-all text-[8px] font-black uppercase cursor-pointer group"><GitMerge size={14} className="text-slate-500 group-hover:text-purple-400"/> Logic</button>
              <button onClick={() => addElement('Utility')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-blue-500/50 hover:bg-blue-900/20 active:scale-95 transition-all text-[8px] font-black uppercase cursor-pointer group"><Terminal size={14} className="text-slate-500 group-hover:text-blue-400"/> Util</button>
            </div>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              {elements.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-16 text-center opacity-50 relative z-10">
                    <Cpu size={32} className="text-slate-600 mb-4" />
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Workspace Kosong</p>
                    <p className="text-slate-500 text-[9px]">Tambahkan kartu dari menu di atas,<br/>atau buka menu ≡ untuk Template.</p>
                 </div>
              )}
              {elements.map(el => (
                <ElementCard key={el.id} el={el} allElements={elements} board={board} usedPins={usedPins} onUpdate={updateEl} onRemove={removeEl} onMove={moveEl} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col h-[850px] sticky top-28">
          <div className="bg-slate-900 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full">
            <div className="bg-white/5 px-8 py-5 flex flex-wrap justify-between items-center border-b border-white/5 gap-4 relative z-20">
              <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/5">
                 <button onClick={() => setActiveTab('code')} className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'code' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    <Code2 size={14}/> Kode
                 </button>
                 <button onClick={() => setActiveTab('wiring')} className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'wiring' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    <Cable size={14}/> Wiring
                 </button>
                 <button onClick={() => setActiveTab('explanation')} className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'explanation' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    <BookOpen size={14}/> Penjelasan
                 </button>
              </div>

              {activeTab === 'code' && (
                <div className="flex items-center gap-3">
                  <button onClick={() => { navigator.clipboard.writeText(finalCode); alert("Kopi Berhasil!"); }} className="text-cyan-500 hover:text-white hover:scale-110 active:scale-95 transition-all p-2 cursor-pointer" title="Copy Code"><Copy size={18}/></button>
                  <button onClick={() => { if(window.confirm("Kosongkan Workspace?")) setElements([]); }} className="text-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all p-2 cursor-pointer" title="Hapus Semua"><Eraser size={18}/></button>
                  <button onClick={() => { 
                    const blob = new Blob([finalCode], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `${projectName.replace(/\s+/g, '_')}.ino`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                  }} className="bg-emerald-600/20 text-emerald-400 p-2.5 rounded-xl hover:bg-emerald-600 hover:text-white hover:-translate-y-1 active:scale-95 transition-all cursor-pointer" title="Download .ino"><Download size={18}/></button>

                  <button onClick={handleDirectUpload} className="flex items-center gap-2 bg-amber-500/20 text-amber-400 font-black uppercase text-[10px] px-4 py-2.5 rounded-xl hover:bg-amber-500 hover:text-white hover:-translate-y-1 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Usb size={16} /> Upload
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 relative bg-black/20 flex flex-col overflow-hidden">
               {activeTab === 'code' && <CodeViewer finalCode={finalCode} requiredLibs={requiredLibs} />}
               {activeTab === 'wiring' && <WiringViewer sensors={elements.filter(e => e.kind === 'Sensor')} actuators={elements.filter(e => e.kind === 'Actuator')} board={board} usedPins={usedPins} />}
               {activeTab === 'explanation' && <ExplanationViewer text={explanationText} />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}