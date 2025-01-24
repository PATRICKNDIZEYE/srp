import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NGO, AnnualTarget } from '../../types';
import { ngoService } from '../../services/ngoService';
import Breadcrumb from '../../components/Breadcrumb';
import { BsCheckCircle, BsXCircle, BsEye, BsSearch } from 'react-icons/bs';
import WorkPlanDetailsModal from './WorkPlanDetailsModal';
import { toast } from 'react-toastify';

const WorkPlans = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workPlans, setWorkPlans] = useState<{
    id: number;
    ngoName: string;
    activityName: string;
    area: string;
    target: number;
    status: 'active' | 'pending' | 'completed';
    progress: number;
    startDate: string;
    endDate: string;
  }[]>([
    {
      id: 1,
      ngoName: "Hope Foundation Rwanda",
      activityName: "Community Healing Workshop Series",
      area: "Community Healing",
      target: 150,
      status: 'active',
      progress: 35,
      startDate: "2024-02-01",
      endDate: "2024-06-30"
    },
    {
      id: 2,
      ngoName: "Youth Empowerment NGO",
      activityName: "Youth Reintegration Program",
      area: "Social Reintegration",
      target: 75,
      status: 'pending',
      progress: 0,
      startDate: "2024-04-01",
      endDate: "2024-09-30"
    }
  ]);

  const filteredWorkPlans = workPlans.filter(plan => {
    const matchesSearch = 
      plan.ngoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = areaFilter === 'all' || plan.area === areaFilter;
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    
    return matchesSearch && matchesArea && matchesStatus;
  });

  const uniqueAreas = Array.from(new Set(workPlans.map(plan => plan.area)));

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {t('Work Plans')}
        </h2>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-1/3">
          <label className="relative">
            <input
              type="text"
              placeholder={t('Search work plans...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span className="absolute left-3 top-2.5 text-gray-500">
              <BsSearch className="h-5 w-5" />
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          >
            <option value="all">{t('All Areas')}</option>
            {uniqueAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
          >
            <option value="all">{t('All Status')}</option>
            <option value="active">{t('Active')}</option>
            <option value="pending">{t('Pending')}</option>
            <option value="completed">{t('Completed')}</option>
          </select>
        </div>
      </div>

      {/* Work Plans Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                  {t('Activity Name')}
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  {t('Area')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Target')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Status')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Progress')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {plan.activityName}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.ngoName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {plan.area}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{plan.target}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        plan.status === 'active'
                          ? 'bg-success/10 text-success'
                          : plan.status === 'pending'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t(plan.status.charAt(0).toUpperCase() + plan.status.slice(1))}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
                      <div
                        className={`absolute left-0 h-full rounded-full ${
                          plan.status === 'completed'
                            ? 'bg-success'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.progress}%
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <BsEye className="h-5 w-5" />
                      </button>
                      {plan.status === 'pending' && (
                        <>
                          <button className="hover:text-success">
                            <BsCheckCircle className="h-5 w-5" />
                          </button>
                          <button className="hover:text-danger">
                            <BsXCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('Showing')} 1 {t('to')} {filteredWorkPlans.length} {t('of')} {workPlans.length} {t('entries')}
        </p>
        <div className="flex items-center space-x-2">
          <button className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4">
            {t('Previous')}
          </button>
          <button className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4">
            {t('Next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkPlans; 