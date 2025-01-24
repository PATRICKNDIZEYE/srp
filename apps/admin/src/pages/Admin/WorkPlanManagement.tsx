import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import Breadcrumb from '../../components/Breadcrumb';
import { BsCheckCircle, BsXCircle, BsEye, BsSearch } from 'react-icons/bs';
import { toast } from 'react-toastify';
import WorkPlanDetailsModal from './WorkPlanDetailsModal';
import axiosInstance from '../../utils/axiosInstance';

// Work plan data interface
interface WorkPlan {
  id: number;
  organizationName: string;
  activityName: string;
  activityDescription: string;
  areaOfIntervention: string;
  targetNumbers: number;
  status: 'active' | 'pending' | 'declined';
  progress: number;
  startDate: string;
  endDate: string;
  plannedBudget: number;
  district: string;
  sector: string;
}

const WorkPlanManagement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkPlan | null>(null);
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract ngoId from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const ngoId = queryParams.get('ngoId');

  useEffect(() => {
    const fetchWorkPlans = async () => {
      if (!ngoId) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`annual-targets/${ngoId}/ngo`);
        const apiData = response.data.map((item: any) => ({
          id: item.id,
          organizationName: item.organizationName,
          activityName: item.activityName,
          activityDescription: item.activityDescription,
          areaOfIntervention: item.areaOfIntervention,
          targetNumbers: item.targetNumbers,
          status: 'pending',
          progress: 0,
          startDate: item.startDate,
          endDate: item.endDate,
          plannedBudget: item.plannedBudget,
          district: item.district,
          sector: item.sector,
        }));
        setWorkPlans(apiData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch work plans');
        toast.error('Error fetching work plans');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkPlans();
  }, [ngoId]);

  const handleApprove = (planId: number) => {
    toast.success('Work plan approved successfully');
    // Add your approval logic here
  };

  const handleDecline = (planId: number) => {
    toast.error('Work plan declined');
    // Add your decline logic here
  };

  const handleViewDetails = (plan: WorkPlan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  // Filter plans based on search and selected filters
  const filteredPlans = workPlans.filter(plan => {
    const matchesSearch =
        (plan.organizationName && String(plan.organizationName).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (plan.activityName && String(plan.activityName).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (plan.district && String(plan.district).toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || plan.status === selectedStatus;
    const matchesArea = selectedArea === 'all' || plan.areaOfIntervention === selectedArea;

    return matchesSearch && matchesStatus && matchesArea;
  });

  // Extract unique areas from work plans
  const areas = Array.from(new Set(workPlans.map(plan => plan.areaOfIntervention)));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Work Plan Management" />

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="sm:w-72">
              <label className="relative">
                <input
                    type="text"
                    placeholder="Search work plans..."
                    className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-500">
                <BsSearch className="h-5 w-5" />
              </span>
              </label>
            </div>

            {/* Filters */}
            <select
                className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="declined">Declined</option>
            </select>

            <select
                className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="all">All Areas</option>
              {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Work Plans Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">NGO & Activity</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Location</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Timeline</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Progress</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Report</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
              </thead>
              <tbody>
              {filteredPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.organizationName}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {plan.areaOfIntervention}
                    </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {plan.district}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.sector}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(plan.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        to {new Date(plan.endDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            plan.status === 'active'
                                ? 'bg-success/10 text-success'
                                : plan.status === 'declined'
                                    ? 'bg-danger/10 text-danger'
                                    : 'bg-warning/10 text-warning'
                        }`}
                    >
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
                        <div
                            className="absolute left-0 h-full rounded-full bg-primary"
                            style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                      <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {plan.progress}%
                    </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button
                          onClick={() => navigate(`/admin/reports?annualTargetId=${plan.id}`)}
                          className="text-primary hover:underline"
                      >
                        View Report
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                            onClick={() => handleViewDetails(plan)}
                            className="hover:text-primary"
                        >
                          <BsEye className="h-5 w-5" />
                        </button>
                        {plan.status === 'pending' && (
                            <>
                              <button
                                  onClick={() => handleApprove(plan.id)}
                                  className="hover:text-success"
                              >
                                <BsCheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                  onClick={() => handleDecline(plan.id)}
                                  className="hover:text-danger"
                              >
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

        {showDetailsModal && selectedPlan && (
            <WorkPlanDetailsModal
                plan={selectedPlan}
                onClose={() => {
                  setShowDetailsModal(false);
                  setSelectedPlan(null);
                }}
                onApprove={handleApprove}
                onDecline={handleDecline}
            />
        )}
      </div>
  );
};

export default WorkPlanManagement;