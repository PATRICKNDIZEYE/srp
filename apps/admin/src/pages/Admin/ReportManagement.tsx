import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Breadcrumb from '../../components/Breadcrumb';
import { BsCheckCircle, BsXCircle, BsEye, BsDownload, BsFileEarmarkPdf } from 'react-icons/bs';
import { toast } from 'react-toastify';
import ReportDetailsModal from './ReportDetailsModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axiosInstance from '../../utils/axiosInstance';

// Report data interface
interface Report {
  id: number;
  relevantIndicators: string[];
  progressAgainstTarget: number;
  targetNumbersReached: number;
  genderDisaggregation: string[];
  interventionArea: string;
  budgetUsed: number;
  progressUpdate: string;
  challengesFaced: string;
  successStories: string;
  attachments: string[];
  biannualType: string;
  annualTargetId: number;
  status: string;
  image: any[];
  createdAt: string;
  updatedAt: string;
  annualTarget: {
    id: number;
    organizationName: number;
    activityName: string;
    activityDescription: string;
    areaOfIntervention: string;
    relevantIndicators: string;
    targetForSelectedIndicator: string;
    targetedBeneficiaries: string;
    targetNumbers: number;
    genderDisaggregation: string[];
    district: string;
    sector: string;
    cell: string;
    plannedBudget: number;
    startDate: string;
    endDate: string;
  };
}

const ReportManagement = () => {
  const { t } = useTranslation();
  const location = useLocation(); // Use useLocation to access URL parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    district: 'all',
    period: 'all'
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: 'all',
    ngoStatus: 'all',
    district: 'all',
    reportType: 'all',
    submissionPeriod: {
      start: '',
      end: ''
    }
  });
  const [reports, setReports] = useState<Report[]>([]);

  // Extract annualTargetId from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const annualTargetId = queryParams.get('annualTargetId');

  useEffect(() => {
    const fetchReports = async () => {
      if (!annualTargetId) return; // Ensure annualTargetId is available
      try {
        const response = await axiosInstance.get(`biannual-reports/${annualTargetId}`);
        setReports(response.data);
      } catch (error) {
        toast.error('Error fetching reports');
      }
    };

    fetchReports();
  }, [annualTargetId]);

  const handleApprove = (reportId: number) => {
    toast.success('Report approved successfully');
    // Implement approval logic
  };

  const handleDecline = (reportId: number) => {
    toast.error('Report declined');
    // Implement decline logic
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('NGO Reports Summary', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    doc.setFontSize(11);
    doc.text('Filters Applied:', 20, 40);
    doc.text(`Date Range: ${advancedFilters.dateRange}`, 30, 45);
    doc.text(`NGO Status: ${advancedFilters.ngoStatus}`, 30, 50);
    doc.text(`District: ${advancedFilters.district}`, 30, 55);
    doc.text(`Report Type: ${advancedFilters.reportType}`, 30, 60);

    const tableData = reports.map(report => [
      report.annualTarget.activityName,
      report.biannualType,
      new Date(report.createdAt).toLocaleDateString(),
      report.annualTarget.district,
      report.status,
      new Date(report.createdAt).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 70,
      head: [['Activity Name', 'Biannual Type', 'Date Created', 'District', 'Status', 'Submission Date']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [63, 81, 181] }
    });

    const totalReports = reports.length;
    const pendingReports = reports.filter(r => r.status === 'Pending').length;
    const approvedReports = reports.filter(r => r.status === 'approved').length;

    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.text('Summary:', 20, finalY + 20);
    doc.text(`Total Reports: ${totalReports}`, 30, finalY + 30);
    doc.text(`Pending Reports: ${pendingReports}`, 30, finalY + 35);
    doc.text(`Approved Reports: ${approvedReports}`, 30, finalY + 40);

    doc.save('ngo-reports-summary.pdf');
    toast.success('PDF Report generated successfully');
  };

  const getDateRangeFilter = (dateRange: string) => {
    const today = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case 'thisMonth':
        startDate.setDate(1);
        break;
      case 'lastMonth':
        startDate.setMonth(startDate.getMonth() - 1, 1);
        today.setDate(0);
        break;
      case 'thisQuarter':
        startDate.setMonth(Math.floor(startDate.getMonth() / 3) * 3, 1);
        break;
      case 'thisYear':
        startDate.setMonth(0, 1);
        break;
      default:
        return () => true;
    }

    return (date: string) => {
      const reportDate = new Date(date);
      return reportDate >= startDate && reportDate <= today;
    };
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch =
        report.annualTarget.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.annualTarget.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDateRange = advancedFilters.dateRange === 'all' ||
        getDateRangeFilter(advancedFilters.dateRange)(report.createdAt);

    const matchesDistrict = advancedFilters.district === 'all' ||
        report.annualTarget.district === advancedFilters.district;

    const matchesReportType = advancedFilters.reportType === 'all' ||
        report.biannualType === advancedFilters.reportType;

    return matchesSearch && matchesDateRange && matchesDistrict && matchesReportType;
  });

  return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb pageName="Report Management" />
          <button
              onClick={generatePDFReport}
              className="inline-flex items-center gap-2.5 rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            <BsFileEarmarkPdf className="h-5 w-5" />
            Generate Report
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2.5 block text-black dark:text-white">Date Range</label>
            <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={advancedFilters.dateRange}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white">District</label>
            <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={advancedFilters.district}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, district: e.target.value }))}
            >
              <option value="all">All Districts</option>
              {/* Add your district options here */}
            </select>
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white">Report Type</label>
            <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={advancedFilters.reportType}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, reportType: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="FIRST_HALF">First Half</option>
              <option value="SECOND_HALF">Second Half</option>
            </select>
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white">Search</label>
            <input
                type="text"
                placeholder="Search reports..."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Reports Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Activity Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Biannual Type</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">District</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
              </thead>
              <tbody>
              {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {report.annualTarget.activityName}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{report.biannualType}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{report.annualTarget.district}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            report.status === 'approved'
                                ? 'bg-success/10 text-success'
                                : report.status === 'declined'
                                    ? 'bg-danger/10 text-danger'
                                    : 'bg-warning/10 text-warning'
                        }`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                            onClick={() => {
                              setSelectedReport(report);
                              setShowDetailsModal(true);
                            }}
                            className="hover:text-primary"
                            title="View Details"
                        >
                          <BsEye className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => handleDownload(report.attachments[0])}
                            className="hover:text-primary"
                            title="Download Report"
                        >
                          <BsDownload className="h-5 w-5" />
                        </button>
                        {report.status === 'Pending' && (
                            <>
                              <button
                                  onClick={() => handleApprove(report.id)}
                                  className="hover:text-success"
                                  title="Approve Report"
                              >
                                <BsCheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                  onClick={() => handleDecline(report.id)}
                                  className="hover:text-danger"
                                  title="Decline Report"
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

        {/* Report Details Modal */}
        {showDetailsModal && selectedReport && (
            <ReportDetailsModal
                report={selectedReport}
                onClose={() => {
                  setShowDetailsModal(false);
                  setSelectedReport(null);
                }}
                onApprove={handleApprove}
                onDecline={handleDecline}
                onDownload={handleDownload}
            />
        )}
      </div>
  );
};

export default ReportManagement;