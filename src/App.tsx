import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import type { User, Session } from '@supabase/supabase-js';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Story from './pages/Story';
import Leaderboard from './pages/Leaderboard';
import Download from './pages/Download';
import Topup from './pages/Topup';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Characters from './pages/Characters';
import Forum from './pages/Forum';

export type AuthUser = User | null;

function App() {
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-game-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-game-gradient relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,45,157,0.18),transparent_55%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(28,245,179,0.13),transparent_55%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(100,130,255,0.06),transparent_60%)]" />
        </div>
        <Navbar user={user} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/story" element={<Story />} />
            <Route path="/leaderboard" element={<Leaderboard user={user} />} />
            <Route path="/download" element={<Download />} />
            <Route path="/topup" element={<Topup user={user} session={session} />} />
            <Route path="/profile" element={<Profile user={user} session={session} />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/forum" element={<Forum user={user} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
