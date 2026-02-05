import React, { useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import { motion } from 'framer-motion';
import { RotateCcw, Home as HomeIcon, CheckCircle2, Trophy, Crosshair, Zap, Brain, Layers } from 'lucide-react';

const Results = () => {
    const { setCurrentView, gameState, resetGame } = useGameStore();
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
        }, 15);
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

    // Calculate Rank based on score
    const getRank = (score) => {
        if (score >= 95) return { label: 'PROPHET', color: '#bc13fe', sub: 'LEGENDARY TIER' };
        if (score >= 90) return { label: 'ARCHITECT', color: '#40f0ff', sub: 'MASTER TIER' };
        if (score >= 80) return { label: 'OPERATOR', color: '#4dffb5', sub: 'ELITE TIER' };
        if (score >= 60) return { label: 'INITIATE', color: '#ffd60a', sub: 'STANDARD TIER' };
        return { label: 'RECRUIT', color: '#666', sub: 'BASIC TIER' };
    };

    const rank = getRank(gameState.totalScore || 0);
    const scoreVal = gameState.totalScore || 0;

    // Use actual scores from game state if available, or fallback to mock data structure
    const levelScores = gameState.scores && gameState.scores.length > 0
        ? gameState.scores.map((score, i) => ({ id: i + 1, score: Math.round(score), label: ['OPTICS', 'STRUCTURE', 'INTEGRITY', 'CORE'][i] || `SECTOR 0${i + 1}` }))
        : [
            { id: 1, label: 'OPTICS', score: 85 },
            { id: 2, label: 'STRUCTURE', score: 92 },
            { id: 3, label: 'INTEGRITY', score: 78 },
            { id: 4, label: 'CORE', score: 95 }
        ];

    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#050505', color: 'white',
            position: 'relative', overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>

            {/* 1. Background Environment */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {/* Grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '50px 50px', opacity: 0.5
                }} />
                {/* Glow Spot */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '80vw', height: '80vh',
                    background: `radial-gradient(circle, ${rank.color}10 0%, transparent 60%)`,
                    filter: 'blur(80px)'
                }} />
            </div>

            {/* 2. Main Content Container */}
            <div style={{
                width: '90%', maxWidth: '1200px',
                display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem',
                zIndex: 10
            }}>

                {/* LEFT COL: Rank Identity */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                    <div style={{
                        fontSize: '4rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px',
                        marginBottom: '10px', textShadow: `0 0 40px ${rank.color}60`
                    }}>
                        {rank.label}
                    </div>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px', background: rank.color, color: '#000',
                        fontWeight: 800, fontSize: '0.9rem', letterSpacing: '2px', alignSelf: 'flex-start',
                        borderRadius: '2px', marginBottom: '3rem'
                    }}>
                        {rank.sub}
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '5px'
                        }}>
                            <div style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '1px' }}>ACCURACY</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>94%</div>
                            <div style={{ height: '2px', width: '100%', background: '#333', marginTop: '5px' }}>
                                <div style={{ height: '100%', width: '94%', background: '#fff' }} />
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '5px'
                        }}>
                            <div style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '1px' }}>SPEED</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>1.2s</div>
                            <div style={{ height: '2px', width: '100%', background: '#333', marginTop: '5px' }}>
                                <div style={{ height: '100%', width: '85%', background: rank.color }} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT COL: Mission Report */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <div style={{
                        border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,10,10,0.8)',
                        backdropFilter: 'blur(20px)', padding: '3rem', position: 'relative'
                    }}>
                        {/* Header Decoration */}
                        <div style={{
                            position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                            width: '200px', height: '2px', background: rank.color,
                            boxShadow: `0 0 20px ${rank.color}`
                        }} />
                        <div style={{
                            position: 'absolute', top: 0, right: 0, width: '20px', height: '20px',
                            borderTop: '2px solid rgba(255,255,255,0.2)', borderRight: '2px solid rgba(255,255,255,0.2)'
                        }} />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px',
                            borderBottom: '2px solid rgba(255,255,255,0.2)', borderLeft: '2px solid rgba(255,255,255,0.2)'
                        }} />

                        {/* Title */}
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '4px', marginBottom: '0.5rem' }}>MISSION COMPLETE</h2>
                            <div style={{ color: '#666', fontSize: '0.8rem', letterSpacing: '2px' }}>NEURAL SYNC ESTABLISHED SUCCESSFULLY</div>
                        </div>

                        {/* Round Breakdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                            {levelScores.map((lvl, i) => (
                                <div key={lvl.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #222' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%', background: '#1a1a1a',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                                            border: '1px solid #333'
                                        }}>{lvl.id}</div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px' }}>{lvl.label}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            height: '4px', width: '100px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden'
                                        }}>
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${lvl.score}%` }} transition={{ delay: 0.8 + (i * 0.1), duration: 1 }}
                                                style={{ height: '100%', background: rank.color }}
                                            />
                                        </div>
                                        <div style={{ width: '40px', textAlign: 'right', fontWeight: 700 }}>{lvl.score}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Score */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '2px' }}>TOTAL SCORE</div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: rank.color, lineHeight: 1 }}>{displayedScore}</div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handlePlayAgain}
                                className="hover-brightness"
                                style={{
                                    flex: 1, padding: '16px', background: 'white', color: 'black',
                                    border: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }}
                            >
                                <RotateCcw size={18} /> DEPLOY AGAIN
                            </button>
                            <button
                                onClick={handleHome}
                                className="hover-brightness"
                                style={{
                                    flex: 1, padding: '16px', background: 'transparent', color: 'white',
                                    border: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }}
                            >
                                <HomeIcon size={18} /> RETURN TO BASE
                            </button>
                        </div>

                    </div>
                </motion.div>

            </div>

        </div>
    );
};

export default Results;
