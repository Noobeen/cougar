import { io } from 'socket.io-client';

export const socket = io(
  import.meta.env.VITE_API_URL || 'http://localhost:5179',
  { 
    transports: ['websocket', 'polling'],  // Fall back to polling if websocket fails
    reconnectionAttempts: 5,               // Try to reconnect 5 times
    reconnectionDelay: 1000,               // Wait 1 second between attempts
    timeout: 10000                         // Increase connection timeout
  }
);

// Add error handling
socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});
