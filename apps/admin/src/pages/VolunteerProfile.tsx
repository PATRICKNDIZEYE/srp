import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const VolunteerProfile = () => {
  const { id } = useParams();

  return (
    <>
      <Breadcrumb pageName="Volunteer Profile" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {/* Profile Card */}
        <div className="flex flex-col gap-4">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-35 md:h-65">
              <img
                src="/cover-01.png"
                alt="profile cover"
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              />
            </div>
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="relative z-30 mx-auto -mt-22 h-30 w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:-mt-24">
                <div className="relative rounded-full">
                  <img src="/volunteer-avatar.png" alt="profile" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  John Doe
                </h3>
                <p className="font-medium">Active Volunteer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="flex flex-col gap-4 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Volunteer Information
              </h3>
            </div>
            <div className="p-6.5">
              {/* Add volunteer details */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerProfile; 