import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PaymentReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const PayerID = searchParams.get('PayerID');
    const paymentId = searchParams.get('paymentId');

    if (token && PayerID) {
      // Payment was successful, redirect to success page
      navigate(`/payment/success?paymentId=${paymentId}&token=${token}`, { replace: true });
    } else {
      // Something went wrong, redirect to cancel page
      navigate('/payment/cancel', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    </div>
  );
}