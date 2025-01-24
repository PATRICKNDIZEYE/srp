import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Finance = () => {
  return (
    <>
      <Breadcrumb pageName="Financial Overview" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Summary Cards */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            {/* Add icon */}
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                Total Budget
              </h4>
              <span className="text-sm font-medium">$240,000</span>
            </div>
          </div>
        </div>

        {/* Add more financial summary cards */}
      </div>

      {/* Financial Charts and Tables */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Add charts and detailed financial information */}
      </div>
    </>
  );
};

export default Finance; 