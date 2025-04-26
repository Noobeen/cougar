// client/src/App.jsx
import { useEffect, useState } from 'react';
import { socket } from './sockets.js';
import Map from './components/Map.jsx';
import ChatBox from './components/ChatBox.jsx';

export default function App() {
  const [lastFix, setLastFix] = useState(null);

  useEffect(() => {
    // Confirm the socket handshake
    socket.on('server_ack', console.log);

    // Receive GPS updates
    socket.on('location_update', setLastFix);

    // Clean up on unmount
    return () => socket.off('location_update');
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: 960, margin: '0 auto' }}>
      <h1>ShuttleTrack Live Feed</h1>

      {/* Google Map with moving bus markers */}
      <Map />

      {/* Two-way chat to the back-end */}
      <ChatBox />

      {/* Raw JSON for quick debugging */}
      <h3 style={{ marginTop: '1.5rem' }}>Last JSON fix received:</h3>
      {lastFix ? (
        <pre style={{ background: '#f2f2f2', padding: '0.75rem', borderRadius: 6 }}>
          {JSON.stringify(lastFix, null, 2)}
        </pre>
      ) : (
        <p>Waiting for data…</p>
      )}
    </div>
  );
}
