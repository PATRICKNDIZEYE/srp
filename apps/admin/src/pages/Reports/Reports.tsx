import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ReportsList from './components/ReportsList';
import CreateReport from './components/CreateReport';
import ReportStats from './components/ReportStats';
import ReportCharts from './components/ReportCharts';
import ViewReport from './components/ViewReport';
import EditReport from './components/EditReport';
import { BsPlus } from 'react-icons/bs';

// Dummy data
const DUMMY_REPORTS = [
  {
    id: 1,
    workPlan: {
      id: 1,
      activityName: 'Community Health Program',
      activityDescription: 'Healthcare services in rural areas',
      targetNumbers: 1000,
      plannedBudget: 5000000,
    },
    period: 'First Half 2024',
    submissionDate: '2024-06-30',
    status: 'Submitted',
    progressAgainstTarget: 85,
    targetNumbersReached: 850,
    genderDisaggregation: {
      male: 400,
      female: 430,
      other: 20,
    },
    budgetUtilization: 92,
    progressUpdate: 'Successfully conducted health awareness campaigns in 5 sectors',
    challengesFaced: 'Limited transportation in remote areas',
    successStories: 'Increased vaccination rates by 40% in target communities',
    attachments: [
      { name: 'Progress_Report.pdf', url: '#', size: '2.5MB' },
      { name: 'Photos.zip', url: '#', size: '15MB' },
    ],
  },
  {
    id: 2,
    workPlan: {
      id: 2,
      activityName: 'Youth Education Initiative',
      activityDescription: 'Skills development for youth',
      targetNumbers: 800,
      plannedBudget: 3000000,
    },
    period: 'Second Half 2023',
    submissionDate: '2023-12-31',
    status: 'Approved',
    progressAgainstTarget: 95,
    targetNumbersReached: 760,
    genderDisaggregation: {
      male: 380,
      female: 365,
      other: 15,
    },
    budgetUtilization: 88,
    progressUpdate: 'Completed training programs in 3 districts',
    challengesFaced: 'Scheduling conflicts with school hours',
    successStories: '85% of participants found employment',
    attachments: [
      { name: 'Training_Report.pdf', url: '#', size: '1.8MB' },
    ],
  },
  {
    id: 3,
    workPlan: {
      id: 3,
      activityName: 'Agricultural Support',
      activityDescription: 'Farmer training and resource distribution',
      targetNumbers: 500,
      plannedBudget: 2500000,
    },
    period: 'First Half 2023',
    submissionDate: '2023-06-30',
    status: 'Approved',
    progressAgainstTarget: 90,
    targetNumbersReached: 450,
    genderDisaggregation: {
      male: 240,
      female: 210,
      other: 0,
    },
    budgetUtilization: 85,
    progressUpdate: 'Distributed seeds and tools to 450 farmers',
    challengesFaced: 'Delayed delivery of farming equipment',
    successStories: 'Average crop yield increased by 30%',
    attachments: [
      { name: 'Distribution_List.pdf', url: '#', size: '1.2MB' },
      { name: 'Impact_Photos.zip', url: '#', size: '8MB' },
    ],
  },
];

const Reports = () => {
  const { t } = useTranslation();
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [viewReport, setViewReport] = useState<number | null>(null);
  const [editReport, setEditReport] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState(DUMMY_REPORTS);

  // Calculate statistics from dummy data
  const stats = {
    totalReports: reports.length,
    submittedThisYear: reports.filter(r => new Date(r.submissionDate).getFullYear() === 2024).length,
    pendingReports: reports.filter(r => r.status === 'Pending').length,
    completionRate: Math.round(
      reports.reduce((acc, r) => acc + r.progressAgainstTarget, 0) / reports.length
    ),
  };

  // Simulate API calls with dummy data
  const handleCreateReport = async (reportData: any) => {
    try {
      // Simulate API delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReport = {
        id: reports.length + 1,
        ...reportData,
        submissionDate: new Date().toISOString(),
        status: 'Submitted',
      };

      setReports([newReport, ...reports]);
      setShowCreateReport(false);
      toast.success(t('Report created successfully'));
    } catch (error) {
      toast.error(t('Failed to create report'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async (reportId: number, reportData: any) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setReports(reports.map(report =>
        report.id === reportId ? { ...report, ...reportData } : report
      ));
      setEditReport(null);
      toast.success(t('Report updated successfully'));
    } catch (error) {
      toast.error(t('Failed to update report'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('Report downloaded successfully'));
    } catch (error) {
      toast.error(t('Failed to download report'));
    }
  };

  const handleView = (reportId: number) => {
    setViewReport(reportId);
    setEditReport(null);
    setShowCreateReport(false);
  };

  const handleEdit = (reportId: number) => {
    setEditReport(reportId);
    setViewReport(null);
    setShowCreateReport(false);
  };

  const handleClose = () => {
    setViewReport(null);
    setEditReport(null);
    setShowCreateReport(false);
  };

  const filteredReports = reports.filter(report => {
    if (selectedPeriod === 'all') return true;
    return report.period.toLowerCase().includes(selectedPeriod);
  });

  const handleCreateClick = () => {
    // Only show create modal if no other modal is open
    if (!viewReport && !editReport) {
      setShowCreateReport(true);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {t('Biannual Reports')}
        </h2>
        {/*<div className="flex flex-wrap items-center gap-3">*/}
        {/*  <select*/}
        {/*    value={selectedPeriod}*/}
        {/*    onChange={(e) => setSelectedPeriod(e.target.value)}*/}
        {/*    className="rounded-lg border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"*/}
        {/*  >*/}
        {/*    <option value="all">{t('All Periods')}</option>*/}
        {/*    <option value="first_half">{t('First Half')}</option>*/}
        {/*    <option value="second_half">{t('Second Half')}</option>*/}
        {/*  </select>*/}
        {/*  <button*/}
        {/*    onClick={handleCreateClick}*/}
        {/*    disabled={viewReport || editReport}*/}
        {/*    className="inline-flex items-center gap-2.5 rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"*/}
        {/*  >*/}
        {/*    <BsPlus className="text-xl" />*/}
        {/*    {t('Create Report')}*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>

      {/* Statistics Cards */}
      {/*<ReportStats stats={stats} />*/}

      {/* Charts Section */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <ReportCharts reports={reports} />
      </div>

      {/* Reports List/Create/View/Edit */}
      {loading ? (
        <div className="mt-4 flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : viewReport ? (
        <ViewReport
          reportId={viewReport}
          onClose={handleClose}
          onEdit={handleEdit}
          onDownload={handleDownload}
        />
      ) : editReport ? (
        <EditReport
          reportId={editReport}
          onClose={handleClose}
          onUpdate={handleUpdateReport}
        />
      ) : showCreateReport ? (
        <CreateReport
          onClose={handleClose}
          onCreate={handleCreateReport}
        />
      ) : (
        <ReportsList
          reports={filteredReports}
          onView={handleView}
          onEdit={handleEdit}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default Reports;