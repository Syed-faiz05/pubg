import React from 'react';
import useGameStore from '../store/useGameStore';
import Navbar from '../components/Navbar';
import { Award, TrendingUp, History, Shield } from 'lucide-react';

const Profile = () => {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '2rem' }}>

                {/* Header Card */}
                <div className="glass-panel" style={{ padding: '3rem', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        padding: '4px'
                    }}>
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="Profile"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#111' }}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>Agent_007</h1>
                                <span style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem', letterSpacing: '1px' }}>GRANDMASTER I</span>
                            </div>
                            <button className="btn btn-secondary">Edit Profile</button>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '3rem' }}>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Matches</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>1,248</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Win Rate</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-success)' }}>68.4%</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Avg. Accuracy</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>91.2%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                    {/* Recent Matches */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <History size={20} color="var(--accent-purple)" /> Recent Operations
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#333' }}></div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Neon City Breakdown</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ranked • 1v1</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ color: i === 1 ? 'var(--accent-error)' : 'var(--accent-success)', fontWeight: 'bold' }}>
                                            {i === 1 ? 'DEFEAT' : 'VICTORY'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+24 RP</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats & Badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={20} color="var(--accent-cyan)" /> Season Stats
                            </h3>
                            {/* Performance Graph Placeholder */}
                            <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                                {[40, 60, 45, 80, 70, 90, 85].map((h, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        height: `${h}%`,
                                        background: 'var(--gradient-primary)',
                                        opacity: 0.5 + (i / 10),
                                        borderRadius: '2px'
                                    }} />
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={20} color="var(--accent-accent)" /> Badges
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Profile;
