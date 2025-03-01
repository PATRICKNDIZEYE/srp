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
        // Retrieve user data from local storage
        const userData = localStorage.getItem('userData');
        const userId = userData ? JSON.parse(userData)[0].id : null;

        if (userId) {
          // Use the userId in the API endpoint
          const response = await axiosInstance.get(`/reports/grouped/poc/${userId}`);
          setGroupedReports(response.data);
        } else {
          console.error('User ID not found in local storage');
        }
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
        <table className="w-full mb-4 border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Amafaranga y'Amata</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Ideni Afite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.values(groupedReports).map((group) => (
              <tr key={group.farmer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.farmer.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.farmer.firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.farmer.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.farmer.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.submissions.length > 0 ? group.submissions[0].milkType : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.totalMilkAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.totalMilkAmount * 400}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.totalLoanAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{(group.totalMilkAmount * 400) - group.totalLoanAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports; 