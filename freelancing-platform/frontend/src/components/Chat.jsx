import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Chat({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef();
  const user = JSON.parse(localStorage.getItem('user') || null);

  useEffect(()=>{
    socketRef.current = io((process.env.REACT_APP_API || 'http://localhost:5000').replace('/api',''), { autoConnect:true }).of('/chat');
    socketRef.current.on('connect', ()=> {
      socketRef.current.emit('join', { projectId });
    });
    socketRef.current.on('message', (msg) => setMessages(prev => [...prev, msg]));
    return ()=> socketRef.current.disconnect();
  },[projectId]);

  const send = () => {
    if (!text) return;
    socketRef.current.emit('message', { projectId, fromUserId: user?.id || user?._id, content: text });
    setText('');
  };

  return (
    <div style={{ border:'1px solid #ddd', padding:10 }}>
      <div style={{ maxHeight:200, overflow:'auto' }}>{messages.map(m => <div key={m.id}><b>{m.from === (user?.id || user?._id) ? 'You' : m.from}:</b> {m.content}</div>)}</div>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type..." />
      <button onClick={send}>Send</button>
    </div>
  );
}
