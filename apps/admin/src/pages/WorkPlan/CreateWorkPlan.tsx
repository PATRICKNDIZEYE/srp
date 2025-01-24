import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsArrowLeft, BsArrowRight, BsCalendar, BsExclamationCircle } from 'react-icons/bs';

interface WorkPlanFormData {
  // Basic Info
  activityName: string;
  activityDescription: string;
  areaOfIntervention: string;
  
  // Indicators & Targets
  relevantIndicators: string[];
  targetForSelectedIndicator: {
    [key: string]: string;
  };
  targetedBeneficiaries: string[];
  targetNumbers: number;
  
  // Gender Data
  genderDisaggregation: {
    male: number;
    female: number;
    other: number;
  };
  
  // Location
  district: string;
  sector: string;
  cell: string;
  
  // Budget & Timeline
  plannedBudget: number;
  startDate: Date | null;
  endDate: Date | null;

  // Additional Details
  challenges: string;
  mitigation: string;
  resources: string[];
  partners: string[];
}

const CreateWorkPlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<WorkPlanFormData>({
    activityName: '',
    activityDescription: '',
    areaOfIntervention: '',
    relevantIndicators: [],
    targetForSelectedIndicator: {},
    targetedBeneficiaries: [],
    targetNumbers: 0,
    genderDisaggregation: {
      male: 0,
      female: 0,
      other: 0
    },
    district: '',
    sector: '',
    cell: '',
    plannedBudget: 0,
    startDate: null,
    endDate: null,
    challenges: '',
    mitigation: '',
    resources: [],
    partners: []
  });

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.activityName.trim()) {
          newErrors.push('Activity name is required');
        }
        if (!formData.areaOfIntervention) {
          newErrors.push('Area of intervention is required');
        }
        if (formData.activityDescription.length < 50) {
          newErrors.push('Activity description must be at least 50 characters');
        }
        break;

      case 2:
        if (formData.relevantIndicators.length === 0) {
          newErrors.push('At least one indicator must be selected');
        }
        formData.relevantIndicators.forEach(indicator => {
          if (!formData.targetForSelectedIndicator[indicator]) {
            newErrors.push(`Target value is required for ${indicator}`);
          }
        });
        if (formData.targetedBeneficiaries.length === 0) {
          newErrors.push('At least one beneficiary group must be selected');
        }
        if (formData.targetNumbers <= 0) {
          newErrors.push('Target number must be greater than 0');
        }
        break;

      case 3:
        const totalGender = formData.genderDisaggregation.male + 
                          formData.genderDisaggregation.female + 
                          formData.genderDisaggregation.other;
        if (totalGender !== formData.targetNumbers) {
          newErrors.push('Gender distribution must equal total target number');
        }
        if (!formData.district) {
          newErrors.push('District is required');
        }
        if (!formData.sector) {
          newErrors.push('Sector is required');
        }
        if (!formData.cell) {
          newErrors.push('Cell is required');
        }
        break;

      case 4:
        if (formData.plannedBudget <= 0) {
          newErrors.push('Planned budget must be greater than 0');
        }
        if (!formData.startDate || !formData.endDate) {
          newErrors.push('Both start and end dates are required');
        }
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
          newErrors.push('End date must be after start date');
        }
        if (!formData.challenges.trim()) {
          newErrors.push('Potential challenges must be identified');
        }
        if (!formData.mitigation.trim()) {
          newErrors.push('Mitigation strategies must be provided');
        }
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Get indicators based on area of intervention
  const getIndicators = (area: string): string[] => {
    switch (area) {
      case 'Community Healing':
        return [
          'Identified issues affecting community healing',
          'Percentage of citizens reporting improved readiness to share sensitive stories',
          'Number of community healing sessions conducted',
          'Percentage of participants reporting improved well-being'
        ];
      case 'Social Reintegration':
        return [
          'Percentage of people reintegrated into families and communities',
          'Rate of decrease in recidivism due to interventions',
          'Number of successful family reunifications',
          'Percentage of beneficiaries engaged in income-generating activities'
        ];
      case 'Social Cohesion':
        return [
          'Proportion of conflicts managed effectively',
          'Participation rate in community activities',
          'Number of inter-community initiatives implemented',
          'Level of trust between community members'
        ];
      default:
        return [];
    }
  };

  // Location data (example)
  const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge'];
  const sectors: { [key: string]: string[] } = {
    Gasabo: ['Gisozi', 'Kimihurura', 'Remera'],
    Kicukiro: ['Gatenga', 'Gikondo', 'Kagarama'],
    Nyarugenge: ['Gitega', 'Kigali', 'Nyamirambo']
  };
  const cells: { [key: string]: string[] } = {
    Gisozi: ['Cell 1', 'Cell 2', 'Cell 3'],
    Kimihurura: ['Cell A', 'Cell B', 'Cell C'],
    // ... add more cells
  };

  const beneficiaryGroups = [
    'Youth',
    'Women',
    'Ex-combatants',
    'Returnees',
    'Elderly',
    'People with Disabilities',
    'Children'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t('Basic Information')}</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Activity Name')} *
              </label>
              <input
                type="text"
                value={formData.activityName}
                onChange={(e) => setFormData({...formData, activityName: e.target.value})}
                className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                placeholder={t('Enter activity name')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Area of Intervention')} *
              </label>
              <select
                value={formData.areaOfIntervention}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    areaOfIntervention: e.target.value,
                    relevantIndicators: []
                  });
                }}
                className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
              >
                <option value="">{t('Select Area')}</option>
                <option value="Community Healing">{t('Community Healing')}</option>
                <option value="Social Reintegration">{t('Social Reintegration')}</option>
                <option value="Social Cohesion">{t('Social Cohesion')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Activity Description')} *
              </label>
              <textarea
                value={formData.activityDescription}
                onChange={(e) => setFormData({...formData, activityDescription: e.target.value})}
                className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                rows={4}
                placeholder={t('Provide a detailed description of the activity')}
              />
              <p className="text-sm text-gray-500 mt-1">
                {t('Minimum 50 characters required')}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t('Indicators and Targets')}</h2>
            
            {formData.areaOfIntervention && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Relevant Indicators')} *
                </label>
                <div className="space-y-2">
                  {getIndicators(formData.areaOfIntervention).map((indicator) => (
                    <div key={indicator} className="flex flex-col space-y-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.relevantIndicators.includes(indicator)}
                          onChange={(e) => {
                            const updatedIndicators = e.target.checked
                              ? [...formData.relevantIndicators, indicator]
                              : formData.relevantIndicators.filter(i => i !== indicator);
                            setFormData({...formData, relevantIndicators: updatedIndicators});
                          }}
                          className="form-checkbox h-5 w-5 text-primary rounded border-gray-300"
                        />
                        <span className="ml-2">{indicator}</span>
                      </label>
                      {formData.relevantIndicators.includes(indicator) && (
                        <input
                          type="text"
                          value={formData.targetForSelectedIndicator[indicator] || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            targetForSelectedIndicator: {
                              ...formData.targetForSelectedIndicator,
                              [indicator]: e.target.value
                            }
                          })}
                          className="ml-7 w-full rounded-lg border border-stroke bg-transparent p-2 outline-none focus:border-primary"
                          placeholder={t('Set target value')}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Target Beneficiaries')} *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {beneficiaryGroups.map((group) => (
                  <label key={group} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetedBeneficiaries.includes(group)}
                      onChange={(e) => {
                        const updatedBeneficiaries = e.target.checked
                          ? [...formData.targetedBeneficiaries, group]
                          : formData.targetedBeneficiaries.filter(b => b !== group);
                        setFormData({...formData, targetedBeneficiaries: updatedBeneficiaries});
                      }}
                      className="form-checkbox h-5 w-5 text-primary rounded border-gray-300"
                    />
                    <span className="ml-2">{group}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Total Target Number')} *
              </label>
              <input
                type="number"
                min="0"
                value={formData.targetNumbers}
                onChange={(e) => setFormData({...formData, targetNumbers: parseInt(e.target.value)})}
                className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t('Gender Distribution and Location')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Male Beneficiaries')} *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.genderDisaggregation.male}
                  onChange={(e) => setFormData({
                    ...formData,
                    genderDisaggregation: {
                      ...formData.genderDisaggregation,
                      male: parseInt(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Female Beneficiaries')} *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.genderDisaggregation.female}
                  onChange={(e) => setFormData({
                    ...formData,
                    genderDisaggregation: {
                      ...formData.genderDisaggregation,
                      female: parseInt(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Other Beneficiaries')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.genderDisaggregation.other}
                  onChange={(e) => setFormData({
                    ...formData,
                    genderDisaggregation: {
                      ...formData.genderDisaggregation,
                      other: parseInt(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('District')} *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      district: e.target.value,
                      sector: '',
                      cell: ''
                    });
                  }}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                >
                  <option value="">{t('Select District')}</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Sector')} *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      sector: e.target.value,
                      cell: ''
                    });
                  }}
                  disabled={!formData.district}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                >
                  <option value="">{t('Select Sector')}</option>
                  {formData.district && sectors[formData.district]?.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Cell')} *
                </label>
                <select
                  value={formData.cell}
                  onChange={(e) => setFormData({...formData, cell: e.target.value})}
                  disabled={!formData.sector}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                >
                  <option value="">{t('Select Cell')}</option>
                  {formData.sector && cells[formData.sector]?.map((cell) => (
                    <option key={cell} value={cell}>
                      {cell}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t('Budget and Timeline')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Planned Budget (RWF)')} *
              </label>
              <input
                type="number"
                min="0"
                value={formData.plannedBudget}
                onChange={(e) => setFormData({...formData, plannedBudget: parseInt(e.target.value)})}
                className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('Start Date')} *
                </label>
                <input
                  type="date"
                  value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, startDate: new Date(e.target.value)})}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('End Date')} *
                </label>
                <input
                  type="date"
                  value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, endDate: new Date(e.target.value)})}
                  className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                  min={formData.startDate ? formData.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Potential Challenges')} *
              </label>
              <textarea
                value={formData.challenges}
                onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                rows={3}
                placeholder={t('Describe potential challenges and risks')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Mitigation Strategies')} *
              </label>
              <textarea
                value={formData.mitigation}
                onChange={(e) => setFormData({...formData, mitigation: e.target.value})}
                className="w-full rounded-lg border border-stroke bg-transparent p-4 outline-none focus:border-primary"
                rows={3}
                placeholder={t('Describe strategies to address challenges')}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      try {
        setIsSubmitting(true);
        // Add API call to submit work plan
        console.log('Submitting work plan:', formData);
        navigate('/work-plans');
      } catch (error) {
        console.error('Error submitting work plan:', error);
        setErrors(['Failed to submit work plan. Please try again.']);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">{t('Create Work Plan')}</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Basic Info', 'Indicators', 'Location', 'Budget'].map((step, index) => (
              <div
                key={step}
                className={`text-sm font-medium ${
                  currentStep > index + 1
                    ? 'text-primary'
                    : currentStep === index + 1
                    ? 'text-primary'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Messages.tsx */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
            <div className="flex items-center gap-2 text-danger mb-2">
              <BsExclamationCircle className="h-5 w-5" />
              <span className="font-medium">{t('Please correct the following errors:')}</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-danger">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-boxdark rounded-lg p-6 shadow-lg">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-2 px-6 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-gray-50"
              >
                <BsArrowLeft />
                {t('Previous')}
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateStep(currentStep)) {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 ml-auto"
              >
                {t('Next')}
                <BsArrowRight />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 ml-auto disabled:opacity-50"
              >
                {isSubmitting ? t('Submitting...') : t('Submit Work Plan')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkPlan; 