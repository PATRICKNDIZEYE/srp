import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import axiosInstance from '../../utils/axiosInstance';
import * as XLSX from 'xlsx';
import { differenceInDays, parseISO } from 'date-fns';

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
  quality: string;
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
  lastPaymentDate: string;
}

const Reports = () => {
  const [groupedReports, setGroupedReports] = useState<Record<string, Group>>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    const fetchGroupedReports = async () => {
      try {
        // Retrieve user data from local storage
        const userData = localStorage.getItem('userData');
        const userId = userData ? JSON.parse(userData)[0].id : null;

        if (userId) {
          // Use the userId in the API endpoint
          const response = await axiosInstance.get(`/reports/grouped/poc/${userId}`);
          const data = response.data;

          // Ensure lastPaymentDate is set
          const updatedData = Object.values(data).map((group: Group) => ({
            ...group,
            lastPaymentDate: group.lastPaymentDate || '1970-01-01', // Default to a very old date
          }));

          setGroupedReports(updatedData);
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

  const isPaymentDue = (submissions: Submission[]) => {
    if (submissions.length === 0) {
      return false; // No submissions, assume payment is not due
    }
    const lastSubmissionDate = submissions[submissions.length - 1].createdAt;
    const daysSinceLastSubmission = differenceInDays(new Date(), parseISO(lastSubmissionDate));
    return daysSinceLastSubmission >= 15;
  };

  // Pagination logic
  const paginatedReports = Object.values(groupedReports).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(Object.values(groupedReports).length / itemsPerPage);

  // Calculate total balance
  const totalBalance = paginatedReports.reduce((sum, group) => {
    return sum + (group.totalMilkAmount * 400 - group.totalLoanAmount);
  }, 0);

  const totalQuantity = paginatedReports.reduce((sum, group) => {
    return sum + group.totalMilkAmount;
  }, 0);

  const totalLoanAmount = paginatedReports.reduce((sum, group) => {
    return sum + group.totalLoanAmount;
  }, 0);

  const handlePayment = async (farmerId: string, amount: number, startDate: string, endDate: string) => {
    try {
      const response = await axiosInstance.post('/payments/create', {
        farmerId,
        amount,
        startDate,
        endDate,
      });

      if (response.status === 201) {
        console.log('Payment created successfully:', response.data);
        // Optionally update the UI or state here
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Submissions Summary" />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">First Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Amafaranga y'Amata</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Ideni Afite</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedReports.map((group, index) => {
              const paymentDue = isPaymentDue(group.submissions);
              const sequenceNumber = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <React.Fragment key={group.farmer.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{sequenceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.farmer.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.farmer.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.farmer.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.totalMilkAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.totalMilkAmount * 400}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">
                      {group.loans.reduce((total, loan) => 
                        loan.status === 'approved' ? total + loan.loanAmount : total, 
                        0
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{(group.totalMilkAmount * 400) - group.totalLoanAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">{group.submissions.length > 0 ? group.submissions[0].status : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300">
                      <button
                        onClick={() => handlePayment(group.farmer.id, group.totalMilkAmount * 400, group.submissions[group.submissions.length - 1].createdAt, new Date().toISOString())}
                        className={`px-4 py-2 rounded ${paymentDue ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        disabled={!paymentDue}
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                  {paymentDue && (
                    <tr className="hover:bg-gray-50">
                      <td colSpan={10} className="px-6 py-4 whitespace-nowrap text-sm border border-gray-300 text-center">
                        15 days have passed since the last submission.
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan={4} className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase border border-gray-300">Totals</td>
              <td className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">{totalQuantity}</td>
              <td className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300"></td>
              <td className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">{totalLoanAmount}</td>
              <td className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300">{totalBalance}</td>
              <td colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border border-gray-300"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reports;