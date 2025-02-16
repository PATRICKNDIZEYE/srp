import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedFarmerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if farmer is pending
  if (user.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mutegereze Kwemezwa
            </h2>
            <p className="text-gray-600 mb-4">
              POC uri hafi yanyu agomba kubanza kubemeza kugirango mubashe gukoresha system. 
              Murabimenyeshwa mukimara kwemezwa.
            </p>
            <p className="text-sm text-gray-500">
              Murakoze kwihangana
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if farmer is rejected
  if (user.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Kwiyandikisha Byanzwe
            </h2>
            <p className="text-gray-600 mb-4">
              Mwihangane, kwiyandikisha kwanyu ntabwo byemewe. 
              Mushobora guhamagara POC uri hafi yanyu kugirango mubiganireho.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedFarmerRoute; 