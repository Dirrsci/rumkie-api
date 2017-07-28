import stripePackage from 'stripe';
import config from './config/default';

export default class StripeApi {
  constructor() {
    this.stripe = stripePackage(config.stripe.private_key);
  }

  chargeCard(amount, token) {
    console.log('amount: ', amount);
    console.log('token: ', token);
    return this.stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token.id,
      description: ''
    });
  }

  calculateChargeAmount(numSongs) {
    console.log('numSongs: ', numSongs);
    let amount;
    if (numSongs === 0) amount = 0;
    if (numSongs === 1) amount = 300;
    if (numSongs === 2) amount = 500;
    if (numSongs > 2) amount = numSongs * 200;
    return Promise.resolve(amount);
  }
}
