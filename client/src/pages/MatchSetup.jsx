import React, { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Target, Users, Clock, Zap, Map,
    ChevronRight, Settings, BarChart, Hash, Layers,
    Hexagon
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
        setCurrentView('lobby');
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
                    background: 'linear-gradient(transparent 1px, #1a1a1a 1px), linear-gradient(90deg, transparent 1px, #1a1a1a 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    border: '1px solid #333'
                }} />
            </div>

            {/* LEFT PANEL: CONFIGURATION */}
            <div style={{
                flex: '0 0 600px', // Increased width for better breathing room
                display: 'flex', flexDirection: 'column',
                padding: '4rem',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(5, 5, 8, 0.95)',
                backdropFilter: 'blur(20px)',
                zIndex: 20,
                boxShadow: '20px 0 50px rgba(0,0,0,0.5)' // Layered Shadow
            }}>

                {/* Header */}
                <div style={{ marginBottom: '4rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--tac-cyan)', letterSpacing: '4px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Hexagon size={12} fill="var(--tac-cyan)" /> COMMAND CENTER
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-1px' }}>
                        Match<br /><span style={{ color: '#444' }}>Configuration</span>
                    </h1>
                </div>

                {/* SCROLLABLE CONFIG AREA */}
                <div className="custom-scrollbar" style={{
                    flex: 1, overflowY: 'auto', paddingRight: '1rem',
                    maskImage: 'linear-gradient(black 80%, transparent 100%)', // Fade out bottom
                    display: 'flex', flexDirection: 'column', gap: '3rem' // Increased vertical rhythm
                }}>

                    {/* Mode Selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Layers size={14} /> SELECT PROTOCOL
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {MODES.map(mode => {
                                const isSelected = selectedMode === mode.id;
                                return (
                                    <motion.button
                                        key={mode.id}
                                        onClick={() => setSelectedMode(mode.id)}
                                        whileTap={{ scale: 0.98, y: 2 }} // Physical sink effect
                                        animate={{
                                            backgroundColor: isSelected ? 'rgba(255,255,255,0.03)' : 'transparent',
                                            borderColor: isSelected ? mode.color : 'rgba(255,255,255,0.1)',
                                            x: isSelected ? 10 : 0
                                        }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem',
                                            border: '1px solid',
                                            borderBottom: isSelected ? `4px solid ${mode.color}` : '1px solid rgba(255,255,255,0.1)', // Tactile Thickness
                                            color: isSelected ? 'white' : '#666',
                                            cursor: 'pointer', textAlign: 'left',
                                            position: 'relative', overflow: 'hidden'
                                        }}
                                    >
                                        <mode.icon size={24} color={isSelected ? mode.color : '#444'} />
                                        <div>
                                            <div style={{ fontWeight: 700, letterSpacing: '1px', fontSize: '1rem', textShadow: isSelected ? `0 0 10px ${mode.color}` : 'none' }}>{mode.label}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>{mode.desc}</div>
                                        </div>
                                        {isSelected && <motion.div layoutId="selection-glow" style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 30px ${mode.color}20` }} />}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Rounds Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#888', letterSpacing: '1px' }}><Hash size={14} /> ROUND CONFIG</span>
                            <span style={{ color: 'var(--tac-cyan)', fontWeight: 700, fontSize: '1.2rem' }}>{rounds}</span>
                        </div>
                        <input
                            type="range" min="1" max="4" value={rounds} onChange={(e) => setRounds(parseInt(e.target.value))}
                            style={{
                                width: '100%', accentColor: 'var(--tac-cyan)', height: '4px', background: '#333',
                                appearance: 'none', borderRadius: '2px', outline: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#444', marginTop: '8px' }}>
                            <span>INITIATION</span>
                            <span>FULL SEQUENCE</span>
                        </div>
                    </div>

                    {/* Time Pressure Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#888', letterSpacing: '1px' }}><Clock size={14} /> TEMPORAL LIMIT</span>
                            <span style={{ color: 'var(--tac-cyan)', fontWeight: 700, fontSize: '1.2rem' }}>{time}s</span>
                        </div>
                        <input
                            type="range" min="30" max="180" step="10" value={time} onChange={(e) => setTime(parseInt(e.target.value))}
                            style={{
                                width: '100%', accentColor: 'var(--tac-cyan)', height: '4px', background: '#333',
                                appearance: 'none', borderRadius: '2px', outline: 'none'
                            }}
                        />
                    </div>

                    {/* Difficulty Selector */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#888', letterSpacing: '1px' }}><BarChart size={14} /> NEURAL COMPLEXITY</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['easy', 'normal', 'hard'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    style={{
                                        flex: 1, padding: '1rem',
                                        border: `1px solid ${difficulty === d ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                                        background: difficulty === d ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        color: difficulty === d ? 'white' : '#666',
                                        fontSize: '0.75rem', fontWeight: 700,
                                        textTransform: 'uppercase', cursor: 'pointer',
                                        borderBottom: difficulty === d ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <div style={{ marginTop: '3rem' }}>
                    <motion.button
                        onClick={handleDeploy}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                            background: currentModeData ? currentModeData.color : 'white',
                            boxShadow: `0 0 40px ${currentModeData ? currentModeData.color : 'white'}40`,
                            padding: '1.5rem', fontSize: '1rem'
                        }}
                    >
                        CONFIRM CONFIGURATION <ChevronRight size={18} />
                    </motion.button>
                </div>

            </div>

            {/* RIGHT PANEL: 3D PREVIEW */}
            <div style={{
                flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                perspective: '1000px', // key for 3D effect
                overflow: 'hidden'
            }}>

                {/* 3D Container */}
                <motion.div
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: -10, opacity: 1 }} // Standing holographic feel
                    transition={{ duration: 1, ease: "circOut" }}
                    style={{
                        width: '80%', height: '70%', position: 'relative',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Floating Label - Aligned with Sidebar Title? Not exactly possible visually across split panes easily, 
                         but we align left within this container */}
                    <div style={{
                        position: 'absolute', top: '-3rem', left: 0,
                        transform: 'translateZ(50px)',
                        fontSize: '0.9rem', color: currentModeData.color, letterSpacing: '4px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '10px',
                        textShadow: `0 0 10px ${currentModeData.color}`
                    }}>
                        <Map size={16} /> SECTOR 0{rounds} PREVIEW
                    </div>

                    {/* Main Glass Card */}
                    <div className="glass-card" style={{
                        width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
                        border: `1px solid ${currentModeData.color}40`,
                        background: 'rgba(20, 20, 25, 0.4)',
                        boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(0,0,0,0.5)`
                    }}>

                        {/* 3D Map Assembly Simulation */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Base Grid */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    width: '150%', height: '150%', position: 'absolute',
                                    background: `radial-gradient(circle, ${currentModeData.color}10 0%, transparent 70%)`,
                                    backgroundImage: `linear-gradient(${currentModeData.color}10 2px, transparent 2px), linear-gradient(90deg, ${currentModeData.color}10 2px, transparent 2px)`,
                                    backgroundSize: '100px 100px',
                                    transform: 'perspective(500px) rotateX(60deg)'
                                }}
                            />

                            {/* "Exploded" Layers */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedMode}
                                    initial={{ scale: 0.8, opacity: 0, rotateX: 60 }}
                                    animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                                    exit={{ scale: 1.2, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ position: 'relative', width: '300px', height: '300px' }}
                                >
                                    {/* Layer 1: Core */}
                                    <div style={{
                                        position: 'absolute', inset: 0, border: `2px solid ${currentModeData.color}`,
                                        borderRadius: '50%', opacity: 0.8, boxShadow: `0 0 30px ${currentModeData.color}40`
                                    }} />

                                    {/* Layer 2: Rotating Ring */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        style={{
                                            position: 'absolute', inset: '-20px', border: `1px dashed ${currentModeData.color}`,
                                            borderRadius: '50%', opacity: 0.5
                                        }}
                                    />

                                    {/* Layer 3: Glitch Elements */}
                                    <div style={{
                                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                        fontSize: '4rem', fontWeight: 900, color: 'white', opacity: 0.9, textShadow: `0 0 20px ${currentModeData.color}`
                                    }}>
                                        {rounds}
                                    </div>

                                    <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', letterSpacing: '4px', color: currentModeData.color }}>
                                        {selectedMode.toUpperCase()}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Telemetry Overlay */}
                        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', textAlign: 'right', fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                            <div>COORD: 45.92.11</div>
                            <div>NET_STATUS: STABLE</div>
                            <div style={{ color: currentModeData.color }}>SYNC: 99.9%</div>
                        </div>

                    </div>
                </motion.div>

            </div>

        </div>
    );
};

export default MatchSetup;
