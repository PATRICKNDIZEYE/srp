import React from 'react';
import { useTranslation } from 'react-i18next';
import { BsFileText, BsCheckCircle, BsClock, BsGraphUp } from 'react-icons/bs';

interface StatsProps {
  stats: {
    totalReports: number;
    submittedThisYear: number;
    pendingReports: number;
    completionRate: number;
  };
}

const ReportStats: React.FC<StatsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: BsFileText,
      color: 'primary',
    },
    {
      title: 'Submitted This Year',
      value: stats.submittedThisYear,
      icon: BsCheckCircle,
      color: 'success',
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports,
      icon: BsClock,
      color: 'warning',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: BsGraphUp,
      color: 'info',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t(card.title)}
              </span>
              <h4 className="mt-1 text-2xl font-bold text-black dark:text-white">
                {card.value}
              </h4>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${card.color}/10`}>
              <card.icon className={`text-2xl text-${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportStats; 