import React, { useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Users, AlertTriangle, Lock, Radio, Cpu, ChevronRight, Activity, Grid } from 'lucide-react';

const MatchSetup = () => {
    const setCurrentView = useGameStore((state) => state.setCurrentView);
    const [selectedId, setSelectedId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    // Protocol Definitions
    const protocols = [
        {
            id: 'ranked',
            label: 'RANKED // OPERATION',
            code: 'PROT_LETHAL_01',
            icon: Shield,
            risk: 'EXTREME',
            reward: 'ELO ++',
            desc: 'Competitive ladder. Global leaderboard active. Anti-cheat enforcement maximized.',
            color: 'var(--tac-cyan)'
        },
        {
            id: 'practice',
            label: 'SANDBOX // SIM',
            code: 'PROT_SAFE_99',
            icon: Target,
            risk: 'NULL',
            reward: 'SKILL ++',
            desc: 'Unrestricted generated environment. No penalties. Debug tools enabled.',
            color: '#e0e0e0'
        },
        {
            id: 'custom',
            label: 'PRIVATE // NET',
            code: 'PROT_HOST_X',
            icon: Users,
            risk: 'VARIABLE',
            reward: 'NONE',
            desc: 'User-defined parameters. Invite-only encrypted channel.',
            color: '#bc13fe' // Hardcoded purple for accent
        }
    ];

    const activeData = protocols.find(p => p.id === (selectedId || hoveredId));

    const handleSelect = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };

    const handleConfirm = () => {
        setCurrentView('lobby');
    };

    return (
        <div style={{
            height: '100vh', width: '100vw',
            background: '#020202',
            color: '#eee',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            fontFamily: 'var(--font-mono)'
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

            {/* Left Rail - Status */}
            <div style={{
                width: '80px', borderRight: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0',
                zIndex: 10, background: '#020202'
            }}>
                <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '4px', fontSize: '0.8rem', color: '#666' }}>
                    SYSTEM READY // AWAITING INPUT
                </div>
                <div style={{ flex: 1 }} />
                <Activity size={20} color="var(--tac-cyan)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
            </div>

            {/* Main Content Grid */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3rem', position: 'relative', zIndex: 10 }}>

                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '4rem' }}>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            style={{ fontSize: '0.8rem', color: 'var(--tac-cyan)', marginBottom: '0.5rem' }}
                        >
                            <Grid size={12} style={{ display: 'inline', marginRight: '8px' }} />
                            SELECT OPERATION MODE
                        </motion.div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 100, textTransform: 'uppercase', letterSpacing: '-1px' }}>
                            Protocol <span style={{ fontWeight: 900 }}>Selection</span>
                        </h1>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#666' }}>
                        <div>SECURE CONNECTION ESTABLISHED</div>
                        <div>ENC: AES-256-GCM</div>
                    </div>
                </header>

                <div style={{ display: 'flex', flex: 1, gap: '4rem' }}>

                    {/* Node Selection Area */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                        {protocols.map((p) => {
                            const isSelected = selectedId === p.id;
                            const isHovered = hoveredId === p.id;
                            const isDimmed = selectedId && !isSelected;

                            return (
                                <motion.div
                                    key={p.id}
                                    onMouseEnter={() => setHoveredId(p.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => handleSelect(p.id)}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{
                                        x: 0,
                                        opacity: isDimmed ? 0.3 : 1,
                                        scale: isSelected ? 1.05 : 1
                                    }}
                                    transition={{ delay: 0.1 }}
                                    style={{
                                        padding: '2rem',
                                        border: isSelected ? `1px solid ${p.color}` : '1px solid rgba(255,255,255,0.1)',
                                        background: isSelected ? `${p.color}05` : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        position: 'relative',
                                        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <p.icon size={24} color={isSelected || isHovered ? p.color : '#444'} />
                                        <div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '2px' }}>{p.label}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.code}</div>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            style={{ width: '8px', height: '8px', background: p.color, boxShadow: `0 0 15px ${p.color}` }}
                                        />
                                    )}

                                    {/* Selection Corner Brackets */}
                                    {isHovered && !isSelected && (
                                        <>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', borderTop: `2px solid ${p.color}`, borderLeft: `2px solid ${p.color}` }} />
                                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderBottom: `2px solid ${p.color}`, borderRight: `2px solid ${p.color}` }} />
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Context/Intelligence Panel */}
                    <div style={{ width: '400px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <AnimatePresence mode="wait">
                            {activeData ? (
                                <motion.div
                                    key={activeData.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <div style={{ fontSize: '4rem', fontWeight: 900, color: '#222', lineHeight: 0.8, marginBottom: '2rem', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                        {activeData.code}
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.5rem' }}>RISK ASSESSMENT</div>
                                        <div style={{ fontSize: '1.5rem', color: activeData.color }}>{activeData.risk}</div>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.5rem' }}>OPERATIONAL REWARD</div>
                                        <div style={{ fontSize: '1.2rem' }}>{activeData.reward}</div>
                                    </div>

                                    <p style={{ lineHeight: 1.5, color: '#999', fontSize: '0.9rem', marginBottom: '3rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                                        {activeData.desc}
                                    </p>

                                    {selectedId === activeData.id ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleConfirm}
                                            style={{
                                                width: '100%', padding: '1.5rem',
                                                background: activeData.color, color: '#000', fontWeight: 900, border: 'none',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                                            }}
                                        >
                                            INITIATE PROTOCOL <ChevronRight size={18} />
                                        </motion.button>
                                    ) : (
                                        <div style={{
                                            width: '100%', padding: '1.5rem',
                                            border: '1px dashed #444', color: '#666', textAlign: 'center', fontSize: '0.8rem'
                                        }}>
                                            SELECT NODE TO ARM
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <div style={{ color: '#444', textAlign: 'center' }}>
                                    <Cpu size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <div>AWAITING SELECTION</div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default MatchSetup;
