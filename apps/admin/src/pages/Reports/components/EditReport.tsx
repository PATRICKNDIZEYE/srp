import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsX } from 'react-icons/bs';

interface EditReportProps {
  reportId: number;
  onClose: () => void;
}

const EditReport: React.FC<EditReportProps> = ({ reportId, onClose }) => {
  const { t } = useTranslation();

  // Dummy data - replace with API call
  const [formData, setFormData] = useState({
    targetNumbersReached: 850,
    genderDisaggregation: {
      male: 400,
      female: 430,
      other: 20,
    },
    budgetUsed: 4600000,
    progressUpdate: 'Successfully conducted health awareness campaigns in 5 sectors',
    challengesFaced: 'Limited transportation in remote areas',
    successStories: 'Increased vaccination rates by 40% in target communities',
    attachments: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement update functionality
    console.log('Updating report:', reportId, formData);
    onClose();
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {t('Edit Report')}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <BsX className="text-2xl" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Beneficiaries Section */}
        <div>
          <h4 className="mb-4 font-semibold text-black dark:text-white">
            {t('Beneficiaries')}
          </h4>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(formData.genderDisaggregation).map(([key, value]) => (
              <div key={key}>
                <label className="mb-2.5 block text-black dark:text-white">
                  {t(key)}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    genderDisaggregation: {
                      ...formData.genderDisaggregation,
                      [key]: Number(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Budget Section */}
        <div>
          <h4 className="mb-4 font-semibold text-black dark:text-white">
            {t('Budget')}
          </h4>
          <div>
            <label className="mb-2.5 block text-black dark:text-white">
              {t('Budget Used (RWF)')}
            </label>
            <input
              type="number"
              value={formData.budgetUsed}
              onChange={(e) => setFormData({
                ...formData,
                budgetUsed: Number(e.target.value)
              })}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
            />
          </div>
        </div>

        {/* Progress Information */}
        <div>
          <h4 className="mb-4 font-semibold text-black dark:text-white">
            {t('Progress Information')}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                {t('Progress Update')}
              </label>
              <textarea
                value={formData.progressUpdate}
                onChange={(e) => setFormData({
                  ...formData,
                  progressUpdate: e.target.value
                })}
                rows={4}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                {t('Challenges Faced')}
              </label>
              <textarea
                value={formData.challengesFaced}
                onChange={(e) => setFormData({
                  ...formData,
                  challengesFaced: e.target.value
                })}
                rows={3}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                {t('Success Stories')}
              </label>
              <textarea
                value={formData.successStories}
                onChange={(e) => setFormData({
                  ...formData,
                  successStories: e.target.value
                })}
                rows={3}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
              />
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div>
          <h4 className="mb-4 font-semibold text-black dark:text-white">
            {t('Update Attachments')}
          </h4>
          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setFormData({
                ...formData,
                attachments: files
              });
            }}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stroke px-6 py-2.5 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            {t('Cancel')}
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
          >
            {t('Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReport; 