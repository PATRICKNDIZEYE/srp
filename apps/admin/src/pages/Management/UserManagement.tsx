import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiMapPin, FiRefreshCw, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import DeleteUserModal from '../../components/Management/DeleteUserModal';
import EditUserModal from '../../components/Management/EditUserModal';
import axiosInstance from '../../utils/axiosInstance';
import AddPocForm from '../../components/Management/AddPocForm';
import AddFarmerModal from '../../components/Management/AddFarmerModal';
import AddTransportModal from '../../components/Management/AddTransportModal';
import AddUserModal from '../../components/Management/AddUserModal';
import AddEditFarmerModal from '../../components/Management/AddEditFarmerModal';
import EditPocForm from '../../components/Management/EditPocForm';
import AddProductionModal from '../../components/Management/AddProductionModal';
import EditProductionModal from '../../components/Management/EditProductionModal';

interface User {
  id: number;
  name: string;
  role: string;
  site: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'Active' | 'Inactive';
  lastActive: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
  username: string;
}

interface Dairy {
  id: number;
  firstName: string;
  lastName: string;
  nationalId: string;
  status: 'active' | 'inactive';
  approveStatus: 'active' | 'inactive';
  phoneNumber: string;
  password: string;
  longitude: string;
  latitude: string;
}

interface PocData {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
  nationalId: string;
  phoneNumber: string;
  longitude: number | string;
  latitude: number | string;
  username: string;
  password: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  status: string;
}

const UserManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [pocs, setPocs] = useState<User[]>([]);
  const [transports, setTransports] = useState<User[]>([]);
  const [dairies, setDairies] = useState<User[]>([]);
  const [productions, setProductions] = useState<User[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  const [location, setLocation] = useState<{ longitude: number; latitude: number } | null>(null);

  const [showAddDairyModal, setShowAddDairyModal] = useState(false);
  const [selectedDairy, setSelectedDairy] = useState<Dairy | null>(null);

  const [showEditPocModal, setShowEditPocModal] = useState(false);
  const [selectedPoc, setSelectedPoc] = useState<PocData | null>(null);

  const [showAddProductionModal, setShowAddProductionModal] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState<any>(null);

  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [showEditTransportModal, setShowEditTransportModal] = useState(false);

  const fetchData = async () => {
    try {
      if (activeTab === 'users') {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } else if (activeTab === 'farmers') {
        const response = await axiosInstance.get('/farmer');
        setFarmers(response.data);
      } else if (activeTab === 'pocs') {
        const response = await axiosInstance.get('/pocs');
        setPocs(response.data);
      } else if (activeTab === 'transports') {
        const response = await axiosInstance.get('/transports');
        setTransports(response.data);
      } else if (activeTab === 'dairies') {
        const response = await axiosInstance.get('/diary');
        setDairies(response.data);
      } else if (activeTab === 'productions') {
        const response = await axiosInstance.get('/production');
        setProductions(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAddUser = async (userData: any) => {
    try {
      let endpoint = '';
      if (activeTab === 'users') {
        endpoint = '/users';
      } else if (activeTab === 'farmer') {
        endpoint = '/farmer';
      } else if (activeTab === 'transports') {
        endpoint = '/transports';
      }

      if (endpoint) {
        const formattedUserData = {
          ...userData,
          role: userData.role || 'ADMIN',
          birthday: new Date(userData.birthday).toISOString().split('T')[0] + 'T00:00:00Z',
        };

        await axiosInstance.post(endpoint, formattedUserData);
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} added successfully`);
      }
      setShowAddModal(false);
      fetchData(); // Refresh data after adding
    } catch (error) {
      toast.error(`Failed to add ${activeTab}`);
    }
  };

  const handleEditUser = (userId: number, userData: Omit<User, 'id' | 'lastActive'>) => {
    // Use the same form for editing
    setSelectedUser({ ...userData, id: userId });
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      let endpoint = '';

      if (activeTab === 'users') {
        endpoint = `/users/${userId}`;
      } else if (activeTab === 'farmers') {
        endpoint = `/farmer/${userId}`;
      } else if (activeTab === 'pocs') {
        endpoint = `/pocs/${userId}`;
      } else if (activeTab === 'transports') {
        endpoint = `/transports/${userId}`;
      } else if (activeTab === 'dairies') {
        endpoint = `/diary/${userId}`;
      }

      if (endpoint) {
        await axiosInstance.delete(endpoint);
        toast.success('Deleted successfully');
        fetchData(); // Refresh data after deletion
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleAddPoc = async (pocData: PocData) => {
    try {
      const formattedBirthday = new Date(pocData.birthday).toISOString().split('T')[0] + 'T00:00:00Z';
      const formattedPocData = {
        ...pocData,
        birthday: formattedBirthday,
        longitude: Number(pocData.longitude),
        latitude: Number(pocData.latitude),
        status: pocData.status.toLowerCase(),
      };

      await axiosInstance.post('/pocs', formattedPocData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('POC added successfully!');
      fetchData();
    } catch (error) {
      toast.error('Error adding POC');
    }
  };

  const handleAddFarmer = (farmerData: any) => {
    // Destructure to remove 'id' from the data
    const { id, ...dataWithoutId } = farmerData;

    // Log the data without 'id'
    console.log('Farmer Data to be sent:', dataWithoutId);

    // Assuming you have a POST request here
    // await axiosInstance.post('/farmer', dataWithoutId, { headers: { 'Content-Type': 'application/json' } });

    setShowAddFarmerModal(false);
    fetchData(); // Refresh data after adding
  };

  const handleEditFarmer = async (farmerData: any) => {
    try {
      // Destructure to remove 'id' from the data
      const { id, ...dataWithoutId } = farmerData;

      // Format the birthday to ISO-8601
      const formattedBirthday = new Date(dataWithoutId.birthday).toISOString();

      // Log the data without 'id'
      console.log('Farmer Data to be updated:', { ...dataWithoutId, birthday: formattedBirthday });

      // Assuming you have an endpoint to update a farmer
      const endpoint = `/farmer/${farmerData.id}`;
      await axiosInstance.put(endpoint, { ...dataWithoutId, birthday: formattedBirthday }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Farmer updated successfully!');
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error('Error updating farmer:', error);
      toast.error('Failed to update farmer');
    }
    setShowAddFarmerModal(false);
  };

  const handleChangeStatus = async (userId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      let endpoint = '';

      if (activeTab === 'users') {
        endpoint = `/users/${userId}/status`;
      } else if (activeTab === 'farmers') {
        endpoint = `/farmer/${userId}/status`;
      } else if (activeTab === 'pocs') {
        endpoint = `/pocs/${userId}/status`;
      } else if (activeTab === 'transports') {
        endpoint = `/transports/${userId}/status`;
      } else if (activeTab === 'dairies') {
        endpoint = `/diary/${userId}/status`;
      }

      if (endpoint) {
        await axiosInstance.patch(endpoint, { status: newStatus });
        toast.success(`Status changed to ${newStatus}`);
        fetchData(); // Refresh data after status change
      }
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  const handleGenerateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (error) => {
          toast.error('Failed to get location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const handleAddDairy = async (dairyData: Dairy) => {
    try {
      // Format the data to match the expected structure
      const formattedDairyData = {
        firstName: dairyData.firstName,
        lastName: dairyData.lastName,
        nationalId: dairyData.nationalId,
        status: dairyData.status,
        approveStatus: dairyData.approveStatus,
        phoneNumber: dairyData.phoneNumber,
        password: dairyData.password,
        longitude: dairyData.longitude,
        latitude: dairyData.latitude,
      };

      console.log('Submitting dairy data:', formattedDairyData); // Log the formatted data

      await axiosInstance.post('/diary', formattedDairyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Dairy added successfully!');
      fetchData(); // Refresh data after adding
    } catch (error) {
      console.error('Error adding dairy:', error);
      toast.error('Error adding dairy');
    }
  };

  const handleEditDairy = (dairyData: Dairy) => {
    setSelectedDairy(dairyData);
    setShowAddDairyModal(true);
  };

  const handleEditButtonClick = (entity: any) => {
    if (activeTab === 'farmers') {
      setSelectedFarmer(entity);
      setShowAddFarmerModal(true);
    } else if (activeTab === 'dairies') {
      setSelectedDairy(entity);
      setShowAddDairyModal(true);
    } else if (activeTab === 'pocs') {
      setSelectedPoc(entity);
      setShowEditPocModal(true);
    } else if (activeTab === 'transports') {
      setSelectedTransport(entity);
      setShowEditTransportModal(true);
    } else {
      setSelectedUser(entity);
      setShowEditModal(true);
    }
  };

  const handleAddProduction = () => {
    setShowAddProductionModal(true);
  };

  const handleEditProduction = (production: any) => {
    setSelectedProduction(production);
    setShowEditModal(true);
  };

  const handleEditTransport = (transportData: any) => {
    setSelectedTransport(transportData);
    setShowEditTransportModal(true);
  };

  const AddUserForm = ({ onClose, onSubmit, initialData }: { onClose: () => void; onSubmit: (data: any) => void; initialData?: User }) => (
    <div>
      {/* Form fields for adding or editing a user */}
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSubmit(initialData ? { ...initialData } : { /* new user data */ })}>
        {initialData ? 'Update' : 'Submit'}
      </button>
    </div>
  );

  const AddFarmerForm = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) => (
    <div>
      {/* Form fields for adding a farmer */}
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSubmit({ /* farmer data */ })}>Submit</button>
    </div>
  );

  const AddTransportForm = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) => {
    const [location, setLocation] = useState<{ longitude: number; latitude: number } | null>(null);

    const handleGenerateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });
          },
          (error) => {
            toast.error('Failed to get location');
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser');
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
          <h2 className="text-xl font-semibold mb-4">Add Transport</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              firstName: (e.target as any).firstName.value,
              lastName: (e.target as any).lastName.value,
              birthday: new Date((e.target as any).birthday.value).toISOString(),
              nationalId: (e.target as any).nationalId.value,
              phoneNumber: (e.target as any).phoneNumber.value,
              longitude: location ? location.longitude : parseFloat((e.target as any).longitude.value),
              latitude: location ? location.latitude : parseFloat((e.target as any).latitude.value),
              username: (e.target as any).username.value,
              password: (e.target as any).password.value,
              status: 'pending', // Set default status to 'pending'
            };
            onSubmit(formData);
          }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Birthday</label>
              <input type="date" name="birthday" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">National ID</label>
              <input type="text" name="nationalId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phoneNumber" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input type="number" step="any" name="longitude" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={location ? location.longitude : ''} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input type="number" step="any" name="latitude" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={location ? location.latitude : ''} required />
            </div>
            <div className="mb-4">
              <button type="button" onClick={handleGenerateLocation} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Generate Location</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddEditDairyForm = ({ onClose, onSubmit, initialData }: { onClose: () => void; onSubmit: (data: Dairy) => void; initialData?: Dairy }) => {
    const [formData, setFormData] = useState<Dairy>(initialData || {
      firstName: '',
      lastName: '',
      nationalId: '',
      status: 'active',
      approveStatus: 'active',
      phoneNumber: '',
      password: '',
      longitude: '',
      latitude: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleGenerateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData({
              ...formData,
              longitude: position.coords.longitude.toString(),
              latitude: position.coords.latitude.toString(),
            });
          },
          (error) => {
            toast.error('Failed to get location');
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser');
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
          <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Dairy' : 'Add Dairy'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">National ID</label>
              <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <button type="button" onClick={handleGenerateLocation} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Generate Location</button>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddEditFarmerModal = ({ isOpen, onClose, onSubmit, initialData }: { isOpen: boolean; onClose: () => void; onSubmit: (data: NewFarmer) => void; initialData?: NewFarmer }) => {
    const [formData, setFormData] = useState<NewFarmer>(initialData || {
      firstName: '',
      lastName: '',
      birthday: '',
      nationalId: '',
      phoneNumber: '',
      longitude: 0,
      latitude: 0,
      username: '',
      password: '',
      farmDetails: '',
      status: 'active',
      pocId: 0,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [pocs, setPocs] = useState<POC[]>([]);

    useEffect(() => {
      const fetchPocs = async () => {
        try {
          const response = await axiosInstance.get('/pocs');
          setPocs(response.data);
        } catch (error) {
          console.error('Error fetching POCs:', error);
        }
      };

      fetchPocs();
    }, []);

    const getCurrentLocation = () => {
      setIsLoadingLocation(true);
      setLocationError('');

      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        setIsLoadingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setIsLoadingLocation(false);
        },
        (error) => {
          setLocationError('Failed to get location');
          setIsLoadingLocation(false);
        }
      );
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 my-8">
          <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Farmer' : 'Add New Farmer'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.firstName + ' ' + formData.lastName}
                onChange={(e) => {
                  const [firstName, ...lastName] = e.target.value.split(' ');
                  setFormData({ ...formData, firstName, lastName: lastName.join(' ') });
                }}
                required
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">National ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                placeholder="National ID"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Birthday</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Point of Contact (POC)</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.pocId}
                onChange={(e) => setFormData({ ...formData, pocId: parseInt(e.target.value) })}
                required
              >
                {pocs.map((poc) => (
                  <option key={poc.id} value={poc.id}>
                    {poc.firstName} {poc.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiMapPin />
                  )}
                  Use GPS
                </button>
              </div>
              {locationError && (
                <p className="text-red-500 text-sm mb-4">{locationError}</p>
              )}
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Longitude"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  required
                />
                <input
                  type="text"
                  placeholder="Latitude"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {initialData ? 'Update Farmer' : 'Add Farmer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditTransportForm = ({ transport, onClose, onSubmit }: { transport: any; onClose: () => void; onSubmit: (data: any) => void }) => {
    const [location, setLocation] = useState<{ longitude: number; latitude: number } | null>(null);

    const handleGenerateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });
          },
          (error) => {
            toast.error('Failed to get location');
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser');
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
          <h2 className="text-xl font-semibold mb-4">Edit Transport</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              firstName: (e.target as any).firstName.value,
              lastName: (e.target as any).lastName.value,
              birthday: new Date((e.target as any).birthday.value).toISOString(),
              nationalId: (e.target as any).nationalId.value,
              phoneNumber: (e.target as any).phoneNumber.value,
              longitude: location ? location.longitude : parseFloat((e.target as any).longitude.value),
              latitude: location ? location.latitude : parseFloat((e.target as any).latitude.value),
              username: (e.target as any).username.value,
              password: (e.target as any).password.value,
              status: 'pending', // Set default status to 'pending'
            };
            onSubmit(formData);
          }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.firstName} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.lastName} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Birthday</label>
              <input type="date" name="birthday" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.birthday} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">National ID</label>
              <input type="text" name="nationalId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.nationalId} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phoneNumber" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.phoneNumber} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input type="number" step="any" name="longitude" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.longitude} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input type="number" step="any" name="latitude" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.latitude} />
            </div>
            <div className="mb-4">
              <button type="button" onClick={handleGenerateLocation} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Generate Location</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.username} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required value={transport.password} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="User Management" />
      
      <div className="tabs flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'farmers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Farmers
        </button>
        <button
          onClick={() => setActiveTab('pocs')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'pocs' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          POCs
        </button>
        <button
          onClick={() => setActiveTab('transports')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'transports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Transports
        </button>
        <button
          onClick={() => setActiveTab('dairies')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'dairies' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Dairies
        </button>
        <button
          onClick={() => setActiveTab('productions')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'productions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Productions
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          {activeTab !== 'farmers' && (
            <button 
              onClick={() => {
                if (activeTab === 'farmers') {
                  setShowAddFarmerModal(true);
                } else {
                  setShowAddModal(true);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FiUserPlus />
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          )}
          {activeTab === 'dairies' && (
            <button 
              onClick={() => setShowAddDairyModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FiUserPlus />
              Add Dairy
            </button>
          )}
          {activeTab === 'productions' && (
            <button 
              onClick={() => setShowAddProductionModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FiUserPlus />
              Add Production
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            <table className="min-w-full divide-y divide-gray-200 table-users">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditButtonClick(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTab === 'productions' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approve Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productions.map((production) => (
                  <tr key={production.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{production.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{production.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{production.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{production.approveStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {production.longitude && production.latitude ? `${production.longitude}, ${production.latitude}` : 'No coordinates'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditProduction(production)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(production);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 />
                        </button>
                        <button 
                          onClick={() => handleChangeStatus(production.id, production.status)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FiRefreshCw />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">National ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(activeTab === 'farmers' ? farmers : activeTab === 'pocs' ? pocs : activeTab === 'transports' ? transports : dairies).map((entity) => (
                  <tr key={entity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {entity.firstName ? entity.firstName.charAt(0) : '?'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entity.firstName || 'Unknown'} {entity.lastName || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{entity.nationalId || 'No ID'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{entity.phoneNumber || 'No phone'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {entity.longitude && entity.latitude ? `${entity.longitude}, ${entity.latitude}` : 'No coordinates'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entity.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {entity.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditButtonClick(entity)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(entity);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 />
                        </button>
                        <button 
                          onClick={() => handleChangeStatus(entity.id, entity.status)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <FiRefreshCw />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showAddModal && activeTab === 'users' && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
          initialData={selectedUser}
        />
      )}

      {showAddFarmerModal && (
        <AddEditFarmerModal
          isOpen={showAddFarmerModal}
          onClose={() => setShowAddFarmerModal(false)}
          onSubmit={handleAddFarmer}
          initialData={selectedFarmer}
        />
      )}

      {selectedFarmer && (
        <AddEditFarmerModal
          isOpen={!!selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          onSubmit={handleEditFarmer}
          initialData={selectedFarmer}
        />
      )}

      {showAddModal && activeTab === 'pocs' && (
        <AddPocForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPoc}
        />
      )}

      {showAddModal && activeTab === 'transports' && (
        <AddTransportForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditUser}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteUser}
        />
      )}

      {showAddDairyModal && (
        <AddEditDairyForm
          onClose={() => setShowAddDairyModal(false)}
          onSubmit={handleAddDairy}
          initialData={selectedDairy}
        />
      )}

      {showEditPocModal && selectedPoc && (
        <EditPocForm
          onClose={() => {
            setShowEditPocModal(false);
            setSelectedPoc(null);
          }}
          onSubmit={async (updatedPocData) => {
            try {
              // Format the birthday to ISO-8601
              const formattedBirthday = new Date(updatedPocData.birthday).toISOString();

              // Create a new object excluding the 'id' field and with formatted birthday
              const { id, ...dataWithoutId } = updatedPocData;
              const dataToSend = { ...dataWithoutId, birthday: formattedBirthday };

              // Log the data being sent to the server
              console.log('Updating POC with data:', dataToSend);

              // Use the id for the PUT request
              await axiosInstance.put(`/pocs/${updatedPocData.id}`, dataToSend, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              toast.success('POC updated successfully!');
              fetchData(); // Refresh data after editing
            } catch (error) {
              console.error('Error updating POC:', error.response?.data || error.message);
              toast.error('Error updating POC');
            }
            setShowEditPocModal(false);
          }}
          initialData={selectedPoc}
        />
      )}

      {showAddProductionModal && (
        <AddProductionModal
          onClose={() => setShowAddProductionModal(false)}
          onAdd={fetchData}
        />
      )}

      {showEditModal && selectedProduction && (
        <EditProductionModal
          production={selectedProduction}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduction(null);
          }}
          onEdit={fetchData}
        />
      )}

      {showEditTransportModal && selectedTransport && (
        <EditTransportForm
          transport={selectedTransport}
          onClose={() => {
            setShowEditTransportModal(false);
            setSelectedTransport(null);
          }}
          onSubmit={handleEditTransport}
        />
      )}
    </div>
  );
};

export default UserManagement; 
