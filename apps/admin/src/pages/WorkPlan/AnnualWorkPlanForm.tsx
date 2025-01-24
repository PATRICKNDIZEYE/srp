import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { AnnualTarget } from '../../types';
import { ngoService } from '../../services/ngoService';

const workPlanSchema = z.object({
  activityName: z.string().min(1, 'Activity name is required'),
  activityDescription: z.string().min(10, 'Description must be at least 10 characters'),
  areaOfIntervention: z.string().min(1, 'Area of intervention is required'),
  relevantIndicators: z.string().min(1, 'At least one indicator is required'),
  targetForSelectedIndicator: z.string().min(1, 'Target value is required'),
  targetedBeneficiaries: z.string().min(1, 'Target beneficiaries are required'),
  targetNumbers: z.number().min(1, 'Target number must be greater than 0'),
  genderDisaggregation: z.object({
    male: z.number(),
    female: z.number(),
    other: z.number()
  }),
  district: z.string().min(1, 'District is required'),
  sector: z.string().min(1, 'Sector is required'),
  cell: z.string().min(1, 'Cell is required'),
  plannedBudget: z.number().min(0, 'Budget must be 0 or greater'),
  startDate: z.date(),
  endDate: z.date()
});

const AnnualWorkPlanForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<AnnualTarget>({
    resolver: zodResolver(workPlanSchema)
  });

  const areaOfIntervention = watch('areaOfIntervention');

  // Dynamic indicators based on area of intervention
  const getRelevantIndicators = (area: string) => {
    switch (area) {
      case 'Community Healing':
        return [
          'Identified issues affecting community healing',
          'Percentage of citizens reporting improved readiness to share sensitive stories'
        ];
      case 'Social Reintegration':
        return [
          'Percentage of people reintegrated into families and communities',
          'Rate of decrease in recidivism due to interventions'
        ];
      case 'Social Cohesion':
        return [
          'Proportion of conflicts managed effectively',
          'Participation rate in community activities'
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (data: AnnualTarget) => {
    try {
      setIsSubmitting(true);
      await ngoService.submitAnnualTarget(data);
      // Show success message and redirect
    } catch (error) {
      // Handle error
      console.error('Work plan submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {t('Annual Work Plan')}
        </h2>
        <p className="text-sm text-gray-500">
          {t('Define your activities and targets for the year')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Activity Details */}
        <div className="rounded-sm border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            {t('Activity Details')}
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                {t('Activity Name')}
              </label>
              <input
                type="text"
                {...register('activityName')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.activityName && (
                <p className="mt-1 text-xs text-danger">{errors.activityName.message}</p>
              )}
            </div>

            {/* Add other form fields following the same pattern */}
          </div>
        </div>

        {/* Continue with other sections */}
      </form>
    </div>
  );
};

export default AnnualWorkPlanForm; 