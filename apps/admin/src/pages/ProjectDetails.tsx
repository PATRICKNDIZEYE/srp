import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsCalendar, BsPeople, BsCurrencyDollar, BsGeoAlt, BsClockHistory } from 'react-icons/bs';
import ChartOne from '../components/Charts/ChartOne';
import ChartTwo from '../components/Charts/ChartTwo';

const ProjectDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample project data - replace with actual data fetching
  const project = {
    id: 1,
    name: 'Community Health Initiative',
    description: 'Improving healthcare access in rural areas of Gasabo district through mobile clinics and health education programs.',
    status: 'active',
    progress: 75,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 5000000,
    spent: 3750000,
    location: 'Gasabo District',
    beneficiaries: 1200,
    volunteers: 25,
    objectives: [
      'Establish 5 mobile health clinics',
      'Train 50 community health workers',
      'Conduct monthly health education sessions',
      'Provide basic medical supplies to 1000 households'
    ],
    milestones: [
      {
        title: 'Project Launch',
        date: '2024-01-01',
        status: 'completed'
      },
      {
        title: 'Mobile Clinics Setup',
        date: '2024-03-15',
        status: 'in-progress'
      },
      {
        title: 'Community Training',
        date: '2024-06-30',
        status: 'pending'
      }
    ],
    team: [
      {
        name: 'John Doe',
        role: 'Project Manager',
        image: '/team1.jpg'
      },
      {
        name: 'Jane Smith',
        role: 'Health Coordinator',
        image: '/team2.jpg'
      }
    ]
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              {project.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{project.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
              ${project.status === 'active' 
                ? 'bg-success/10 text-success' 
                : 'bg-warning/10 text-warning'
              }`}>
              {project.status}
            </span>
            <Link
              to={`/projects/${id}/edit`}
              className="inline-flex items-center justify-center rounded-lg border border-primary px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:text-white"
            >
              {t('Edit Project')}
            </Link>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <BsCurrencyDollar className="text-2xl text-primary" />
            <div className="ml-4">
              <h4 className="text-xl font-bold text-black dark:text-white">
                {new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' })
                  .format(project.budget)}
              </h4>
              <p className="text-sm text-gray-500">{t('Total Budget')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <BsPeople className="text-2xl text-success" />
            <div className="ml-4">
              <h4 className="text-xl font-bold text-black dark:text-white">
                {project.beneficiaries}
              </h4>
              <p className="text-sm text-gray-500">{t('Beneficiaries')}</p>
            </div>
          </div>
        </div>

        {/* Add more stats */}
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-stroke dark:border-strokedark">
        <div className="flex flex-wrap gap-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            {t('Overview')}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'milestones'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('milestones')}
          >
            {t('Milestones')}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'team'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('team')}
          >
            {t('Team')}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'reports'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('reports')}
          >
            {t('Reports')}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                {t('Project Progress')}
              </h3>
              <div className="h-80">
                <ChartOne />
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                {t('Budget Utilization')}
              </h3>
              <div className="h-80">
                <ChartTwo />
              </div>
            </div>

            {/* Objectives */}
            <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                {t('Objectives')}
              </h3>
              <ul className="space-y-3">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Add other tab contents */}
      </div>
    </div>
  );
};

export default ProjectDetails; 