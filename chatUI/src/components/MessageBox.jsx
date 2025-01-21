import { motion } from 'framer-motion';

const messageTypes = {
  default: {
    bg: 'bg-gray-700',
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
  },
  error: {
    bg: 'bg-red-500/50',
    text: 'text-white',
    icon: null
  },
  success: {
    bg: 'bg-blue-500/50',
    text: 'text-white',
    icon: null
  }
};

const MessageBox = ({ message, type = 'default', onClose }) => {
  const messageStyle = messageTypes[type] || messageTypes.default;
  const { bg, text } = messageStyle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full flex justify-center mb-4"
    >
      <div className={`${bg} ${text} px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-75 focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default MessageBox;