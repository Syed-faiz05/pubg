import React, { useEffect, useState } from 'react';
import useGameStore from './store/useGameStore';
import { AnimatePresence, motion } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';

import Home from './pages/Home';
import MatchSetup from './pages/MatchSetup';
import Lobby from './pages/Lobby';
import Arena from './pages/Arena';
import Results from './pages/Results';
import Profile from './pages/Profile';

function App() {
  const currentView = useGameStore((state) => state.currentView);

  // Cinematic transitions
  const pageVariants = {
    initial: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.95, filter: 'blur(5px)' }
  };

  return (
    <>
      <div className="vignette" />
      <div className="scanlines" />
      <ParticleBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "circOut" }}
          className="page-wrapper"
          style={{ width: '100%', height: '100%' }}
        >
          {currentView === 'home' && <Home />}
          {currentView === 'match_setup' && <MatchSetup />}
          {currentView === 'lobby' && <Lobby />}
          {currentView === 'arena' && <Arena />}
          {currentView === 'results' && <Results />}
          {currentView === 'profile' && <Profile />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
