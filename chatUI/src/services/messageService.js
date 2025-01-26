import { create } from 'zustand';

const useMessageStore = create((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      id: Date.now(),
      ...message,
    }]
  })),
  removeMessage: (id) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== id)
  })),
}));

const messageService = {
  show: (message, type = 'default', duration = 3000) => {
    const { addMessage, removeMessage } = useMessageStore.getState();
    const id = Date.now();
    
    addMessage({
      id,
      message,
      type,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, duration);
    }
  },

  success: (message, duration) => {
    messageService.show(message, 'success', duration);
  },

  error: (message, duration) => {
    messageService.show(message, 'error', duration);
  },

  warning: (message, duration) => {
    messageService.show(message, 'warning', duration);
  },

  info: (message, duration) => {
    messageService.show(message, 'info', duration);
  }
};

export { useMessageStore, messageService };