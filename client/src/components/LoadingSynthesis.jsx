import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingSynthesis = ({ levelData, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('detect'); // 'detect', 'synthesize', 'polish', 'complete'

    // Ensure we have a valid color or fallback
    const color = levelData?.color || '#40f0ff';

    // Sequence Sequence Logic
    useEffect(() => {
        const timers = [];

        // 0-40%: Analyzing Visual Geometry
        timers.push(setTimeout(() => setPhase('synthesize'), 1500));

        // 40-80%: Synthesizing Environment
        timers.push(setTimeout(() => setPhase('polish'), 3000));

        // 80-100%: Preparing Arena
        timers.push(setTimeout(() => {
            setPhase('complete');
            setTimeout(onComplete, 800);
        }, 4500));

        return () => timers.forEach(t => clearTimeout(t));
    }, []); // Run once on mount

    // Progress Simulation Logic
    useEffect(() => {
        const progInterval = setInterval(() => {
            setProgress(prev => {
                const target = phase === 'detect' ? 40 : phase === 'synthesize' ? 80 : 100;
                // Accelerate progress if we are behind the target phase
                const speed = phase === 'complete' ? 5 : 1;
                if (prev >= target) return prev;
                return Math.min(prev + (Math.random() * 2 * speed), target);
            });
        }, 50);

        return () => clearInterval(progInterval);
    }, [phase]);

    // Particle Generation
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth,
        y: (Math.random() - 0.5) * window.innerHeight,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
                opacity: 0, scale: 2, filter: 'blur(20px)',
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: '#050505', // Slightly lighter than pure black for depth
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', color: '#e0e6ed',
                fontFamily: 'var(--font-mono)'
            }}
        >
            {/* 1. Background Environment (Teal/Cyan Gradients & Grid) */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at 50% 50%, ${color}15 0%, transparent 60%)`
                }} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.1,
                    backgroundImage: `linear-gradient(${color}20 1px, transparent 1px), linear-gradient(90deg, ${color}20 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
                {/* Floating Particles */}
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ x: p.x, y: p.y, opacity: 0 }}
                        animate={{
                            y: [p.y, p.y - 100],
                            opacity: [0, 0.3, 0]
                        }}
                        transition={{
                            duration: p.duration, repeat: Infinity, ease: 'linear', delay: Math.random() * 2
                        }}
                        style={{
                            position: 'absolute', left: '50%', top: '50%',
                            width: p.size, height: p.size, borderRadius: '50%',
                            background: color, filter: 'blur(1px)'
                        }}
                    />
                ))}
            </div>

            {/* 2. Intelligent Circular Energy System */}
            <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {/* Rotating Outer Ring segments */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', inset: -20, border: `1px dashed ${color}30`, borderRadius: '50%' }}
                />

                <svg width="300" height="300" viewBox="0 0 300 300" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle cx="150" cy="150" r="130" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />

                    {/* Glowing Progress Segment */}
                    <motion.circle
                        cx="150" cy="150" r="130" stroke={color} strokeWidth="6" fill="none"
                        strokeDasharray="816" strokeDashoffset="816"
                        strokeLinecap="round"
                        animate={{ strokeDashoffset: 816 - (816 * (progress / 100)) }}
                        transition={{ type: "spring", stiffness: 40, damping: 20 }}
                        style={{ filter: `drop-shadow(0 0 15px ${color})` }}
                    />
                </svg>

                {/* Central Data Display */}
                <div style={{ position: 'absolute', textAlign: 'center', flexDirection: 'column', display: 'flex' }}>

                    {/* Percentage */}
                    <motion.div
                        key={Math.floor(progress)}
                        style={{ fontSize: '4rem', fontWeight: 800, color: 'white', lineHeight: 1, textShadow: `0 0 30px ${color}60` }}
                    >
                        {Math.floor(progress)}%
                    </motion.div>

                    {/* Dynamic Phase Text */}
                    <div style={{ marginTop: '10px', height: '20px', overflow: 'hidden' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={phase}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                style={{
                                    fontSize: '0.8rem', color: color, letterSpacing: '2px',
                                    textTransform: 'uppercase', fontWeight: 600
                                }}
                            >
                                {phase === 'detect' && "Analyzing Visual Geometry"}
                                {phase === 'synthesize' && "Synthesizing Environment"}
                                {phase === 'polish' && "Preparing Arena"}
                                {phase === 'complete' && "System Ready"}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>

                {/* Pulse Wave on Completion */}
                {phase === 'complete' && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: `2px solid ${color}` }}
                    />
                )}
            </div>

            {/* Bottom Status Line */}
            <div style={{ position: 'absolute', bottom: '60px', width: '100%', textAlign: 'center', opacity: 0.5 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '4px' }}>ESTIMATING RENDER COMPLEXITY...</div>
            </div>

        </motion.div>
    );
};

export default LoadingSynthesis;
