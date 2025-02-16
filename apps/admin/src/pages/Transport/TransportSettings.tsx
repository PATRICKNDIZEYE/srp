import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheckCircle } from 'react-icons/bs';
import AxiosInstance from "../../utils/axiosInstance.ts";
import { toast } from 'react-toastify';

const TransportSettings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    password: '',
  });
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchSettingsAndOverview = async () => {
      try {
        const response = await AxiosInstance.get(`/transport/${userId}`);
        setSettings({ password: response.data.password });
        setOverview(response.data.overview);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch settings');
      }
    };

    if (userId) {
      fetchSettingsAndOverview();
    } else {
      toast.error('User ID not found in local storage');
    }
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.error('User ID not found in local storage');
      setLoading(false);
      return;
    }

    try {
      await AxiosInstance.patch(`/transport/${userId}/password`, { password: settings.password });
      toast.success('Settings updated successfully');
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          {t('Transport Settings')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('Manage transport preferences and configurations')}
        </p>
      </div>

      {overview && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {t('Overview')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {overview}
          </p>
        </div>
      )}

      {showSuccess && (
        <div className="mb-6">
          <div className="flex items-center gap-3 rounded-lg bg-meta-3 py-4 px-6 text-white">
            <BsCheckCircle className="text-xl" />
            <p>
              {t('Settings have been successfully updated!')}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdateSettings}>
        <div className="mb-5.5">
          <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="password">
            {t('Password')}
          </label>
          <input
            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            type="password"
            name="password"
            id="password"
            value={settings.password}
            onChange={(e) => setSettings({ ...settings, password: e.target.value })}
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
  );
};

export default TransportSettings; 