import React from 'react';
import { FiSettings, FiServer, FiShield, FiGlobe } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';

const SystemSettings = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="System Settings" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiServer className="text-blue-600" />
            <h3 className="text-lg font-semibold">System Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                defaultValue="SRP System"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Production</option>
                <option>Development</option>
                <option>Testing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="text-green-600" />
            <h3 className="text-lg font-semibold">Security Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Policy
              </label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Strong</option>
                <option>Medium</option>
                <option>Basic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                defaultValue={30}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiGlobe className="text-purple-600" />
            <h3 className="text-lg font-semibold">Regional Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Africa/Kigali</option>
                <option>UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiSettings className="text-orange-600" />
            <h3 className="text-lg font-semibold">Maintenance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backup Frequency
              </label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings; 