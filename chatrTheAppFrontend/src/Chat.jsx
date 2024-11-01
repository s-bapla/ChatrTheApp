import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://34.66.135.64:8080');

function Chat({ username, room, setIsLoggedIn }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('join', { username, room });

    socket.on('message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    return () => {
      socket.emit('leave', { username, room });
      socket.off('message');
    };
  }, [username, room]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('message', { message, room });
    setMessage('');
  };

  const leaveChatroom = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className='chat-container'>
      <h2 className='room-title'>Room: {room}</h2>
      <div className='chat-box'>
        {chat.map((msg, index) => (
          <div key={index} className='chat-message'>
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className='message-form'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Enter a message...'
          className='message-input'
        />
        <button type='submit' className='send-button'>
          Send
        </button>
      </form>
      <button onClick={leaveChatroom} className='leave-button'>
        Leave Chatroom
      </button>
    </div>
  );
}

export default Chat;
