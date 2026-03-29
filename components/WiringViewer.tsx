import React from 'react';
import { Cpu } from 'lucide-react';
import { WIRING_MAP } from '@/lib/constants';

interface WiringViewerProps {
  sensors: any[];
  actuators: any[];
  board: string;
  usedPins: { pin: string }[];
}

export default function WiringViewer({ sensors, actuators, board, usedPins }: WiringViewerProps) {
  
  const renderModule = (el: any, isRight: boolean) => {
    const wires = WIRING_MAP[el.type] || [
        { label: "VCC", type: 'vcc', color: 'bg-red-500' },
        { label: "DATA", type: 'data', color: 'bg-cyan-500' },
        { label: "GND", type: 'gnd', color: 'bg-slate-600' }
    ];

    return (
      <div key={el.id} className="relative flex flex-col items-center group">
        {/* Body Modul Fisik */}
        <div className="bg-slate-800 border-b-4 border-slate-900 rounded-xl p-4 w-48 shadow-2xl transition-transform group-hover:-translate-y-1">
          {/* Ilustrasi Komponen (Cth: Ultrasonic Mata) */}
          {el.type.includes("HC-SR04") && (
            <div className="flex justify-around mb-4">
              <div className="w-10 h-10 rounded-full border-4 border-slate-600 bg-slate-700 flex items-center justify-center"><div className="w-4 h-4 bg-black rounded-full"></div></div>
              <div className="w-10 h-10 rounded-full border-4 border-slate-600 bg-slate-700 flex items-center justify-center"><div className="w-4 h-4 bg-black rounded-full"></div></div>
            </div>
          )}
          
          <div className="text-[10px] font-black text-white text-center uppercase mb-4 tracking-tighter opacity-80">{el.type}</div>
          
          {/* Header Pin Modul */}
          <div className="flex justify-center gap-1 bg-black/40 p-1.5 rounded-lg border border-white/5">
            {wires.map((w, idx) => (
               <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`w-3 h-3 rounded-sm ${w.color} shadow-sm`}></div>
                  <span className="text-[7px] font-bold text-slate-500">{w.label.split(' ')[0]}</span>
               </div>
            ))}
          </div>
        </div>

        {/* Jalur Kabel Keluar */}
        <div className={`flex flex-col ${isRight ? 'items-start -translate-x-10' : 'items-end translate-x-10'} mt-2 w-full`}>
           {wires.map((w, idx) => {
             // Deteksi pin mana yang dipakai untuk label data
             let pinLabel = "";
             if (w.type === 'vcc') pinLabel = "5V / 3.3V";
             else if (w.type === 'gnd') pinLabel = "GND";
             else {
                // Mapping pin data (Trig ke pin1, Echo ke pin2, dst)
                const dataIdx = wires.filter((x, i) => x.type === 'data' && i <= idx).length;
                pinLabel = dataIdx === 1 ? `Pin ${el.pin}` : `Pin ${el.pin2 || '?'}`;
             }

             return (
               <div key={idx} className={`flex items-center gap-2 mb-1 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${w.type === 'vcc' ? 'bg-red-500/20 text-red-400' : w.type === 'gnd' ? 'bg-slate-700 text-slate-300' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
                    {pinLabel}
                  </span>
                  <div className={`h-[2px] w-12 ${w.color} opacity-40 shadow-[0_0_8px_currentColor]`}></div>
               </div>
             )
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full p-10 overflow-auto custom-scrollbar flex flex-col items-center bg-[radial-gradient(circle_at_center,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)]">
      {/* Legend & Title */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-16 px-4">
        <div className="space-y-1">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase">Wiring Schematic</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Visual Guide for Physical Assembly</p>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[9px] font-bold text-slate-400">VCC</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-600"></div><span className="text-[9px] font-bold text-slate-400">GND</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-[9px] font-bold text-slate-400">DATA</span></div>
        </div>
      </div>

      <div className="w-full max-w-6xl flex justify-between items-start gap-10 relative">
        
        {/* Kolom Sensor (Kiri) */}
        <div className="flex-1 flex flex-col gap-12 items-center">
            {sensors.length === 0 ? (
                <div className="h-40 w-full border-2 border-dashed border-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 text-[10px] font-bold uppercase tracking-widest">No Input Modules</div>
            ) : sensors.map(s => renderModule(s, false))}
        </div>

        {/* Kolom Central Board (Tengah) */}
        <div className="flex-1 flex justify-center sticky top-0 py-10">
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-10 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all"></div>
                
                <div className="bg-[#1e293b] border-[6px] border-[#334155] rounded-[3rem] p-10 w-64 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
                    {/* Texture Microchip */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    
                    <div className="flex flex-col items-center relative z-20">
                        <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Cpu size={48} className="text-slate-400 drop-shadow-lg" />
                        </div>
                        <h4 className="text-white font-black text-sm text-center uppercase tracking-widest leading-tight">{board}</h4>
                        <div className="mt-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            <span className="text-[8px] text-cyan-400 font-black uppercase">Core Controller</span>
                        </div>

                        {/* List Pin Board */}
                        <div className="mt-8 grid grid-cols-4 gap-2 w-full">
                            {usedPins.map((up, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mb-1 shadow-[0_0_5px_rgba(234,179,8,0.8)]"></div>
                                    <span className="text-[8px] font-mono text-slate-500">P{up.pin}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Kolom Aktuator (Kanan) */}
        <div className="flex-1 flex flex-col gap-12 items-center">
            {actuators.length === 0 ? (
                <div className="h-40 w-full border-2 border-dashed border-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 text-[10px] font-bold uppercase tracking-widest">No Output Modules</div>
            ) : actuators.map(a => renderModule(a, true))}
        </div>

      </div>

      {/* Ground & Power Rail Simulator */}
      <div className="mt-20 w-full max-w-4xl bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex justify-around items-center">
            <div className="text-center">
                <div className="w-full h-1 bg-red-500/30 rounded mb-2"></div>
                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Common VCC Rail (Positive)</p>
            </div>
            <div className="text-center">
                <div className="w-full h-1 bg-slate-600 rounded mb-2"></div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Common GND Rail (Negative)</p>
            </div>
        </div>
      </div>
    </div>
  );
}