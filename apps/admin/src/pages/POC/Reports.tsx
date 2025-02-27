import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';
import * as XLSX from 'xlsx';

// Define types for the data structure
interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface Submission {
  id: string;
  createdAt: string;
  milkType: string;
  amount: number;
  status: string;
}

interface Loan {
  id: string;
  createdAt: string;
  loanAmount: number;
  status: string;
}

interface Group {
  farmer: Farmer;
  totalMilkAmount: number;
  totalLoanAmount: number;
  submissions: Submission[];
  loans: Loan[];
}

const Reports = () => {
  const [groupedReports, setGroupedReports] = useState<Record<string, Group>>({});

  useEffect(() => {
    const fetchGroupedReports = async () => {
      try {
        const response = await axiosInstance.get('/reports/grouped');
        setGroupedReports(response.data);
      } catch (error) {
        console.error('Error fetching grouped reports:', error);
      }
    };

    fetchGroupedReports();
  }, []);

  const downloadExcel = () => {
    const data = Object.values(groupedReports).map(group => ({
      firstName: group.farmer.firstName,
      lastName: group.farmer.lastName,
      phoneNumber: group.farmer.phoneNumber,
      totalMilkAmount: group.totalMilkAmount,
      totalLoanAmount: group.totalLoanAmount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

    XLSX.writeFile(workbook, 'Reports.xlsx');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Reports" />
      <h2 className="text-lg font-semibold mb-4">Reports Grouped by Farmer</h2>
      <button
        onClick={downloadExcel}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download Excel
      </button>
      <div className="overflow-x-auto">
        {Object.values(groupedReports).map((group) => (
          <div key={group.farmer.id} className="mb-8">
            <h3 className="text-md font-semibold mb-2">
              {group.farmer.firstName} {group.farmer.lastName} - {group.farmer.phoneNumber}
            </h3>
            <p className="text-sm mb-4">Total Milk Amount: {group.totalMilkAmount}</p>
            <p className="text-sm mb-4">Total Loan Amount: {group.totalLoanAmount}</p>

            <h4 className="text-md font-semibold mb-2">Milk Submissions</h4>
            <table className="w-full mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {group.submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{submission.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{submission.milkType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{submission.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{submission.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 className="text-md font-semibold mb-2">Loans</h4>
            <table className="w-full mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {group.loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{loan.createdAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{loan.loanAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{loan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports; 