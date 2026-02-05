import React, { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSynthesis from '../components/LoadingSynthesis';
import {
    Clock, Sparkles, Wand2, Image as ImageIcon,
    AlertCircle, Check, ArrowRight, Zap, Target,
    Maximize2, Command, Terminal, Activity, Eye, Brain, Focus,
    Share2, AlertTriangle, Layers, Disc
} from 'lucide-react';

const Arena = () => {
    const { currentView, setCurrentView, gameState, advanceLevel, gameConfig } = useGameStore();
    const [timer, setTimer] = useState(gameConfig?.timeLimit || 60);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [introState, setIntroState] = useState('loading'); // 'loading' | 'active'
    const [interactionStarted, setInteractionStarted] = useState(false);
    const inputRef = useRef(null);

    // Current Level Info
    const currentLevel = gameState.currentLevel;

    // Level Specific Configurations (The PUBG Logic)
    const getLevelConfig = (level) => {
        switch (level) {
            case 1: return {
                id: 1, title: "VISUAL LOGIC", subtitle: "ESTABLISH BASELINE",
                color: "#40f0ff", icon: <Target size={24} />,
                noiseOpacity: 0.03,
                uiStyle: "clean",
                animMode: "stable",
                description: "Analyze the target. Deconstruct visual elements."
            };
            case 2: return {
                id: 2, title: "NEURAL SYNC", subtitle: "ACCELERATE PROCESSING",
                color: "#bf5af2", icon: <Share2 size={24} />, // Violet
                noiseOpacity: 0.08,
                uiStyle: "dynamic",
                animMode: "pulse",
                description: "Synthesize patterns. Increase input velocity."
            };
            case 3: return {
                id: 3, title: "CRITICAL FLUX", subtitle: "MAINTAIN INTEGRITY",
                color: "#ff3b30", icon: <AlertTriangle size={24} />, // Red
                noiseOpacity: 0.15,
                uiStyle: "stress",
                animMode: "shake",
                description: "System unstable. Perform under cognitive load."
            };
            case 4: return {
                id: 4, title: "ASCENSION", subtitle: "ACHIEVE RESONANCE",
                color: "#ffd60a", icon: <Zap size={24} />, // Gold
                noiseOpacity: 0,
                uiStyle: "flow",
                animMode: "levitate",
                description: "Total mastery. Architect state achieved."
            };
            default: return { title: "UNKNOWN", color: "#fff" };
        }
    };

    const currentLevelData = getLevelConfig(currentLevel);

    // Reset per level
    useEffect(() => {
        setTimer(gameConfig?.timeLimit || 60);
        setPrompt('');
        setGeneratedResult(null);
        setIsGenerating(false);
        setIntroState('loading');
        setInteractionStarted(false);
    }, [currentLevel, gameConfig]);


    // Handle Loading Complete
    const handleLoadingComplete = () => {
        setIntroState('active');
        if (inputRef.current) setTimeout(() => inputRef.current.focus(), 500);
    };

    // Timer Logic - Starts only after intro
    useEffect(() => {
        if (introState === 'active' && !generatedResult && !isGenerating && timer > 0) {
            const t = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(t);
        }
    }, [introState, generatedResult, isGenerating, timer]);

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        // Simulation delay varies by level
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedResult({
                id: 1, // Using consistent ID for now, simulate same visual target
                src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop",
                score: 0.85 + (Math.random() * 0.14) // Mock score
            });
        }, 2200);
    };

    const handleConfirm = () => {
        if (!generatedResult) return;
        const score = Math.round(generatedResult.score * 100);

        // Use configured rounds
        if (currentLevel < (gameConfig?.rounds || 4)) {
            advanceLevel(score);
        } else {
            advanceLevel(score);
            setCurrentView('results');
        }
    };

    // Calculate intensity based on input length
    const inputIntensity = Math.min(prompt.length / 50, 1);

    // Dynamic UI Styles based on Round logic
    // Anim Variants
    const containerVariants = {
        stable: { opacity: 1 },
        pulse: { opacity: 1, scale: [1, 1.002, 1], transition: { duration: 4, repeat: Infinity } },
        shake: { opacity: 1, x: [0, -1, 1, 0], transition: { duration: 0.2, repeat: Infinity, repeatDelay: Math.random() } },
        levitate: { opacity: 1, y: [0, -5, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }
    };

    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#050505',
            color: '#e0e6ed', fontFamily: 'var(--font-sans)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* LOADING SCREEN INTERCEPT */}
            <AnimatePresence mode="wait">
                {introState === 'loading' && (
                    <LoadingSynthesis key="loader" levelData={currentLevelData} onComplete={handleLoadingComplete} />
                )}
            </AnimatePresence>

            {/* MAIN CONTENT (Fades in after loading) */}
            <motion.div
                animate={introState === 'active' ? currentLevelData.animMode : { opacity: 0 }}
                variants={containerVariants}
                transition={{ duration: 0.5 }}
                style={{ height: '100%', width: '100%', position: 'relative' }}
            >

                {/* REACTIVE AMBIENT LIGHTING via Volumetric Fog Sim */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: `radial-gradient(circle at 30% 50%, ${currentLevelData.color}15 0%, transparent 60%)`,
                        opacity: currentLevelData.uiStyle === 'stress' && timer < 15 ? [0.3, 0.5, 0.3] : 0.4 + (inputIntensity * 0.2)
                    }}
                    transition={{ duration: currentLevelData.uiStyle === 'stress' ? 0.5 : 4, repeat: Infinity, repeatType: 'reverse' }}
                />

                {/* Background Texture - Obsidian / Digital Noise */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        opacity: currentLevelData.noiseOpacity,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                    }}
                />

                {/* Round Indicator Watermark */}
                <div style={{ position: 'absolute', top: '10%', right: '10%', fontSize: '12rem', fontWeight: 900, color: 'white', opacity: 0.02, pointerEvents: 'none' }}>
                    0{currentLevel}
                </div>

                {/* MAIN GAMEPLAY INTERFACE */}
                <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex' }}>

                    {/* LEFT: SIGNAL CHAMBER (Thick Glass with Fluid Sim) */}
                    <div style={{
                        flex: '0 0 50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        background: 'radial-gradient(ellipse at left, rgba(20,20,30,0.4) 0%, transparent 70%)'
                    }}>
                        <motion.div
                            animate={{
                                boxShadow: `0 0 ${30 + (inputIntensity * 50)}px ${currentLevelData.color}15`,
                                scale: currentLevelData.uiStyle === 'stress' && timer < 15 ? [1, 1.01, 1] : 1
                            }}
                            transition={{
                                scale: { duration: 0.5, repeat: Infinity },
                            }}
                            style={{
                                width: '480px', height: '640px', borderRadius: '12px',
                                overflow: 'hidden', position: 'relative',
                                // Frosted Glass "Chamber" Effect
                                background: 'rgba(255,255,255,0.02)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderTop: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: `
                                0 20px 40px -10px rgba(0,0,0,0.5), 
                                inset 0 0 20px rgba(255,255,255,0.05),
                                0 0 0 1px rgba(0,0,0,0.2)
                            `
                            }}
                        >
                            {/* Bioluminescent Fluid Background Simulation */}
                            <motion.div
                                animate={{
                                    backgroundPosition: ['0% 0%', '100% 100%'],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear'
                                }}
                                style={{
                                    position: 'absolute', inset: '-50%',
                                    background: `
                                    radial-gradient(circle at 50% 50%, ${currentLevelData.color}40 0%, transparent 60%),
                                    radial-gradient(circle at 80% 20%, #7d2ae840 0%, transparent 50%)
                                `,
                                    filter: 'blur(60px)', opacity: 0.6
                                }}
                            />

                            {/* Valid Signal Image */}
                            <div style={{ position: 'relative', width: '100%', height: '100%', padding: '20px' }}>
                                <div style={{
                                    width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden',
                                    border: `1px solid ${currentLevelData.color}30`,
                                    position: 'relative'
                                }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
                                        style={{
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            filter: 'contrast(1.2) brightness(1.1) saturate(1.2)',
                                            opacity: 0.9 + (Math.random() * 0.1)
                                        }}
                                    />
                                    {/* Scanline Overlay for Round 2+ */}
                                    {currentLevel >= 2 && (
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                                            backgroundSize: '100% 2px, 3px 100%', pointerEvents: 'none'
                                        }} />
                                    )}
                                    {/* Glitch Overlay for Round 3 */}
                                    {currentLevel === 3 && (
                                        <motion.div
                                            animate={{ opacity: [0, 0.2, 0] }}
                                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 3 }}
                                            style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.2)', mixBlendMode: 'color-dodge' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Chamber UI Overlay */}
                            <div style={{ position: 'absolute', top: '30px', left: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="w-2 h-2 rounded-full" style={{ background: currentLevelData.color, boxShadow: `0 0 10px ${currentLevelData.color}` }} />
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px', color: 'rgba(255,255,255,0.9)' }}>
                                    LIVE SIGNAL FEED
                                </span>
                            </div>

                            <div style={{ position: 'absolute', bottom: '30px', right: '30px', textAlign: 'right' }}>
                                <Activity size={16} color={currentLevelData.color} style={{ marginLeft: 'auto', marginBottom: '4px' }} />
                                <div style={{ fontSize: '0.6rem', color: currentLevelData.color, letterSpacing: '1px' }}>FREQ: 82.44 HZ</div>
                            </div>

                        </motion.div>
                    </div>


                    {/* RIGHT: HOLOGRAPHIC INPUT TERMINAL */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 6rem' }}>

                        {/* FUI HUD HEADER */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {currentLevelData.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '2px', marginBottom: '2px' }}>MISSION OBJECTIVE</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', letterSpacing: '1px' }}>{currentLevelData.subtitle}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '3.5rem', fontWeight: 500, lineHeight: 1,
                                    color: currentLevel === 3 ? '#ff3b30' : timer < 10 ? '#ef4444' : 'white', // Intense red in round 3
                                    fontFamily: 'var(--font-mono)', letterSpacing: '-2px',
                                    textShadow: currentLevel === 3 ? '0 0 10px red' : 'none'
                                }}>
                                    {timer < 10 ? `0${timer}` : timer}<span style={{ fontSize: '1rem', opacity: 0.5, letterSpacing: '0' }}>s</span>
                                </div>
                            </div>
                        </div>


                        {/* FLOATING GLASS INPUT TERMINAL */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            style={{ position: 'relative', marginTop: '1rem' }}
                        >
                            {/* Placeholder Text Overlay */}
                            <AnimatePresence>
                                {!interactionStarted && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                                    >
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.1)', lineHeight: 1.1 }}>
                                            {currentLevelData.description.split('. ').map((s, i) => <div key={i}>{s}</div>)}
                                        </h2>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <textarea
                                ref={inputRef}
                                value={prompt}
                                onChange={(e) => {
                                    setPrompt(e.target.value);
                                    if (!interactionStarted && e.target.value.length > 0) setInteractionStarted(true);
                                }}
                                spellCheck="false"
                                style={{
                                    width: '100%', background: 'transparent',
                                    border: 'none', resize: 'none',
                                    height: '220px', fontSize: '2rem', lineHeight: '1.3', fontWeight: 500,
                                    color: interactionStarted ? 'white' : 'transparent',
                                    fontFamily: 'var(--font-sans)', outline: 'none',
                                    textShadow: `0 0 ${10 + (inputIntensity * 10)}px ${currentLevelData.color}80`,
                                    caretColor: currentLevelData.color,
                                }}
                            />

                            {/* Progressive Neural Feedback Bar */}
                            <div style={{
                                height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', marginTop: '1rem',
                                position: 'relative', overflow: 'hidden', borderRadius: '2px'
                            }}>
                                <motion.div
                                    style={{
                                        position: 'absolute', inset: 0, background: currentLevelData.color,
                                        width: `${Math.min((prompt.length / 100) * 100, 100)}%`,
                                        boxShadow: `0 0 20px ${currentLevelData.color}`
                                    }}
                                />
                            </div>
                        </motion.div>


                        {/* CONTEXTUAL ACTION DECK */}
                        <div style={{ height: '100px', marginTop: '3rem', display: 'flex', alignItems: 'center' }}>
                            <AnimatePresence mode="wait">
                                {/* STATE: READY TO GENERATE */}
                                {prompt.length > 5 && !isGenerating && !generatedResult && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        onClick={handleGenerate}
                                        whileTap={{ scale: 0.95, y: 2 }}
                                        style={{
                                            background: 'transparent',
                                            border: `1px solid ${currentLevelData.color}40`,
                                            borderBottom: `4px solid ${currentLevelData.color}`, // Physical depth
                                            color: currentLevelData.color, padding: '18px 40px',
                                            fontSize: '0.9rem', fontWeight: 800, letterSpacing: '2px',
                                            textTransform: 'uppercase', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '15px',
                                            boxShadow: `0 5px 20px -5px ${currentLevelData.color}20`,
                                            transition: 'all 0.2s',
                                            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
                                        }}
                                        whileHover={{
                                            background: `${currentLevelData.color}10`,
                                            boxShadow: `0 0 30px ${currentLevelData.color}40`
                                        }}
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
                                        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: currentLevelData.color, borderTopColor: 'transparent' }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: 700 }}>
                                            COMPILING NEURAL PATHWAYS <span className="animate-pulse">_</span>
                                        </span>
                                    </motion.div>
                                )}

                                {/* STATE: RESULT CONFIRMATION */}
                                {generatedResult && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px' }}
                                    >
                                        <div style={{
                                            flex: 1, background: 'rgba(255,255,255,0.03)', padding: '20px',
                                            borderLeft: `2px solid ${currentLevelData.color}`,
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>System Output</div>
                                            <div style={{ fontSize: '1.5rem', color: currentLevelData.color, fontWeight: 700, letterSpacing: '1px' }}>
                                                {Math.round(generatedResult.score * 100)}% CORRELATION
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={handleConfirm}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'white', color: 'black', border: 'none',
                                                padding: '24px 48px', fontSize: '1.2rem', fontWeight: 900,
                                                letterSpacing: '2px', textTransform: 'uppercase',
                                                cursor: 'pointer', boxShadow: '0 0 50px rgba(255,255,255,0.3)',
                                                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                                            }}
                                        >
                                            Confirm
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Arena;
