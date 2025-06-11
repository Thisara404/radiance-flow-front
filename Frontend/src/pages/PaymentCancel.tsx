// filepath: c:\Users\CHAMA COMPUTERS\Downloads\Sithumini\radiance-flow-front\Frontend\src\pages\PaymentSuccess.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-green-800">Payment Successful!</h1>
        <p className="mt-4 text-lg text-green-700">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        <button 
          onClick={handleGoHome} 
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;