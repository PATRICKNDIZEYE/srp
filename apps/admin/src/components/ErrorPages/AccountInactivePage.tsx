import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiPhoneCall } from 'react-icons/fi';

const AccountInactivePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FiAlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Konti Yawe Yahagaritswe
        </h1>
        
        <p className="text-gray-600 mb-8">
          Mwihangane, konti yanyu ntikora kubera impamvu z'umutekano. 
          Nyamuneka hamagara POC uri hafi yawe kugira ngo mubiganireho.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => window.location.href = 'tel:+250780000000'}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPhoneCall className="mr-2" />
            Hamagara POC
          </button>

          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-3 text-blue-600 hover:text-blue-800 transition-colors"
          >
            Subira inyuma
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInactivePage; 