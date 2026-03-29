"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Save, FolderOpen, Cpu, Thermometer, Zap, Variable, GitMerge, Copy, Download, Eraser, Code2, Cable, Terminal, BookOpen } from 'lucide-react';
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
  // --- STATE UTAMA ---
  const [board, setBoard] = useState("Arduino Uno");
  const [elements, setElements] = useState<any[]>([]);
  const [projectName, setProjectName] = useState("Proyek Micromice Kang Mas");
  const [baudRate, setBaudRate] = useState("9600");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'wiring' | 'explanation'>('code');

  // --- LOGIKA AUTO-PIN SAAT GANTI BOARD ---
  useEffect(() => {
    if (elements.length === 0) return;
    setElements(prev => prev.map(el => {
        if (['Variable', 'Logic', 'Utility'].includes(el.kind)) return el;
        const used = prev.filter(x => x.id !== el.id).map(x => x.pin);
        const auto = getAutoAssignedPins(el.kind, el.type, used, board);
        return { ...el, ...auto };
    }));
  }, [board]);

  // --- SUPABASE ACTIONS ---
  const saveToCloud = async () => {
    setIsSyncing(true);
    const { error } = await supabase.from('ardumaster_projects').upsert({ 
        username, 
        project_name: projectName, 
        elements, 
        updated_at: new Date() 
    }, { onConflict: 'username, project_name' });
    setIsSyncing(false);
    if (!error) alert("Mendarat dengan aman di database, Kang Mas!");
    else alert("Waduh, gagal simpan: " + error.message);
  };

  const fetchProjectList = async () => {
    setIsSyncing(true);
    const { data, error } = await supabase.from('ardumaster_projects').select('id, project_name, updated_at').eq('username', username).order('updated_at', { ascending: false });
    setIsSyncing(false);
    if (!error) { setSavedProjects(data || []); setShowOpenModal(true); }
  };

  // --- MEMOIZED HELPERS ---
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

  // --- WORKSPACE HANDLERS ---
  const getAutoAssignedPins = (kind: string, type: string, currentUsed: string[], targetBoard: string = board) => {
    const db = kind === 'Sensor' ? SENSORS_DB.find(x => x.name === type) : ACTUATORS_DB.find(x => x.name === type);
    const newPins: any = {};
    const tempUsed = [...currentUsed];
    db?.pinTypes.forEach((req, i) => {
        const key = i === 0 ? 'pin' : `pin${i+1}`;
        const p = BOARD_PINS[targetBoard].find(p => !tempUsed.includes(p) && isPinSupported(targetBoard, p, req));
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
    <>
      <ProjectModal show={showOpenModal} onClose={() => setShowOpenModal(false)} projects={savedProjects} onSelectProject={(id) => {
          const p = savedProjects.find(x => x.id === id);
          if(p) { setElements(p.elements || []); setProjectName(p.project_name); }
          setShowOpenModal(false);
      }} />

      <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
        
        {/* KOLOM KIRI: WORKSPACE & CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-3xl border border-white/5">
              <h2 className="text-sm font-black text-white uppercase flex items-center gap-2"><Cpu size={16} className="text-cyan-500"/> Workspace</h2>
              <div className="flex gap-2">
                  <button onClick={saveToCloud} disabled={isSyncing} className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Save</button>
                  <button onClick={fetchProjectList} disabled={isSyncing} className="bg-cyan-600/20 text-cyan-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-cyan-600/40 transition-all">Open</button>
              </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <input value={projectName} onChange={e => setProjectName(e.target.value)} className="bg-transparent border-none text-2xl font-black text-white outline-none w-full uppercase mb-4 focus:text-cyan-500 transition-colors" />
            <div className="flex gap-2 mb-8">
                <select value={board} onChange={e => setBoard(e.target.value)} className="bg-black/30 p-2 rounded-lg text-xs font-black uppercase border border-white/5 text-slate-500 outline-none flex-1">
                  {Object.keys(BOARD_PINS).map(b => <option key={b}>{b}</option>)}
                </select>
                <select value={baudRate} onChange={e => setBaudRate(e.target.value)} className="bg-black/30 p-2 rounded-lg text-xs font-black uppercase border border-white/5 text-slate-500 outline-none w-32">
                  {["9600", "115200"].map(b => <option key={b} value={b}>{b} BPS</option>)}
                </select>
            </div>

            {/* ACTION BUTTONS GRID */}
            <div className="grid grid-cols-5 gap-2 mb-8">
              <button onClick={() => addElement('Sensor')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-cyan-500/50 transition-all text-[8px] font-black uppercase"><Thermometer size={14}/> Sensor</button>
              <button onClick={() => addElement('Actuator')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-emerald-500/50 transition-all text-[8px] font-black uppercase"><Zap size={14}/> Aktuator</button>
              <button onClick={() => addElement('Variable')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-amber-500/50 transition-all text-[8px] font-black uppercase"><Variable size={14}/> Var</button>
              <button onClick={() => addElement('Logic')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-purple-500/50 transition-all text-[8px] font-black uppercase"><GitMerge size={14}/> Logic</button>
              <button onClick={() => addElement('Utility')} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-blue-500/50 transition-all text-[8px] font-black uppercase"><Terminal size={14}/> Util</button>
            </div>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              {elements.length === 0 && <p className="text-center text-slate-700 text-[10px] font-bold py-10"> Workspace masih kosong...</p>}
              {elements.map(el => (
                <ElementCard key={el.id} el={el} allElements={elements} board={board} usedPins={usedPins} onUpdate={updateEl} onRemove={removeEl} onMove={moveEl} />
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: CODE / WIRING / EXPLANATION VIEWERS */}
        <div className="lg:col-span-7 flex flex-col h-[850px] sticky top-10">
          <div className="bg-slate-900 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full">
            
            {/* TABS HEADER */}
            <div className="bg-white/5 px-8 py-5 flex flex-wrap justify-between items-center border-b border-white/5 gap-4 relative z-20">
              <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/5">
                 <button onClick={() => setActiveTab('code')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'code' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-white'}`}>
                    <Code2 size={14}/> Kode (.ino)
                 </button>
                 <button onClick={() => setActiveTab('wiring')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'wiring' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-500 hover:text-white'}`}>
                    <Cable size={14}/> Wiring Guide
                 </button>
                 <button onClick={() => setActiveTab('explanation')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'explanation' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white'}`}>
                    <BookOpen size={14}/> Penjelasan
                 </button>
              </div>

              {activeTab === 'code' && (
                <div className="flex items-center gap-4">
                  <button onClick={() => { navigator.clipboard.writeText(finalCode); alert("Kopi Berhasil!"); }} className="text-cyan-500 hover:text-white transition-colors p-2"><Copy size={18}/></button>
                  <button onClick={() => { if(window.confirm("Kosongkan Workspace?")) setElements([]); }} className="text-red-500 hover:text-white transition-colors p-2"><Eraser size={18}/></button>
                  <button onClick={() => { 
                    const blob = new Blob([finalCode], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `${projectName.replace(/\s+/g, '_')}.ino`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                  }} className="bg-emerald-600/20 text-emerald-400 p-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Download size={18}/></button>
                </div>
              )}
            </div>
            
            {/* CONTENT AREA */}
            <div className="flex-1 relative bg-black/20 flex flex-col overflow-hidden">
               {activeTab === 'code' && <CodeViewer finalCode={finalCode} requiredLibs={requiredLibs} />}
               {activeTab === 'wiring' && <WiringViewer sensors={elements.filter(e => e.kind === 'Sensor')} actuators={elements.filter(e => e.kind === 'Actuator')} board={board} usedPins={usedPins} />}
               {activeTab === 'explanation' && <ExplanationViewer text={explanationText} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}