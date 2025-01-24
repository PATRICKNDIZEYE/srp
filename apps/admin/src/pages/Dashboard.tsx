import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ChartOne from '../components/Charts/ChartOne';
import ChartTwo from '../components/Charts/ChartTwo';
import ChartThree from '../components/Charts/ChartThree';
import MapOne from '../components/Maps/MapOne';
import CardDataStats from '../components/CardDataStats';
import { BsArrowUp, BsCalendar, BsPeople, BsCurrencyDollar, BsGeoAlt } from 'react-icons/bs';

const Dashboard = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Sample data for NGO distribution
  const ngoDistribution = {
    local: 15,
    international: 10,
    countries: ['Rwanda', 'Kenya', 'Uganda', 'USA', 'UK', 'France', 'Germany']
  };

  // Sample recent projects
  const recentProjects = [
    {
      id: 1,
      name: 'Community Health Initiative',
      progress: 75,
      status: 'active',
      image: '/health-project.jpg',
      region: 'Gasabo'
    },
    {
      id: 2,
      name: 'Youth Education Program',
      progress: 45,
      status: 'active',
      image: '/education-project.jpg',
      region: 'Nyarugenge'
    },
    {
      id: 3,
      name: 'Agricultural Support',
      progress: 30,
      status: 'on-hold',
      image: '/agriculture-project.jpg',
      region: 'Kicukiro'
    }
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {t('Dashboard Overview')}
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-lg border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
          >
            <option value="weekly">{t('Weekly')}</option>
            <option value="monthly">{t('Monthly')}</option>
            <option value="yearly">{t('Yearly')}</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title={t('Active Projects')}
          total="25"
          rate="12.5%"
          levelUp
          levelDown={false}
          children={<BsCalendar className="fill-primary dark:fill-white" />}
        />

        <CardDataStats
          title={t('Total Budget')}
          total="RWF 15.2M"
          rate="8.2%"
          levelUp
          levelDown={false}
          children={<BsCurrencyDollar className="fill-primary dark:fill-white" />}
        />

        <CardDataStats
          title={t('Active Volunteers')}
          total="250"
          rate="15.8%"
          levelUp
          levelDown={false}
          children={<BsPeople className="fill-primary dark:fill-white" />}
        />

        <CardDataStats
          title={t('Communities Reached')}
          total="32"
          rate="6.8%"
          levelUp
          levelDown={false}
          children={<BsGeoAlt className="fill-primary dark:fill-white" />}
        />
      </div>

      {/* NGO Distribution Map */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5">
        <div className="col-span-1 md:col-span-2">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {t('Global NGO Distribution')}
            </h3>
            <div className="h-90">
              <MapOne />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {ngoDistribution.local} Local NGOs
                </span>
                <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                  {ngoDistribution.international} International NGOs
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {t('Active in')} {ngoDistribution.countries.length} {t('countries')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Project Progress Overview')}
          </h3>
          <div className="mb-2">
            <div id="chartOne" className="mx-auto flex justify-center">
              <ChartOne />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Budget Allocation')}
          </h3>
          <div className="mb-2">
            <div id="chartTwo" className="mx-auto flex justify-center">
              <ChartTwo />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Impact Metrics')}
          </h3>
          <div className="mb-2">
            <div id="chartThree" className="mx-auto flex justify-center">
              <ChartThree />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Regional Distribution')}
          </h3>
          <div className="mb-2">
            <div id="chartThree" className="mx-auto flex justify-center">
              <ChartThree />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="mt-6">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              {t('Recent Projects')}
            </h4>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80"
            >
              {t('View All')}
              <BsArrowUp className="rotate-45" />
            </Link>
          </div>

          {/* Project cards grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
              >
                <div className="relative mb-3">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-48 w-full rounded-sm object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/project-fallback.jpg';
                    }}
                  />
                  <span
                    className={`absolute top-4 right-4 rounded-full px-3 py-1 text-sm font-medium ${
                      project.status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h5 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  {project.name}
                </h5>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{project.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">
                      {project.progress}%
                    </span>
                    <div className="h-2 w-20 rounded-full bg-stroke dark:bg-strokedark">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;