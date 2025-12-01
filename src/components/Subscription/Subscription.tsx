import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { calculatePricing, formatPrice, getAvailableCurrencies, detectUserCurrency } from '../../utils/pricing';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Subscription() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => detectUserCurrency());
  const { t, i18n } = useTranslation();

  useEffect(() => {
    ReactGA.set({
      userId: user?.uid,
      email: user?.email,
    });
    ReactGA.event({
      category: 'User',
      action: 'Viewed Subscription Page',
      label: user?.email || '',
    });
  }, [user]);

  // Get pricing data based on selected currency
  const pricingData = calculatePricing(selectedCurrency);
  const availableCurrencies = getAvailableCurrencies();

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      ReactGA.event({
        category: 'User',
        action: 'Clicked on Payment Button',
        label: 'No Coupon',
      });
      
      setError(null);

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const requestBody = {
        userId: user?.uid,
        userEmail: user?.email,
      };
      
      console.log('Creating checkout session with:', requestBody);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/subscription/create-monthly-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const session = await response.json();

      if (session.error) {
        console.log(session.error);
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(t('subscription.error_processing'));
    } finally {
      setIsLoading(false);
    }
  };

  const features: string[] = t('subscription.features', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            {t('subscription.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400"
          >
            {t('subscription.subtitle')}
          </motion.p>
        </div>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/20 relative overflow-hidden"
          >
            {/* Currency Selector */}
            <div className="text-center mb-6">
              <label className="block text-sm text-zinc-400 mb-2">
                {t('subscription.select_currency', { defaultValue: 'Select your currency' })}
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableCurrencies.map((curr) => (
                  <option key={curr.key} value={curr.key}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center mb-8">
              <div className="mb-2">
                <div className="text-4xl font-bold text-blue-500">
                  {formatPrice(pricingData.price, pricingData)}
                  <span className="text-base font-normal text-zinc-400 ml-2">/ {t('common.month', { defaultValue: 'month' })}</span>
                </div>
              </div>
              <p className="text-zinc-400">{t('subscription.cancel_anytime', { defaultValue: 'Cancel anytime' })}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('subscription.processing')}
                </div>
              ) : (
                t('subscription.buy_now')
              )}
            </button>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-4">{t('subscription.why_buy_title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-blue-400">{t('subscription.why_practical_title')}</h4>
              <p className="text-zinc-400">
                {t('subscription.why_practical_desc')}
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-purple-400">{t('subscription.why_updated_title')}</h4>
              <p className="text-zinc-400">
                {t('subscription.why_updated_desc')}
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-yellow-400">{t('subscription.why_career_title')}</h4>
              <p className="text-zinc-400">
                {t('subscription.why_career_desc')}
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-orange-400">{t('subscription.why_community_title')}</h4>
              <p className="text-zinc-400">
                {t('subscription.why_community_desc')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 