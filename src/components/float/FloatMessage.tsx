
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MessageProps {
  id: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: (id: string) => void;
}

const FloatMessage = ({ id, content, type, duration = 5000, onClose }: MessageProps) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={cn(
        'float-glass rounded-lg border px-4 py-3 shadow-lg',
        typeStyles[type]
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm">{content}</p>
        <button
          onClick={() => onClose(id)}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

interface FloatMessagesContainerProps {
  messages: MessageProps[];
  onClose: (id: string) => void;
}

export const FloatMessagesContainer = ({ messages, onClose }: FloatMessagesContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
      <AnimatePresence>
        {messages.map((message) => (
          <FloatMessage
            key={message.id}
            id={message.id}
            content={message.content}
            type={message.type}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatMessagesContainer;
