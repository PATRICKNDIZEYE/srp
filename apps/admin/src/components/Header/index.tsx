import { Link } from 'react-router-dom';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from './DarkModeSwitcher';
import { BsChat } from 'react-icons/bs';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  unreadMessages: number;
}

const Header = ({ sidebarOpen, setSidebarOpen, unreadMessages }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-boxdark border-b dark:border-gray-700">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
       
       
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Menu Button */}
          <button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Other header content */}
        </div>
        <div className="flex items-center gap-3 2xsm:gap-7">
          <DarkModeSwitcher />
          <DropdownUser />
          {unreadMessages > 0 && (
            <Link
              to="/admin/chat"
              className="relative inline-flex items-center p-2 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-full"
            >
              <BsChat className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                {unreadMessages}
              </span>
            </Link>
          )}
        </div>

        {/* Right side content */}
       
      </div>
    </header>
  );
};

export default Header;
