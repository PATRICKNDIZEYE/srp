import React from 'react';
import { BsX, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { WorkPlan } from './WorkPlanManagement'; // You'll need to move the interface to a types file

interface WorkPlanDetailsModalProps {
  plan: WorkPlan;
  onClose: () => void;
  onApprove?: (id: number) => void;
  onDecline?: (id: number) => void;
}

const WorkPlanDetailsModal = ({ plan, onClose, onApprove, onDecline }: WorkPlanDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            Work Plan Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <BsX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* NGO Information */}
          <section>
            <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
              NGO Information
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {plan.ngoName}
            </p>
          </section>

          {/* Activity Details */}
          <section>
            <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
              Activity Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Activity Name</p>
                <p className="text-black dark:text-white">{plan.activityName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                <p className="text-black dark:text-white">{plan.area}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="text-black dark:text-white">{plan.description}</p>
              </div>
            </div>
          </section>

          {/* Timeline & Progress */}
          <section>
            <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
              Timeline & Progress
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <p className="text-black dark:text-white">
                  {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                <div className="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark mt-2">
                  <div
                    className="absolute left-0 h-full rounded-full bg-primary"
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.progress}%
                </span>
              </div>
            </div>
          </section>

          {/* Location & Budget */}
          <section>
            <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
              Location & Budget
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-black dark:text-white">
                  {plan.location.district}, {plan.location.sector}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                <p className="text-black dark:text-white">
                  {plan.budget.toLocaleString()} RWF
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        {plan.status === 'pending' && onApprove && onDecline && (
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => onDecline(plan.id)}
              className="px-6 py-2 rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <BsXCircle />
                Decline
              </span>
            </button>
            <button
              onClick={() => onApprove(plan.id)}
              className="px-6 py-2 rounded-lg bg-success text-white hover:bg-success/90 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BsCheckCircle />
                Approve
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPlanDetailsModal; 