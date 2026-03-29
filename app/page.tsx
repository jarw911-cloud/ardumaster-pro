"use client";

import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, User, Code2, Cpu, Code, LogOut, Mail, Lock } from 'lucide-react';
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

  // Cek status login saat aplikasi pertama kali dimuat
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
      // Proses Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Gagal Login: " + error.message);
    } else {
      // Proses Daftar Akun Baru
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert("Gagal Daftar: " + error.message);
      else {
        alert("Pendaftaran berhasil! Silakan login menggunakan akun tersebut.");
        setIsLoginMode(true);
      }
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-400 p-6 lg:p-10 font-sans selection:bg-cyan-500/30 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="h-16 border-b border-white/5 flex flex-wrap items-center justify-between mb-10 gap-4 relative z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20">A</div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-tighter leading-none">ARDUMASTER <span className="text-cyan-500">PRO</span></h1>
            <p className="text-[10px] font-bold text-slate-600 uppercase italic tracking-widest">Kang Mastech Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <button onClick={() => setCurrentView('home')} className={`${currentView === 'home' ? 'text-cyan-500' : 'text-slate-500 hover:text-white'} transition-colors`}>Home</button>
          <button onClick={() => setCurrentView('about')} className={`${currentView === 'about' ? 'text-cyan-500' : 'text-slate-500 hover:text-white'} transition-colors`}>About Me</button>
          
          {session ? (
            <div className="flex items-center gap-4 ml-4 border-l border-white/5 pl-6">
               <button onClick={() => setCurrentView('dashboard')} className={`${currentView === 'dashboard' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'} flex items-center gap-2 transition-colors`}><Code size={14}/> Dashboard</button>
               <button onClick={handleLogout} className="text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors"><LogOut size={14}/> Keluar</button>
            </div>
          ) : (
            <button onClick={() => setCurrentView('login')} className="ml-4 bg-cyan-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-500/20"><User size={14}/> Login</button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        
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
          // Kita melempar email pengguna sebagai "username" agar sinkron dengan database sebelumnya
          <Dashboard username={session.user.email} />
        )}

      </main>

    </div>
  );
}