"use client";

import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, User, Code2, Cpu, Code, LogOut, Mail, Lock, Menu, X, Plus, LayoutTemplate, FolderOpen, UploadCloud, FileUp, FileDown, BookOpen, Sparkles } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';
import { PROJECT_TEMPLATES } from '@/lib/constants';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setCurrentView('dashboard');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setCurrentView('dashboard');
      else setCurrentView('home');
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fungsi untuk mengirim sinyal ke Dashboard.tsx
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
    
    if (error) alert("Kesalahan: " + error.message);
    else if (!isLoginMode) {
      alert("Pendaftaran berhasil! Cek email Anda.");
      setIsLoginMode(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-x-hidden">
      
      {/* GIANT LOGO OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-[#020617]/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)}>
          <div className="flex flex-col items-center justify-center opacity-[0.03] pointer-events-none select-none">
             <div className="text-[35vw] font-black text-cyan-500 leading-none">A</div>
             <div className="text-[10vw] font-black text-white tracking-[2em] -mr-[2em]">ARDUMASTER</div>
          </div>
        </div>
      )}

      {/* NAVBAR UTAMA */}
      <nav className="sticky top-0 z-[100] h-20 px-6 lg:px-10 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4 relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer group">
              {isMenuOpen ? <X size={28} className="text-cyan-400" /> : <Menu size={28} className="text-slate-400 group-hover:text-white" />}
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }}>
            <div className="w-9 h-9 bg-cyan-600 rounded-lg flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20">A</div>
            <h1 className="text-lg font-black text-white uppercase tracking-tighter">ARDUMASTER <span className="text-cyan-500">PRO</span></h1>
          </div>

          {/* DROPDOWN MENU */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col py-2 animate-in slide-in-from-top-4">
              <button onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }} className="px-6 py-3 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-3"><Zap size={14}/> Home</button>
              <button onClick={() => { setCurrentView('examples'); setIsMenuOpen(false); }} className="px-6 py-3 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-3 text-cyan-400"><BookOpen size={14}/> Project Examples</button>
              
              {currentView === 'dashboard' && (
                <>
                  <div className="h-px bg-white/5 my-2 mx-6" />
                  <button onClick={() => triggerDashboardAction('new')} className="px-6 py-3 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-3"><Plus size={14} className="text-emerald-400"/> New Project</button>
                  <button onClick={() => triggerDashboardAction('openCloud')} className="px-6 py-3 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-3"><FolderOpen size={14} className="text-cyan-400"/> Open Cloud</button>
                  <button onClick={() => triggerDashboardAction('importLocal')} className="px-6 py-3 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-3 text-amber-500"><FileUp size={14}/> Open Local File</button>
                  <button onClick={() => triggerDashboardAction('exportLocal')} className="px-6 py-3 hover:bg-white/5 text-left text-[10px] font-black uppercase flex items-center gap-3 text-amber-500"><FileDown size={14}/> Save Offline</button>
                </>
              )}
              <div className="h-px bg-white/5 my-2 mx-6" />
              <button onClick={() => { setCurrentView('about'); setIsMenuOpen(false); }} className="px-6 py-3 hover:bg-white/5 text-left text-[10px] font-black uppercase">About Developer</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <button onClick={() => setCurrentView('dashboard')} className={`text-[10px] font-black uppercase px-4 py-2 rounded-lg transition-all ${currentView === 'dashboard' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}`}>Dashboard</button>
              <button onClick={() => supabase.auth.signOut()} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400">Logout</button>
            </>
          ) : (
            <button onClick={() => setCurrentView('login')} className="bg-cyan-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-cyan-500 transition-all">Login</button>
          )}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-10">
        
        {/* HOME VIEW */}
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
             <button onClick={() => setCurrentView(session ? 'dashboard' : 'login')} className="bg-white text-black px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/10">Buka Workspace Pro &rarr;</button>
          </div>
        )}

        {/* EXAMPLES GALLERY */}
        {currentView === 'examples' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white uppercase mb-4">Galeri Proyek <span className="text-cyan-500">Inspiratif</span></h2>
                <p className="text-slate-500 text-sm italic">Pilih "resep" di bawah untuk langsung memuatnya ke Workspace.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PROJECT_TEMPLATES.map(item => (
                  <div key={item.id} className="bg-slate-900/50 border border-white/5 p-8 rounded-[3rem] hover:border-cyan-500/30 transition-all flex flex-col justify-between group">
                     <div>
                        <div className="text-4xl mb-6">{item.name.split(' ')[0]}</div>
                        <h3 className="text-xl font-black text-white uppercase mb-3 leading-tight">{item.name.substring(item.name.indexOf(' ') + 1)}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8">{item.description}</p>
                     </div>
                     <button onClick={() => { setCurrentView('dashboard'); setTimeout(() => triggerDashboardAction('loadSpecific', item), 200); }} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase group-hover:bg-cyan-600 group-hover:text-white transition-all tracking-widest">Gunakan Rancangan Ini</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* LOGIN VIEW */}
        {currentView === 'login' && !session && (
          <div className="py-10 flex justify-center items-center h-full animate-in zoom-in-95">
             <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-600"></div>
                <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">{isLoginMode ? 'Sign In' : 'Register'}</h2>
                <form onSubmit={handleAuth} className="space-y-5">
                   <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500" required />
                   <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-cyan-500" required />
                   <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 text-white p-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-500 shadow-lg shadow-cyan-500/20">{isLoading ? 'Loading...' : (isLoginMode ? 'Login' : 'Daftar')}</button>
                </form>
                <button onClick={() => setIsLoginMode(!isLoginMode)} className="w-full mt-8 text-[10px] font-bold text-slate-500 uppercase hover:text-cyan-400">{isLoginMode ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}</button>
             </div>
          </div>
        )}

        {/* DASHBOARD VIEW */}
        {currentView === 'dashboard' && session && <Dashboard username={session.user.email} />}
      </main>
    </div>
  );
}