import React from 'react';
import { X, Thermometer, Zap, Variable, GitMerge, Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { BOARD_PINS, SENSORS_DB, ACTUATORS_DB, isPinSupported, getPinWarning } from '@/lib/constants';

interface ElementCardProps {
  el: any;
  allElements: any[];
  board: string;
  usedPins: any[];
  onUpdate: (id: number, data: any) => void;
  onRemove: (id: number) => void;
  onMove: (id: number, direction: 'up' | 'down') => void;
}

export default function ElementCard({ el, allElements, board, usedPins, onUpdate, onRemove, onMove }: ElementCardProps) {
  // 1. Ambil data konfigurasi komponen dari database (constants.ts)
  const dbConfig = el.kind === 'Sensor' 
    ? SENSORS_DB.find(x => x.name === el.type) 
    : ACTUATORS_DB.find(x => x.name === el.type);

  // 2. PERBAIKAN: Hitung jumlah pin berdasarkan panjang array `pinTypes`
  const pinTypes = dbConfig?.pinTypes || ['digital']; // Default 1 pin digital
  const pinCount = pinTypes.length;

  const getIcon = () => {
    if (el.kind === 'Sensor') return <Thermometer size={16} className="text-cyan-500" />;
    if (el.kind === 'Actuator') return <Zap size={16} className="text-emerald-500" />;
    if (el.kind === 'Variable') return <Variable size={16} className="text-amber-500" />;
    if (el.kind === 'Logic') return <GitMerge size={16} className="text-purple-500" />;
    return <Terminal size={16} className="text-blue-500" />;
  };

  return (
    <div className={`bg-black/50 p-5 rounded-3xl border border-white/5 relative group transition-all hover:border-white/10 ${el.kind === 'Logic' ? 'border-purple-500/20' : el.kind === 'Utility' ? 'border-blue-500/20' : ''}`}>
      {/* TOMBOL KONTROL: MOVE UP, DOWN, REMOVE */}
      <div className="absolute top-5 right-6 flex gap-2 items-center">
          <button onClick={() => onMove(el.id, 'up')} className="p-1 hover:bg-white/5 rounded text-slate-600 hover:text-cyan-500 transition-colors"><ChevronUp size={14}/></button>
          <button onClick={() => onMove(el.id, 'down')} className="p-1 hover:bg-white/5 rounded text-slate-600 hover:text-cyan-500 transition-colors"><ChevronDown size={14}/></button>
          <button onClick={() => onRemove(el.id)} className="ml-2 p-1 hover:bg-red-500/10 rounded text-slate-700 hover:text-red-500 transition-colors"><X size={16}/></button>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
          {getIcon()}
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{el.kind}</span>
          <span className="text-xs font-mono text-slate-600">{el.name}</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* VIEW: VARIABLE */}
        {el.kind === 'Variable' && (
           <div className="grid grid-cols-2 gap-3 w-full">
              <select value={el.varType} onChange={e => onUpdate(el.id, { varType: e.target.value })} className="bg-slate-900 p-2.5 rounded-xl text-xs font-bold outline-none text-slate-400 border border-white/5">
                {['int', 'float', 'bool', 'String'].map(v => <option key={v}>{v}</option>)}
              </select>
              <select value={el.sourceSensor || ""} onChange={e => onUpdate(el.id, { sourceSensor: e.target.value })} className="bg-slate-900 p-2.5 rounded-xl text-[10px] font-bold outline-none text-cyan-500 border border-white/5">
                 <option value="">-- Isi Manual --</option>
                 {allElements.filter(x => x.kind === 'Sensor').map(x => <option key={x.id} value={x.name}>Baca {x.name}</option>)}
              </select>
              <input value={el.sourceSensor ? `Auto (${el.sourceSensor})` : el.value} disabled={!!el.sourceSensor} onChange={e => onUpdate(el.id, { value: e.target.value })} className={`bg-slate-900 p-2.5 rounded-xl text-xs text-white outline-none border border-white/5 col-span-2 ${el.sourceSensor ? 'opacity-50 italic text-cyan-500' : ''}`} placeholder="Nilai" />
           </div>
        )}

        {/* VIEW: SENSOR & ACTUATOR */}
        {(el.kind === 'Sensor' || el.kind === 'Actuator') && (
          <>
            <select value={el.type} onChange={e => onUpdate(el.id, { type: e.target.value })} className="bg-slate-900 p-2.5 rounded-xl text-xs font-bold outline-none text-slate-400 border border-white/5 w-full">
               {(el.kind === 'Sensor' ? SENSORS_DB : ACTUATORS_DB).map(x => <option key={x.name}>{x.name}</option>)}
            </select>
            
            {/* PERBAIKAN: Mapping berdasarkan pinCount yang baru */}
            <div className={`grid gap-3 ${pinCount > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {Array.from({ length: pinCount }).map((_, pIdx) => {
                  const pKey = pIdx === 0 ? 'pin' : `pin${pIdx + 1}`;
                  let label = `Pin ${pIdx + 1}`;
                  
                  // Label khusus untuk komponen tertentu (opsional, bisa ditambah nanti)
                  if (el.type === "Ultrasonik (HC-SR04)") {
                     label = pIdx === 0 ? "TRIG (Out)" : "ECHO (In)";
                  }

                  // Pengecekan Warning & Support
                  const reqType = pinTypes[pIdx];
                  const warningMsg = el[pKey] ? getPinWarning(board, el[pKey], reqType) : null;
                  
                  return (
                    <div key={pKey} className="flex flex-col gap-1 w-full">
                      <label className="text-[9px] font-black uppercase text-slate-500 pl-1">{label} ({reqType})</label>
                      <select value={el[pKey] || ""} onChange={e => onUpdate(el.id, { [pKey]: e.target.value })} className="bg-slate-900 p-2.5 rounded-xl text-[10px] font-mono outline-none border border-white/5 text-cyan-500 w-full">
    <option value="" disabled>Pilih Pin...</option>
    {/* INI BAGIAN YANG DIUBAH */}
    {(BOARD_PINS[board] as string[])?.map(p => {
      const isTaken = usedPins.some(up => up.pin === p && up.device !== el.name);
      const isSupported = isPinSupported(board, p, reqType);
      const isDisabled = isTaken || !isSupported;
      let optLabel = `P${p}${isTaken ? ' (Dipakai)' : !isSupported ? ' (Tdk Support)' : ''}`;
      return <option key={p} value={p} disabled={isDisabled} className={isDisabled ? 'text-slate-600 italic' : 'text-white'}>{optLabel}</option>
    })}
</select>
                      {warningMsg && <p className="text-[8px] text-amber-500 font-bold bg-amber-500/10 p-1 rounded mt-1">{warningMsg}</p>}
                    </div>
                  )
              })}
            </div>
          </>
        )}

        {/* VIEW: LOGIC */}
        {el.kind === 'Logic' && (
          <div className="space-y-3">
            <div className="flex gap-2 items-center bg-slate-900 p-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-black uppercase text-slate-600 w-12 text-center">JIKA</span>
                <select value={el.source} onChange={e => onUpdate(el.id, { source: e.target.value })} className="bg-transparent p-1.5 rounded text-xs font-bold flex-1 outline-none text-cyan-500">
                  <option value="">-- DATA --</option>
                  {allElements.filter(x => x.kind === 'Sensor' || x.kind === 'Variable').map(x => <option key={x.id} value={x.kind === 'Sensor' ? `val_${x.name}` : x.name}>{x.name.toUpperCase()}</option>)}
                </select>
                <select value={el.operator} onChange={e => onUpdate(el.id, { operator: e.target.value })} className="bg-black/50 p-1.5 rounded text-xs font-black w-10 outline-none text-white">{['>', '<', '==', '!=', '>=', '<='].map(o => <option key={o}>{o}</option>)}</select>
                <input value={el.threshold} onChange={e => onUpdate(el.id, { threshold: e.target.value })} className="bg-black/50 p-1.5 rounded text-xs w-14 outline-none text-amber-400 font-bold text-center" />
            </div>
            <div className="flex gap-2 items-center bg-slate-900 p-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] font-black uppercase text-slate-600 w-12 text-center">MAKA</span>
                <select value={el.target} onChange={e => {
                  const targetActuator = allElements.find(x => x.name === e.target.value);
                  onUpdate(el.id, { 
                    target: e.target.value, 
                    actionTrue: targetActuator?.type.includes("Servo") ? "90" : "HIGH", 
                    actionFalse: targetActuator?.type.includes("Servo") ? "0" : "LOW" 
                  });
                }} className="bg-transparent p-1.5 rounded text-xs font-bold flex-1 outline-none text-emerald-500">
                  <option value="">-- TARGET --</option>
                  {allElements.filter(x => x.kind === 'Actuator').map(x => <option key={x.id} value={x.name}>{x.name.toUpperCase()}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-black/30 p-2 rounded-lg border border-white/5"><p className="text-[9px] font-black text-slate-600 mb-1 uppercase text-center">True</p><input value={el.actionTrue} onChange={e => onUpdate(el.id, { actionTrue: e.target.value })} className="bg-transparent w-full outline-none text-xs text-center text-white font-mono" /></div>
                <div className="bg-black/30 p-2 rounded-lg border border-white/5"><p className="text-[9px] font-black text-slate-600 mb-1 uppercase text-center">False</p><input value={el.actionFalse} onChange={e => onUpdate(el.id, { actionFalse: e.target.value })} className="bg-transparent w-full outline-none text-xs text-center text-white font-mono" /></div>
            </div>
          </div>
        )}

        {/* VIEW: UTILITY (DELAY & PRINT) */}
        {el.kind === 'Utility' && (
          <div className="flex flex-col gap-3">
            <select value={el.type} onChange={e => onUpdate(el.id, { type: e.target.value })} className="bg-slate-900 p-2.5 rounded-xl text-xs font-bold outline-none text-slate-400 border border-white/5 w-full">
                <option>Serial Print</option><option>Delay</option>
            </select>
            {el.type === 'Delay' ? (
                <div className="flex gap-2 items-center bg-slate-900 p-1.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black uppercase text-slate-600 w-16 text-center">WAKTU</span>
                    <input value={el.value} onChange={e => onUpdate(el.id, { value: e.target.value })} className="bg-transparent p-1.5 rounded text-xs font-bold flex-1 outline-none text-blue-400" placeholder="ms" />
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <input value={el.value} onChange={e => onUpdate(el.id, { value: e.target.value })} className="bg-slate-900 p-2.5 rounded-xl text-xs text-white outline-none border border-white/5" placeholder="Teks Awalan" />
                    <select value={el.source} onChange={e => onUpdate(el.id, { source: e.target.value })} className="bg-slate-900 p-2.5 rounded-xl text-[10px] font-bold outline-none text-cyan-500 border border-white/5 w-full">
                        <option value="">-- Hanya Teks --</option>
                        {allElements.filter(x => x.kind === 'Sensor' || x.kind === 'Variable').map(x => <option key={x.id} value={x.kind === 'Sensor' ? `val_${x.name}` : x.name}>Print {x.name.toUpperCase()}</option>)}
                    </select>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}