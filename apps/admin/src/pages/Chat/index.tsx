import React, { useState, useEffect, useRef } from 'react';
import { BsSend } from 'react-icons/bs';
import { ngoService } from '../../services/ngoService';

interface ChatMessage {
  id: number;
  content: string;
  isRead: false;
  ngo: {};
  ngoId: number;
  senderType: "ADMIN" | "NGO";
  createdAt: string;
}

interface ChatUser {
  id: number;
  nameofTheNgo: string;
  ngoName: string;
  name: string;
}

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scroll

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const ngos = await ngoService.getAllNGOs();
        const chatUsers = ngos.map((ngo) => ({
          id: ngo.id,
          name: ngo.nameOfTheNGO,
          ngoName: ngo.district,
          status: 'active',
        }));
        setUsers(chatUsers);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
      }
    };

    fetchNGOs();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sendMessage = await ngoService.sendMessage(selectedUser!.id, messageText);
      console.log(sendMessage);
      setMessageText('');
      fetchMessage(); // Refresh messages after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const fetchMessage = async () => {
    try {
      const messagesSetter = await ngoService.getNgoMessage(selectedUser!.id);
      setMessages(messagesSetter);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessage();
    }
  }, [selectedUser]);

  // Scroll to the last message whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const filteredMessages = messages.filter((msg) => msg.ngoId === selectedUser?.id);

  return (
      <div className="mx-auto max-w-screen-2xl text-black-2 dark:text-white p-4 md:p-6 2xl:p-10">
        <div className="flex h-[calc(100vh-200px)] rounded-sm ">
          <div className="w-80 border-r bg-white   dark:bg-black ">
            <div className="p-4 border-b bg-white   dark:bg-black border-stroke dark:border-strokedark">
              <h4 className="text-xl font-semibold text-black  dark:text-white  mb-4">Support Line</h4>
            </div>
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {users.map((user) => (
                  <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 cursor-pointer  hover:bg-primary dark:hover:bg-black ${
                          selectedUser?.id === user.id ? 'bg-primary dark:bg-boxdark-2 ' : ''
                      }`}
                  >
                    <div className="flex items-center text-black-2 dark:text-white gap-3">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black-2 dark:text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 text-black-2 dark:text-white">
                        <h5 className="font-medium ">{user.name}</h5>
                        <p className="text-sm text-gray-400">{user.ngoName}</p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col dark:bg-boxdark-2 bg:white ">
            {selectedUser ? (
                <>
                  <div className="p-4 border-b border-stroke  dark:border-strokedark">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary  dark:text-black text-white">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-medium  text-black  dark:text-white">{selectedUser.name}</h5>
                        <p className="text-sm text-gray-400 dark:text-white">{selectedUser.ngoName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {filteredMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  message.senderType === 'ADMIN'
                                      ? 'bg-primary text-white'
                                      : 'bg-boxdark text-white'
                              }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.senderType}</span>
                              <span className="text-xs opacity-70">{message.createdAt}</span>
                            </div>
                            <p>{message.content}</p>
                          </div>
                        </div>
                    ))}
                    {/* Auto-scroll reference */}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t border-stroke dark:border-strokedark ">
                    <div className="flex gap-2">
                      <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full rounded-lg border border-stroke  dark:bg-boxdark bg-whiter py-3 px-4 dark:text-white  text-black outline-none focus:border-primary"
                      />
                      <button
                          type="submit"
                          disabled={!messageText.trim()}
                          className="flex items-center justify-center rounded bg-primary p-3 text-white hover:bg-opacity-90 disabled:opacity-50"
                      >
                        <BsSend className="h-5 w-5" />
                      </button>
                    </div>
                  </form>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select an NGO to start chatting
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Chat;
