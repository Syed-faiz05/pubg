import React, { useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { RotateCcw, Home as HomeIcon, Share2, Award, TrendingUp, Cpu } from 'lucide-react';

const Results = () => {
    const { setCurrentView, gameState, resetGame, gameConfig } = useGameStore();
    const [displayedScore, setDisplayedScore] = useState(0);

    // Animated Score Counter
    useEffect(() => {
        const target = gameState.totalScore || 0;
        const interval = setInterval(() => {
            setDisplayedScore(prev => {
                if (prev < target) return prev + 1;
                clearInterval(interval);
                return target;
            });
        }, 20);
        return () => clearInterval(interval);
    }, [gameState.totalScore]);

    const handlePlayAgain = () => {
        resetGame();
        setCurrentView('lobby');
    };

    const handleHome = () => {
        resetGame();
        setCurrentView('home');
    };

    // Mock Breakdown Data (simulating AI analysis)
    const breakdown = [
        { label: 'SEMANTIC STRUCTURE', val: 92, color: 'var(--tac-cyan)' },
        { label: 'LIGHTING ACCURACY', val: 88, color: '#ff3864' },
        { label: 'COMPOSITION MATCH', val: 95, color: '#bc13fe' },
        { label: 'STYLISTIC INTEGRITY', val: 84, color: '#ffe600' },
    ];

    const getRank = (score) => {
        if (score >= 95) return { label: 'PROPHET', color: '#bc13fe' };
        if (score >= 90) return { label: 'ARCHITECT', color: 'var(--tac-cyan)' };
        if (score >= 80) return { label: 'OPERATOR', color: '#4dffb5' };
        if (score >= 60) return { label: 'INITIATE', color: '#ccc' };
        return { label: 'RECRUIT', color: '#666' };
    };

    const rank = getRank(gameState.totalScore || 0);

    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#020202', color: 'white',
            position: 'relative', overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            display: 'flex', flexDirection: 'column',
            paddingTop: '60px'
        }}>
            {/* Background Matrix */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
                <div style={{
                    width: '200%', height: '200%',
                    background: 'linear-gradient(transparent 1px, #1a1a1a 1px), linear-gradient(90deg, transparent 1px, #1a1a1a 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    border: '1px solid #333'
                }} />
            </div>

            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ width: '100%', maxWidth: '1400px', display: 'flex', gap: '4rem', padding: '2rem' }}>

                    {/* LEFT COL: Hero Score & Rank */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            style={{
                                padding: '3rem', border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(20,20,30,0.6)', backdropFilter: 'blur(20px)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, padding: '10px 20px', background: rank.color, color: 'black', fontWeight: 900, fontSize: '0.8rem' }}>
                                CLASSIFICATION ASSIGNED
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <div style={{ fontSize: '1rem', color: '#888', letterSpacing: '4px', marginBottom: '1rem' }}>AGGREGATE PERFORMANCE</div>
                                <div style={{
                                    fontSize: '8rem', fontWeight: 900, lineHeight: 0.9,
                                    textShadow: `0 0 50px ${rank.color}40`, color: 'white'
                                }}>
                                    {displayedScore}%
                                </div>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: rank.color, letterSpacing: '2px', marginTop: '-10px', textTransform: 'uppercase' }}>
                                    {rank.label}
                                </div>
                            </div>
                        </motion.div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <TrendingUp color="#4dffb5" />
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#888' }}>ELIMINATIONS</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>TOP 5%</div>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Cpu color="#ff3864" />
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#888' }}>LATENCY</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>42ms</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COL: Detailed Analysis */}
                    <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={18} color="var(--tac-cyan)" />
                            <span style={{ fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--tac-cyan)' }}>NEURAL ANALYSIS BREAKDOWN</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {breakdown.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 * i }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#ccc' }}>
                                        <span>{item.label}</span>
                                        <span style={{ color: item.color }}>{item.val}%</span>
                                    </div>
                                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                                        <motion.div
                                            initial={{ width: 0 }} animate={{ width: `${item.val}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            style={{ height: '100%', background: item.color, boxShadow: `0 0 10px ${item.color}` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handlePlayAgain}
                                className="btn-primary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                <RotateCcw size={18} /> INITIATE REMATCH
                            </button>
                            <button
                                onClick={handleHome}
                                style={{
                                    flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 700
                                }}
                            >
                                <HomeIcon size={18} /> BASE
                            </button>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default Results;
