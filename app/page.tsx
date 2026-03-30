"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, ArrowRight, User, Code2, Cpu, Code, LogOut, Mail, Lock, 
  Menu, X, Plus, LayoutTemplate, FolderOpen, UploadCloud, 
  FileUp, FileDown, BookOpen, Sparkles, Activity 
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { PROJECT_TEMPLATES, SENSOR_EXAMPLES, ACTUATOR_EXAMPLES } from '@/lib/constants';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [session, setSession] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cek Sesi Awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setCurrentView('dashboard');
    });

    // Listen Perubahan Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setCurrentView('dashboard');
      else setCurrentView('home');
    });

    return () => subscription.unsubscribe();
  }, []);

  // FUNGSI SAKTI: Mengirim perintah dari Navbar ke Dashboard.tsx
  const triggerDashboardAction = (type: string, data?: any) => {
    const event = new CustomEvent('dashboardAction', { detail: { type, data } });
    window.dispatchEvent(event);
    setIsMenuOpen(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = isLoginMode 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    
    if (error) alert("Waduh, ada kendala: " + error.message);
    else if (!isLoginMode) {
      alert("Pendaftaran sukses, Kang Mas! Silakan cek email konfirmasi.");
      setIsLoginMode(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-x-hidden">
      
      {/* =========================================
          1. GIANT LOGO OVERLAY (EFEK WATERMARK)
      ========================================= */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[80] bg-[#020617]/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300" 
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center opacity-[0.03] pointer-events-none select-none">
             <div className="text-[35vw] font-black text-cyan-500 leading-none">A</div>
             <div className="text-[10vw] font-black text-white tracking-[1em] -mr-[1em]">ARDUMASTER</div>
          </div>
        </div>
      )}

      {/* =========================================
          2. NAVBAR UTAMA (FIXED/STICKY)
      ========================================= */}
      <nav className="sticky top-0 z-[100] h-20 px-6 lg:px-10 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4 relative">
          
          {/* HAMBURGER MENU BUTTON */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2.5 bg-slate-900/50 border border-white/5 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
              {isMenuOpen ? <X size={26} className="text-cyan-400" /> : <Menu size={26} className="text-slate-400 group-hover:text-white" />}
          </button>
          
          {/* LOGO & BRAND */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }}>
            <div className="w-9 h-9 bg-cyan-600 rounded-lg flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/30">A</div>
            <h1 className="text-lg font-black text-white uppercase tracking-tighter">
              ARDUMASTER <span className="text-cyan-500">PRO</span>
            </h1>
          </div>

          {/* DROPDOWN MENU PANEL */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col py-2 animate-in slide-in-from-top-4">
              <button onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4"><Zap size={14} className="text-slate-400"/> Home</button>
              <button onClick={() => { setCurrentView('examples'); setIsMenuOpen(false); }} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4 text-cyan-400"><BookOpen size={14}/> Project Examples</button>
              <button onClick={() => { setCurrentView('sensor_lab'); setIsMenuOpen(false); }} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4 text-emerald-400"><Cpu size={14}/> Sensor Lab</button>
              <button onClick={() => { setCurrentView('actuator_lab'); setIsMenuOpen(false); }} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4 text-yellow-400"><Activity size={14}/> Actuator Lab</button>
              
              {currentView === 'dashboard' && (
                <>
                  <div className="h-px bg-white/5 my-2 mx-6" />
                  <button onClick={() => triggerDashboardAction('new')} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4"><Plus size={14} className="text-emerald-400"/> New Project</button>
                  <button onClick={() => triggerDashboardAction('openCloud')} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4"><FolderOpen size={14} className="text-cyan-400"/> Open Cloud</button>
                  <button onClick={() => triggerDashboardAction('importLocal')} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4 text-amber-500"><FileUp size={14}/> Open Local File</button>
                  <button onClick={() => triggerDashboardAction('exportLocal')} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-4 text-amber-500"><FileDown size={14}/> Save Offline</button>
                </>
              )}
              <div className="h-px bg-white/5 my-2 mx-6" />
              <button onClick={() => { setCurrentView('about'); setIsMenuOpen(false); }} className="px-6 py-3.5 hover:bg-white/5 text-left text-[10px] font-black uppercase">About Developer</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <button onClick={() => setCurrentView('dashboard')} className={`hidden sm:block text-[10px] font-black uppercase px-5 py-2.5 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Dashboard</button>
              <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 px-2 transition-colors">Logout</button>
            </>
          ) : (
            <button onClick={() => setCurrentView('login')} className="bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/20">Login</button>
          )}
        </div>
      </nav>

      {/* =========================================
          3. KONTEN UTAMA (MAIN AREA)
      ========================================= */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-10">
        
        {/* --- VIEW: HOME --- */}
        {currentView === 'home' && (
          <div className="py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-10 border border-cyan-500/20">
                <Sparkles size={12}/> Master of Microcontroller Logic
             </div>
             <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
               Rakit Logika.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Kendali Nyata.</span>
             </h1>
             <p className="text-slate-500 max-w-2xl mx-auto text-base mb-12 leading-relaxed">
                Platform visual tercanggih untuk membangun sistem IoT dan Robotika. Susun alur kerja, otomatisasi pin, dan dapatkan kode Arduino dalam hitungan detik.
             </p>
             <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setCurrentView(session ? 'dashboard' : 'login')} className="bg-white text-black px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Mulai Merakit &rarr;</button>
                <button onClick={() => setCurrentView('examples')} className="bg-slate-900 border border-white/5 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Lihat Inspirasi</button>
             </div>
          </div>
        )}

        {/* --- VIEW: PROJECT EXAMPLES --- */}
        {currentView === 'examples' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Inspirasi <span className="text-cyan-500">Proyek Utuh</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Pilih rancangan IoT/Robotika untuk langsung dimuat ke Workspace</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PROJECT_TEMPLATES.map(item => (
                  <div key={item.id} className="bg-slate-900/50 border border-white/5 p-8 rounded-[3rem] hover:border-cyan-500/30 transition-all flex flex-col justify-between group">
                     <div>
                        <div className="text-4xl mb-6">{item.name.split(' ')[0]}</div>
                        <h3 className="text-xl font-black text-white uppercase mb-3 leading-tight">{item.name.substring(item.name.indexOf(' ') + 1)}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8">{item.description}</p>
                     </div>
                     <button onClick={() => { setCurrentView('dashboard'); setTimeout(() => triggerDashboardAction('loadSpecific', item), 200); }} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase group-hover:bg-cyan-600 group-hover:text-white transition-all tracking-widest">Buka Rancangan &rarr;</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: SENSOR LAB --- */}
        {currentView === 'sensor_lab' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Sensor <span className="text-emerald-500">Lab</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Tes pembacaan data mentah sensor ke Serial Monitor</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SENSOR_EXAMPLES.map(item => (
                  <div key={item.id} className="bg-slate-900/80 border border-white/5 p-7 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group flex flex-col justify-between">
                     <div>
                        <h3 className="text-sm font-black text-white uppercase mb-3">{item.name}</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-6 h-12">{item.description}</p>
                     </div>
                     <button onClick={() => { setCurrentView('dashboard'); setTimeout(() => triggerDashboardAction('loadSpecific', { ...item, board: 'Arduino Uno R3' }), 200); }} className="w-full py-3 bg-emerald-600/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">Uji Sensor &rarr;</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: ACTUATOR LAB --- */}
        {currentView === 'actuator_lab' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Actuator <span className="text-yellow-500">Lab</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Tes fungsionalitas komponen output (Hardware Check)</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ACTUATOR_EXAMPLES.map(item => (
                  <div key={item.id} className="bg-slate-900/80 border border-white/5 p-7 rounded-[2.5rem] hover:border-yellow-500/30 transition-all group flex flex-col justify-between">
                     <div>
                        <h3 className="text-sm font-black text-white uppercase mb-3">{item.name}</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-6 h-12">{item.description}</p>
                     </div>
                     <button onClick={() => { setCurrentView('dashboard'); setTimeout(() => triggerDashboardAction('loadSpecific', { ...item, board: 'Arduino Uno R3' }), 200); }} className="w-full py-3 bg-yellow-600/10 text-yellow-500 rounded-xl text-[9px] font-black uppercase hover:bg-yellow-600 hover:text-white transition-all">Uji Aktuator &rarr;</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {currentView === 'login' && !session && (
          <div className="py-10 flex justify-center items-center h-full animate-in zoom-in-95">
             <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-600"></div>
                <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">{isLoginMode ? 'Sign In' : 'Register'}</h2>
                <form onSubmit={handleAuth} className="space-y-5">
                   <div className="relative">
                      <Mail size={16} className="absolute left-4 top-4 text-slate-600"/>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-black/50 border border-white/10 py-4 pl-12 pr-4 rounded-2xl text-white outline-none focus:border-cyan-500 text-sm" required />
                   </div>
                   <div className="relative">
                      <Lock size={16} className="absolute left-4 top-4 text-slate-600"/>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black/50 border border-white/10 py-4 pl-12 pr-4 rounded-2xl text-white outline-none focus:border-cyan-500 text-sm" required />
                   </div>
                   <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 text-white p-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-500 shadow-lg shadow-cyan-500/20">{isLoading ? 'Loading...' : (isLoginMode ? 'Login Sekarang' : 'Daftar Akun')}</button>
                </form>
                <button onClick={() => setIsLoginMode(!isLoginMode)} className="w-full mt-8 text-[10px] font-bold text-slate-500 uppercase hover:text-cyan-400">
                   {isLoginMode ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Login di sini'}
                </button>
             </div>
          </div>
        )}

        {/* --- VIEW: ABOUT --- */}
        {currentView === 'about' && (
          <div className="py-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
               <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/20">
                  <User size={32} className="text-white"/>
               </div>
               <h2 className="text-3xl font-black text-white mb-4">Kang Mas Tech</h2>
               <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                 Seorang antusias teknologi yang gemar mengutak-atik sistem dari hulu ke hilir. ArduMaster Pro dibangun sebagai sarana visualisasi logika pemrograman bagi para pengembang sistem IoT dan robotika masa depan.
               </p>
               <div className="flex gap-6 border-t border-white/5 pt-8 mt-8">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase"><Code2 size={16} className="text-cyan-500"/> Flutter & Next.js</div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase"><Cpu size={16} className="text-emerald-500"/> IoT & Robotika</div>
               </div>
            </div>
          </div>
        )}

        {/* --- VIEW: DASHBOARD (WORKSPACE) --- */}
        {currentView === 'dashboard' && session && (
          <Dashboard username={session.user.email} />
        )}

      </main>

      {/* FOOTER KECIL */}
      <footer className="p-10 border-t border-white/5 text-center">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">ArduMaster Pro v2.0 • Kang Mastech Engine</p>
      </footer>
    </div>
  );
}