import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import ErrorMessage from '../../components/ErrorMessage';

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage('Email not found. Please try logging in again.');
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const response = await axiosInstance.post('/verify-opt-foradmin', {
                email,
                otp,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                toast.success('Login successful!');
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('OTP verification error:', error);
            setErrorMessage(error.parsedMessage || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-boxdark-2">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    {errorMessage && (
                        <ErrorMessage
                            message={errorMessage}
                            onClose={() => setErrorMessage(null)}
                        />
                    )}

                    <div className="bg-white dark:bg-boxdark rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-center mb-8">
                            Verify Your Email
                        </h2>

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Enter OTP Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;