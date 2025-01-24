import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const About = () => {
  return (
    <>
      <Breadcrumb pageName="About Us" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Mission & Vision Section */}
        <div className="rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Our Mission
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Minubumwe is dedicated to fostering unity, healing, and sustainable development 
            in Rwandan communities through innovative programs and collaborative partnerships.
          </p>
          
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Our Vision
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            A harmonious Rwanda where communities thrive through mutual understanding, 
            reconciliation, and collective progress.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Communities Served
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Volunteers
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Ongoing Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lives Impacted
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="col-span-1 md:col-span-2 rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-boxdark-2">
              <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Unity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Promoting social cohesion and collective progress in our communities.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-boxdark-2">
              <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Integrity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Maintaining transparency and ethical standards in all our operations.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50 dark:bg-boxdark-2">
              <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Finding creative solutions to community challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="col-span-1 md:col-span-2 rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team Member Card */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img 
                  src="/team-member1.jpg" 
                  alt="Team Member"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                John Doe
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Executive Director
              </p>
            </div>
            {/* Add more team member cards */}
          </div>
        </div>

        {/* Partners Section */}
        <div className="col-span-1 md:col-span-2 rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
            Our Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Partner Logo */}
            <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-boxdark-2 rounded-lg">
              <img 
                src="/partner1-logo.png" 
                alt="Partner"
                className="max-h-16"
              />
            </div>
            {/* Add more partner logos */}
          </div>
        </div>
      </div>
    </>
  );
};

export default About; 