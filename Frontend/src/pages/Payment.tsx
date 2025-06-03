
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';

export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentType, setPaymentType] = useState('');
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    amount: '120.00'
  });

  const paymentOptions = [
    { id: 'monthly', label: 'Monthly Tuition', amount: '120.00', description: 'Regular monthly class fees' },
    { id: 'registration', label: 'Registration Fee', amount: '50.00', description: 'One-time registration fee' },
    { id: 'workshop', label: 'Workshop Fee', amount: '75.00', description: 'Special workshop participation' },
    { id: 'costume', label: 'Costume & Supplies', amount: '45.00', description: 'Dance costume and accessories' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value);
    const selectedOption = paymentOptions.find(option => option.id === value);
    if (selectedOption) {
      handleInputChange('amount', selectedOption.amount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentType) {
      toast({
        title: "Error",
        description: "Please select a payment type",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        toast({
          title: "Error",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }
    }

    // Simulate payment processing
    toast({
      title: "Processing Payment",
      description: "Please wait while we process your payment..."
    });

    setTimeout(() => {
      navigate('/payment-confirmation', { 
        state: { 
          amount: formData.amount,
          paymentType,
          method: paymentMethod 
        }
      });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment</h1>
          <p className="text-gray-600">Complete your payment securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Type Selection */}
                <div>
                  <Label className="text-base font-medium">What are you paying for?</Label>
                  <Select value={paymentType} onValueChange={handlePaymentTypeChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label} - ${option.amount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Method */}
                <div>
                  <Label className="text-base font-medium">Payment Method</Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {paymentMethod === 'bank' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Account Name:</strong> Radiance Dance Academy</p>
                      <p><strong>Account Number:</strong> 1234567890</p>
                      <p><strong>Routing Number:</strong> 987654321</p>
                      <p><strong>Reference:</strong> Use your email as reference</p>
                    </div>
                  </div>
                )}

                {/* PayPal Info */}
                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm">You will be redirected to PayPal to complete your payment securely.</p>
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Pay ${formData.amount}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentType && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800">
                      {paymentOptions.find(option => option.id === paymentType)?.label}
                    </h4>
                    <p className="text-sm text-purple-600 mt-1">
                      {paymentOptions.find(option => option.id === paymentType)?.description}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal:</span>
                    <span>${formData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Processing Fee:</span>
                    <span>$2.50</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${(parseFloat(formData.amount) + 2.50).toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>✓ Secure SSL encryption</p>
                  <p>✓ 100% secure payment processing</p>
                  <p>✓ Instant payment confirmation</p>
                  <p>✓ 24/7 customer support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
