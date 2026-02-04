import React from 'react';
import useGameStore from '../store/useGameStore';
import { LayoutDashboard, Gamepad2, Trophy, User } from 'lucide-react';

const Navbar = () => {
    const setCurrentView = useGameStore((state) => state.setCurrentView);
    const activeView = useGameStore((state) => state.currentView);

    const NavItem = ({ view, icon: Icon, label }) => (
        <button
            onClick={() => setCurrentView(view)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: activeView === view ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s',
                fontWeight: activeView === view ? 600 : 400,
                cursor: 'pointer'
            }}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <nav style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(5, 5, 5, 0.5)',
            backdropFilter: 'blur(10px)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100
        }}>
            {/* Logo */}
            <div
                onClick={() => setCurrentView('home')}
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    letterSpacing: '-1px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <div style={{ width: '12px', height: '12px', background: 'var(--accent-cyan)', borderRadius: '2px', transform: 'rotate(45deg)' }}></div>
                PROMPT <span className="text-gradient">ARENA</span>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <NavItem view="home" icon={LayoutDashboard} label="Hub" />
                <NavItem view="lobby" icon={Gamepad2} label="Arena" />
                <NavItem view="profile" icon={Trophy} label="Leaderboard" />
            </div>

            {/* Profile / User */}
            <div
                onClick={() => setCurrentView('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
            >
                <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Agent_007</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>LVL 42 // MASTER</div>
                </div>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <User color="black" size={20} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
