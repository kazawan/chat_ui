import { useEffect, useState } from 'react';

const messageTypes = {
  default: {
    bg: 'bg-black/50',
    text: 'text-white',
    icon: null
  },
  info: {
    bg: 'bg-green-500/50',
    text: 'text-white',
    icon: null
  },
  warning: {
    bg: 'bg-yellow-500/50',
    text: 'text-black',
    icon: null
  }
};

export default function MessageBox({ type = 'default', message, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible || !message) return null;

  const { bg, text } = messageTypes[type];

  return (
    <div className="fixed top-10 left-0 w-full flex justify-center z-[9999]">
      <div className={`${bg} ${text} px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in`}>
        <span>{message}</span>
      </div>
    </div>
  );
}