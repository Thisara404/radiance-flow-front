
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import { Home, Calendar } from 'lucide-react';

export default function PaymentConfirmation() {
  const location = useLocation();
  const { amount, paymentType, method } = location.state || {};

  const paymentOptions = [
    { id: 'monthly', label: 'Monthly Tuition', description: 'Regular monthly class fees' },
    { id: 'registration', label: 'Registration Fee', description: 'One-time registration fee' },
    { id: 'workshop', label: 'Workshop Fee', description: 'Special workshop participation' },
    { id: 'costume', label: 'Costume & Supplies', description: 'Dance costume and accessories' }
  ];

  const selectedOption = paymentOptions.find(option => option.id === paymentType);
  const transactionId = `RDC${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Transaction ID</h4>
                <p className="text-gray-900 font-mono">{transactionId}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Date & Time</h4>
                <p className="text-gray-900">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Payment Method</h4>
                <p className="text-gray-900 capitalize">{method}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Amount Paid</h4>
                <p className="text-gray-900 text-xl font-bold">${amount}</p>
              </div>
            </div>

            {selectedOption && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Payment For</h4>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-medium text-purple-800">{selectedOption.label}</h5>
                  <p className="text-purple-600 text-sm">{selectedOption.description}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receipt Actions */}
        <Card className="bg-white/80 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-800 mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>A confirmation email has been sent to your registered email address</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Your payment will be reflected in your account within 24 hours</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>For monthly tuition payments, your classes are now accessible</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Keep this transaction ID for your records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/student-dashboard">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Home className="mr-2" size={16} />
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/classes">
            <Button variant="outline" className="w-full sm:w-auto">
              <Calendar className="mr-2" size={16} />
              View Classes
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@radiancedance.com" className="text-purple-600 hover:text-purple-700">
              support@radiancedance.com
            </a>{' '}
            or call{' '}
            <a href="tel:+1234567890" className="text-purple-600 hover:text-purple-700">
              (123) 456-7890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
