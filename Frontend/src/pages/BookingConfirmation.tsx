
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MPesaPayment } from "@/components/MPesaPayment";
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone } from "lucide-react";
import { toast } from "sonner";

interface BookingDetails {
  serviceName: string;
  professionalName: string;
  professionalPhone: string;
  date: string;
  time: string;
  location: string;
  price: number;
  description: string;
}

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const bookingDetails = location.state?.bookingDetails as BookingDetails;

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/');
      return;
    }
  }, [bookingDetails, navigate]);

  if (!bookingDetails) {
    return null;
  }

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    setBookingConfirmed(true);
    toast.success('Booking confirmed! You will receive a confirmation SMS shortly.');
    
    // Here you would typically save the booking to your database
    // For now, we'll simulate this with localStorage
    const booking = {
      ...bookingDetails,
      transactionId,
      bookingId: `BK${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    toast.error('Payment failed. Please try again.');
  };

  const generateAccountReference = () => {
    return `FUNDIS${Date.now()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {bookingConfirmed ? 'Booking Confirmed' : 'Confirm Your Booking'}
          </h1>
        </div>

        {!bookingConfirmed ? (
          <div className="space-y-6">
            {/* Booking Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Please review your booking information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{bookingDetails.professionalName}</p>
                        <p className="text-xs text-muted-foreground">{bookingDetails.serviceName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{bookingDetails.professionalPhone}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{bookingDetails.date}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{bookingDetails.time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{bookingDetails.location}</p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    KSh {bookingDetails.price.toLocaleString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            {!showPayment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>Complete your booking by making payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Pay with M-Pesa - KSh {bookingDetails.price.toLocaleString()}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <MPesaPayment
                amount={bookingDetails.price}
                description={`${bookingDetails.serviceName} booking`}
                accountReference={generateAccountReference()}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          </div>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-green-600">Booking Confirmed!</CardTitle>
              <CardDescription>Your service has been successfully booked</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  You will receive a confirmation SMS with the professional's contact details.
                </p>
                <p className="text-sm text-muted-foreground">
                  The professional will contact you shortly to confirm the appointment.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Wait for the professional to contact you</li>
                  <li>• Be available at the scheduled time</li>
                  <li>• Have your payment receipt ready if needed</li>
                </ul>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate('/bookings')}
                  className="flex-1"
                >
                  View My Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;
