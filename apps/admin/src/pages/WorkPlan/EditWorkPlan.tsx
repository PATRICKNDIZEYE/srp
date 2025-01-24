import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BsPlus, BsTrash } from 'react-icons/bs';

interface Indicator {
  id?: number;
  name: string;
  description: string;
  targetValue: number;
  unit: string;
}

const EditWorkPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    activityName: '',
    activityDescription: '',
    areaOfIntervention: '',
    targetNumbers: 0,
    plannedBudget: 0,
    startDate: '',
    endDate: '',
    status: 'active',
    indicators: [] as Indicator[],
    interventionAreas: [] as string[]
  });

  useEffect(() => {
    const fetchWorkPlan = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app, fetch from API
        setFormData({
          activityName: 'Community Healing Workshop Series',
          activityDescription: 'Healthcare services in rural areas',
          areaOfIntervention: 'Community Healing',
          targetNumbers: 150,
          plannedBudget: 5000000,
          startDate: '2024-03-01',
          endDate: '2024-06-30',
          status: 'active',
          indicators: [
            {
              id: 1,
              name: 'Number of workshops',
              description: 'Total number of workshops conducted',
              targetValue: 24,
              unit: 'workshops'
            }
          ],
          interventionAreas: ['Gasabo / Health / Cell A']
        });
      } catch (error) {
        toast.error(t('Failed to fetch work plan'));
        navigate('/work-plans');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkPlan();
  }, [id, navigate, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('Work Plan updated successfully'));
      navigate('/work-plans');
    } catch (error) {
      toast.error(t('Failed to update work plan'));
    } finally {
      setLoading(false);
    }
  };

  const addIndicator = () => {
    setFormData({
      ...formData,
      indicators: [
        ...formData.indicators,
        { name: '', description: '', targetValue: 0, unit: '' }
      ]
    });
  };

  const removeIndicator = (index: number) => {
    setFormData({
      ...formData,
      indicators: formData.indicators.filter((_, i) => i !== index)
    });
  };

  const updateIndicator = (index: number, field: keyof Indicator, value: string | number) => {
    const newIndicators = [...formData.indicators];
    newIndicators[index] = { ...newIndicators[index], [field]: value };
    setFormData({ ...formData, indicators: newIndicators });
  };

  const addInterventionArea = () => {
    setFormData({
      ...formData,
      interventionAreas: [...formData.interventionAreas, '']
    });
  };

  const removeInterventionArea = (index: number) => {
    setFormData({
      ...formData,
      interventionAreas: formData.interventionAreas.filter((_, i) => i !== index)
    });
  };

  const updateInterventionArea = (index: number, value: string) => {
    const newAreas = [...formData.interventionAreas];
    newAreas[index] = value;
    setFormData({ ...formData, interventionAreas: newAreas });
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="relative after:absolute after:left-0 after:top-1/2 after:h-0.5 after:w-full after:-translate-y-1/2 after:bg-stroke after:content-[''] dark:after:bg-strokedark">
        <div className="relative z-10 flex items-center justify-between">
          {[
            t('Basic Info'),
            t('Timeline'),
            t('Indicators'),
            t('Areas')
          ].map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => setCurrentStep(index + 1)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 sm:h-11 sm:w-11
                  ${currentStep >= index + 1
                    ? 'bg-primary text-white'
                    : 'border border-stroke bg-white text-body hover:border-primary hover:bg-primary/30 dark:border-strokedark dark:bg-boxdark'
                  }`}
              >
                {index + 1}
              </button>
              <span className="mt-2 hidden text-sm font-medium text-body sm:block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFormCard = (title: string, children: React.ReactNode) => (
    <div className="rounded-sm border border-stroke bg-white shadow-default transition-all duration-300 hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke p-4 dark:border-strokedark sm:p-6.5">
        <h3 className="font-medium text-black dark:text-white">
          {title}
        </h3>
      </div>
      <div className="p-4 sm:p-6.5">
        {children}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderFormCard(t('Basic Information'),
          <div className="space-y-4">
            {/* Activity Name */}
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                {t('Activity Name')} <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.activityName}
                onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder={t('Enter activity name')}
              />
            </div>

            {/* Activity Description */}
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                {t('Activity Description')} <span className="text-danger">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.activityDescription}
                onChange={(e) => setFormData({ ...formData, activityDescription: e.target.value })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder={t('Describe the activity')}
              />
            </div>

            {/* Area of Intervention */}
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                {t('Area of Intervention')} <span className="text-danger">*</span>
              </label>
              <select
                value={formData.areaOfIntervention}
                onChange={(e) => setFormData({ ...formData, areaOfIntervention: e.target.value })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="">{t('Select Area')}</option>
                <option value="Community Healing">{t('Community Healing')}</option>
                <option value="Social Reintegration">{t('Social Reintegration')}</option>
                <option value="Social Cohesion">{t('Social Cohesion')}</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return renderFormCard(t('Targets & Timeline'),
          <div className="space-y-4">
            {/* Target Numbers */}
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                {t('Target Numbers')} <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={formData.targetNumbers}
                onChange={(e) => setFormData({ ...formData, targetNumbers: Number(e.target.value) })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            {/* Planned Budget */}
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                {t('Planned Budget (RWF)')} <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={formData.plannedBudget}
                onChange={(e) => setFormData({ ...formData, plannedBudget: Number(e.target.value) })}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('Start Date')} <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t('End Date')} <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return renderFormCard(t('Indicators'),
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-black dark:text-white">
                {t('Indicator')}
              </h4>
              <button
                type="button"
                onClick={addIndicator}
                className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80"
              >
                <BsPlus className="text-xl" />
                {t('Add Indicator')}
              </button>
            </div>

            {formData.indicators.map((indicator, index) => (
              <div key={index} className="mb-4.5 border-b border-stroke pb-4.5">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-black dark:text-white">
                    {t('Indicator')} #{index + 1}
                  </h5>
                  <button
                    type="button"
                    onClick={() => removeIndicator(index)}
                    className="text-danger hover:text-opacity-80"
                  >
                    <BsTrash className="text-xl" />
                  </button>
                </div>

                {/* Indicator Name */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    {t('Name')} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={indicator.name}
                    onChange={(e) => updateIndicator(index, 'name', e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* Indicator Description */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    {t('Description')} <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={indicator.description}
                    onChange={(e) => updateIndicator(index, 'description', e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* Target Value and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      {t('Target Value')} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      value={indicator.targetValue}
                      onChange={(e) => updateIndicator(index, 'targetValue', Number(e.target.value))}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      {t('Unit')} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={indicator.unit}
                      onChange={(e) => updateIndicator(index, 'unit', e.target.value)}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return renderFormCard(t('Intervention Areas'),
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-black dark:text-white">
                {t('Area')}
              </h4>
              <button
                type="button"
                onClick={addInterventionArea}
                className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80"
              >
                <BsPlus className="text-xl" />
                {t('Add Area')}
              </button>
            </div>

            {formData.interventionAreas.map((area, index) => (
              <div key={index} className="mb-4.5 flex items-center gap-4">
                <select
                  value={area}
                  onChange={(e) => updateInterventionArea(index, e.target.value)}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">{t('Select Area')}</option>
                  <option value="Gasabo / Health / Cell A">Gasabo / Health / Cell A</option>
                  <option value="Kicukiro / Health / Cell B">Kicukiro / Health / Cell B</option>
                  {/* Add more options */}
                </select>
                <button
                  type="button"
                  onClick={() => removeInterventionArea(index)}
                  className="text-danger hover:text-opacity-80"
                >
                  <BsTrash className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-270">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {t('Edit Work Plan')}
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/work-plans" className="font-medium text-primary hover:underline">
                {t('Work Plans')}
              </Link>
            </li>
            <li className="text-primary">/</li>
            <li className="text-black dark:text-white">{t('Edit Work Plan')}</li>
          </ol>
        </nav>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-6">
        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="mx-auto max-w-180">
          <div className="mb-6">
            {renderStepContent()}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="rounded-lg border border-stroke px-6 py-2.5 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                {t('Previous')}
              </button>
            )}
            <button
              type={currentStep === 4 ? 'submit' : 'button'}
              onClick={() => currentStep < 4 && setCurrentStep(prev => prev + 1)}
              className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              {currentStep === 4 ? t('Update Work Plan') : t('Next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkPlan; 