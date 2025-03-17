import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiMapPin, FiLoader } from 'react-icons/fi';
import axiosInstance from '../../utils/axios';
import { AxiosError } from 'axios';
import { jwtDecode } from "jwt-decode";

// Define a type for POC
type POC = {
  id: number;
  firstName: string;
  lastName: string;
};

const FarmerRegistration = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);  
  const [locationError, setLocationError] = useState('');
  const [pocs, setPocs] = useState<POC[]>([]);
 
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    nationalId: '',
    longitude: '',
    latitude: '',
    farmType: '',
    farmSize: '',
    district: '',
    sector: '',
    cell: '',
    copyField: '',
    pocId: ''
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

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
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1&zoom=18`
          );
          const data = await response.json();
          const address = data.address;
          
          const district = address.county || address.city || address.town || address.district || '';
          const sector = address.suburb || address.village || address.subdivision || '';
          const cell = address.neighbourhood || address.hamlet || address.locality || '';

          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            district,
            sector,
            cell
          }));

          if (!district || !sector || !cell) {
            toast.warning('Amwe mu makuru y\'aho uherereye ntabwo yuzuye. Nyamuneka uzuza ubwawe.');
          }
        } catch (error) {
          setLocationError('Ntibishoboye kubona aho uherereye. Nyamuneka uzuza ubwawe.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        let errorMessage = 'Ntibishoboye kubona aho uherereye.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Nyamuneka emerera urubuga kubona aho uherereye.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Aho uherereye ntabwo habashije kuboneka.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Igihe cyo kubona aho uherereye cyararenze.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const response = await axiosInstance.post('/login-farmer', {
          phoneNumber: formData.phone,
          password: formData.password
        });


        console.log(response);
        const { token } = response.data;
        const decodedToken: any = jwtDecode(token);
        localStorage.setItem('token', token);
        localStorage.setItem('role', decodedToken.role);

        // Fetch user details after successful login
        const userResponse = await axiosInstance.get(`/farmer/phone/${formData.phone}`);
        const userData = userResponse.data;
        console.log('User Data:', userData); // Handle user data as needed

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        toast.success('Login successful!');
        navigate('/farmer/dashboard');
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error during login:', axiosError.response ? axiosError.response.data : axiosError.message);
        toast.error('Invalid credentials');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Validate nationalId
      if (!formData.nationalId || formData.nationalId.length !== 16) {
        toast.error('Please enter a valid national ID');
        return;
      }

      try {
        const formattedBirthday = formData.birthday
          ? new Date(formData.birthday).toISOString()
          : '1990-01-01T00:00:00.000Z';

        const registrationData = {
          firstName: formData.fullName.split(' ')[0] || '',
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
          birthday: formattedBirthday,
          nationalId: formData.nationalId,
          phoneNumber: formData.phone,
          longitude: parseFloat(formData.longitude) || 30.123456,
          latitude: parseFloat(formData.latitude) || -1.987654,
          username: formData.fullName.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000),
          password: formData.password,
          farmDetails: formData.location || 'Farm in Kigali',
          status: 'Active',
          pocId: Number(formData.pocId)
        };

        console.log('Registration Data:', registrationData);

        const response = await axiosInstance.post('/register-farmer', registrationData);
        console.log(response.data);

        if (response.status === 201) {
          toast.success('Kwiyandikisha byagenze neza! Injira.');
          setIsLogin(true);
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle the error response from the backend
        if (error.response?.data) {
          const errorData = error.response.data;
          
          // Show the error message from the backend
          toast.error(errorData.message || 'Kwiyandikisha Byanze. Gerageza urebe niba ibyo wanditse bidasanzwe muri sisitemu.');
          
          // If there's a specific field error, update the form errors
          if (errorData.field === 'phone') {
            setErrors(prev => ({
              ...prev,
              phone: errorData.message
            }));
          }
        } else {
          toast.error('Kwiyandikisha Byanze. Gerageza urebe niba ibyo wanditse bidasanzwe muri sisitemu.');
        }
      } 
    }
  };



  const handleCopy = () => {
    setFormData(prev => ({
      ...prev,
      fullName: prev.copyField
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Kwinjira nk\'Umuhinzi' : 'Kwiyandikisha nk\'Umuhinzi'}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? 'Murakaza neza! Injira mu konti yawe'
              : 'Iyandikishe kugirango utangire gukoresha system'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Amazina yombi</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  placeholder="Amazina yawe yombi"
                />
              </div>

  

              <div>
                <label className="block text-gray-700 mb-2">Nimero y'irangamuntu</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  required
                  placeholder="1 1999 8 0123456 1 23"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Itariki y'amavuko</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Telefoni</label>
                <input
                  type="tel"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${errors.phone ? 'border-red-500' : ''}`}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    // Clear the error when user starts typing
                    if (errors.phone) {
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }
                  }}
                  required
                  placeholder="07X XXX XXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Point of Contact (POC)</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pocId}
                  onChange={(e) => setFormData({ ...formData, pocId: e.target.value })}
                  required
                >
                  <option value="">Select POC</option>
                  {pocs.map((poc) => (
                    <option key={poc.id} value={poc.id}>
                      {poc.firstName} {poc.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Aho uherereye</label>
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
                    Koresha GPS
                  </button>
                </div>
                {locationError && (
                  <p className="text-red-500 text-sm mb-4">{locationError}</p>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Akarere"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Umurenge"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Akagari"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.cell}
                    onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Telefoni</label>
                <input
                  type="tel"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  required
                  placeholder="07X XXX XXXX"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ijambo ry'ibanga</label>
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
            </div>
          )}

          {/* Show confirm password only for registration */}
          {!isLogin && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Ijambo ry'ibanga</label>
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

              <div>
                <label className="block text-gray-700 mb-2">Subiramo ijambo ry'ibanga</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition-colors font-medium"
          >
            {isLogin ? 'Injira' : 'Iyandikishe'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Nta konti ufite? Iyandikishe"
              : 'Usanzwe ufite konti? Injira'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegistration; 
