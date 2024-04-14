// ChatMessage.js
import React from 'react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`message ${message.sender.toLowerCase() === 'user' ? 'user' : 'ai'}`}>
      {message.sender.toLowerCase() === 'user' ? (
        <span className="sender">You</span>
      ) : (
        <span className="sender">AI</span>
      )}
      <p className="text">{message.text}</p>
    </div>
  );
};

export default ChatMessage;
