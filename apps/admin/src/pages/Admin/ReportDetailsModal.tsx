import React from 'react';
import { BsX, BsCheckCircle, BsXCircle, BsDownload } from 'react-icons/bs';
import { Report } from './ReportManagement';

interface ReportDetailsModalProps {
  report: Report;
  onClose: () => void;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onDownload: (url: string) => void;
}

const ReportDetailsModal = ({ report, onClose, onApprove, onDecline, onDownload }: ReportDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            Report Details
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
              {report.ngoName}
            </p>
          </section>

          {/* Report Details */}
          <section>
            <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
              Report Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Report Type</p>
                <p className="text-black dark:text-white">
                  {report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Period</p>
                <p className="text-black dark:text-white">{report.period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Submission Date</p>
                <p className="text-black dark:text-white">
                  {new Date(report.submissionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
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
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
              Location
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">District</p>
                <p className="text-black dark:text-white">{report.district}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sector</p>
                <p className="text-black dark:text-white">{report.sector}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => onDownload(report.downloadUrl)}
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <span className="flex items-center gap-2">
              <BsDownload />
              Download Report
            </span>
          </button>
          
          {report.status === 'pending' && (
            <>
              <button
                onClick={() => onDecline(report.id)}
                className="px-6 py-2 rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BsXCircle />
                  Decline
                </span>
              </button>
              <button
                onClick={() => onApprove(report.id)}
                className="px-6 py-2 rounded-lg bg-success text-white hover:bg-success/90 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BsCheckCircle />
                  Approve
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal; 