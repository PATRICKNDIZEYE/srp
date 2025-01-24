import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsDownload, BsFilter, BsPrinter } from 'react-icons/bs';
import ChartOne from '../components/Charts/ChartOne';
import ChartTwo from '../components/Charts/ChartTwo';
import ChartThree from '../components/Charts/ChartThree';

const Reports = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('monthly');
  const [reportType, setReportType] = useState('projects');

  const reportsList = [
    {
      id: 1,
      name: 'Monthly Project Status Report',
      type: 'Project',
      date: '2024-03-01',
      status: 'Generated',
    },
    {
      id: 2,
      name: 'Q1 Financial Summary',
      type: 'Financial',
      date: '2024-03-15',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'Community Impact Assessment',
      type: 'Impact',
      date: '2024-02-28',
      status: 'Generated',
    },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {t('Reports & Analytics')}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 dark:border-strokedark dark:bg-boxdark"
          >
            <option value="weekly">{t('Weekly')}</option>
            <option value="monthly">{t('Monthly')}</option>
            <option value="yearly">{t('Yearly')}</option>
          </select>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 dark:border-strokedark dark:bg-boxdark"
          >
            <option value="projects">{t('Projects')}</option>
            <option value="financial">{t('Financial')}</option>
            <option value="impact">{t('Impact')}</option>
          </select>

          <button className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark">
            <BsDownload />
            {t('Export')}
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark">
            <BsPrinter />
            {t('Print')}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-xl font-bold text-black dark:text-white">25</h4>
          <p className="text-sm text-gray-500">{t('Active Projects')}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-success">+12.5%</span>
            <span className="text-sm text-gray-500">{t('vs last period')}</span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-xl font-bold text-black dark:text-white">RWF 15.2M</h4>
          <p className="text-sm text-gray-500">{t('Total Budget')}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-success">+8.3%</span>
            <span className="text-sm text-gray-500">{t('vs last period')}</span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-xl font-bold text-black dark:text-white">1,250</h4>
          <p className="text-sm text-gray-500">{t('Beneficiaries')}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-success">+15.2%</span>
            <span className="text-sm text-gray-500">{t('vs last period')}</span>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-xl font-bold text-black dark:text-white">32</h4>
          <p className="text-sm text-gray-500">{t('Communities')}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-success">+6.8%</span>
            <span className="text-sm text-gray-500">{t('vs last period')}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Project Progress */}
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Project Progress')}
          </h3>
          <div className="h-80">
            <ChartOne />
          </div>
        </div>

        {/* Regional Impact */}
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Regional Impact')}
          </h3>
          <div className="h-80">
            <ChartTwo />
          </div>
        </div>

        {/* Budget Utilization */}
        <div className="rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Budget Utilization')}
          </h3>
          <div className="h-80">
            <ChartThree />
          </div>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="mt-6 rounded-sm border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Detailed Reports')}
          </h3>
          <div className="flex items-center gap-2">
            <BsFilter className="text-lg" />
            <input
              type="text"
              placeholder={t('Search reports...')}
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Report Name')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Type')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Date')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Status')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {reportsList.map((report) => (
                <tr key={report.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{report.name}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className="text-sm">{report.type}</span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className="text-sm">{report.date}</span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium
                      ${report.status === 'Generated' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-warning/10 text-warning'
                      }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <BsDownload className="text-lg" />
                      </button>
                      <button className="hover:text-primary">
                        <BsPrinter className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default Reports;