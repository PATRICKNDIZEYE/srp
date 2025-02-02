import React, { useState } from 'react';
import { FiMapPin, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';

interface Site {
  id: number;
  name: string;
  type: 'POC' | 'Diary' | 'Production';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'Active' | 'Inactive';
  capacity: string;
  manager?: string;
}

const SiteManagement = () => {
  const [sites] = useState<Site[]>([
    {
      id: 1,
      name: 'Kigali Main Diary',
      type: 'Diary',
      address: 'KG 123 St, Kigali',
      coordinates: { lat: -1.9441, lng: 30.0619 },
      status: 'Active',
      capacity: '5000L/day',
      manager: 'John Doe'
    },
    {
      id: 2,
      name: 'Gasabo Collection Center',
      type: 'POC',
      address: 'Gasabo District',
      coordinates: { lat: -1.9441, lng: 30.0619 },
      status: 'Active',
      capacity: '2000L/day',
      manager: 'Jane Smith'
    },
    {
      id: 3,
      name: 'Nyarugenge Production',
      type: 'Production',
      address: 'Nyarugenge District',
      coordinates: { lat: -1.9508, lng: 30.0575 },
      status: 'Active',
      capacity: '10000L/day',
      manager: 'Mike Wilson'
    }
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Site Management" />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sites</h2>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiPlus />
            Add Site
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sites.map((site) => (
                <tr key={site.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{site.name}</div>
                    <div className="text-sm text-gray-500">{site.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      site.type === 'POC' ? 'bg-blue-100 text-blue-800' :
                      site.type === 'Diary' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {site.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <FiMapPin className="mr-1 text-gray-500" />
                      <span>{site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      site.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{site.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{site.manager || 'Unassigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEdit2 />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FiTrash2 />
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

export default SiteManagement; 