// stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
      apiVersion: '2024-04-10', // Specify the API version
    });
  }

  constructEvent(payload: any, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      'YOUR_STRIPE_WEBHOOK_SECRET',
    );
  }

  handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    // Logic to handle successful payment intent
  }

  handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    // Logic to handle failed payment intent
  }
}
