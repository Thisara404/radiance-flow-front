// filepath: c:\Users\CHAMA COMPUTERS\Downloads\Sithumini\radiance-flow-front\Frontend\src\pages\PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Receipt, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import PaymentSlip from '../components/PaymentSlip';
import { toast } from '@/hooks/use-toast';
import * as paymentService from '../services/paymentService';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const token = searchParams.get('token');
  
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSlip, setShowSlip] = useState(false);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentSlip();
    } else {
      setLoading(false);
    }
    
    // Show success toast
    toast({
      title: 'Payment Successful!',
      description: 'Your payment has been processed successfully.'
    });
  }, [paymentId]);

  const fetchPaymentSlip = async () => {
    try {
      const response = await paymentService.getPaymentSlip(paymentId);
      if (response.success) {
        setPaymentSlip(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment slip:', error);
      toast({
        title: 'Warning',
        description: 'Payment successful but could not load receipt',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/student-dashboard');
  };

  const handleViewReceipt = () => {
    setShowSlip(true);
  };

  const handleDownloadReceipt = () => {
    if (paymentSlip) {
      // Create receipt content
      const receiptContent = `
RADIANCE DANCE ACADEMY
Payment Receipt

Transaction ID: ${paymentSlip.transactionId}
Payment ID: ${paymentSlip.paymentId}
Date: ${new Date(paymentSlip.paymentDate).toLocaleDateString()}

Customer: ${paymentSlip.user.name}
Email: ${paymentSlip.user.email}

Item: ${paymentSlip.item.name}
Type: ${paymentSlip.item.type.toUpperCase()}
Description: ${paymentSlip.item.description}

Amount (LKR): Rs. ${paymentSlip.amount.lkr.toLocaleString()}
Amount (USD): $${paymentSlip.amount.usd}
Exchange Rate: 1 USD = ${paymentSlip.amount.exchangeRate} LKR

Status: ${paymentSlip.status.toUpperCase()}

Thank you for choosing Radiance Dance Academy!
      `;

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentSlip.paymentId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-green-700">Loading your payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Payment Successful!
            </CardTitle>
            <p className="text-green-600">
              Your transaction has been completed successfully
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• You will receive a confirmation email shortly</li>
                <li>• Your enrollment/registration is now active</li>
                <li>• You can view your receipt below</li>
                <li>• Access your classes/events from your dashboard</li>
              </ul>
            </div>

            {paymentId && paymentSlip && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Payment Details</h3>
                <div className="space-y-1 text-blue-700 text-sm">
                  <p><strong>Payment ID:</strong> {paymentSlip.paymentId}</p>
                  <p><strong>Transaction ID:</strong> {paymentSlip.transactionId}</p>
                  <p><strong>Amount:</strong> Rs. {paymentSlip.amount.lkr.toLocaleString()}</p>
                  <p><strong>Item:</strong> {paymentSlip.item.name}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Home className="mr-2" size={16} />
                Go to Dashboard
              </Button>
              
              {paymentSlip && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleViewReceipt}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Receipt className="mr-2" size={16} />
                    View Receipt
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadReceipt}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="mr-2" size={16} />
                    Download
                  </Button>
                </>
              )}
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                Need help? Contact us at{' '}
                <a href="mailto:support@radiancedance.com" className="text-green-600 hover:underline">
                  support@radiancedance.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Slip Modal */}
        {showSlip && paymentSlip && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Payment Receipt</h2>
                <Button variant="ghost" onClick={() => setShowSlip(false)}>
                  ×
                </Button>
              </div>
              <PaymentSlip payment={paymentSlip} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;