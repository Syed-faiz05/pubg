import React, { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSynthesis from '../components/LoadingSynthesis';
import {
    Activity, Layers, Target, Zap, AlertTriangle,
    Lock, Sparkles, Clock, AlertCircle, Terminal,
    Share2, Disc, Settings, Image as ImageIcon
} from 'lucide-react';

const Arena = () => {
    const { currentView, setCurrentView, gameState, advanceLevel, gameConfig } = useGameStore();
    const [timer, setTimer] = useState(gameConfig?.timeLimit || 60);
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [introState, setIntroState] = useState('loading');
    const [interactionStarted, setInteractionStarted] = useState(false);
    const inputRef = useRef(null);

    // Current Level Info
    const currentLevel = gameState.currentLevel;

    // Use specific Level Configs that match the user's "Game Logic" but with new Visual Style from Reference
    const getLevelConfig = (level) => {
        switch (level) {
            case 1: return {
                id: 1, title: "LEVEL 1 FOUNDATION", subtitle: "OPTICS",
                color: "#40f0ff", icon: <Target size={16} />,
                noiseOpacity: 0.03, uiStyle: "clean", animMode: "stable",
                tag: "REALISTIC", tagIcon: <ImageIcon size={14} />,
                description: "Describe subject, style, lighting..."
            };
            case 2: return {
                id: 2, title: "LEVEL 2 STRUCTURE", subtitle: "GRID",
                color: "#bf5af2", icon: <Layers size={16} />,
                noiseOpacity: 0.08, uiStyle: "dynamic", animMode: "pulse",
                tag: "ARCHITECTURAL", tagIcon: <Layers size={14} />,
                description: "Define geometry, structure, perspective..."
            };
            case 3: return {
                id: 3, title: "LEVEL 3 INTEGRITY", subtitle: "DECAY",
                color: "#ff3b30", icon: <AlertTriangle size={16} />,
                noiseOpacity: 0.15, uiStyle: "stress", animMode: "shake",
                tag: "SURREALISM", tagIcon: <AlertCircle size={14} />,
                description: "Reconstruct from memory. Signal decaying..."
            };
            case 4: return {
                id: 4, title: "LEVEL 4 ASCENSION", subtitle: "CORE",
                color: "#ffd60a", icon: <Zap size={16} />,
                noiseOpacity: 0, uiStyle: "flow", animMode: "levitate",
                tag: "ABSTRACT", tagIcon: <Sparkles size={14} />,
                description: "Achieve resonance. Master abstract form."
            };
            default: return { title: "UNKNOWN", color: "#fff" };
        }
    };

    const currentLevelData = getLevelConfig(currentLevel);

    // Initial Setup
    useEffect(() => {
        setTimer(gameConfig?.timeLimit || 60);
        setPrompt('');
        setNegativePrompt('');
        setGeneratedResult(null);
        setIsGenerating(false);
        setIntroState('loading');
        setInteractionStarted(false);
    }, [currentLevel, gameConfig]);

    const handleLoadingComplete = () => {
        setIntroState('active');
        if (inputRef.current) setTimeout(() => inputRef.current.focus(), 500);
    };

    useEffect(() => {
        if (introState === 'active' && !generatedResult && !isGenerating && timer > 0) {
            const t = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(t);
        }
    }, [introState, generatedResult, isGenerating, timer]);

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedResult({
                id: 1,
                src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600",
                score: 0.85 + (Math.random() * 0.14)
            });
        }, 2200);
    };

    const handleConfirm = () => {
        if (!generatedResult) return;
        const score = Math.round(generatedResult.score * 100);
        if (currentLevel < (gameConfig?.rounds || 4)) {
            advanceLevel(score);
        } else {
            advanceLevel(score);
            setCurrentView('results');
        }
    };

    const inputIntensity = Math.min(prompt.length / 50, 1);

    // Animation Variants
    const containerVariants = {
        stable: { opacity: 1 },
        pulse: { opacity: 1, scale: [1, 1.002, 1], transition: { duration: 4, repeat: Infinity } },
        shake: { opacity: 1, x: [0, -1, 1, 0], transition: { duration: 0.2, repeat: Infinity, repeatDelay: Math.random() } },
        levitate: { opacity: 1, y: [0, -5, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }
    };

    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#080808', color: '#e0e6ed',
            fontFamily: 'var(--font-mono)',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column'
        }}>
            {/* Loading Overlay */}
            <AnimatePresence mode="wait">
                {introState === 'loading' && (
                    <LoadingSynthesis key="loader" levelData={currentLevelData} onComplete={handleLoadingComplete} />
                )}
            </AnimatePresence>

            {/* MAIN INTERFACE */}
            <motion.div
                style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', opacity: introState === 'active' ? 1 : 0 }}
                variants={containerVariants}
                animate={currentLevelData.animMode}
            >
                {/* HEADER - Updated to Reference */}
                <header style={{
                    height: '60px', padding: '0 2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#0a0a0a'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '1px' }}>LEVEL {currentLevel}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>{currentLevelData.subtitle}</span>
                        </div>
                        {/* Round Indicators */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[1, 2, 3, 4].map(r => (
                                <div key={r} style={{
                                    width: '8px', height: '24px',
                                    background: r <= currentLevel ? 'white' : 'rgba(255,255,255,0.1)',
                                    transform: 'skewX(-20deg)'
                                }} />
                            ))}
                            <span style={{ fontSize: '0.7rem', color: '#666', marginLeft: '10px', alignSelf: 'center' }}>ROUND {currentLevel}/4</span>
                        </div>
                    </div>

                    <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        00:{timer < 10 ? `0${timer}` : timer}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '1px' }}>YOUR SCORE</div>
                            <div style={{ fontSize: '1rem', fontWeight: 900 }}>{(gameState.totalScore || 0) * (currentLevel - 1)} pts</div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', opacity: 0.3 }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>
                        </div>
                    </div>
                </header>

                {/* MAIN GRID */}
                <main style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(400px, 45%) 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)' }}>

                    {/* LEFT PANEL: TARGET REFERENCE */}
                    <div style={{ background: '#0a0a0a', padding: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>
                                <ImageIcon size={14} /> TARGET REFERENCE
                            </div>
                            <div style={{ fontSize: '0.7rem', padding: '2px 8px', border: '1px solid #333', borderRadius: '4px', color: '#666' }}>REALISTIC</div>
                        </div>

                        {/* Image Container with Visual Mechanics */}
                        <div style={{
                            flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                            background: '#000', position: 'relative', overflow: 'hidden'
                        }}>
                            <motion.img
                                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800"
                                animate={
                                    currentLevel === 3 ? { opacity: [1, 1, 0, 0, 1, 1, 0.5, 0], filter: ['blur(0px)', 'blur(0px)', 'blur(20px)', 'blur(10px)', 'blur(0px)'] } :
                                        currentLevel === 4 ? { y: [0, -10, 0], filter: 'brightness(1.2) contrast(1.1)' } :
                                            { opacity: 1, filter: 'blur(0px)' }
                                }
                                transition={
                                    currentLevel === 3 ? { duration: 3, repeat: Infinity, times: [0, 0.7, 0.75, 0.9, 0.95, 0.98, 0.99, 1] } :
                                        currentLevel === 4 ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : {}
                                }
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {/* Round 2 Grid Overlay */}
                            {currentLevel === 2 && (
                                <>
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${currentLevelData.color}40 1px, transparent 1px), linear-gradient(90deg, ${currentLevelData.color}40 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.4, pointerEvents: 'none' }} />
                                    <motion.div animate={{ top: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: currentLevelData.color, boxShadow: `0 0 10px ${currentLevelData.color}, 0 0 20px ${currentLevelData.color}`, zIndex: 10 }} />
                                </>
                            )}
                            {/* Round 3 Glitch */}
                            {currentLevel === 3 && (
                                <motion.div animate={{ opacity: [0, 0.5, 0], x: [-10, 10, -5, 0] }} transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.5 }} style={{ position: 'absolute', inset: 0, background: 'rgba(255,0,0,0.1)', mixBlendMode: 'color-dodge' }} />
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#666', padding: '6px 12px', border: '1px solid #222', borderRadius: '4px' }}>
                                <Share2 size={12} /> {currentLevelData.tag}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#666', padding: '6px 12px', border: '1px solid #222', borderRadius: '4px' }}>
                                <Zap size={12} /> {currentLevel === 3 ? 'UNSTABLE' : 'STABLE'}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: COMMAND LINE */}
                    <div style={{ background: '#0a0a0a', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#888' }}>
                                <Terminal size={14} /> COMMAND LINE
                            </div>
                            <div style={{ fontSize: '0.7rem', color: currentLevelData.color }}>
                                {prompt.length} / 75 TOKENS
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '0.7rem', color: '#444', marginBottom: '8px', fontWeight: 700 }}>POSITIVE PROMPT</label>
                                <textarea
                                    ref={inputRef}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={currentLevelData.description}
                                    style={{
                                        flex: 1, background: '#0e0e0e', border: '1px solid #222', borderRadius: '8px',
                                        padding: '20px', fontSize: '1.2rem', color: 'white', resize: 'none',
                                        fontFamily: 'var(--font-mono)', outline: 'none',
                                        boxShadow: inputRef.current === document.activeElement ? `0 0 0 1px ${currentLevelData.color}40` : 'none'
                                    }}
                                />
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '0.7rem', color: '#884444', marginBottom: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertTriangle size={10} /> NEGATIVE PROMPT
                                </label>
                                <textarea
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    placeholder="blur, distortion, bad anatomy, pixelated..."
                                    style={{
                                        flex: 1, background: '#0e0e0e', border: '1px solid #331111', borderRadius: '8px',
                                        padding: '15px', fontSize: '0.9rem', color: '#ccaaaa', resize: 'none',
                                        fontFamily: 'var(--font-mono)', outline: 'none',
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                </main>

                {/* FOOTER: LOADOUT & ACTIONS */}
                <footer style={{
                    height: '100px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#444', display: 'flex', gap: '6px' }}>
                            <Settings size={12} /> API LOADOUT
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['TITAN-XL', 'SWIFT-V2', 'ARTISAN', 'LOGIC-01'].map((api, i) => (
                                <div key={api} style={{
                                    padding: '8px 16px', background: i === 0 ? 'rgba(64, 240, 255, 0.1)' : '#111',
                                    border: i === 0 ? '1px solid #40f0ff' : '1px solid #222',
                                    borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '2px',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: i === 0 ? '#40f0ff' : '#888' }}>{api}</div>
                                    <div style={{ fontSize: '0.6rem', color: '#444' }}>x{i === 1 ? 4 : 2}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#4dffb5', fontWeight: 700 }}>
                            STATUS: {isGenerating ? 'COMPILING...' : 'DRAFTING'}
                        </div>
                        {isGenerating ? (
                            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: currentLevelData.color, borderTopColor: 'transparent' }} />
                        ) : generatedResult ? (
                            <button
                                onClick={handleConfirm}
                                style={{
                                    background: 'white', color: 'black', border: 'none',
                                    padding: '12px 30px', fontWeight: 900, borderRadius: '4px',
                                    fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                <Check size={16} /> CONFIRM
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                disabled={prompt.length === 0}
                                style={{
                                    background: prompt.length > 0 ? 'white' : '#333',
                                    color: prompt.length > 0 ? 'black' : '#666', border: 'none',
                                    padding: '12px 30px', fontWeight: 900, borderRadius: '4px',
                                    fontSize: '0.9rem', cursor: prompt.length > 0 ? 'pointer' : 'not-allowed',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                <Lock size={14} /> LOCK PROMPT
                            </button>
                        )}
                    </div>
                </footer>
            </motion.div>
        </div>
    );
};

export default Arena;
