import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsPlus, BsFilter, BsSearch, BsEye, BsPencil } from 'react-icons/bs';
import EditWorkPlan from './EditWorkPlan';
import Buttons from "../UiElements/Buttons.tsx";
import {GiTick} from "react-icons/gi";
import {CgCross, CgDanger} from "react-icons/cg";
import {BiCheck} from "react-icons/bi";
import {MdCancel} from "react-icons/md";


interface WorkPlan {
  id: number;
  activityName: string;
  areaOfIntervention: string;
  targetNumbers: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

const WorkPlanList = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editWorkPlan, setEditWorkPlan] = useState<number | null>(null);
  
  // Initialize workPlans with example data
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([
    {
      id: 1,
      activityName: 'Community Healing Workshop Series',
      areaOfIntervention: 'Community Healing',
      targetNumbers: 150,
      startDate: '2024-03-01',
      endDate: '2024-06-30',
      status: 'active',
      progress: 35
    },
    {
      id: 2,
      activityName: 'Youth Reintegration Program',
      areaOfIntervention: 'Social Reintegration',
      targetNumbers: 75,
      startDate: '2024-04-01',
      endDate: '2024-09-30',
      status: 'pending',
      progress: 0
    }
  ]);

  // Filter work plans based on search and area
  const filteredWorkPlans = workPlans.filter(plan => {
    const matchesSearch = plan.activityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = filterArea === 'all' || plan.areaOfIntervention === filterArea;
    return matchesSearch && matchesArea;
  });

  // Pagination
  const totalPages = Math.ceil(filteredWorkPlans.length / itemsPerPage);
  const paginatedWorkPlans = filteredWorkPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'completed':
        return 'text-primary bg-primary/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const handleEdit = (id: number) => {
    setEditWorkPlan(id);
  };

  const handleClose = () => {
    setEditWorkPlan(null);
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkPlans(workPlans.map(wp => 
        wp.id === id ? { ...wp, ...data } : wp
      ));
      setEditWorkPlan(null);
      // Assuming toast is imported from a library like 'react-hot-toast'
      // toast.success(t('Work Plan updated successfully'));
    } catch (error) {
      // Assuming toast is imported from a library like 'react-hot-toast'
      // toast.error(t('Failed to update Work Plan'));
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/*<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">*/}
      {/*  <h2 className="text-title-md2 font-semibold text-black dark:text-white">*/}
      {/*    {t('Work Plans')}*/}
      {/*  </h2>*/}
      {/*  <Link*/}
      {/*    to="/work-plans/create"*/}
      {/*    className="inline-flex items-center gap-2.5 rounded-md bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"*/}
      {/*  >*/}
      {/*    <BsPlus className="h-6 w-6" />*/}
      {/*    {t('Create Work Plan')}*/}
      {/*  </Link>*/}
      {/*</div>*/}

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* Filter and Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder={t('Search work plans...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary"
              />
              <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            </div>
            
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-8 outline-none focus:border-primary"
            >
              <option value="all">{t('All Areas')}</option>
              <option value="Community Healing">{t('Community Healing')}</option>
              <option value="Social Reintegration">{t('Social Reintegration')}</option>
              <option value="Social Cohesion">{t('Social Cohesion')}</option>
            </select>
          </div>
        </div>

        {/* Work Plans Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  {t('Activity Name')}
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  {t('Area')}
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  {t('Target')}
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  {t('Status')}
                </th>
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  {t('Progress')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedWorkPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {plan.activityName}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {`${new Date(plan.startDate).toLocaleDateString()} - ${new Date(plan.endDate).toLocaleDateString()}`}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <span className="text-black dark:text-white">
                      {plan.areaOfIntervention}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <span className="text-black dark:text-white">
                      {plan.targetNumbers}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <span className={`inline-block rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <div className="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 mt-1">
                      {plan.progress}%
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <div className="flex items-center space-x-3.5">

                      <Link className="text-green-600  h-5 w-5"
                            to ={`/approve-plan/${plan.id}`}>
                        <BiCheck />
                      </Link>
                      <Link className="h-5  w-5"
                            to ={`/reject-plan/${plan.id}`}>
                        <MdCancel />
                      </Link>

                      <Link
                        to={`/work-plans/${plan.id}`}
                        className="hover:text-primary"
                      >
                        <BsEye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/work-plans/${plan.id}/edit`}
                        className="hover:text-primary"
                      >
                        <BsPencil className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Pagination */}
        <div className="flex items-center justify-between border-t border-stroke py-4 dark:border-strokedark">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('Showing')} {(currentPage - 1) * itemsPerPage + 1} {t('to')} {Math.min(currentPage * itemsPerPage, filteredWorkPlans.length)} {t('of')} {filteredWorkPlans.length} {t('entries')}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:text-gray-400 dark:hover:bg-meta-4"
            >
              {t('Previous')}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  currentPage === index + 1
                    ? 'bg-primary text-white'
                    : 'border border-stroke text-gray-600 hover:bg-gray-50 dark:border-strokedark dark:text-gray-400 dark:hover:bg-meta-4'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:text-gray-400 dark:hover:bg-meta-4"
            >
              {t('Next')}
            </button>
          </div>
        </div>
      </div>

      {editWorkPlan && (
        <EditWorkPlan
          workPlanId={editWorkPlan}
          onClose={handleClose}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default WorkPlanList; 