import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
  typescript: true,
});

interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  paymentMethodId?: string;  // For frontend tokens
  paymentMethodType?: 'card' | string;
}

const createPaymentIntentHandler = async (
  req: Request<{}, {}, PaymentIntentRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, currency = 'usd', paymentMethodId, paymentMethodType = 'card' } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method_types: [paymentMethodType],
      ...(paymentMethodId && { payment_method: paymentMethodId }),
      confirm: true,
      metadata: {
        integration_method: paymentMethodId ? 'frontend' : 'api_test'
      }
    });

    res.json({
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      requiresAction: paymentIntent.status === 'requires_action'
    });

  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      type: error.type || 'api_error',
      code: error.code
    });
  }
};

router.post(
  '/create-payment-intent',
  (req: Request<{}, {}, PaymentIntentRequest>, res: Response, next: NextFunction) => {
    createPaymentIntentHandler(req, res, next);
  }
);
export default router;