import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface AddSiteModalProps {
  onClose: () => void;
  onSubmit: (siteData: any) => void;
}

const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const AddSiteModal: React.FC<AddSiteModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    address: '',
    coordinates: { lat: -1.9441, lng: 30.0619 }, // Default to Kigali
    status: 'Active',
    capacity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          <h3 className="text-xl font-semibold">Add New Site</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
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
                Type
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="">Select Type</option>
                <option value="POC">Collection Point (POC)</option>
                <option value="Diary">Diary</option>
                <option value="Production">Production</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (L/day)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.capacity}
                onChange={e => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-gray-500">(Click to set location)</span>
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
              Add Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSiteModal; 