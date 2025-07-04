
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { mpesaService } from "@/services/mpesaService";
import { toast } from "sonner";

interface MPesaPaymentProps {
  amount: number;
  description: string;
  accountReference: string;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
}

export const MPesaPayment: React.FC<MPesaPaymentProps> = ({
  amount,
  description,
  accountReference,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [checkoutRequestID, setCheckoutRequestID] = useState<string>('');

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhoneNumber(value);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Kenyan phone number validation
    const cleanPhone = phone.replace(/\D/g, '');
    return /^(254|0)?[17]\d{8}$/.test(cleanPhone);
  };

  const initiatePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid Kenyan phone number');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');

    try {
      const response = await mpesaService.initiateSTKPush(
        phoneNumber,
        amount,
        accountReference,
        description
      );

      console.log('STK Push Response:', response);

      if (response.ResponseCode === '0') {
        setCheckoutRequestID(response.CheckoutRequestID);
        toast.success('Payment request sent! Please check your phone and enter your M-Pesa PIN.');
        
        // Start polling for payment status
        pollPaymentStatus(response.CheckoutRequestID);
      } else {
        throw new Error(response.ResponseDescription || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast.error(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 5 minutes (30 * 10 seconds)

    const poll = async () => {
      try {
        const status = await mpesaService.querySTKPushStatus(checkoutRequestID);
        console.log('Payment Status:', status);

        if (status.ResultCode === '0') {
          // Payment successful
          setPaymentStatus('success');
          toast.success('Payment completed successfully!');
          onPaymentSuccess(status.MpesaReceiptNumber || checkoutRequestID);
          return;
        } else if (status.ResultCode && status.ResultCode !== '1032') {
          // Payment failed (1032 means still processing)
          setPaymentStatus('failed');
          toast.error(status.ResultDesc || 'Payment failed');
          onPaymentError(status.ResultDesc || 'Payment failed');
          return;
        }

        // Still processing, continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          // Timeout
          setPaymentStatus('failed');
          toast.error('Payment timeout. Please try again.');
          onPaymentError('Payment timeout');
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus('failed');
          toast.error('Unable to verify payment status');
          onPaymentError('Unable to verify payment status');
        }
      }
    };

    // Start polling after 5 seconds
    setTimeout(poll, 5000);
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    if (phone.length <= 9) return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="h-6 w-6 text-green-600" />
          M-Pesa Payment
        </CardTitle>
        <CardDescription>
          Pay KSh {amount.toLocaleString()} for {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentStatus === 'idle' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678 or 254712345678"
                value={formatPhoneNumber(phoneNumber)}
                onChange={handlePhoneNumberChange}
                maxLength={15}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Enter your M-Pesa registered phone number
              </p>
            </div>
            
            <Button
              onClick={initiatePayment}
              disabled={!phoneNumber || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay KSh ${amount.toLocaleString()}`
              )}
            </Button>
          </>
        )}

        {paymentStatus === 'pending' && (
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
            <div>
              <h3 className="font-semibold">Payment Request Sent</h3>
              <p className="text-sm text-muted-foreground">
                Check your phone for the M-Pesa prompt and enter your PIN
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
            <div>
              <h3 className="font-semibold text-green-600">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your payment has been processed successfully
              </p>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center space-y-4">
            <XCircle className="h-8 w-8 mx-auto text-red-600" />
            <div>
              <h3 className="font-semibold text-red-600">Payment Failed</h3>
              <p className="text-sm text-muted-foreground">
                Please try again or contact support
              </p>
            </div>
            <Button
              onClick={() => {
                setPaymentStatus('idle');
                setPhoneNumber('');
              }}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
