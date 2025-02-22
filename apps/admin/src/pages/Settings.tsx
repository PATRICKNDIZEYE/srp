import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { BsGlobe, BsShieldLock, BsEnvelope, BsBell, BsPalette, BsPerson, BsCheckCircle } from 'react-icons/bs';
import AxiosInstance from "../utils/axiosInstance.ts";
import { toast } from 'react-toastify';
import { useUserContext } from '../context/UserContext';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
  name: string;
}

const Settings = () => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    currentPassword: '',
    newPassword: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const [settings, setSettings] = useState({
    systemName: 'MINUBUMWE',
    adminEmail: 'admin@minubumwe.gov.rw',
    language: 'en',
    timezone: 'Africa/Kigali',
    darkMode: true,
    emailNotifications: true,
    ngoApprovalNotifications: true,
    workPlanNotifications: true,
    chatNotifications: true,
    autoApproveNGOs: false,
    requireDocumentVerification: true,
    maxFileSize: 10, // MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
  });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      if (user) {
        const response = await AxiosInstance.get(`/farmer/${user.id}`);
        setCurrentUser(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          name: response.data.name,
          currentPassword: '',
          newPassword: '',
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch user data');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);
    try {
      if (!currentUser?.id) throw new Error('User ID not found');

      const updateData: any = {
        username: formData.username,
        email: formData.email,
        name: formData.name,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      await AxiosInstance.put(`/farmer/${currentUser.id}`, updateData);
      toast.success('Profile updated successfully');
      setShowSuccess(true);
      fetchCurrentUser();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          {t('System Settings')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('Manage system preferences and configurations')}
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6">
          <div className="flex items-center gap-3 rounded-lg bg-meta-3 py-4 px-6 text-white">
            <BsCheckCircle className="text-xl" />
            <p>
              {t('Your profile has been successfully updated! The changes have been saved.')}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-stroke dark:border-strokedark">
        <div className="flex flex-wrap gap-4">
          <button
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'general'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
            onClick={() => setActiveTab('general')}
          >
            <BsGlobe />
            {t('General')}
          </button>

        </div>
      </div>

      {/* General Settings */}




      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            {t('Profile Information')}
          </h3>
        </div>
        <div className="p-7">
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="username"
                >
                  {t('Username')}
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="email"
                >
                  {t('Email')}
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="name"
              >
                {t('Full Name')}
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="newPassword"
              >
                {t('New Password')}
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="flex justify-end gap-4.5">
              <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                type="submit"
                disabled={loading}
              >
                {loading ? t('Saving...') : t('Save Changes')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
