import React from 'react';
import { useTranslation } from 'react-i18next';
import { BsDownload, BsEye, BsPencil } from 'react-icons/bs';

interface Report {
  id: number;
  workPlan: {
    id: number;
    activityName: string;
    activityDescription: string;
    targetNumbers: number;
    plannedBudget: number;
  };
  period: string;
  submissionDate: string;
  status: string;
  progressAgainstTarget: number;
  targetNumbersReached: number;
  budgetUtilization: number;
}

interface ReportsListProps {
  reports: Report[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDownload: (id: number) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ 
  reports, 
  onView, 
  onEdit, 
  onDownload 
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'text-primary bg-primary/10';
      case 'approved':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                {t('Activity')}
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                {t('Period')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                {t('Status')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                {t('Completion')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                {t('Target Reached')}
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                {t('Budget Used')}
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                {t('Actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {report.workPlan.activityName}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.workPlan.activityDescription}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p className="text-black dark:text-white">
                    {report.period}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(report.submissionDate).toLocaleDateString()}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <div className="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${report.progressAgainstTarget}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 mt-1">
                    {report.progressAgainstTarget}%
                  </span>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p className="text-black dark:text-white">
                    {report.targetNumbersReached}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('of')} {report.workPlan.targetNumbers}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p className="text-black dark:text-white">
                    {report.budgetUtilization}%
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <div className="flex items-center space-x-3.5">
                    <button 
                      onClick={() => onView(report.id)}
                      className="hover:text-primary"
                      title={t('View Report')}
                    >
                      <BsEye className="text-lg" />
                    </button>
                    <button 
                      onClick={() => onEdit(report.id)}
                      className="hover:text-success"
                      title={t('Edit Report')}
                    >
                      <BsPencil className="text-lg" />
                    </button>
                    <button 
                      onClick={() => onDownload(report.id)}
                      className="hover:text-warning"
                      title={t('Download Report')}
                    >
                      <BsDownload className="text-lg" />
                    </button>
                  </div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsList; 