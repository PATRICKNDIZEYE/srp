import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const ProjectForm = () => {
  return (
    <>
      <Breadcrumb pageName="New Project" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6.5">
          <form action="#">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            {/* Add more form fields */}
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectForm; 