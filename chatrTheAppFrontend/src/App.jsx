import React, { useState } from 'react';
import Chat from './Chat';
import './App.css'

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username && room) setIsLoggedIn(true);
  };

  return (
    <div className='App'>
      <h1>Flask-React Live Chat</h1>
      {isLoggedIn ? (
        <Chat username={username} room={room} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <div className='SignIn'>
          <input
            type='text'
            placeholder='Enter your name'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='text'
            placeholder='Enter room name'
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={handleLogin}>Join Room</button>
        </div>
      )}
    </div>
  );
}

export default App;
