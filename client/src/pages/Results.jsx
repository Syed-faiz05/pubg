import React, { useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { RotateCcw, Home as HomeIcon } from 'lucide-react';

const Results = () => {
    const { setCurrentView, gameState, resetGame } = useGameStore();
    const [displayedScore, setDisplayedScore] = useState(0);

    // Animated Score Counter
    useEffect(() => {
        const target = gameState.totalScore || 85;
        const interval = setInterval(() => {
            setDisplayedScore(prev => prev < target ? prev + 1 : target);
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

    const StatBar = ({ label, value, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            style={{ marginBottom: '1.5rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                <span>{label}</span>
                <span style={{ color }}>{value}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ delay: delay + 0.5, duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', background: color, borderRadius: '3px' }}
                />
            </div>
        </motion.div>
    );

    return (
        <div style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div style={{
                maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem',
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center'
            }}>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h1 style={{
                        fontSize: '5rem', fontWeight: 900, marginBottom: '0.5rem',
                        textShadow: '0 0 30px var(--neon-purple)',
                        WebkitTextStroke: '2px white',
                        color: 'transparent'
                    }}>
                        COMPLETE
                    </h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-gradient"
                        style={{ fontSize: '1.5rem' }}
                    >
                        XP EARNED: <span style={{ color: 'var(--neon-green)' }}>+{gameState.totalScore * 10} XP</span>
                    </motion.div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(500px, 1.5fr) 1fr', gap: '3rem', width: '100%' }}>

                    {/* Visual Comparison (Final Round Focus) */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card"
                        style={{ padding: '2rem', display: 'flex', gap: '1rem', height: '400px' }}
                    >
                        <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.2)' }}>TARGET</div>
                        </div>
                        <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--neon-green)', boxShadow: '0 0 30px rgba(0, 255, 157, 0.2)' }}>
                            <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.2)' }} />
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--neon-green)', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>FINAL OUT</div>
                        </div>
                    </motion.div>

                    {/* Stats Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '2rem', background: 'rgba(255,255,255,0.05)',
                                borderRadius: '20px', padding: '2rem',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, color: 'var(--neon-cyan)' }}>{displayedScore}%</div>
                                <div style={{ color: '#888', letterSpacing: '2px', fontSize: '0.9rem', marginTop: '0.5rem' }}>AVG ACCURACY</div>
                            </div>
                        </motion.div>

                        <div className="glass-card" style={{ padding: '2rem', flex: 1 }}>
                            {gameState.scores.map((score, i) => (
                                <StatBar
                                    key={i}
                                    label={`Level 0${i + 1} Score`}
                                    value={score}
                                    color={['var(--neon-cyan)', 'var(--neon-purple)', 'var(--neon-red)', 'var(--neon-green)'][i]}
                                    delay={0.8 + (i * 0.1)}
                                />
                            ))}

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <button className="btn-primary" style={{ flex: 1, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handlePlayAgain}>
                                    <RotateCcw size={18} /> AGAIN
                                </button>
                                <button className="glass-card" style={{ flex: 1, border: '1px solid #333', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleHome}>
                                    <HomeIcon size={18} /> EXIT
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Results;
