import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Download } from 'lucide-react';

interface PaymentSlipType {
  paymentId: string;
  transactionId: string;
  user: {
    name: string;
    email: string;
  };
  item: {
    type: string;
    name: string;
    description: string;
  };
  amount: {
    lkr: number;
    usd: number;
    exchangeRate: number;
  };
  status: string;
  paymentDate: string;
  canRefund: boolean;
  refundInfo?: {
    amount: number;
    date: string;
    reason: string;
  };
}

interface PaymentSlipProps {
  payment: PaymentSlipType;
  onRefund?: (paymentId: string) => void;
  showRefundButton?: boolean;
}

const PaymentSlip: React.FC<PaymentSlipProps> = ({ 
  payment, 
  onRefund, 
  showRefundButton = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text receipt
    const receiptText = `
RADIANCE DANCE ACADEMY
Payment Receipt

Transaction ID: ${payment.transactionId}
Payment ID: ${payment.paymentId}
Date: ${new Date(payment.paymentDate).toLocaleDateString()}

Customer: ${payment.user.name}
Email: ${payment.user.email}

Item: ${payment.item.name}
Description: ${payment.item.description}
Type: ${payment.item.type.toUpperCase()}

Amount (LKR): ${payment.amount.lkr.toLocaleString()}
Amount (USD): $${payment.amount.usd}
Exchange Rate: 1 USD = ${payment.amount.exchangeRate} LKR

Status: ${payment.status.toUpperCase()}

${payment.refundInfo ? `
REFUND INFORMATION:
Refund Amount: ${payment.refundInfo.amount.toLocaleString()} LKR
Refund Date: ${new Date(payment.refundInfo.date).toLocaleDateString()}
Reason: ${payment.refundInfo.reason}
` : ''}

Thank you for choosing Radiance Dance Academy!
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.paymentId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center border-b">
        <CardTitle className="text-2xl font-bold">Payment Receipt</CardTitle>
        <p className="text-gray-600">Radiance Dance Academy</p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Transaction Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700">Transaction ID</h4>
            <p className="font-mono text-sm">{payment.transactionId}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Payment ID</h4>
            <p className="font-mono text-sm">{payment.paymentId}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Date</h4>
            <p>{new Date(payment.paymentDate).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Status</h4>
            <Badge className={getStatusColor(payment.status)}>
              {payment.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Name</h4>
              <p>{payment.user.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Email</h4>
              <p>{payment.user.email}</p>
            </div>
          </div>
        </div>

        {/* Item Info */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Payment Details</h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium">{payment.item.name}</h4>
            <p className="text-gray-600 text-sm">Type: {payment.item.type}</p>
            <p className="text-gray-600 text-sm mt-1">{payment.item.description}</p>
          </div>
        </div>

        {/* Amount Info */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Amount</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">LKR Amount</h4>
              <p className="text-xl font-bold">Rs. {payment.amount.lkr.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">USD Amount</h4>
              <p className="text-xl font-bold">${payment.amount.usd}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Exchange Rate</h4>
              <p>1 USD = {payment.amount.exchangeRate} LKR</p>
            </div>
          </div>
        </div>

        {/* Refund Info */}
        {payment.refundInfo && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Refund Information</h3>
            <div className="bg-red-50 p-4 rounded-lg">
              <p><strong>Refund Amount:</strong> Rs. {payment.refundInfo.amount.toLocaleString()}</p>
              <p><strong>Refund Date:</strong> {new Date(payment.refundInfo.date).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> {payment.refundInfo.reason}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t pt-4 flex flex-wrap gap-3 justify-center">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2" size={16} />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2" size={16} />
            Download
          </Button>
          {showRefundButton && payment.canRefund && payment.status === 'completed' && onRefund && (
            <Button 
              onClick={() => onRefund(payment.paymentId)} 
              variant="destructive"
            >
              Request Refund
            </Button>
          )}
        </div>

        {/* Refund eligibility notice */}
        {payment.status === 'completed' && (
          <div className="border-t pt-4 text-center text-sm text-gray-600">
            {payment.canRefund ? (
              <p className="text-green-600">✓ This payment is eligible for refund (within 7 days)</p>
            ) : (
              <p className="text-red-600">✗ Refund period has expired (7-day limit)</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSlip;