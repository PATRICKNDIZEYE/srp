import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { BsDashCircle, BsBookFill, BsBox2Fill, BsChat, BsFolder, BsPersonPlusFill, BsPeopleFill, BsPeople, BsBook } from 'react-icons/bs';
import { AiOutlineDashboard, AiFillSetting , AiOutlineFolder, AiOutlineSetting } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import {FaBuildingNgo} from "react-icons/fa6";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { t } = useTranslation();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);



  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <AiOutlineDashboard className="w-6 h-6" />,
    },
    {
      title: 'NGO Management',
      path: '/ngo',
      icon: <FaBuildingNgo className="w-6 h-6" />,
    },
    {
      title: 'Work Plans',
      path: '/admin/work-plans',
      icon: <AiOutlineFolder className="w-6 h-6" />,
    },
    {
      title: 'Reports',
      path: '/admin/reports',
      icon: <BsBook className="w-6 h-6" />,
    },

    {
      title: 'Support Chat',
      path: '/admin/chat',
      icon: <BsChat className="w-6 h-6" />,
      badge: '2'
    },


    // {
    //   title: 'Documents',
    //
    //   path: '/documents',
    //   icon: <BsFolder className="w-6 h-6" />,
    // },
    {
      title: 'Manage Users',
      path: '/admin/users',
      icon: <BsPeople className="w-6 h-6" />,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <AiOutlineSetting className="w-6 h-6" />,
    },

  ];

  return (
    <>
      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white dark:bg-boxdark shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <NavLink to="/">
            <div className="flex justify-center gap-3 items-center">
              <img src="/minubumwe.svg" alt="Logo" className="w-10 h-10" />
              <h1 className="text-xl font-extrabold text-dark dark:text-white">MINUBUMWE</h1>
            </div>
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(false)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div>
              <ul className="mb-6 flex flex-col gap-1.5">
                {menuItems.map((item) => (
                  <li key={item.title}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-meta-4 ${
                          isActive 
                            ? 'bg-gray-100 dark:bg-meta-4 text-primary dark:text-white' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`
                      }
                    >
                      {item.icon}
                      <span>{t(item.title)}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

