
import React, { useState } from 'react';
import FloatSidebar from './FloatSidebar';
import FloatContent from './FloatContent';
import FloatMessagesContainer, { MessageProps } from './FloatMessage';
import FloatHeaderActions from './FloatHeaderActions';
import { useIsMobile } from '@/hooks/use-mobile';

const FloatLayout = ({ children }: { children?: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: '1',
      content: 'Welcome to FLOAT, your personal knowledge management system.',
      type: 'info',
      onClose: () => {},
    }
  ]);

  const handleCloseMessage = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  // Update message onClose handlers
  const messagesWithHandlers = messages.map(message => ({
    ...message,
    onClose: () => handleCloseMessage(message.id)
  }));

  return (
    <div className="min-h-screen flex w-full bg-float-bg">
      <FloatSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`min-h-screen flex-1 transition-all duration-300 ${isMobile ? "pl-4" : sidebarOpen ? "pl-64" : "pl-16"}`}>
        <div className="flex justify-end p-4">
          <FloatHeaderActions />
        </div>
        {children ? children : <FloatContent sidebarOpen={sidebarOpen} />}
      </div>
      <FloatMessagesContainer messages={messagesWithHandlers} onClose={handleCloseMessage} />
    </div>
  );
};

export default FloatLayout;
