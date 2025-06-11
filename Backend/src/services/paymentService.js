const PayPal = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypal');
const Payment = require('../models/Payment');
const Class = require('../models/Class');
const Event = require('../models/Event');
const Enrollment = require('../models/Enrollment');
const EventRegistration = require('../models/EventRegistration');

class PaymentService {
  async createPaymentOrder(options) {
    try {
      const { 
        userId, 
        itemId, 
        itemType,
        amount,
        description,
        metadata = {} 
      } = options;

      console.log("Creating PayPal payment:", { itemType, itemId, amount });

      // Validate amount
      let validatedAmount = parseFloat(amount);
      if (isNaN(validatedAmount) || validatedAmount <= 0) {
        throw new Error('Invalid payment amount');
      }

      // Convert LKR to USD (update rate as needed)
      const exchangeRate = 303;
      const amountInUSD = (validatedAmount / exchangeRate).toFixed(2);
      
      console.log(`Converting ${validatedAmount} LKR to ${amountInUSD} USD`);
      
      // Create PayPal order
      const request = new PayPal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      
      const baseClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const baseServerUrl = process.env.SERVER_URL || 'http://localhost:5000';
      
      // Include payment ID in the return URL as a query parameter
      const successUrl = `${baseServerUrl}/api/payments/paypal/return`;
      const cancelUrl = `${baseServerUrl}/api/payments/paypal/cancel`;
      
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amountInUSD
          },
          description: description || `Payment for ${itemType}`
        }],
        application_context: {
          return_url: successUrl,
          cancel_url: cancelUrl,
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING'
        }
      });

      const order = await client.execute(request);
      console.log("PayPal order created:", order.result.id);
      
      const links = order.result.links;
      const approvalUrl = links.find(link => link.rel === 'approve')?.href;
      
      if (!approvalUrl) {
        throw new Error('PayPal approval URL not found');
      }
      
      // Save payment record
      const payment = await Payment.create({
        user: userId,
        itemType: itemType,
        itemId: itemId,
        itemModelName: itemType === 'class' ? 'Class' : itemType === 'event' ? 'Event' : undefined,
        amount: parseFloat(amountInUSD),
        amountLKR: validatedAmount,
        currency: 'USD',
        exchangeRate: exchangeRate,
        description: description,
        paypalOrderId: order.result.id,
        status: 'pending',
        metadata: {
          ...metadata,
          amountUSD: amountInUSD,
          exchangeRate: exchangeRate,
          userId: userId // Store user ID for later reference
        }
      });

      return {
        success: true,
        data: {
          orderId: order.result.id,
          status: order.result.status,
          approvalUrl: approvalUrl,
          paymentId: payment._id,
          amountLKR: validatedAmount,
          amountUSD: amountInUSD
        }
      };
    } catch (error) {
      console.error(`Payment order creation failed:`, error);
      return {
        success: false,
        error: error.message || 'Payment order creation failed'
      };
    }
  }

  async capturePaymentByToken(token) {
    try {
      console.log("Capturing PayPal payment by token:", token);

      // Find payment record by PayPal order ID (token)
      const payment = await Payment.findOne({ paypalOrderId: token });
      if (!payment) {
        throw new Error('Payment record not found for token: ' + token);
      }

      // Capture the payment using the token
      const request = new PayPal.orders.OrdersCaptureRequest(token);
      const capture = await client.execute(request);

      console.log("PayPal capture result:", capture.result);

      if (capture.result.status === 'COMPLETED') {
        // Update payment record
        payment.status = 'completed';
        payment.paymentDate = new Date();
        payment.paypalCaptureId = capture.result.purchase_units[0].payments.captures[0].id;
        await payment.save();

        // Handle post-payment actions
        await this.handleSuccessfulPayment(payment);

        return {
          success: true,
          data: {
            paymentId: payment._id,
            captureId: payment.paypalCaptureId,
            status: payment.status,
            payment: payment
          }
        };
      } else {
        payment.status = 'failed';
        await payment.save();
        throw new Error('Payment capture failed');
      }
    } catch (error) {
      console.error('Payment capture error:', error);
      return {
        success: false,
        error: error.message || 'Payment capture failed'
      };
    }
  }

  async capturePayment(orderId) {
    try {
      console.log("Capturing PayPal payment:", orderId);

      // Find payment record
      const payment = await Payment.findOne({ paypalOrderId: orderId });
      if (!payment) {
        throw new Error('Payment record not found');
      }

      // Capture the payment
      const request = new PayPal.orders.OrdersCaptureRequest(orderId);
      const capture = await client.execute(request);

      console.log("PayPal capture result:", capture.result);

      if (capture.result.status === 'COMPLETED') {
        // Update payment record
        payment.status = 'completed';
        payment.paymentDate = new Date();
        payment.paypalCaptureId = capture.result.purchase_units[0].payments.captures[0].id;
        await payment.save();

        // Handle post-payment actions
        await this.handleSuccessfulPayment(payment);

        return {
          success: true,
          data: {
            paymentId: payment._id,
            captureId: payment.paypalCaptureId,
            status: payment.status
          }
        };
      } else {
        payment.status = 'failed';
        await payment.save();
        throw new Error('Payment capture failed');
      }
    } catch (error) {
      console.error('Payment capture error:', error);
      return {
        success: false,
        error: error.message || 'Payment capture failed'
      };
    }
  }

  async handleSuccessfulPayment(payment) {
    try {
      console.log("Handling successful payment:", payment._id);

      if (payment.itemType === 'class' && payment.itemId) {
        // Auto-enroll student in class
        const existingEnrollment = await Enrollment.findOne({
          student: payment.user,
          class: payment.itemId
        });

        if (!existingEnrollment) {
          await Enrollment.create({
            student: payment.user,
            class: payment.itemId,
            paymentStatus: 'paid',
            status: 'active'
          });
          console.log("Student enrolled in class:", payment.itemId);
        } else {
          // Update existing enrollment
          existingEnrollment.paymentStatus = 'paid';
          existingEnrollment.status = 'active';
          await existingEnrollment.save();
          console.log("Enrollment updated to paid:", existingEnrollment._id);
        }
      } else if (payment.itemType === 'event' && payment.itemId) {
        // Auto-register student for event
        const existingRegistration = await EventRegistration.findOne({
          user: payment.user,
          event: payment.itemId
        });

        if (!existingRegistration) {
          await EventRegistration.create({
            user: payment.user,
            event: payment.itemId,
            status: 'confirmed'
          });
          console.log("Student registered for event:", payment.itemId);
        }
      }
    } catch (error) {
      console.error('Error handling successful payment:', error);
    }
  }

  async refundPayment(paymentId, reason = '') {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return {
          success: false,
          message: 'Payment not found'
        };
      }

      if (payment.status !== 'completed') {
        return {
          success: false,
          message: 'Only completed payments can be refunded'
        };
      }

      // For now, we'll mark as refunded without actual PayPal refund
      // In production, you'd use PayPal's refund API
      payment.status = 'refunded';
      payment.refundAmount = payment.amountLKR;
      payment.refundDate = new Date();
      payment.refundReason = reason;
      
      await payment.save();

      return {
        success: true,
        data: payment,
        message: 'Payment refunded successfully'
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async generatePaymentSlip(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .populate('user', 'name email')
        .populate('itemId', 'name');

      if (!payment) {
        return {
          success: false,
          message: 'Payment not found'
        };
      }

      // Generate payment slip data
      const paymentSlip = {
        paymentId: payment._id,
        transactionId: payment.paypalCaptureId || payment.paypalOrderId,
        user: {
          name: payment.user.name,
          email: payment.user.email
        },
        item: {
          type: payment.itemType,
          name: payment.itemId?.name || 'N/A',
          description: payment.description
        },
        amount: {
          lkr: payment.amountLKR,
          usd: payment.amount,
          exchangeRate: payment.exchangeRate
        },
        status: payment.status,
        paymentDate: payment.paymentDate || payment.createdAt,
        canRefund: payment.canRefund,
        refundInfo: payment.status === 'refunded' ? {
          amount: payment.refundAmount,
          date: payment.refundDate,
          reason: payment.refundReason
        } : null
      };

      return {
        success: true,
        data: paymentSlip
      };
    } catch (error) {
      console.error('Error generating payment slip:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new PaymentService();