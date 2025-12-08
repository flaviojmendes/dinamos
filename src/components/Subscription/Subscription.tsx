import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { calculatePricing, formatPrice, getAvailableCurrencies, detectUserCurrency, calculateYearlySavings } from '../../utils/pricing';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type PlanType = 'monthly' | 'yearly';

export default function Subscription() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => detectUserCurrency());
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
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
  const yearlySavings = calculateYearlySavings(pricingData);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      ReactGA.event({
        category: 'User',
        action: 'Clicked on Payment Button',
        label: `${selectedPlan} - No Coupon`,
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
      
      console.log('Creating checkout session with:', requestBody, 'Plan:', selectedPlan);

      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const endpoint = selectedPlan === 'yearly' 
        ? 'create-yearly-subscription' 
        : 'create-monthly-subscription';
      
      const response = await fetch(`${apiUrl}/api/subscription/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const session = await response.json();
      
      console.log('Checkout session response:', session);

      if (session.error) {
        console.log(session.error);
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout using the URL directly (more reliable)
      if (session.url) {
        window.location.href = session.url;
      } else if (session.id) {
        // Fallback to redirectToCheckout if only id is provided
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        if (error) {
          throw error;
        }
      } else {
        throw new Error('No checkout URL or session ID received from server');
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
            className="text-xl text-slate-500 dark:text-slate-400"
          >
            {t('subscription.subtitle')}
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Currency Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-8"
          >
            <label className="block text-sm text-slate-500 dark:text-slate-400 mb-2">
              {t('subscription.select_currency')}
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableCurrencies.map((curr) => (
                <option key={curr.key} value={curr.key}>
                  {curr.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Plan Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-slate-800/50 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('subscription.monthly')}
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedPlan === 'yearly'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('subscription.yearly')}
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                  -{yearlySavings}%
                </span>
              </button>
            </div>
          </motion.div>

          {/* Plan Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={() => setSelectedPlan('monthly')}
              className={`relative bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-xl p-6 border-2 cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {t('subscription.monthly_plan')}
                </h3>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                }`}>
                  {selectedPlan === 'monthly' && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(pricingData.monthlyPrice, pricingData)}
                </span>
                <span className="text-slate-400 ml-2">/ {t('common.month')}</span>
              </div>
              <p className="text-sm text-slate-400">
                {t('subscription.billed_monthly')}
              </p>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setSelectedPlan('yearly')}
              className={`relative bg-gradient-to-b from-blue-600/10 to-purple-600/10 rounded-xl p-6 border-2 cursor-pointer transition-all ${
                selectedPlan === 'yearly'
                  ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : 'border-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {t('subscription.best_value')}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="text-lg font-semibold text-white">
                  {t('subscription.yearly_plan')}
                </h3>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === 'yearly' ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                }`}>
                  {selectedPlan === 'yearly' && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(pricingData.yearlyPrice, pricingData)}
                </span>
                <span className="text-slate-400 ml-2">/ {t('common.year')}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-400 line-through">
                  {formatPrice(pricingData.monthlyPrice * 12, pricingData)}
                </p>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {t('subscription.save')} {yearlySavings}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Features & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 bg-gradient-to-b from-slate-800/30 to-slate-900/30 rounded-xl p-8 border border-slate-700/50"
          >
            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
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
                <>
                  {t('subscription.subscribe_now')} - {' '}
                  {selectedPlan === 'yearly' 
                    ? formatPrice(pricingData.yearlyPrice, pricingData) + `/${t('common.year')}`
                    : formatPrice(pricingData.monthlyPrice, pricingData) + `/${t('common.month')}`
                  }
                </>
              )}
            </button>
            
            <p className="text-center text-sm text-slate-500 mt-4">
              {t('subscription.cancel_anytime')}
            </p>
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
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-brand-600 dark:text-brand-400">{t('subscription.why_practical_title')}</h4>
              <p className="text-slate-500 dark:text-slate-400">
                {t('subscription.why_practical_desc')}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-purple-400">{t('subscription.why_updated_title')}</h4>
              <p className="text-slate-500 dark:text-slate-400">
                {t('subscription.why_updated_desc')}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-yellow-400">{t('subscription.why_career_title')}</h4>
              <p className="text-slate-500 dark:text-slate-400">
                {t('subscription.why_career_desc')}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-orange-400">{t('subscription.why_community_title')}</h4>
              <p className="text-slate-500 dark:text-slate-400">
                {t('subscription.why_community_desc')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 