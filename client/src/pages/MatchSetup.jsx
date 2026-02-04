import React, { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Target, Users, Clock, Zap, Map,
    ChevronRight, Settings, BarChart, Hash, Layers
} from 'lucide-react';

const MatchSetup = () => {
    const { setCurrentView, setGameConfig, gameConfig } = useGameStore();
    const [selectedMode, setSelectedMode] = useState('solo');
    const [rounds, setRounds] = useState(4);
    const [time, setTime] = useState(60);
    const [difficulty, setDifficulty] = useState('normal');

    const MODES = [
        { id: 'solo', label: 'SOLO OPERATION', icon: Target, color: 'var(--tac-cyan)', desc: 'Single operative training.' },
        { id: 'squad', label: 'SQUAD SYNCH', icon: Users, color: '#bc13fe', desc: 'Cooperative neural link.' },
        { id: 'ranked', label: 'RANKED // LETHAL', icon: Shield, color: '#ff3864', desc: 'Competitive ladder match.' }
    ];

    const currentModeData = MODES.find(m => m.id === selectedMode);

    const handleDeploy = () => {
        setGameConfig({
            mode: selectedMode,
            rounds: rounds,
            timeLimit: time,
            difficulty: difficulty
        });
        setCurrentView('lobby'); // Proceed to waiting lobby
    };

    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#020202', color: '#eee',
            position: 'relative', overflow: 'hidden',
            display: 'flex', fontFamily: 'var(--font-mono)'
        }}>

            {/* Background Matrix */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
                <div style={{
                    width: '200%', height: '200%',
                    background: 'linear-gradient(transparent 1px, #020202 1px), linear-gradient(90deg, transparent 1px, #020202 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    border: '1px solid #333'
                }}>
                    <div style={{ width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
            </div>

            {/* Left Panel: Configuration */}
            <div style={{ flex: '0 0 500px', display: 'flex', flexDirection: 'column', padding: '3rem', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(2,2,2,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>

                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--tac-cyan)', letterSpacing: '2px', marginBottom: '0.5rem' }}>COMMAND CENTER</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9 }}>
                        Match<br /><span style={{ color: '#666' }}>Configuration</span>
                    </h1>
                </div>

                {/* Mode Selector */}
                <div style={{ marginBottom: '3rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={14} /> SELECT PROTOCOL
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {MODES.map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setSelectedMode(mode.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px',
                                    background: selectedMode === mode.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    border: `1px solid ${selectedMode === mode.id ? mode.color : 'rgba(255,255,255,0.1)'}`,
                                    color: selectedMode === mode.id ? 'white' : '#666',
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                                }}
                            >
                                <mode.icon size={20} color={selectedMode === mode.id ? mode.color : '#444'} />
                                <div>
                                    <div style={{ fontWeight: 700, letterSpacing: '1px' }}>{mode.label}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{mode.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sliders Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>

                    {/* Rounds */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#888' }}><Hash size={14} /> ROUNDS</span>
                            <span style={{ color: 'var(--tac-cyan)', fontWeight: 700 }}>{rounds}</span>
                        </div>
                        <input
                            type="range" min="1" max="4" value={rounds} onChange={(e) => setRounds(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--tac-cyan)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#444', marginTop: '4px' }}>
                            <span>INIT</span>
                            <span>FULL SEQ</span>
                        </div>
                    </div>

                    {/* Time Limit */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#888' }}><Clock size={14} /> TIME PRESSURE</span>
                            <span style={{ color: 'var(--tac-cyan)', fontWeight: 700 }}>{time}s</span>
                        </div>
                        <input
                            type="range" min="30" max="180" step="10" value={time} onChange={(e) => setTime(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--tac-cyan)' }}
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#888' }}><BarChart size={14} /> NEURAL COMPLEXITY</span>
                            <span style={{
                                color: difficulty === 'hard' ? '#ff3864' : difficulty === 'normal' ? 'var(--tac-cyan)' : '#4dffb5',
                                fontWeight: 700, textTransform: 'uppercase'
                            }}>
                                {difficulty}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['easy', 'normal', 'hard'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    style={{
                                        flex: 1, padding: '8px', border: `1px solid ${difficulty === d ? 'white' : 'rgba(255,255,255,0.1)'}`,
                                        background: difficulty === d ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: difficulty === d ? 'white' : '#666', fontSize: '0.7rem', fontWeight: 700,
                                        textTransform: 'uppercase', cursor: 'pointer'
                                    }}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <button
                    onClick={handleDeploy}
                    className="btn-primary"
                    style={{
                        marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                        background: currentModeData ? currentModeData.color : 'white', boxShadow: `0 0 30px ${currentModeData ? currentModeData.color : 'white'}40`
                    }}
                >
                    CONFIRM CONFIGURATION <ChevronRight size={18} />
                </button>

            </div>

            {/* Right Panel: Visual Preview */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {/* Map/Arena Preview */}
                <div style={{ width: '80%', height: '60%', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', top: '-2rem', left: 0,
                        fontSize: '0.8rem', color: currentModeData.color, letterSpacing: '4px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <Map size={14} /> ARENA PREVIEW: SECTOR 0{rounds}
                    </div>

                    <div className="glass-card" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', border: `1px solid ${currentModeData.color}40` }}>

                        {/* Placeholder Map Visualization */}
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

                        {/* Grid Lines */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `linear-gradient(${currentModeData.color}10 1px, transparent 1px), linear-gradient(90deg, ${currentModeData.color}10 1px, transparent 1px)`,
                            backgroundSize: '60px 60px', opacity: 0.5
                        }} />

                        {/* Animated Elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                            style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '300px', height: '300px', border: `1px dashed ${currentModeData.color}`, borderRadius: '50%', opacity: 0.3
                            }}
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                            style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                width: '200px', height: '200px', border: `2px solid ${currentModeData.color}20`, borderRadius: '50%'
                            }}
                        />

                        {/* Mode Info Overlay inside Preview */}
                        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: 'white' }}>{selectedMode.toUpperCase()}</div>
                                <div style={{ fontSize: '1rem', color: currentModeData.color, letterSpacing: '2px' }}>{currentModeData.desc}</div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#888' }}>
                                ESTIMATED QUEUE: <span style={{ color: 'white' }}>00:12</span><br />
                                ACTIVE OPERATIVES: <span style={{ color: 'white' }}>8,421</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default MatchSetup;
