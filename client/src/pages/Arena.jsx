import React, { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Sparkles, Wand2, Image as ImageIcon,
    AlertCircle, Check, ArrowRight, Zap, Target,
    Maximize2, Command, Terminal
} from 'lucide-react';

const Arena = () => {
    const { currentView, setCurrentView, gameState, advanceLevel } = useGameStore();
    const [timer, setTimer] = useState(60);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [introState, setIntroState] = useState('reveal'); // 'reveal' | 'transition' | 'active'
    const [interactionStarted, setInteractionStarted] = useState(false);
    const inputRef = useRef(null);

    // Level Configs
    const LEVEL_DATA = {
        1: {
            title: "Visual Logic",
            subtitle: "Analyze and Recreate",
            color: "var(--neon-cyan)",
            accent: "cyan",
            icon: <Target size={24} />
        },
        2: { title: "Style Fusion", subtitle: "Capture the Aesthetic", color: "var(--neon-purple)", accent: "purple", icon: <Wand2 size={24} /> },
        3: { title: "Precision", subtitle: "Exact Detail Match", color: "var(--neon-red)", accent: "red", icon: <Maximize2 size={24} /> },
        4: { title: "Mastery", subtitle: "Blind Creation", color: "var(--neon-green)", accent: "green", icon: <Zap size={24} /> },
    };
    const currentLevelData = LEVEL_DATA[gameState.currentLevel] || LEVEL_DATA[1];

    // Cinematic Intro Sequence
    useEffect(() => {
        // Step 1: Reveal Title (0s - 2s) -> controlled by initial render

        // Step 2: Transition to Workspace (2s)
        const transitionTimer = setTimeout(() => {
            setIntroState('transition');
        }, 2500);

        // Step 3: Fully Active (3s)
        const activeTimer = setTimeout(() => {
            setIntroState('active');
            if (inputRef.current) inputRef.current.focus();
        }, 3200);

        return () => {
            clearTimeout(transitionTimer);
            clearTimeout(activeTimer);
        };
    }, []);

    // Timer Logic - Starts only after intro
    useEffect(() => {
        if (introState === 'active' && !generatedResult && !isGenerating && timer > 0) {
            const t = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(t);
        }
    }, [introState, generatedResult, isGenerating, timer]);

    const handlePromptChange = (e) => {
        const val = e.target.value;
        setPrompt(val);
        if (!interactionStarted && val.length > 0) {
            setInteractionStarted(true);
        }
    };

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedResult({
                id: 1,
                src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop",
                score: 0.92
            });
        }, 2200);
    };

    const handleConfirm = () => {
        if (!generatedResult) return;
        const score = Math.round(generatedResult.score * 100);
        if (gameState.currentLevel < 4) {
            advanceLevel(score);
            // Reset for next level would go here, or handled by store/effect
        } else {
            advanceLevel(score);
            setCurrentView('results');
        }
    };

    // Render Logic
    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#0a0b0f', // Deepest dark
            color: '#e0e6ed', fontFamily: 'var(--font-sans)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* DYNAMIC LIVING BACKGROUND */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        background: [`radial-gradient(circle at 30% 30%, ${currentLevelData.color} 0%, transparent 40%)`, `radial-gradient(circle at 70% 70%, ${currentLevelData.color} 0%, transparent 40%)`]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', inset: '-50%', filter: 'blur(80px)' }}
                />
            </div>
            {/* Subtle Grid */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0, opacity: 0.05,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />


            {/* INTRO TITLE SEQUENCE */}
            <AnimatePresence>
                {introState === 'reveal' && (
                    <motion.div
                        className="flex flex-col items-center justify-center absolute inset-0 z-50 text-center"
                        exit={{ opacity: 0, y: -50, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h2 style={{ color: currentLevelData.color, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>
                                Round 0{gameState.currentLevel}
                            </h2>
                            <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.02em', textShadow: `0 0 40px ${currentLevelData.color}40` }}>
                                {currentLevelData.title}
                            </h1>
                            <motion.div
                                initial={{ width: 0 }} animate={{ width: '100px' }}
                                style={{ height: '4px', background: currentLevelData.color, margin: '2rem auto', borderRadius: '2px' }}
                            />
                            <p style={{ fontSize: '1.2rem', color: '#9ca3af', maxWidth: '400px', margin: '0 auto' }}>
                                {currentLevelData.subtitle}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* MAIN INTERFACE - ENTERS AFTER REVEAL */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: introState !== 'reveal' ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                {/* HEADER (Minimal) */}
                <header style={{
                    padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div className="flex items-center gap-4">
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: `linear-gradient(135deg, ${currentLevelData.color}20, transparent)`,
                            border: `1px solid ${currentLevelData.color}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: currentLevelData.color
                        }}>
                            {currentLevelData.icon}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>{currentLevelData.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6e7685', letterSpacing: '1px', textTransform: 'uppercase' }}>Round 0{gameState.currentLevel}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: interactionStarted ? '#4dffb5' : '#ff9f00', boxShadow: interactionStarted ? '0 0 10px #4dffb5' : 'none' }}></span>
                            {interactionStarted ? 'System Active' : 'Waiting for Input...'}
                        </div>
                        <div style={{
                            background: 'rgba(0,0,0,0.3)', padding: '8px 16px', borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', alignItems: 'center'
                        }}>
                            <Clock size={16} color={timer < 10 ? '#ff5c7f' : '#b0b5c0'} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'white' }}>
                                00:{timer < 10 ? `0${timer}` : timer}
                            </span>
                        </div>
                    </div>
                </header>

                {/* WORKSPACE CONTENT */}
                <main style={{ flex: 1, display: 'flex', padding: '0', overflow: 'hidden' }}>

                    {/* LEFT PANEL: TARGET (Anchored, Softly Illuminated) */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.1 }}
                        style={{
                            flex: '0 0 40%', maxWidth: '600px',
                            background: 'rgba(14, 16, 20, 0.5)', borderRight: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', flexDirection: 'column', padding: '3rem', justifyContent: 'center', alignItems: 'center',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: '2rem', left: '2rem',
                            fontSize: '0.8rem', color: '#40f0ff', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600
                        }}>
                            Target Reference
                        </div>

                        <div style={{
                            position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '16px',
                            overflow: 'hidden', boxShadow: '0 20px 80px -20px rgba(0,0,0,0.7)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                            />
                            {/* Cinematic lighting overlay */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), transparent 60%)' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                        </div>
                    </motion.div>


                    {/* RIGHT PANEL: ACTIVE WORKSPACE */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
                        style={{
                            flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', padding: '4rem 6rem'
                        }}
                    >
                        {/* INSTRUCTIONS (Fades on interaction) */}
                        <AnimatePresence>
                            {!interactionStarted && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                                    style={{ marginBottom: '2rem' }}
                                >
                                    <h3 style={{ fontSize: '2rem', fontWeight: 300, color: 'white', marginBottom: '0.5rem' }}>
                                        What defines this structure?
                                    </h3>
                                    <p style={{ color: '#9ca3af', fontSize: '1.1rem', maxWidth: '500px' }}>
                                        Analyze the geometry, lighting, and mood. Describe the visual logic to reconstruct the target.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* INPUT AREA */}
                        <div style={{ position: 'relative', width: '100%' }}>
                            <textarea
                                ref={inputRef}
                                value={prompt}
                                onChange={handlePromptChange}
                                placeholder={interactionStarted ? "Continue describing..." : "Type here to begin..."}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none', resize: 'none',
                                    height: interactionStarted ? '200px' : '60px', /* Expands naturally */
                                    fontSize: '1.8rem', lineHeight: '1.5', fontWeight: 500, color: 'white',
                                    fontFamily: 'var(--font-sans)', outline: 'none',
                                    transition: 'all 0.5s ease'
                                }}
                            />
                            {/* Cursor/Input Line indicator */}
                            <div style={{
                                height: '2px', width: '100%', background: 'rgba(255,255,255,0.1)', marginTop: '1rem',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <motion.div
                                    animate={{
                                        x: ['-100%', '100%'],
                                        opacity: interactionStarted ? 1 : 0
                                    }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    style={{
                                        position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
                                        background: `linear-gradient(90deg, transparent, ${currentLevelData.color}, transparent)`
                                    }}
                                />
                            </div>
                        </div>

                        {/* CONTEXTUAL ACTIONS */}
                        <div style={{ marginTop: '3rem', height: '60px', display: 'flex', alignItems: 'center' }}>
                            <AnimatePresence>
                                {(prompt.trim().length > 0 && !isGenerating && !generatedResult) && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        onClick={handleGenerate}
                                        className="group"
                                        style={{
                                            background: 'white', color: 'black', border: 'none',
                                            padding: '16px 32px', borderRadius: '40px',
                                            fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            boxShadow: `0 0 20px ${currentLevelData.color}40`,
                                            transition: 'all 0.3s'
                                        }}
                                        whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${currentLevelData.color}60` }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Execute Generation
                                        <div style={{ background: 'black', borderRadius: '50%', padding: '4px' }}>
                                            <ArrowRight size={16} color="white" />
                                        </div>
                                    </motion.button>
                                )}

                                {isGenerating && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: currentLevelData.color }}
                                    >
                                        <Sparkles className="animate-spin" />
                                        <span style={{ letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>Synthesizing...</span>
                                    </motion.div>
                                )}

                                {generatedResult && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                                        style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}
                                    >
                                        <div className="flex flex-col">
                                            <span style={{ color: '#4dffb5', fontWeight: 600, fontSize: '1.2rem' }}>Match Confirm: 92%</span>
                                            <span style={{ color: '#6e7685', fontSize: '0.9rem' }}>Ready for validation</span>
                                        </div>
                                        <button
                                            onClick={handleConfirm}
                                            style={{
                                                background: '#4dffb5', color: '#001a10', border: 'none',
                                                padding: '14px 28px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '10px'
                                            }}
                                        >
                                            Complete <Check size={20} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                </main>
            </motion.div>
        </div>
    );
};

export default Arena;
