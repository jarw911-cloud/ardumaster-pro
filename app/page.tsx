"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Zap, ArrowRight, User, Code2, Cpu, Code, LogOut, Mail, Lock, Menu, X, Plus, LayoutTemplate, FolderOpen, UploadCloud, FileUp, FileDown } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import { supabase } from '@/lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [session, setSession] = useState<any>(null);
  
  // State untuk form login/register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE UNTUK HAMBURGER MENU ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Referensi untuk mengirim sinyal/perintah ke komponen Dashboard
  // Kita menggunakan EventListener kustom agar Navbar bisa "menyuruh" Dashboard
  const triggerDashboardAction = (action: string) => {
    const event = new CustomEvent('dashboardAction', { detail: action });
    window.dispatchEvent(event);
    setIsMenuOpen(false);
  };

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Gagal Login: " + error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert("Gagal Daftar: " + error.message);
      } else {
        alert("Pendaftaran berhasil! Silakan konfirmasi email Anda.");
        setIsLoginMode(true);
      }
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-400 font-sans selection:bg-cyan-500/30 flex flex-col relative overflow-x-hidden">
      
      {/* =========================================
          GIANT LOGO OVERLAY (MUNCUL SAAT MENU AKTIF)
      ========================================= */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[90] bg-[#020617]/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300" 
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center opacity-5 pointer-events-none select-none mix-blend-screen">
             <div className="text-[30vw] font-black text-cyan-500 leading-none drop-shadow-[0_0_100px_rgba(6,182,212,1)]">A</div>
             <div className="text-[10vw] font-black text-white tracking-widest leading-none mt-4">ARDUMASTER</div>
          </div>
        </div>
      )}

      {/* =========================================
          NAVBAR UTAMA (DENGAN HAMBURGER MENU)
      ========================================= */}
      <nav className="sticky top-0 h-20 px-6 lg:px-10 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-[100] mb-6">
      
        <div className="flex items-center gap-4 select-none relative">
          
          {/* HAMBURGER MENU BUTTON */}
          <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)} 
             className="p-2 bg-transparent border-none hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center group"
          >
              {isMenuOpen ? <X size={28} className="text-cyan-400" /> : <Menu size={28} className="text-slate-400 group-hover:text-cyan-400" />}
          </button>

          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }}>
            <div className="w-9 h-9 bg-cyan-600 rounded-lg flex items-center justify-center font-black text-xl text-white shadow-lg shadow-cyan-500/20">A</div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">
                ARDUMASTER <span className="text-cyan-500">PRO</span>
              </h1>
            </div>
          </div>

          {/* DROPDOWN MENU PANEL (HANYA MUNCUL DI DASHBOARD/LOGIN) */}
          {isMenuOpen && currentView === 'dashboard' && (
              <div className="absolute top-16 left-0 w-64 bg-slate-800/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden flex flex-col py-3 animate-in slide-in-from-top-4">
                  
                  <button onClick={() => triggerDashboardAction('new')} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 text-left text-xs font-black uppercase text-white transition-all cursor-pointer">
                      <Plus size={16} className="text-emerald-400" /> New Blank Project
                  </button>
                  <button onClick={() => triggerDashboardAction('template')} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 text-left text-xs font-black uppercase text-white transition-all cursor-pointer">
                      <LayoutTemplate size={16} className="text-purple-400" /> New From Template
                  </button>
                  
                  <div className="h-px bg-white/5 my-2 mx-6"></div>
                  
                  <button onClick={() => triggerDashboardAction('openCloud')} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 text-left text-xs font-black uppercase text-white transition-all cursor-pointer">
                      <FolderOpen size={16} className="text-cyan-400" /> Open Cloud Project
                  </button>
                  <button onClick={() => triggerDashboardAction('saveCloud')} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 text-left text-xs font-black uppercase text-white transition-all cursor-pointer">
                      <UploadCloud size={16} className="text-cyan-400" /> Save to Cloud
                  </button>

                  <div className="h-px bg-white/5 my-2 mx-6"></div>

                  <button onClick={() => triggerDashboardAction('importLocal')} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 text-left text-xs font-black uppercase text-amber-400 transition-all cursor-pointer">
                      <FileUp size={16} /> Open Local (.json)
                  </button>
                  <button onClick={() => triggerDashboardAction('exportLocal')} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 text-left text-xs font-black uppercase text-amber-400 transition-all cursor-pointer">
                      <FileDown size={16} /> Save Offline (.json)
                  </button>
              </div>
          )}
        </div>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <button onClick={() => setCurrentView('home')} className={`${currentView === 'home' ? 'text-cyan-500' : 'text-slate-500 hover:text-white'} transition-colors hidden md:block`}>Home</button>
          <button onClick={() => setCurrentView('about')} className={`${currentView === 'about' ? 'text-cyan-500' : 'text-slate-500 hover:text-white'} transition-colors hidden md:block`}>About Me</button>
          
          {session ? (
            <div className="flex items-center gap-4 ml-4 md:border-l border-white/5 md:pl-6">
               <button onClick={() => setCurrentView('dashboard')} className={`${currentView === 'dashboard' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'} flex items-center gap-2 transition-colors`}><Code size={14} className="hidden sm:block"/> Dashboard</button>
               <button onClick={handleLogout} className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors"><LogOut size={14}/> Keluar</button>
            </div>
          ) : (
            <button onClick={() => setCurrentView('login')} className="bg-cyan-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/20"><User size={14}/> Login</button>
          )}
        </div>
      </nav>

      <main className={`max-w-7xl mx-auto w-full flex-1 flex flex-col px-6 lg:px-10 transition-opacity duration-300 ${isMenuOpen && currentView === 'dashboard' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        
        {/* HALAMAN HOME */}
        {currentView === 'home' && (
          <div className="py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-8 border border-cyan-500/20">
                <Zap size={10} className="text-cyan-500 animate-pulse"/> Generator Logika IoT v2.0
             </div>
             <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
               Eksplorasi Logika.<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Rakitan Tanpa Batas.</span>
             </h1>
             <p className="text-slate-500 max-w-2xl mx-auto text-sm lg:text-base leading-relaxed mb-10">
                ArduMaster Pro membantu meracik logika mikrokontroler dengan cepat. Visualisasikan alur *Hardware* ke *Software* dan dapatkan kode instan yang siap diunggah ke *board* favorit Anda.
             </p>
             <div className="flex gap-4">
                <button onClick={() => setCurrentView('login')} className="bg-white text-black px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-2">Mulai Merakit <ArrowRight size={16}/></button>
                <button onClick={() => setCurrentView('about')} className="bg-slate-900 border border-white/5 text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-white/5 transition-all">Kenali Kreator</button>
             </div>
          </div>
        )}

        {/* HALAMAN ABOUT ME */}
        {currentView === 'about' && (
          <div className="py-10 max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
               <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/20">
                  <User size={32} className="text-white"/>
               </div>
               <h2 className="text-3xl font-black text-white mb-4">Kang Mas Tech</h2>
               <p className="text-slate-400 leading-relaxed mb-6">
                 Seorang antusias teknologi yang gemar mengutak-atik sistem dari hulu ke hilir. Mencari ketenangan dalam struktur kode sekaligus menikmati dinamika perangkat keras mikrokontroler. Proyek ini dibangun sebagai alat bantu visualisasi logika komputasi.
               </p>
               <div className="flex gap-4 border-t border-white/5 pt-8 mt-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase"><Code2 size={16} className="text-cyan-500"/> Flutter & Next.js</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase"><Cpu size={16} className="text-emerald-500"/> IoT & Robotika</div>
               </div>
            </div>
          </div>
        )}

        {/* HALAMAN LOGIN & DAFTAR */}
        {currentView === 'login' && !session && (
          <div className="py-20 flex justify-center animate-in zoom-in-95 duration-500">
             <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                  {isLoginMode ? 'Masuk Ruang Kerja' : 'Daftar Akun Baru'}
                </h2>
                <p className="text-xs text-slate-500 mb-8 font-bold">
                  {isLoginMode ? 'Gunakan kredensial Supabase Anda' : 'Buat akun untuk menyimpan proyek'}
                </p>
                
                <form onSubmit={handleAuth} className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-4 text-slate-600"/>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="kangmas@tech.com"
                          className="w-full bg-black/50 border border-white/5 py-4 pl-12 pr-4 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-colors text-sm"
                          required
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-4 text-slate-600"/>
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full bg-black/50 border border-white/5 py-4 pl-12 pr-4 rounded-2xl text-white outline-none focus:border-cyan-500/50 transition-colors text-sm"
                          required
                        />
                      </div>
                   </div>
                   
                   <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 text-white p-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-500 transition-colors mt-6 shadow-lg shadow-cyan-500/20 disabled:opacity-50">
                     {isLoading ? 'Memproses...' : (isLoginMode ? 'Login Sekarang' : 'Daftar Sekarang')}
                   </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-6">
                   <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-bold">
                      {isLoginMode ? 'Belum punya akun? Daftar di sini.' : 'Sudah punya akun? Login di sini.'}
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* HALAMAN DASHBOARD */}
        {currentView === 'dashboard' && session && (
          <Dashboard username={session.user.email} />
        )}

      </main>
    </div>
  );
}