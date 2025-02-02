import React, { useState } from 'react';
import { FiAlertTriangle, FiSend } from 'react-icons/fi';

interface QualityIssueProps {
  onSubmit: (data: {
    milkType: string;
    quantity: string;
    issueType: string;
    description: string;
    action: string;
  }) => void;
}

const QualityIssueReport: React.FC<QualityIssueProps> = ({ onSubmit }) => {
  const [milkType, setMilkType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [action, setAction] = useState('send_to_factory');

  const issueTypes = [
    { value: 'contamination', label: 'Contamination' },
    { value: 'spoilage', label: 'Spoilage' },
    { value: 'abnormal_smell', label: 'Abnormal Smell' },
    { value: 'density_issues', label: 'Density Issues' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      milkType,
      quantity: `${quantity}L`,
      issueType,
      description,
      action,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FiAlertTriangle className="text-red-500 text-xl" />
        <h2 className="text-xl font-semibold">Report Quality Issue</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields for quality issues... */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <FiSend />
            <span>Submit Report</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default QualityIssueReport; 