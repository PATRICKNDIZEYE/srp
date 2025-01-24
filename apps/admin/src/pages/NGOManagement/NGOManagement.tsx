import { useTranslation } from 'react-i18next';
import { NGO } from '../../types';
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance
import { BsX, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';

interface NGODetailsModalProps {
  ngo: NGO;
  onClose: () => void;
  onApprove?: () => void;
  onDecline?: () => void;
}

const NGODetailsModal = ({ ngo, onClose, onApprove, onDecline }: NGODetailsModalProps) => {
  const { t } = useTranslation();

  const handleApprove = async () => {
    try {
      await axiosInstance.put(`/ngos/${ngo.id}/status`, { status: 'approved' });
      toast.success(t('NGO approved successfully'));
      if (onApprove) onApprove();
    } catch (error) {
      toast.error(t('Failed to approve NGO'));
      console.error('Error approving NGO:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await axiosInstance.put(`/ngos/${ngo.id}/status`, { status: 'declined' });
      toast.success(t('NGO declined successfully'));
      if (onDecline) onDecline();
    } catch (error) {
      toast.error(t('Failed to decline NGO'));
      console.error('Error declining NGO:', error);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-black dark:text-white">
              {ngo.nameOfTheNGO}
            </h3>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <BsX className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Basic Information */}
            <section>
              <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                {t('Basic Information')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Physical Address')}</p>
                  <p className="text-black dark:text-white">{ngo.physicalAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Operational Address')}</p>
                  <p className="text-black dark:text-white">{ngo.operationalAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('District')}</p>
                  <p className="text-black dark:text-white">{ngo.district}</p>
                </div>
              </div>
            </section>

            {/* Operations */}
            <section>
              <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                {t('Operations')}
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Domains of Intervention')}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ngo.domainsOfIntervention.map((domain, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                      {domain}
                    </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Description of Interventions')}
                  </p>
                  <p className="text-black dark:text-white">{ngo.descriptionOfInterventions}</p>
                </div>
              </div>
            </section>

            {/* Target Groups & Resources */}
            <section>
              <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                {t('Target Groups & Resources')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Target Groups')}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ngo.targetGroups.map((group, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-success/10 text-success text-sm"
                        >
                      {group}
                    </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Annual Estimated Budget')}
                  </p>
                  <p className="text-black dark:text-white">
                    RWF {ngo.annualEstimatedBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                {t('Contact Information')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Legal Representatives')}
                  </p>
                  <p className="text-black dark:text-white">{ngo.nameOfLegalRepresentatives}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Contact Persons')}
                  </p>
                  <p className="text-black dark:text-white">{ngo.nameOfContactPersons}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Phone')}</p>
                  <p className="text-black dark:text-white">{ngo.telForContactPersons}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Email')}</p>
                  <p className="text-black dark:text-white">{ngo.contactPersonsEmail}</p>
                </div>
              </div>
            </section>

            {/* Supporting Documents */}
            <section>
              <h4 className="text-lg font-semibold mb-3 text-black dark:text-white">
                {t('Supporting Documents')}
              </h4>
              <div className="space-y-2">
                {ngo.supportingDocuments.map((doc, index) => (
                    <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <span>Document {index + 1}</span>
                    </a>
                ))}
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            {onApprove && onDecline && (
                <>
                  <button
                      onClick={handleDecline}
                      className="px-6 py-2 rounded-lg border border-danger text-danger hover:bg-danger hover:text-white transition-colors"
                  >
                <span className="flex items-center gap-2">
                  <BsXCircle />
                  {t('Decline')}
                </span>
                  </button>
                  <button
                      onClick={handleApprove}
                      className="px-6 py-2 rounded-lg bg-success text-white hover:bg-success/90 transition-colors"
                  >
                <span className="flex items-center gap-2">
                  <BsCheckCircle />
                  {t('Approve')}
                </span>
                  </button>
                </>
            )}
          </div>
        </div>
      </div>
  );
};

export default NGODetailsModal;