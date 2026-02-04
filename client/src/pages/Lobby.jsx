import React, { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, MousePointer2, AlertTriangle, Hexagon } from 'lucide-react';
import Navbar from '../components/Navbar';

const Lobby = () => {
    const { setCurrentView, playerName, gameConfig } = useGameStore();

    // Game State
    const [charge, setCharge] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

    // Mock Players based on Mode
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Initialize Players based on Config
        const isSolo = gameConfig?.mode === 'solo';

        const initialPlayers = [
            { id: 0, name: playerName || 'AGENT_LOCAL', status: 'idle', color: 'var(--tac-cyan)' }, // User
            { id: 1, name: isSolo ? 'SEARCHING...' : 'NEXUS_PRIME', status: 'idle', color: '#ff3864' },
            { id: 2, name: isSolo ? 'SEARCHING...' : 'VECTOR_7', status: 'idle', color: '#bc13fe' },
            { id: 3, name: isSolo ? 'SEARCHING...' : 'NULL_POINTER', status: 'idle', color: '#ffe600' }
        ];
        setPlayers(initialPlayers);
    }, [gameConfig, playerName]);


    // Hold-to-Ready Logic
    const intervalRef = useRef(null);

    const startCharging = () => {
        if (isReady || isLaunching) return;
        intervalRef.current = setInterval(() => {
            setCharge(prev => {
                if (prev >= 100) {
                    clearInterval(intervalRef.current);
                    handleUserReady();
                    return 100;
                }
                return prev + 2; // Charge speed
            });
        }, 16);
    };

    const stopCharging = () => {
        if (isReady || isLaunching) return;
        clearInterval(intervalRef.current);
        setCharge(0);
    };

    const handleUserReady = () => {
        setIsReady(true);
        updatePlayerStatus(0, 'locked');
    };

    const updatePlayerStatus = (idx, status) => {
        setPlayers(prev => prev.map((p, i) => i === idx ? { ...p, status } : p));
    };

    // Simulation of Opponents Readying Up
    useEffect(() => {
        if (!isReady) return; // Wait for user to be ready first? Or independent? 
        // Let's make opponents ready up after user is ready for dramatic effect

        const timeouts = [];
        const opponents = [1, 2, 3];

        opponents.forEach(idx => {
            const delay = 1000 + Math.random() * 3000;
            timeouts.push(setTimeout(() => {
                // If solo, we "Sort of" find them then lock them
                if (gameConfig?.mode === 'solo') {
                    setPlayers(prev => prev.map((p, i) => i === idx ? { ...p, name: `OPPONENT_0${idx}`, status: 'locked' } : p));
                } else {
                    updatePlayerStatus(idx, 'locked');
                }
            }, delay));
        });

        return () => timeouts.forEach(clearTimeout);
    }, [isReady, gameConfig]);

    // Auto-Launch when all ready
    useEffect(() => {
        if (players.length > 0 && players.every(p => p.status === 'locked')) {
            setTimeout(() => setIsLaunching(true), 1000);
            setTimeout(() => setCurrentView('arena'), 4000); // Launch delay
        }
    }, [players, setCurrentView]);

    // --- Sub-Components ---

    // The Central Prompt Core
    const Core = () => {
        const readiness = players.filter(p => p.status === 'locked').length;
        const speed = isLaunching ? 0.2 : 10 - (readiness * 2); // Faster as more ready
        const glowColor = isLaunching ? 'white' : 'var(--tac-cyan)';

        return (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                {/* Core Energy */}
                <motion.div
                    animate={{ rotate: 360, scale: isLaunching ? [1, 50] : [1, 1.05, 1] }}
                    transition={{
                        rotate: { duration: speed, repeat: Infinity, ease: 'linear' },
                        scale: isLaunching ? { duration: 1, ease: 'easeIn' } : { duration: 2, repeat: Infinity }
                    }}
                    style={{
                        width: '150px', height: '150px',
                        background: isLaunching ? 'white' : 'transparent',
                        border: `2px solid ${glowColor}`,
                        boxShadow: `0 0 ${readiness * 20}px ${glowColor}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <div style={{ width: '100px', height: '100px', border: '1px solid rgba(255,255,255,0.2)', transform: 'rotate(45deg)' }} />
                </motion.div>

                {/* Facets */}
                {isLaunching ? null : (
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: speed * 2, repeat: Infinity, ease: "linear" }}
                        style={{ position: 'absolute', width: '220px', height: '220px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }}
                    />
                )}
            </div>
        );
    };

    // Directional Player Vector
    // pos: 0=bottom, 1=top, 2=left, 3=right
    const PlayerVector = ({ player, pos }) => {
        const isLocked = player.status === 'locked';

        // Transforms for positioning
        const getStyle = () => {
            switch (pos) {
                case 0: return { bottom: '0', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse' };
                case 1: return { top: '0', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column' };
                case 2: return { left: '0', top: '50%', transform: 'translateY(-50%)', flexDirection: 'row-reverse' };
                case 3: return { right: '0', top: '50%', transform: 'translateY(-50%)', flexDirection: 'row' };
                default: return {};
            }
        };

        const beamStyle = () => {
            const size = isLocked ? '50%' : '10%'; // Beam length (50% reaches center approx)
            switch (pos) {
                case 0: case 1: return { height: size, width: isLocked ? '4px' : '1px' };
                case 2: case 3: return { width: size, height: isLocked ? '4px' : '1px' };
            }
        };

        return (
            <div style={{
                position: 'absolute',
                display: 'flex', alignItems: 'center',
                width: (pos === 2 || pos === 3) ? '50%' : '100px',
                height: (pos === 0 || pos === 1) ? '50%' : '100px',
                zIndex: 10,
                ...getStyle()
            }}>
                {/* Player Node (Avatar/Name) */}
                <div style={{
                    padding: '1rem',
                    background: '#020202', border: `1px solid ${isLocked ? player.color : '#333'}`,
                    boxShadow: isLocked ? `0 0 20px ${player.color}40` : 'none',
                    textAlign: 'center', minWidth: '150px',
                    display: 'flex', flexDirection: 'column', gap: '5px',
                    opacity: isLaunching ? 0 : 1, transition: 'opacity 0.5s'
                }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: isLocked ? player.color : '#666', letterSpacing: '2px' }}>
                        {player.name}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#444' }}>
                        {isLocked ? <span style={{ color: player.color }}>LOCKED_IN</span> : 'CALIBRATING...'}
                    </div>
                </div>

                {/* Energy Beam */}
                <motion.div
                    initial={{ width: '1px', height: '1px' }}
                    animate={beamStyle()}
                    style={{
                        background: isLocked ? player.color : '#333',
                        boxShadow: isLocked ? `0 0 10px ${player.color}` : 'none',
                        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                />
            </div>
        );
    };

    return (
        <div style={{
            height: '100vh', width: '100vw', background: '#020202', color: 'white',
            position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-mono)'
        }}
            onMouseDown={!isReady ? startCharging : undefined}
            onMouseUp={!isReady ? stopCharging : undefined}
            onMouseLeave={!isReady ? stopCharging : undefined}
            onTouchStart={!isReady ? startCharging : undefined}
            onTouchEnd={!isReady ? stopCharging : undefined}
        >

            {/* Ambient Background */}
            <div className="grain-overlay" />
            <div className="vignette" />

            {/* HUD Top Left */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 20 }}>
                <div style={{ color: 'var(--tac-cyan)', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 700 }}>
                    LOBBY // {gameConfig?.mode?.toUpperCase() || 'SOLO'}
                </div>
                <div style={{ color: '#666', fontSize: '0.7rem' }}>
                    SECTOR: 0{gameConfig?.rounds || 4} // DIFF: {gameConfig?.difficulty?.toUpperCase() || 'NORMAL'}
                </div>
            </div>

            {/* Main Stage */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Core />

                {players.map((p, i) => (
                    <PlayerVector key={p.id} player={p} pos={i} />
                ))}
            </div>

            {/* Launch Transition Overlay */}
            <AnimatePresence>
                {isLaunching && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 100 }}
                    />
                )}
            </AnimatePresence>

            {/* User Interaction Zone (Bottom) */}
            <div style={{
                position: 'absolute', bottom: '50px', left: '0', width: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'
            }}>
                {!isReady && !isLaunching && (
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', letterSpacing: '2px' }}>
                            PRESS & HOLD TO SYNCHRONIZE
                        </div>

                        {/* Charge Meter */}
                        <div style={{
                            width: '300px', height: '4px', background: '#333',
                            position: 'relative', overflow: 'hidden', margin: '0 auto'
                        }}>
                            <motion.div
                                style={{
                                    width: `${charge}%`, height: '100%',
                                    background: 'var(--tac-cyan)',
                                    boxShadow: '0 0 20px var(--tac-cyan)'
                                }}
                            />
                        </div>
                    </div>
                )}

                {isReady && !isLaunching && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                            padding: '1rem 3rem', border: '1px solid var(--tac-cyan)',
                            color: 'var(--tac-cyan)', background: 'rgba(0, 240, 255, 0.1)',
                            letterSpacing: '4px', fontSize: '0.9rem', fontWeight: 900
                        }}
                    >
                        STANDBY FOR DEPLOYMENT
                    </motion.div>
                )}

                {isLaunching && (
                    <div style={{ color: 'black', zIndex: 101, fontSize: '2rem', fontWeight: 900, letterSpacing: '10px' }}>
                        MATCH SEQUENCE INITIATED
                    </div>
                )}
            </div>

            {/* Floating Lattice Decorations */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1 }}>
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '1px', height: '100px', background: 'white' }} />
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '100px', height: '1px', background: 'white' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '1px', height: '100px', background: 'white' }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '100px', height: '1px', background: 'white' }} />
            </div>

        </div>
    );
};

export default Lobby;
