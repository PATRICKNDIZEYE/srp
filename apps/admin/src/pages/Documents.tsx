import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsDownload, BsEye, BsFilter, BsSearch } from 'react-icons/bs';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Documents = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const documents: Document[] = [
    {
      id: 1,
      name: 'Project Proposal Template',
      type: 'PDF',
      size: '2.5 MB',
      date: '2024-03-15',
      status: 'approved'
    },
    {
      id: 2,
      name: 'Financial Report Guidelines',
      type: 'DOCX',
      size: '1.8 MB',
      date: '2024-03-14',
      status: 'approved'
    },
    {
      id: 3,
      name: 'NGO Registration Form',
      type: 'PDF',
      size: '3.2 MB',
      date: '2024-03-13',
      status: 'pending'
    }
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-warning/10 text-warning';
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {t('Documents')}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t('Search documents...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            />
            <BsSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
          >
            <option value="all">{t('All Types')}</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Document Name')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Type')}
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  {t('Size')}
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
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{doc.name}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className="text-sm">{doc.type}</span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className="text-sm">{doc.size}</span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className="text-sm">{doc.date}</span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button className="hover:text-primary">
                        <BsEye className="h-5 w-5" />
                      </button>
                      <button className="hover:text-primary">
                        <BsDownload className="h-5 w-5" />
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

export default Documents; 