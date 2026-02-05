import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingSynthesis = ({ levelData, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('chaos'); // 'chaos', 'align', 'synthesis', 'complete'

    useEffect(() => {
        // Synthesis Simulation
        const intervals = [];

        // 0-40%: Rapid Data Ingest (Chaos)
        intervals.push(setTimeout(() => setPhase('align'), 1500));

        // 40-80%: Structural Alignment (Order)
        intervals.push(setTimeout(() => setPhase('synthesis'), 3000));

        // 80-100%: Final Locking
        intervals.push(setTimeout(() => {
            setPhase('complete');
            setTimeout(onComplete, 800); // Slight pause before unmounting
        }, 4500));

        // Smooth Progress Counter
        const progInterval = setInterval(() => {
            setProgress(prev => {
                const target = phase === 'chaos' ? 40 : phase === 'align' ? 80 : 100;
                if (prev >= target) return prev;
                return prev + (Math.random() * 2);
            });
        }, 50);
        intervals.push(progInterval);

        return () => intervals.forEach(i => (typeof i === 'number' ? clearInterval(i) : clearTimeout(i)));
    }, [phase, onComplete]);

    // Visual Elements based on Level Color
    const color = levelData.color;

    // Fragment Generation
    const fragments = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        scale: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * 360
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: '#020202', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            {/* Background Atmosphere */}
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at 50% 50%, ${color}10 0%, transparent 70%)`
                }}
            />

            {/* Central Synthesis Core */}
            <div style={{ position: 'relative', width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {/* Chaos Particles -> Structured Grid */}
                {fragments.map((frag, i) => (
                    <motion.div
                        key={frag.id}
                        initial={{ x: frag.x * 10, y: frag.y * 10, opacity: 0, scale: 0 }}
                        animate={
                            phase === 'chaos' ? {
                                x: [frag.x * 10, frag.x * -10, frag.x * 5],
                                y: [frag.y * 10, frag.y * 5, frag.y * -5],
                                opacity: [0, 1, 0.5], scale: [0, 1, 0.5]
                            } :
                                phase === 'align' ? {
                                    x: 0, y: 0, opacity: 1, scale: 1,
                                    rotate: 0, borderRadius: '2px'
                                } :
                                    // Synthesis: Form a distinct shape depending on logic (simplifying to grid ring)
                                    {
                                        x: Math.cos(i) * 100,
                                        y: Math.sin(i) * 100,
                                        opacity: 1, scale: 0.5,
                                        background: color
                                    }
                        }
                        transition={{ duration: phase === 'chaos' ? 2 : 1, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute', width: '10px', height: '10px',
                            background: phase === 'chaos' ? 'white' : color,
                            boxShadow: `0 0 10px ${color}`
                        }}
                    />
                ))}

                {/* Main Core Ring */}
                <svg width="300" height="300" viewBox="0 0 300 300" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                    {/* Base Track */}
                    <circle cx="150" cy="150" r="140" fill="none" stroke="#222" strokeWidth="2" />

                    {/* Dynamic Loader Segment */}
                    <motion.circle
                        cx="150" cy="150" r="140" fill="none" stroke={color} strokeWidth="4"
                        strokeDasharray="880" strokeDashoffset="880"
                        animate={{ strokeDashoffset: 880 - (880 * (progress / 100)) }}
                        transition={{ type: 'spring', stiffness: 50 }}
                        style={{ filter: `drop-shadow(0 0 10px ${color})` }}
                    />
                </svg>

                {/* Text Decoder */}
                <div style={{ position: 'absolute', zIndex: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-mono)' }}>
                        {Math.floor(progress)}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: color, letterSpacing: '2px', marginTop: '5px' }}>
                        {phase === 'chaos' ? 'ESTABLISHING NEURAL LINK' :
                            phase === 'align' ? 'SYNTHESIZING ENVIRONMENT' :
                                'FINALIZING SEQ'}
                    </div>
                </div>

            </div>

            {/* Bottom Data Stream */}
            <div style={{ position: 'absolute', bottom: '50px', width: '100%', textAlign: 'center' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#666', letterSpacing: '4px' }}
                    >
                        {phase === 'chaos' && `// DECRYPTING SECTOR 0${levelData.id || 1} DATA STREAM...`}
                        {phase === 'align' && `// RECONSTRUCTING VISUAL GEOMETRY...`}
                        {phase === 'synthesis' && `// OPTIMIZING RENDER PIPELINE...`}
                        {phase === 'complete' && `// READY FOR DEPLOYMENT`}
                    </motion.div>
                </AnimatePresence>
            </div>

        </motion.div>
    );
};

export default LoadingSynthesis;
