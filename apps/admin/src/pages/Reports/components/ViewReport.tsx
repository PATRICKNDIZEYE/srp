import React from 'react';
import { useTranslation } from 'react-i18next';
import { BsX, BsDownload, BsPencil } from 'react-icons/bs';

interface AnnualTarget {
  id: number;
  organizationName: string;
  activityName: string;
  activityDescription: string;
  areaOfIntervention: string;
  relevantIndicators: string;
  targetForSelectedIndicator: string;
  targetedBeneficiaries: string;
  targetNumbers: number;
  genderDisaggregation: string;
  district: string;
  sector: string;
  cell: string;
  plannedBudget: number;
  startDate: string;
  endDate: string;
}

interface Report {
  id: number;
  relevantIndicators: string[];
  progressAgainstTarget: number;
  targetNumbersReached: number;
  genderDisaggregation: string;
  interventionArea: string;
  budgetUsed: number;
  progressUpdate: string;
  challengesFaced: string;
  successStories: string;
  attachments: string[];
  biannualType: string;
  annualTargetId: number;
  status: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
  annualTarget: AnnualTarget;
}

interface ViewReportProps {
  report: Report;
  onClose: () => void;
  onEdit?: (id: number) => void;
}

const ViewReport: React.FC<ViewReportProps> = ({ report, onClose, onEdit }) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    console.log('Downloading report:', report.id);
  };

  return (
      <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Report Details')}
          </h3>
          <div className="flex items-center gap-3">
            <button
                onClick={handleDownload}
                className="hover:text-primary"
                title={t('Download Report')}
            >
              <BsDownload className="text-xl" />
            </button>
            {onEdit && (
                <button
                    onClick={() => onEdit(report.id)}
                    className="hover:text-success"
                    title={t('Edit Report')}
                >
                  <BsPencil className="text-xl" />
                </button>
            )}
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
              <BsX className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white">
              {t('Work Plan Information')}
            </h4>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Activity')}</p>
              <p className="font-medium text-black dark:text-white">
                {report.annualTarget.activityName || t('No Activity Name')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Description')}</p>
              <p className="font-medium text-black dark:text-white">
                {report.annualTarget.activityDescription || t('No Description')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white">
              {t('Progress Overview')}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('Target Progress')}</p>
                <div className="mt-1">
                  <div className="relative h-2 w-full rounded-full bg-stroke dark:bg-strokedark">
                    <div
                        className="absolute left-0 h-full rounded-full bg-primary"
                        style={{ width: `${report.progressAgainstTarget}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm font-medium">{report.progressAgainstTarget}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('Budget Utilization')}</p>
                <div className="mt-1">
                  <div className="relative h-2 w-full rounded-full bg-stroke dark:bg-strokedark">
                    <div
                        className="absolute left-0 h-full rounded-full bg-success"
                        style={{ width: `${report.budgetUsed}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm font-medium">{report.budgetUsed}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white">
              {t('Beneficiaries')}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(report.genderDisaggregation).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-gray-50 p-3 dark:bg-meta-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t(key)}</p>
                    <p className="text-lg font-semibold text-black dark:text-white">{value}</p>
                  </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-black dark:text-white">
              {t('Attachments')}
            </h4>
            <div className="space-y-2">
              {report.attachments.map((file, index) => (
                  <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-stroke p-3 dark:border-strokedark"
                  >
                    <span className="text-sm">{file}</span>
                    <button className="hover:text-primary">
                      <BsDownload />
                    </button>
                  </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-black dark:text-white">
            {t('Additional Information')}
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Progress Update')}</p>
              <p className="mt-1">{report.progressUpdate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Challenges Faced')}</p>
              <p className="mt-1">{report.challengesFaced}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('Success Stories')}</p>
              <p className="mt-1">{report.successStories}</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ViewReport;