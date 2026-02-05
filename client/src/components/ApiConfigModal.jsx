import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Server, Key, Edit2 } from 'lucide-react';
import useGameStore from '../store/useGameStore';

const ApiConfigModal = ({ isOpen, onClose }) => {
    const { userApis, updateApiConfig } = useGameStore();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', key: '' });

    const handleEdit = (api) => {
        setEditingId(api.id);
        setEditForm({ name: api.name, key: api.key });
    };

    const handleSave = (index) => {
        updateApiConfig(index, {
            name: editForm.name,
            key: editForm.key,
            connected: editForm.key.length > 5 // Mock connection check
        });
        setEditingId(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        style={{
                            width: '600px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px', padding: '2rem', position: 'relative', overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Server size={24} color="#40f0ff" />
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '1px', lineHeight: 1 }}>API CONFIGURATION</h2>
                                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>MANAGE NEURAL INTERFACE CONNECTIONS</div>
                                </div>
                            </div>
                            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* API List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {userApis.map((api, index) => (
                                <div key={api.id} style={{
                                    background: editingId === api.id ? 'rgba(64, 240, 255, 0.05)' : 'rgba(255,255,255,0.03)',
                                    border: editingId === api.id ? '1px solid #40f0ff' : '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px', padding: '1.5rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    transition: 'all 0.2s'
                                }}>
                                    {editingId === api.id ? (
                                        // Edit Mode
                                        <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <input
                                                autoFocus
                                                value={editForm.name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="API Name"
                                                style={{
                                                    background: '#050505', border: '1px solid #333', color: 'white',
                                                    padding: '8px 12px', borderRadius: '4px', fontSize: '0.9rem',
                                                    fontFamily: 'var(--font-mono)', width: '120px'
                                                }}
                                            />
                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <Key size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                                                <input
                                                    value={editForm.key}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, key: e.target.value }))}
                                                    placeholder="Enter API Key / Endpoint"
                                                    style={{
                                                        background: '#050505', border: '1px solid #333', color: '#4dffb5',
                                                        padding: '8px 12px 8px 30px', borderRadius: '4px', fontSize: '0.8rem',
                                                        fontFamily: 'var(--font-mono)', width: '100%'
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSave(index)}
                                                style={{
                                                    background: '#40f0ff', color: 'black', border: 'none',
                                                    borderRadius: '4px', padding: '8px', cursor: 'pointer'
                                                }}
                                            >
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{
                                                    width: '10px', height: '10px', borderRadius: '50%',
                                                    background: api.connected ? '#4dffb5' : '#333',
                                                    boxShadow: api.connected ? '0 0 10px #4dffb5' : 'none'
                                                }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{api.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#666' }}>{api.type} Protocol • {api.charges} Charges</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <div style={{
                                                    fontSize: '0.7rem', color: api.connected ? '#4dffb5' : '#666',
                                                    border: `1px solid ${api.connected ? '#4dffb5' : '#333'}`,
                                                    padding: '2px 8px', borderRadius: '2px'
                                                }}>
                                                    {api.connected ? 'CONNECTED' : 'OFFLINE'}
                                                </div>
                                                <button
                                                    onClick={() => handleEdit(api)}
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ApiConfigModal;
