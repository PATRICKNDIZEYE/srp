import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPaperclip, BsEmojiSmile, BsSend } from 'react-icons/bs';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

const Chat = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Admin',
      content: 'Hello! How can we help you today?',
      timestamp: '09:00 AM',
      isAdmin: true
    },
    {
      id: 2,
      sender: 'NGO User',
      content: 'Hi, I need information about project submission requirements.',
      timestamp: '09:05 AM',
      isAdmin: false
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'NGO User',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAdmin: false
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          {t('Support Chat')}
        </h2>
        <p className="text-sm text-gray-500">{t('Chat with administration')}</p>
      </div>

      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        {/* Chat Messages.tsx */}
        <div className="h-[calc(100vh-300px)] overflow-y-auto p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.isAdmin
                    ? 'bg-gray-100 dark:bg-boxdark-2'
                    : 'bg-primary text-white'
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-semibold">{msg.sender}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-stroke p-4 dark:border-strokedark">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <button
              type="button"
              className="text-gray-500 hover:text-primary dark:text-gray-400"
            >
              <BsPaperclip className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="text-gray-500 hover:text-primary dark:text-gray-400"
            >
              <BsEmojiSmile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('Type your message...')}
              className="flex-1 rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            >
              <BsSend className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 