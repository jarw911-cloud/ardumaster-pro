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
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'wiring' | 'explanation'>('code');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LISTENER DARI NAVBAR UTAMA ---
  useEffect(() => {
    const handleAction = (e: any) => {
      const { type, data } = e.detail;
      if (type === 'new') { if(window.confirm("Kosongkan Workspace?")) setElements([]); }
      else if (type === 'openCloud') fetchProjectList();
      else if (type === 'saveCloud') saveToCloud();
      else if (type === 'importLocal') fileInputRef.current?.click();
      else if (type === 'exportLocal') handleExportLocal();
      else if (type === 'loadSpecific') {
        setBoard(data.board);
        setProjectName(data.name);
        setElements(data.elements.map((el: any) => ({ ...el, id: Date.now() + Math.random() })));
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
    await supabase.from('ardumaster_projects').upsert({ username, project_name: projectName, elements, updated_at: new Date() }, { onConflict: 'username, project_name' });
    setIsSyncing(false);
    alert("Proyek Tersimpan di Cloud!");
  };

  const fetchProjectList = async () => {
    const { data } = await supabase.from('ardumaster_projects').select('id, project_name, updated_at').eq('username', username).order('updated_at', { ascending: false });
    setSavedProjects(data || []);
    setShowOpenModal(true);
  };

  const handleExportLocal = () => {
    const blob = new Blob([JSON.stringify({ projectName, board, elements }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${projectName}.ardumaster`;
    a.click();
  };

  const handleImportLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.elements) { setElements(parsed.elements); setProjectName(parsed.projectName); setBoard(parsed.board); }
    };
    reader.readAsText(file);
  };

  const usedPins = useMemo(() => {
    const pins: any[] = [];
    elements.forEach(el => { ['pin', 'pin2', 'pin3', 'pin4', 'pin5'].forEach(k => { if (el[k] && !['Logic', 'Variable', 'Utility'].includes(el.kind)) pins.push({ device: el.name, pin: el[k] }); }); });
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
    if (elements.length >= 12) return alert("Maksimal 12 kartu!");
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
    <div className="w-full relative">
      <input type="file" accept=".ardumaster,.json" ref={fileInputRef} onChange={handleImportLocal} className="hidden" />
      <ProjectModal show={showOpenModal} onClose={() => setShowOpenModal(false)} projects={savedProjects} onSelectProject={(id) => {
          const p = savedProjects.find(x => x.id === id);
          if(p) { setElements(p.elements || []); setProjectName(p.project_name); }
          setShowOpenModal(false);
      }} />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <input value={projectName} onChange={e => setProjectName(e.target.value)} className="bg-transparent border-none text-xl lg:text-2xl font-black text-white outline-none w-full uppercase mb-6 focus:text-cyan-500" />
            <div className="flex gap-2 mb-8">
                <select value={board} onChange={e => setBoard(e.target.value)} className="bg-black/30 p-3 rounded-xl text-[10px] font-black uppercase border border-white/5 text-slate-500 outline-none flex-1 cursor-pointer">
                  {Object.keys(BOARD_PINS).map(b => <option key={b}>{b}</option>)}
                </select>
                <select value={baudRate} onChange={e => setBaudRate(e.target.value)} className="bg-black/30 p-3 rounded-xl text-[10px] font-black uppercase border border-white/5 text-slate-500 outline-none w-28 cursor-pointer">
                  {["9600", "115200"].map(b => <option key={b}>{b}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-8">
               {['Sensor', 'Actuator', 'Variable', 'Logic', 'Utility'].map(k => (
                 <button key={k} onClick={() => addElement(k)} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-900/20 active:scale-95 transition-all text-[8px] font-black uppercase">
                    {k === 'Sensor' && <Thermometer size={14} className="text-cyan-500"/>}
                    {k === 'Actuator' && <Zap size={14} className="text-emerald-500"/>}
                    {k === 'Variable' && <Variable size={14} className="text-amber-500"/>}
                    {k === 'Logic' && <GitMerge size={14} className="text-purple-500"/>}
                    {k === 'Utility' && <Terminal size={14} className="text-blue-500"/>}
                    {k.substring(0,4)}
                 </button>
               ))}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {elements.length === 0 && <div className="py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">Workspace Kosong</div>}
              {elements.map(el => (
                <ElementCard key={el.id} el={el} allElements={elements} board={board} usedPins={usedPins} onUpdate={(id, d) => setElements(elements.map(e => e.id === id ? {...e, ...d} : e))} onRemove={id => setElements(elements.filter(e => e.id !== id))} onMove={(id, dir) => {
                  const idx = elements.findIndex(e => e.id === id);
                  const newEls = [...elements];
                  if(dir === 'up' && idx > 0) [newEls[idx], newEls[idx-1]] = [newEls[idx-1], newEls[idx]];
                  if(dir === 'down' && idx < elements.length -1) [newEls[idx], newEls[idx+1]] = [newEls[idx+1], newEls[idx]];
                  setElements(newEls);
                }} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col h-[850px] sticky top-28">
          <div className="bg-slate-900 rounded-[3.5rem] border border-white/5 overflow-hidden flex flex-col h-full shadow-2xl">
            <div className="bg-white/5 px-8 py-6 flex justify-between items-center border-b border-white/5">
              <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/5">
                 {['code', 'wiring', 'explanation'].map(t => (
                   <button key={t} onClick={() => setActiveTab(t as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-white'}`}>{t}</button>
                 ))}
              </div>
              {activeTab === 'code' && (
                <div className="flex gap-3">
                  <button onClick={() => { navigator.clipboard.writeText(finalCode); alert("Kopi Berhasil!"); }} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"><Copy size={16}/></button>
                  <button onClick={() => { 
                    const blob = new Blob([finalCode], { type: 'text/plain' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${projectName}.ino`; a.click();
                  }} className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"><Download size={16}/></button>
                  <button onClick={async () => { try { await (navigator as any).serial.requestPort(); alert("Arduino Terhubung!"); } catch { alert("Gagal koneksi USB."); } }} className="flex items-center gap-2 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-4 py-2.5 rounded-xl hover:bg-amber-500 hover:text-white transition-all cursor-pointer"><Usb size={16}/> Upload</button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden relative bg-black/20">
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