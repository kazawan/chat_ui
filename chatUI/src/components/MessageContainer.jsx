import { useState, forwardRef, useImperativeHandle } from 'react';
import MessageBox from './MessageBox';

const MessageContainer = forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);

  useImperativeHandle(ref, () => ({
    addMessage: (message, type = 'default', duration = 3000) => {
      const id = Date.now();
      setMessages(prev => [{ id, message, type, duration }, ...prev]);
      
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, duration);
    }
  }));

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 flex flex-col z-[9999] bg-transparent">
      {messages.map(msg => (
        <MessageBox
          key={msg.id}
          type={msg.type}
          message={msg.message}
          duration={msg.duration}
        />
      ))}
    </div>
  );
});

export default MessageContainer;