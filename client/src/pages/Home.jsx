import React, { useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { Play, Shield, Activity, Fingerprint, Server, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const setCurrentView = useGameStore((state) => state.setCurrentView);
    const [isDeploying, setIsDeploying] = useState(false);

    // Parallax mouse effect (simplified)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleDeploy = () => {
        setIsDeploying(true);
        setTimeout(() => {
            setCurrentView('match_setup');
        }, 1800);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient Overlays */}
            <div className="grain-overlay" />
            <div className="vignette" />

            {/* Top Micro-HUD */}
            <header style={{
                height: '80px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 3rem', zIndex: 60,
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', gap: '2rem', height: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--tac-cyan)' }}>SERVER_STATUS</span>
                        <span style={{ letterSpacing: '1px' }}>US_EAST_01 // ONLINE</span>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: '#333' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#888', fontFamily: 'var(--font-mono)' }}>
                        <Radio size={14} className={isDeploying ? 'animate-pulse' : ''} />
                        NET_LATENCY: 12ms
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '4px 10px',
                        fontSize: '0.7rem',
                        color: 'var(--tac-cyan)',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        <Shield size={12} /> RICCHET_SECURE
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#444', fontFamily: 'var(--font-mono)' }}>VER. 4.1.0-STABLE</div>
                </div>
            </header>

            {/* Main Content Area */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 60, transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                transition: 'transform 0.1s ease-out'
            }}>

                {/* Title Lockup */}
                <div style={{ marginBottom: '5rem', textAlign: 'center', position: 'relative' }}>

                    {/* Decorative Bracket */}
                    <motion.div
                        initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 1 }}
                        style={{ position: 'absolute', left: '-40px', top: 0, width: '1px', background: 'linear-gradient(180deg, transparent, var(--tac-cyan), transparent)' }}
                    />

                    <motion.div
                        initial={{ opacity: 0, letterSpacing: '20px' }}
                        animate={{ opacity: 1, letterSpacing: '6px' }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{
                            fontSize: '0.9rem', color: '#666', marginBottom: '1rem',
                            fontFamily: 'var(--font-mono)', textTransform: 'uppercase'
                        }}
                    >
                        Tactical Generative Environment
                    </motion.div>

                    <h1 style={{ lineHeight: 0.9, position: 'relative' }}>
                        <div className="text-outline" style={{ fontSize: '7rem', letterSpacing: '-2px' }}>PROMPT</div>
                        <div style={{ fontSize: '7rem', fontWeight: 900, color: 'white', letterSpacing: '-4px', marginTop: '-10px' }}>
                            ULTIMATE
                        </div>
                        <div className="text-outline" style={{ fontSize: '4rem', letterSpacing: '10px', marginTop: '10px', opacity: 0.8 }}>
                            BATTLEGROUNDS
                        </div>
                    </h1>
                </div>

                {/* Primary Action */}
                <motion.button
                    onClick={handleDeploy}
                    className="btn-tactical"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                    {isDeploying ? (
                        <span style={{ color: 'var(--tac-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Activity size={18} className="animate-spin" /> ESTABLISHING LINK...
                        </span>
                    ) : (
                        <>
                            DEPLOY INTO BATTLEGROUNDS
                            <Play size={16} fill="white" />
                        </>
                    )}
                </motion.button>

            </div>

            {/* Bottom Status Bar */}
            <div style={{
                height: '60px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 3rem',
                borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 60,
                fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666'
            }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Server size={14} /> ID: 821-XG-ALPHA
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Fingerprint size={14} /> USER: AGENT_007
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ width: '40px', height: '4px', background: i === 5 ? 'var(--tac-cyan)' : '#333' }} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Home;
