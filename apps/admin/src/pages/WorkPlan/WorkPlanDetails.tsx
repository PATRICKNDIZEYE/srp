import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsArrowLeft, BsPencil, BsDownload } from 'react-icons/bs';

interface WorkPlanDetail {
  id: number;
  activityName: string;
  activityDescription: string;
  areaOfIntervention: string;
  relevantIndicators: {
    name: string;
    target: string;
    current: string;
  }[];
  targetedBeneficiaries: string[];
  targetNumbers: number;
  genderDisaggregation: {
    male: number;
    female: number;
    other: number;
  };
  location: {
    district: string;
    sector: string;
    cell: string;
  };
  plannedBudget: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
  challenges: string;
  mitigation: string;
}

const WorkPlanDetails = ( { } ) => {
  const { id } = useParams();
  const { t } = useTranslation();
  // const [currentNgo, setCurrentNgo] = useState()
  // Example data - replace with API call
  const workPlan: WorkPlanDetail = {
    id: 1,
    activityName: 'Community Healing Workshop Series',
    activityDescription: 'A series of workshops focused on community healing and reconciliation...',
    areaOfIntervention: 'Community Healing',
    relevantIndicators: [
      {
        name: 'Identified issues affecting community healing',
        target: '15 issues',
        current: '8 issues'
      },
      {
        name: 'Percentage of citizens reporting improved readiness',
        target: '70%',
        current: '45%'
      }
    ],
    targetedBeneficiaries: ['Youth', 'Women', 'Ex-combatants'],
    targetNumbers: 150,
    genderDisaggregation: {
      male: 70,
      female: 75,
      other: 5
    },
    location: {
      district: 'Gasabo',
      sector: 'Kimihurura',
      cell: 'Cell A'
    },
    plannedBudget: 5000000,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    status: 'active',
    progress: 35,
    challenges: 'Limited community engagement, resource constraints',
    mitigation: 'Community outreach programs, partnership development'
  };

  {/*{ Work plan for a certain NGO }*/}


  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/work-plans"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-primary dark:text-white"
          >
            <BsArrowLeft />
            {t('Back to Work Plans')}
          </Link>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {workPlan.activityName}
      </h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/work-plans/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
          >
            <BsPencil />
            {t('Edit')}
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
          >
            <BsDownload />
            {t('Export')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Basic Information')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Area of Intervention')}
              </label>
              <p className="text-black dark:text-white">{workPlan.areaOfIntervention}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Description')}
              </label>
              <p className="text-black dark:text-white">{workPlan.activityDescription}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Status')}
              </label>
              <div className="flex items-center gap-3">
                <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  workPlan.status === 'active' ? 'bg-success/10 text-success' :
                  workPlan.status === 'completed' ? 'bg-primary/10 text-primary' :
                  'bg-warning/10 text-warning'
                }`}>
                  {workPlan.status}
                </span>
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-stroke dark:bg-strokedark">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${workPlan.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{workPlan.progress}%</span>
              </div>
            </div>
          </div>
        </div>



        {/* Indicators and Targets */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Indicators and Progress')}
          </h3>
          <div className="space-y-4">
            {workPlan.relevantIndicators.map((indicator, index) => (
              <div key={index}>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {indicator.name}
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {t('Target')}: {indicator.target}
                  </span>
                  <span className="text-sm text-primary">
                    {t('Current')}: {indicator.current}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location and Timeline */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Location and Timeline')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('District')}
              </label>
              <p className="text-black dark:text-white">{workPlan.location.district}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Sector')}
              </label>
              <p className="text-black dark:text-white">{workPlan.location.sector}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Cell')}
              </label>
              <p className="text-black dark:text-white">{workPlan.location.cell}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Duration')}
              </label>
              <p className="text-black dark:text-white">
                {new Date(workPlan.startDate).toLocaleDateString()} - {new Date(workPlan.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Beneficiaries and Budget */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Beneficiaries and Budget')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Target Groups')}
              </label>
              <div className="flex flex-wrap gap-2">
                {workPlan.targetedBeneficiaries.map((group, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-meta-4 dark:text-gray-300"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Gender Distribution')}
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('Male')}</p>
                  <p className="text-black dark:text-white">{workPlan.genderDisaggregation.male}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('Female')}</p>
                  <p className="text-black dark:text-white">{workPlan.genderDisaggregation.female}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('Other')}</p>
                  <p className="text-black dark:text-white">{workPlan.genderDisaggregation.other}</p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Planned Budget')}
              </label>
              <p className="text-black dark:text-white">
                {new Intl.NumberFormat('rw-RW', { style: 'currency', currency: 'RWF' }).format(workPlan.plannedBudget)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};






export default WorkPlanDetails; 