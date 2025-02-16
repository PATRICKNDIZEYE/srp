import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Images/Logo';
import DarkModeSwitcher from './DarkModeSwitcher';
import { useUserContext } from '../../context/UserContext';
import DropdownUser from './DropdownUser';

const DashboardHeader = () => {
  const { user } = useUserContext();

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
          </ul>

          <DropdownUser user={user} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 