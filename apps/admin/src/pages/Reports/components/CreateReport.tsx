import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BsX } from 'react-icons/bs';
import axiosInstance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';
import Select from 'react-select'; // Import react-select

interface AnnualTarget {
  id: number;
  activityName: string;
  activityDescription: string;
  areaOfIntervention: string;
  relevantIndicators: string; // Assuming this is a comma-separated string
  targetForSelectedIndicator: string;
  targetedBeneficiaries: string;
  targetNumbers: number;
  genderDisaggregation: string;
  district: string;
  sector: string;
  cell: string;
  plannedBudget: number;
  startDate: string;
  endDate: string;
}

interface CreateReportProps {
  onClose: () => void;
  onCreate: (data: any) => void;
}

const CreateReport: React.FC<CreateReportProps> = ({ onClose, onCreate }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [annualTargets, setAnnualTargets] = useState<AnnualTarget[]>([]);
  const [selectedAnnualTargetId, setSelectedAnnualTargetId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    relevantIndicators: [] as string[], // Ensure this is an array
    selectedIndicators: [] as string[], // Updated to an array for multi-select
    genderDisaggregation: {
      male: 0,
      female: 0,
      other: 0
    },
    interventionArea: '',
    budgetUsed: 0,
    progressUpdate: '',
    challengesFaced: '',
    successStories: '',
    attachments: [] as File[],
    biannualType: 'FIRST_HALF',
    image: [] as string[],
    status: 'Pending'
  });

  useEffect(() => {
    const fetchAnnualTargets = async () => {
      try {
        const response = await axiosInstance.get('/annual-targets/1/ngo');
        setAnnualTargets(response.data);
      } catch (error) {
        console.error('Error fetching annual targets:', error);
      }
    };

    fetchAnnualTargets();
  }, []);

  const calculateProgress = (plannedBudget: number, budgetUsed: number) => {
    if (plannedBudget === 0) return 0;
    return (budgetUsed / plannedBudget) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnualTargetId) {
      toast.error("Please select an annual target.");
      return;
    }

    const selectedAnnualTarget = annualTargets.find(target => target.id === selectedAnnualTargetId);

    const genderDisaggregationArray = Object.entries(formData.genderDisaggregation).map(
        ([key, value]) => `${key}:${value}`
    );

    // Ensure relevantIndicators is the same as selectedIndicators
    const reportData = {
      annualTargetId: selectedAnnualTargetId,
      relevantIndicators: formData.selectedIndicators, // Set relevantIndicators to selectedIndicators
      selectedIndicators: formData.selectedIndicators,
      progressAgainstTarget: calculateProgress(selectedAnnualTarget.plannedBudget, formData.budgetUsed),
      targetNumbersReached: Object.values(formData.genderDisaggregation).reduce((a, b) => a + b, 0),
      genderDisaggregation: genderDisaggregationArray,
      interventionArea: formData.interventionArea || `${selectedAnnualTarget?.district}, ${selectedAnnualTarget?.sector}, ${selectedAnnualTarget?.cell}`,
      budgetUsed: formData.budgetUsed,
      progressUpdate: formData.progressUpdate,
      challengesFaced: formData.challengesFaced,
      successStories: formData.successStories,
      attachments: formData.attachments.map(file => `documents/${file.name}`),
      biannualType: formData.biannualType,
      image: formData.image,
      status: formData.status
    };

    console.log('Report Data:', reportData); // Log the data to be sent

    try {
      const response = await axiosInstance.post('/biannual-reports', reportData);
      onCreate(response.data);
      toast.success("Report created successfully");
      window.location.reload();
    } catch (error) {
      console.error('Error creating report:', error);
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
            <div className="space-y-4">
              <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
                {t('Select Annual Target')}
              </h4>
              <select
                  value={selectedAnnualTargetId || ''}
                  onChange={(e) => setSelectedAnnualTargetId(Number(e.target.value))}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
              >
                <option value="">{t('Select Annual Target')}</option>
                {annualTargets.map(target => (
                    <option key={target.id} value={target.id}>
                      {target.activityName}
                    </option>
                ))}
              </select>

              {selectedAnnualTargetId && (
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      {t('Select Indicators')}
                    </label>
                    <Select
                        isMulti
                        options={annualTargets.find(target => target.id === selectedAnnualTargetId)?.relevantIndicators.split(',').map(indicator => ({
                          value: indicator.trim(),
                          label: indicator.trim()
                        }))}
                        value={formData.selectedIndicators.map(indicator => ({ value: indicator, label: indicator }))}
                        onChange={(selectedOptions) => setFormData({
                          ...formData,
                          selectedIndicators: selectedOptions.map(option => option.value)
                        })}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                  </div>
              )}
            </div>
        );

      case 2:
        return (
            <div className="space-y-6">
              <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
                {t('Basic Details')}
              </h4>

              <div>
                <label className="mb-2.5 block font-medium">
                  {t('Report Period')}
                </label>
                <select
                    value={formData.biannualType}
                    onChange={(e) => setFormData({ ...formData, biannualType: e.target.value })}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                >
                  <option value="FIRST_HALF">{t('First Half')}</option>
                  <option value="LAST_HALF">{t('last Half')}</option>
                </select>
              </div>

              <div>
                <label className="mb-2.5 block font-medium">
                  {t('Intervention Area')}
                </label>
                <input
                    type="text"
                    value={formData.interventionArea}
                    onChange={(e) => setFormData({ ...formData, interventionArea: e.target.value })}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                />
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('Beneficiaries')}
                </label>
                <div className="grid grid-cols-3 gap-4">
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

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('Budget Used (RWF)')}
                </label>
                <input
                    type="number"
                    value={formData.budgetUsed}
                    onChange={(e) => setFormData({ ...formData, budgetUsed: Number(e.target.value) })}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                />
              </div>
            </div>
        );

      case 3:
        return (
            <div className="space-y-6">
              <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
                {t('Progress Information')}
              </h4>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('Progress Update')}
                </label>
                <textarea
                    value={formData.progressUpdate}
                    onChange={(e) => setFormData({ ...formData, progressUpdate: e.target.value })}
                    rows={4}
                    placeholder={t('Describe the progress made in implementing the activities...')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                />
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('Challenges Faced')}
                </label>
                <textarea
                    value={formData.challengesFaced}
                    onChange={(e) => setFormData({ ...formData, challengesFaced: e.target.value })}
                    rows={3}
                    placeholder={t('Describe any challenges or obstacles encountered...')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                />
              </div>
            </div>
        );

      case 4:
        return (
            <div className="space-y-6">
              <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
                {t('Success Stories & Documentation')}
              </h4>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('Success Stories')}
                </label>
                <textarea
                    value={formData.successStories}
                    onChange={(e) => setFormData({ ...formData, successStories: e.target.value })}
                    rows={4}
                    placeholder={t('Share notable achievements and success stories...')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                />
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('Supporting Documents')}
                </label>
                <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData({
                        ...formData,
                        attachments: files
                      });
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5"
                />
                {formData.attachments.length > 0 && (
                    <div className="mt-4">
                      <h6 className="mb-2 font-medium">{t('Selected Files')}:</h6>
                      <ul className="space-y-2">
                        {Array.from(formData.attachments).map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm">
                              <span>{file.name}</span>
                              <span className="text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                            </li>
                        ))}
                      </ul>
                    </div>
                )}
              </div>
            </div>
        );

      default:
        return null;
    }
  };

  return (
      <div className="fixed inset-0 z-999 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40">
        <div className="relative w-full max-w-xl rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark my-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {t('Create Biannual Report')}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <BsX className="text-2xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="createReportForm">
            {renderStepContent()}

            <div className="flex justify-end gap-4">
              {step > 1 && (
                  <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="rounded-lg border border-stroke px-6 py-2.5 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  >
                    {t('Previous')}
                  </button>
              )}
              <button
                  type="button"
                  onClick={() => {
                    if (step === 4) {
                      document.getElementById('createReportForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  disabled={step === 1 && !selectedAnnualTargetId}
                  className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {step === 4 ? t('Submit') : t('Next')}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateReport;