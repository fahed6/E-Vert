import {
    Alert,
    AlertTitle,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { Box, Flex, Text } from '@radix-ui/themes';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);interface PaymentPopupProps {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
  amount: number;
  currency?: string;
}

const PaymentForm: React.FC<{ 
  onSuccess: (paymentIntentId: string) => void,
  onError: (error: string) => void,
  amount: number,
  currency: string
}> = ({ onSuccess, onError, amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method from card elements
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        throw stripeError;
      }

      // Call your backend to create payment intent
      const response = await fetch('http://localhost:5000/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          paymentMethodId: paymentMethod?.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      if (data.requiresAction) {
        // Handle 3D Secure authentication
        const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret);
        if (confirmError) {
          throw confirmError;
        }
      }

      onSuccess(data.paymentIntentId);
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      onError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold">
          Pay {amount} {currency.toUpperCase()}
        </Text>
        
        <Box style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={!stripe || loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : `Pay ${amount} ${currency.toUpperCase()}`}
        </Button>
      </Flex>
    </form>
  );
};

const PaymentPopup: React.FC<PaymentPopupProps> = ({ 
  open, 
  onClose, 
  onPaymentSuccess,
  amount,
  currency = 'usd'
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handlePaymentSuccess = (id: string) => {
    setPaymentSuccess(true);
    setPaymentIntentId(id);
    onPaymentSuccess(id);
  };

  const handleClose = () => {
    setPaymentSuccess(false);
    setPaymentIntentId(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Text size="4" weight="bold">
          Complete Payment
        </Text>
      </DialogTitle>
      
      <DialogContent>
        {paymentSuccess ? (
          <Flex direction="column" gap="3" align="center">
            <Alert severity="success" sx={{ width: '100%' }}>
              <AlertTitle>Payment Successful</AlertTitle>
              Your payment of {amount} {currency.toUpperCase()} has been processed.
            </Alert>
            <Text size="1" color="gray">
              Payment ID: {paymentIntentId}
            </Text>
          </Flex>
        ) : (
          <Elements stripe={stripePromise}>
            <PaymentForm 
              onSuccess={handlePaymentSuccess} 
              onError={() => {}} 
              amount={amount}
              currency={currency}
            />
          </Elements>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>
          {paymentSuccess ? 'Close' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPopup;