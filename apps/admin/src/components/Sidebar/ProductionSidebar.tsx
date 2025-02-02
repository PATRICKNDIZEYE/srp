import { NavLink } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FiBox, FiTruck, FiBarChart2, FiSettings } from 'react-icons/fi';

const ProductionSidebar = () => {
  const menus = [
    { title: 'Dashboard', icon: RxDashboard, link: '/production/dashboard' },
    { title: 'Production Line', icon: FiBox, link: '/production/line' },
    { title: 'Deliveries', icon: FiTruck, link: '/production/deliveries' },
    { title: 'Reports', icon: FiBarChart2, link: '/production/sales' },
    { title: 'Settings', icon: FiSettings, link: '/production/settings' },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto duration-300 ease-linear">
      <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
        <div>
          <ul className="mb-6 flex flex-col gap-1.5">
            {menus.map((menu) => (
              <li key={menu.link}>
                <NavLink
                  to={menu.link}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      isActive
                        ? 'bg-primary text-white dark:bg-meta-4'
                        : 'text-bodydark1 dark:text-bodydark2'
                    }`
                  }
                >
                  <menu.icon />
                  {menu.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default ProductionSidebar; 