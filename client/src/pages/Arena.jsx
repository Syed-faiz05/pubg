import React, { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Sparkles, Wand2, Image as ImageIcon,
    AlertCircle, Check, ArrowRight
} from 'lucide-react';

const Arena = () => {
    const { currentView, setCurrentView, gameState, advanceLevel } = useGameStore();
    const [timer, setTimer] = useState(60);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [showLevelIntro, setShowLevelIntro] = useState(true);

    // Level Configs
    const LEVEL_DATA = {
        1: { title: "Visual Logic", subtitle: "Analyze and Recreate", color: "var(--neon-cyan)" },
        2: { title: "Style Fusion", subtitle: "Capture the Aesthetic", color: "var(--neon-purple)" },
        3: { title: "Precision", subtitle: "Exact Detail Match", color: "var(--neon-red)" },
        4: { title: "Mastery", subtitle: "Blind Creation", color: "var(--neon-green)" },
    };
    const currentLevelData = LEVEL_DATA[gameState.currentLevel] || LEVEL_DATA[1];

    // Reset per level
    useEffect(() => {
        setShowLevelIntro(true);
        setTimer(60);
        setPrompt('');
        setIsGenerating(false);
        setGeneratedResult(null);
    }, [gameState.currentLevel]);

    // Timer Logic
    useEffect(() => {
        if (!showLevelIntro && !generatedResult && !isGenerating && timer > 0) {
            const t = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(t);
        }
    }, [showLevelIntro, generatedResult, isGenerating, timer]);

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        setTimeout(() => {
            setIsGenerating(false);
            // Simulate single best result for this "Creative" mode
            setGeneratedResult({
                id: 1,
                src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop",
                score: 0.92
            });
        }, 2500);
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

    return (
        <div style={{
            height: '100vh', display: 'flex', flexDirection: 'column',
            background: 'radial-gradient(circle at 50% 10%, #1a1d24 0%, #0e1014 100%)', // Brighter, premium background
            color: '#e0e6ed', fontFamily: 'var(--font-sans)',
            position: 'relative', overflow: 'hidden'
        }}>

            {/* LEVEL INTRO OVERLAY */}
            <AnimatePresence>
                {showLevelIntro && (
                    <motion.div
                        initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute', inset: 0, zIndex: 100,
                            background: 'rgba(14, 16, 20, 0.95)', backdropFilter: 'blur(20px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ color: currentLevelData.color, fontSize: '1rem', letterSpacing: '4px', marginBottom: '1rem', fontWeight: 600 }}
                        >
                            ROUND 0{gameState.currentLevel}
                        </motion.div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                            {currentLevelData.title}
                        </h1>
                        <p style={{ color: '#9ca3af', fontSize: '1.2rem' }}>{currentLevelData.subtitle}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <header style={{
                height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 3rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>
                        Prompt<span style={{ color: currentLevelData.color }}>Arena</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                        padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <Clock size={16} color={timer < 10 ? '#ff5c7f' : '#fff'} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>00:{timer < 10 ? `0${timer}` : timer}</span>
                    </div>
                </div>
            </header>

            {/* MAIN CREATIVE SPACE */}
            <main style={{ flex: 1, display: 'flex', padding: '3rem', gap: '4rem', justifyContent: 'center', alignItems: 'center' }}>

                {/* LEFT: TARGET VISUAL (Vertically Oriented) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    style={{ width: '380px', height: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Reference Vision</span>
                        <ImageIcon size={18} color="#9ca3af" />
                    </div>

                    <div className="glass-card" style={{
                        flex: 1, padding: '10px', borderRadius: '24px', position: 'relative', overflow: 'hidden',
                        backgroundColor: 'rgba(30,35,45,0.4)', border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', position: 'relative', background: '#000' }}>
                            <img
                                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {/* Clear Overlay Gradient for Depth */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 80%, rgba(0,0,0,0.4) 100%)' }} />
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT: CONVERSATIONAL INPUT */}
                <div style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Prompt Bubble */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '32px',
                            padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                        }}>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your vision here..."
                                disabled={isGenerating || generatedResult}
                                style={{
                                    width: '100%', height: '180px', background: 'transparent', border: 'none',
                                    color: 'white', fontSize: '1.4rem', lineHeight: '1.6', fontWeight: 500,
                                    resize: 'none', outline: 'none', padding: '0', fontFamily: 'var(--font-sans)'
                                }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', color: prompt.length > 50 ? currentLevelData.color : '#666', transition: 'color 0.3s' }}>
                                    {prompt.length} chars
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isGenerating || generatedResult}
                                    style={{
                                        background: !prompt.trim() || isGenerating ? 'rgba(255,255,255,0.1)' : 'white',
                                        color: !prompt.trim() || isGenerating ? 'rgba(255,255,255,0.4)' : '#000',
                                        border: 'none', padding: '14px 28px', borderRadius: '50px',
                                        fontSize: '1rem', fontWeight: 600, cursor: (!prompt.trim() || isGenerating) ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s',
                                        boxShadow: (!prompt.trim() || isGenerating) ? 'none' : '0 0 20px rgba(255,255,255,0.3)'
                                    }}
                                >
                                    {isGenerating ? (
                                        <><Sparkles className="animate-spin" size={18} /> Dreaming...</>
                                    ) : (
                                        <>Generate Vision <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Glow effect behind prompt box */}
                        <div style={{
                            position: 'absolute', inset: '10px', zIndex: -1,
                            background: currentLevelData.color, filter: 'blur(60px)', opacity: 0.15
                        }} />
                    </motion.div>

                    {/* Result Area (Appears below) */}
                    <AnimatePresence>
                        {generatedResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{
                                    background: 'rgba(30,35,45,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem'
                                }}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={generatedResult.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>Vision Realized</div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>High fidelity match detected.</div>
                                    </div>
                                    <button
                                        onClick={handleConfirm}
                                        style={{
                                            background: currentLevelData.color, color: '#000', border: 'none',
                                            padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        Complete Round <Check size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

            </main>
        </div>
    );
};

export default Arena;
