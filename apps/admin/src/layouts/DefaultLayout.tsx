import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axiosInstance from "../utils/axiosInstance.ts";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);


  const fetchAllUnreadMessages = async () => {
    const unreadMessagesCounter = await axiosInstance.get('/user-messages/ngo/allUnreadMessages');
    setUnreadMessages(unreadMessagesCounter.data.unreadCount);


  }

  // Simulate checking for new messages
  useEffect(() => {
    // Here you would typically connect to your chat service
    // For now, we'll just simulate unread messages

    fetchAllUnreadMessages()
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} unreadMessages={unreadMessages} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout; 