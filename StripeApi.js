import stripePackage from 'stripe';
import config from './config/default';

export default class StripeApi {
  constructor() {
    this.stripe = stripePackage(config.stripe.private_key);
  }

  chargeCard(paymentInfo) {
    return this.stripe.charges.create({
      amount: paymentInfo.amount,
      currency: 'usd',
      source: paymentInfo.token,
      description: ''
    });
  }
}
