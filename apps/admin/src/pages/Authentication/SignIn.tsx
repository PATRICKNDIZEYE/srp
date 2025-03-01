import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';


interface SignInForm {
  email: string;
  password: string;
}



interface OtpForm {
  otp: string;
}

const SignIn = () => {
  const [formData, setFormData] = useState<SignInForm>({
    email: '',
    password: '',
  });
  const [otpData, setOtpData] = useState<OtpForm>({ otp: '' });
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axiosInstance.post('/loginAdmin', {
        email: formData.email.trim(),
        password: formData.password
      });

      if (response.status === 200) {
        toast.success(response.data.message || 'Login successful');
        navigate('/admin/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error('Error:', error);
    const message = error.response?.data?.message || error.message || 'An error occurred';
    setErrorMessage(message);
    toast.error(message);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-boxdark-2 flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Login
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Continue to the system by signing in 
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        {!showOtpInput ? (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <div className='mt-4 text-center text-sm text-gray-500 dark:text-gray-400'>
            You don't have an account? please talk to Administration
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
