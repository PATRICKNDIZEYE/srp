import React, { useState, useEffect } from 'react';
import { FiX, FiMapPin } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface EditUserModalProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    site: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    status: 'Active' | 'Inactive';
  };
  onClose: () => void;
  onSubmit: (userId: number, userData: any) => void;
}

// Map click handler component
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    site: user.site,
    coordinates: user.coordinates,
    status: user.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user.id, formData);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { lat, lng }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                required
              >
                <option value="Production Manager">Production Manager</option>
                <option value="Transport Coordinator">Transport Coordinator</option>
                <option value="Diary Manager">Diary Manager</option>
                <option value="POC Manager">POC Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.site}
                onChange={e => setFormData(prev => ({ ...prev, site: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-gray-500">(Click to update location)</span>
            </label>
            <div className="h-[300px] w-full rounded-lg overflow-hidden border">
              <MapContainer
                center={[formData.coordinates.lat, formData.coordinates.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[formData.coordinates.lat, formData.coordinates.lng]} />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
              </MapContainer>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Selected coordinates: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal; 