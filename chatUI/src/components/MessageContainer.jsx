import { useState, forwardRef, useImperativeHandle } from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBox from './MessageBox';

const MessageContainer = forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);

  useImperativeHandle(ref, () => ({
    addMessage: (message, type = 'default') => {
      const id = Date.now();
      setMessages(prev => [{ id, message, type }, ...prev]);
      
      // 3秒后自动移除消息
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, 3000);
    }
  }));

  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 flex flex-col z-[9999] bg-transparent">
      <AnimatePresence>
        {messages.map(({ id, message, type }) => (
          <MessageBox
            key={id}
            message={message}
            type={type}
            onClose={() => removeMessage(id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

MessageContainer.displayName = 'MessageContainer';

export default MessageContainer;