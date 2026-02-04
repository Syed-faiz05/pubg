import { io } from 'socket.io-client';
import useGameStore from '../store/useGameStore';

const SOCKET_URL = 'http://localhost:3001';

class SocketService {
    socket = null;

    connect() {
        if (this.socket) return;

        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log('Connected to server');
            useGameStore.getState().setIsConnected(true);
            useGameStore.getState().setPlayerId(this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            useGameStore.getState().setIsConnected(false);
        });

        this.socket.on('lobby_update', (data) => {
            // Update lobby state in store (if we had a specific lobby slice)
            console.log('Lobby Update:', data);
        });
    }

    joinLobby(playerName) {
        if (this.socket) {
            this.socket.emit('join_lobby', { name: playerName });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketService = new SocketService();
