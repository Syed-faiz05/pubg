import React, { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Sparkles, Wand2, Image as ImageIcon,
    AlertCircle, Check, ArrowRight, Zap, Target,
    Maximize2, Command, Terminal, Activity
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
            title: "VISUAL LOGIC",
            subtitle: "DECODE THE SIGNAL",
            color: "#40f0ff", // Neon Cyan
            accent: "cyan",
            icon: <Target size={24} />
        },
        2: { title: "STYLE FUSION", subtitle: "SYNTHESIZE AESTHETICS", color: "#d56aff", accent: "purple", icon: <Wand2 size={24} /> },
        3: { title: "PRECISION", subtitle: "EXACT MATCH REQUIRED", color: "#ff5c7f", accent: "red", icon: <Maximize2 size={24} /> },
        4: { title: "MASTERY", subtitle: "BLIND EXECUTION", color: "#4dffb5", accent: "green", icon: <Zap size={24} /> },
    };
    const currentLevelData = LEVEL_DATA[gameState.currentLevel] || LEVEL_DATA[1];

    // Cinematic Intro Sequence
    useEffect(() => {
        const transitionTimer = setTimeout(() => setIntroState('transition'), 2000);
        const activeTimer = setTimeout(() => {
            setIntroState('active');
            if (inputRef.current) inputRef.current.focus();
        }, 2800);

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
        } else {
            advanceLevel(score);
            setCurrentView('results');
        }
    };

    // Calculate intensity based on input length
    const inputIntensity = Math.min(prompt.length / 50, 1);

    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#050505',
            color: '#e0e6ed', fontFamily: 'var(--font-sans)',
            position: 'relative', overflow: 'hidden'
        }}>

            {/* REACTIVE AMBIENT LIGHTING */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    background: `radial-gradient(circle at 60% 50%, ${currentLevelData.color}20 0%, transparent 60%)`
                }}
                style={{ opacity: 0.4 + (inputIntensity * 0.3), transition: 'opacity 0.5s ease' }}
            />

            {/* Background Texture - Digital Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* INTRO TITLE SEQUENCE */}
            <AnimatePresence>
                {introState === 'reveal' && (
                    <motion.div
                        className="flex flex-col items-center justify-center absolute inset-0 z-50 text-center"
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 style={{
                            fontSize: '6rem', fontWeight: 900, color: 'white',
                            letterSpacing: '-0.05em', lineHeight: 0.9,
                            textShadow: `0 0 80px ${currentLevelData.color}`
                        }}>
                            {currentLevelData.title}
                        </h1>
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: '200px' }}
                            style={{ height: '4px', background: 'white', margin: '2rem auto' }}
                        />
                        <p style={{ fontSize: '1.5rem', color: currentLevelData.color, letterSpacing: '0.2em', fontWeight: 600 }}>
                            {currentLevelData.subtitle}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN GAMEPLAY INTERFACE */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: introState !== 'reveal' ? 1 : 0 }}
                transition={{ duration: 1 }}
                style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex' }}
            >

                {/* LEFT: TARGET SIGNAL (Active Visual Anchor) */}
                <div style={{ flex: '0 0 45%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div
                        animate={{
                            boxShadow: `0 0 ${20 + (inputIntensity * 40)}px ${currentLevelData.color}20`,
                            scale: [1, 1.01, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            width: '400px', height: '600px', borderRadius: '4px',
                            overflow: 'hidden', position: 'relative',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) brightness(1.1)' }}
                        />
                        {/* Status Overlay */}
                        <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.8)' }}>LIVE FEED</span>
                        </div>
                    </motion.div>
                </div>


                {/* RIGHT: COMMAND CENTER */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 6rem' }}>

                    {/* HUD HEADER */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#666', letterSpacing: '2px', marginBottom: '4px' }}>MISSION OBJECTIVE</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>RECONSTRUCT VISUAL DATA</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1, color: timer < 10 ? '#ef4444' : 'white', fontFamily: 'var(--font-mono)' }}>
                                {timer < 10 ? `0${timer}` : timer}<span style={{ fontSize: '1rem', opacity: 0.5 }}>s</span>
                            </div>
                        </div>
                    </div>


                    {/* THOUGHT-COMMIT ZONE */}
                    <div style={{ position: 'relative' }}>
                        <AnimatePresence>
                            {!interactionStarted && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                                >
                                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.2)', lineHeight: 1.2 }}>
                                        DESCRIBE<br />THE SIGNAL<br />TO ENGAGE
                                    </h2>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <textarea
                            ref={inputRef}
                            value={prompt}
                            onChange={handlePromptChange}
                            spellCheck="false"
                            style={{
                                width: '100%', background: 'transparent', border: 'none', resize: 'none',
                                height: '200px', fontSize: '2rem', lineHeight: '1.4', fontWeight: 600,
                                color: interactionStarted ? 'white' : 'transparent',
                                fontFamily: 'var(--font-sans)', outline: 'none',
                                textShadow: `0 0 ${inputIntensity * 20}px ${currentLevelData.color}60`,
                                caretColor: currentLevelData.color
                            }}
                        />

                        {/* Input Feedback Line */}
                        <motion.div
                            style={{
                                height: '2px', width: '100%', background: '#333', marginTop: '1rem',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <motion.div
                                style={{
                                    position: 'absolute', inset: 0, background: currentLevelData.color,
                                    width: `${Math.min((prompt.length / 100) * 100, 100)}%`
                                }}
                            />
                        </motion.div>
                    </div>


                    {/* CONTEXTUAL COMMIT ACTIONS */}
                    <div style={{ height: '80px', marginTop: '3rem', display: 'flex', alignItems: 'center' }}>
                        <AnimatePresence mode="wait">
                            {/* STATE: READY TO GENERATE */}
                            {prompt.length > 5 && !isGenerating && !generatedResult && (
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                    onClick={handleGenerate}
                                    style={{
                                        background: 'transparent', border: `1px solid ${currentLevelData.color}`,
                                        color: currentLevelData.color, padding: '16px 32px',
                                        fontSize: '1rem', fontWeight: 700, letterSpacing: '2px',
                                        textTransform: 'uppercase', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '12px'
                                    }}
                                    whileHover={{ background: currentLevelData.color, color: 'black', boxShadow: `0 0 30px ${currentLevelData.color}60` }}
                                >
                                    Initiate Sequence <Target size={18} />
                                </motion.button>
                            )}

                            {/* STATE: PROCESSING */}
                            {isGenerating && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '16px', color: currentLevelData.color }}
                                >
                                    <Activity className="animate-pulse" size={24} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '2px' }}>
                                        COMPILING NEURAL PATHWAYS...
                                    </span>
                                </motion.div>
                            )}

                            {/* STATE: RESULT CONFIRMATION */}
                            {generatedResult && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px' }}
                                >
                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '16px', borderLeft: '2px solid #4dffb5' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>System Output</div>
                                        <div style={{ fontSize: '1.2rem', color: '#4dffb5', fontWeight: 700 }}>92% CORRELATION</div>
                                    </div>
                                    <button
                                        onClick={handleConfirm}
                                        style={{
                                            background: 'white', color: 'black', border: 'none',
                                            padding: '20px 40px', fontSize: '1.1rem', fontWeight: 800,
                                            letterSpacing: '1px', textTransform: 'uppercase',
                                            cursor: 'pointer', boxShadow: '0 0 40px rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default Arena;
