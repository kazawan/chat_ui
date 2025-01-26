import React from 'react';
import { useMessageStore } from '../../services/messageService';
import Message from './Message';

const MessageContainer = () => {
  const messages = useMessageStore((state) => state.messages);
  const removeMessage = useMessageStore((state) => state.removeMessage);

  return (
    <div className="fixed top-0 right-0 p-4 z-50">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg.message}
          type={msg.type}
          duration={msg.duration}
          onClose={() => removeMessage(msg.id)}
        />
      ))}
    </div>
  );
};

export default MessageContainer;