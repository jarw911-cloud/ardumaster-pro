"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Cpu, Thermometer, Zap, Variable, GitMerge, Copy, Download, 
  Eraser, Code2, Cable, Terminal, BookOpen, X, Usb, Activity 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BOARD_PINS, SENSORS_DB, ACTUATORS_DB, isPinSupported } from '@/lib/constants';
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
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'wiring' | 'explanation'>('code');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleAction = (e: any) => {
      const { type, data } = e.detail;
      switch (type) {
        case 'new':
          if(window.confirm("Buat proyek baru? Workspace saat ini akan dibersihkan.")) {
            setElements([]);
            setProjectName("Proyek Baru");
          }
          break;
        case 'openCloud': fetchProjectList(); break;
        case 'saveCloud': saveToCloud(); break;
        case 'importLocal': fileInputRef.current?.click(); break;
        case 'exportLocal': handleExportLocal(); break;
        case 'loadSpecific':
          setBoard(data.board || "Arduino Uno R3");
          setProjectName(data.name);
          const elementsWithNewIds = data.elements.map((el: any) => ({ ...el, id: Date.now() + Math.random() }));
          setElements(elementsWithNewIds);
          break;
      }
    };
    window.addEventListener('dashboardAction', handleAction);
    return () => window.removeEventListener('dashboardAction', handleAction);
  }, [elements, projectName, board]);

  useEffect(() => {
    if (elements.length === 0) return;
    setElements(prev => prev.map(el => {
        if (['Variable', 'Logic', 'Utility'].includes(el.kind)) return el;
        const used = prev.filter(x => x.id !== el.id).map(x => x.pin);
        return { ...el, ...getAutoAssignedPins(el.kind, el.type, used, board) };
    }));
  }, [board]);

  const saveToCloud = async () => {
    setIsSyncing(true);
    const { error } = await supabase.from('ardumaster_projects').upsert({ 
        username, project_name: projectName, elements, updated_at: new Date() 
    }, { onConflict: 'username, project_name' });
    setIsSyncing(false);
    if (!error) alert("Mendarat dengan aman di Cloud, Kang Mas!");
    else alert("Gagal simpan: " + error.message);
  };

  const fetchProjectList = async () => {
    const { data, error } = await supabase.from('ardumaster_projects').select('id, project_name, updated_at').eq('username', username).order('updated_at', { ascending: false });
    if (!error) { setSavedProjects(data || []); setShowOpenModal(true); }
  };

  const handleExportLocal = () => {
    const data = { projectName, board, elements };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${projectName.replace(/\s+/g, '_')}.ardumaster`; a.click();
  };

  const handleImportLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const parsed = JSON.parse(ev.target?.result as string);
            if (parsed.elements) {
                setElements(parsed.elements); setProjectName(parsed.projectName || "Imported Project"); setBoard(parsed.board || "Arduino Uno R3");
                alert("File berhasil dimuat!");
            }
        } catch (err) { alert("Format file salah!"); }
    };
    reader.readAsText(file);
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

  const getAutoAssignedPins = (kind: string, type: string, currentUsed: string[], targetBoard: string) => {
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
    if (elements.length >= 12) return alert("Batas maksimal 12 kartu!");
    let newEl: any = { id: Date.now(), kind, name: `${kind.toLowerCase()}_${elements.length + 1}` };
    
    if (kind === 'Variable') { newEl.varType = 'float'; newEl.value = '0'; newEl.sourceSensor = ''; }
    else if (kind === 'Logic') { newEl.source = ""; newEl.operator = ">"; newEl.threshold = "100"; newEl.target = ""; newEl.actionTrue = "HIGH"; newEl.actionFalse = "LOW"; }
    else if (kind === 'Utility') { newEl.type = "Serial Print"; newEl.value = "Data"; newEl.source = ""; }
    else {
        newEl.type = kind === 'Sensor' ? SENSORS_DB[0].name : ACTUATORS_DB[0].name;
        newEl = { ...newEl, ...getAutoAssignedPins(kind, newEl.type, usedPins.map(p => p.pin), board) };
    }
    setElements([...elements, newEl]);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <input type="file" accept=".ardumaster,.json" ref={fileInputRef} onChange={handleImportLocal} className="hidden" />

      <ProjectModal show={showOpenModal} onClose={() => setShowOpenModal(false)} projects={savedProjects} onSelectProject={(id) => {
          const p = savedProjects.find(x => x.id === id);
          if(p) { setElements(p.elements || []); setProjectName(p.project_name); }
          setShowOpenModal(false);
      }} />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* KOLOM KIRI: WORKSPACE */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full" />
            
            <input 
               value={projectName} 
               onChange={e => setProjectName(e.target.value)} 
               className="bg-transparent border-none text-xl lg:text-2xl font-black text-white outline-none w-full uppercase mb-6 focus:text-cyan-500 transition-colors"
            />

            <div className="flex flex-col sm:flex-row gap-2 mb-8 w-full">
                <select value={board} onChange={e => setBoard(e.target.value)} className="bg-black/30 p-3 rounded-xl text-[10px] font-black uppercase border border-white/5 text-slate-500 outline-none w-full sm:flex-1 cursor-pointer hover:border-white/20 transition-all">
                  {Object.keys(BOARD_PINS).map(b => <option key={b}>{b}</option>)}
                </select>
                <select value={baudRate} onChange={e => setBaudRate(e.target.value)} className="bg-black/30 p-3 rounded-xl text-[10px] font-black uppercase border border-white/5 text-slate-500 outline-none w-full sm:w-28 cursor-pointer hover:border-white/20 transition-all">
                  {["9600", "115200"].map(b => <option key={b} value={b}>{b} BPS</option>)}
                </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 w-full">
               {[
                 { k: 'Sensor', i: <Thermometer size={14}/>, c: 'text-cyan-500' },
                 { k: 'Actuator', i: <Zap size={14}/>, c: 'text-emerald-500' },
                 { k: 'Variable', i: <Variable size={14}/>, c: 'text-amber-500' },
                 { k: 'Logic', i: <GitMerge size={14}/>, c: 'text-purple-500' },
                 { k: 'Utility', i: <Terminal size={14}/>, c: 'text-blue-500' }
               ].map(item => (
                 <button 
                   key={item.k} 
                   onClick={() => addElement(item.k)} 
                   className="flex-1 min-w-[50px] sm:min-w-[60px] flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-white/20 hover:bg-white/5 active:scale-95 transition-all text-[8px] font-black uppercase group"
                 >
                    <div className={`${item.c} group-hover:scale-110 transition-transform`}>{item.i}</div>
                    {item.k.substring(0,4)}
                 </button>
               ))}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {elements.length === 0 && (
                <div className="py-20 flex flex-col items-center opacity-20 select-none">
                   <Cpu size={48} className="mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em]">Workspace Kosong</p>
                </div>
              )}
              {elements.map(el => (
                <ElementCard 
                   key={el.id} el={el} allElements={elements} board={board} usedPins={usedPins} 
                   onUpdate={(id, d) => setElements(elements.map(e => e.id === id ? {...e, ...d} : e))} 
                   onRemove={id => setElements(elements.filter(e => e.id !== id))} 
                   onMove={(id, dir) => {
                      const idx = elements.findIndex(e => e.id === id);
                      const newEls = [...elements];
                      if(dir === 'up' && idx > 0) [newEls[idx], newEls[idx-1]] = [newEls[idx-1], newEls[idx]];
                      if(dir === 'down' && idx < elements.length -1) [newEls[idx], newEls[idx+1]] = [newEls[idx+1], newEls[idx]];
                      setElements(newEls);
                   }} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: VIEWERS (SUDAH DI PERBAIKI AGAR BISA SCROLL) */}
        {/* h-[80vh] min-h-[500px] membuat ukurannya pas di layar HP dan tidak kebesaran */}
        <div className="lg:col-span-7 flex flex-col h-[80vh] min-h-[500px] lg:h-[850px] lg:sticky lg:top-28 mt-8 lg:mt-0 pb-10">
          <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3.5rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-2xl relative">
            
            <div className="bg-white/5 p-4 sm:px-8 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/5 z-20">
              <div className="flex flex-wrap justify-center bg-black/50 p-1.5 rounded-2xl border border-white/5 w-full sm:w-auto">
                 {[
                   { id: 'code', icon: <Code2 size={14}/>, label: 'KODE' },
                   { id: 'wiring', icon: <Cable size={14}/>, label: 'WIRING' },
                   { id: 'explanation', icon: <BookOpen size={14}/>, label: 'INFO' }
                 ].map(t => (
                   <button 
                     key={t.id} 
                     onClick={() => setActiveTab(t.id as any)} 
                     className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === t.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-white'}`}
                   >
                     {t.icon} <span className="hidden sm:inline">{t.label}</span>
                   </button>
                 ))}
              </div>

              {activeTab === 'code' && (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button onClick={() => { navigator.clipboard.writeText(finalCode); alert("Kopi Berhasil!"); }} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 text-cyan-400 transition-all cursor-pointer" title="Copy Code"><Copy size={16}/></button>
                  <button onClick={() => { 
                    const blob = new Blob([finalCode], { type: 'text/plain' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${projectName}.ino`; a.click();
                  }} className="p-2.5 bg-emerald-600/10 text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer" title="Download .ino"><Download size={16}/></button>
                  
                  <button 
                    onClick={async () => { try { await (navigator as any).serial.requestPort(); alert("Arduino Terdeteksi!"); } catch { alert("Gagal koneksi USB."); } }} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                  >
                    <Usb size={16}/> Upload
                  </button>
                </div>
              )}
            </div>

            {/* VIEWER CONTENT (INI KUNCI SCROLL KE BAWAH: overflow-y-auto) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-black/20 custom-scrollbar">
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