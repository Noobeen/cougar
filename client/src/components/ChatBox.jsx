import { useState, useEffect } from 'react';
import { socket } from '../sockets.js';

export default function ChatBox() {
  const [text, setText] = useState('');
  const [log, setLog] = useState([]);

  useEffect(() => {
    socket.on('chat_msg', (msg) => setLog((prev) => [...prev, msg]));
    return () => socket.off('chat_msg');
  }, []);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const payload = { text, user: 'browser' };
    socket.emit('chat_msg', payload);
    setText('');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <form onSubmit={send} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit">Send</button>
      </form>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {log.map((m, i) => (
          <li key={i}>{m.user}: {m.text}</li>
        ))}
      </ul>
    </div>
  );
}