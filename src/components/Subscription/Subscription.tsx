import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { calculatePricing, formatPrice, getAvailableCurrencies, detectUserCurrency, calculateYearlySavings } from '../../utils/pricing';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type PlanType = 'monthly' | 'yearly' | 'lifetime';

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
  const hasLifetimePrice = typeof pricingData.lifetimePrice === 'number';

  useEffect(() => {
    if (selectedPlan === 'lifetime' && !hasLifetimePrice) {
      setSelectedPlan('yearly');
    }
  }, [selectedPlan, hasLifetimePrice]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      ReactGA.event({
        category: 'User',
        action: 'Clicked on Payment Button',
        label: `${selectedPlan} - No Coupon`,
      });
      
      setError(null);
      if (selectedPlan === 'lifetime' && !pricingData.lifetimePrice) {
        setError(t('subscription.lifetime_unavailable'));
        setIsLoading(false);
        return;
      }

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const apiUrl = import.meta.env.VITE_API_URL ?? '';
      const basePayload = {
        userId: user?.uid,
        userEmail: user?.email,
      };

      const isLifetime = selectedPlan === 'lifetime';
      const endpoint = isLifetime
        ? '/api/subscription/create-checkout-session'
        : `/api/subscription/${selectedPlan === 'yearly' ? 'create-yearly-subscription' : 'create-monthly-subscription'}`;

      const requestBody = isLifetime
        ? { ...basePayload, priceId: 'one-time' }
        : {
            ...basePayload,
            planType: selectedPlan,
            currency: pricingData.currency,
            currencyKey: selectedCurrency,
            price:
              selectedPlan === 'yearly'
                ? pricingData.yearlyPrice
                : pricingData.monthlyPrice,
          };

      console.log('Creating checkout session with:', requestBody, 'Plan:', selectedPlan);

      const response = await fetch(`${apiUrl}${endpoint}`, {
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
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg text-slate-900 dark:text-tactical-text p-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-signal-red/10 border border-signal-red/50 text-signal-red p-4 mb-8 text-center font-sans rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex rounded-full bg-brand-50 px-3 py-1 font-sans text-[11px] text-brand-700 dark:bg-tactical-raised dark:text-signal-amber"
          >
            Premium access
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-6 text-slate-900 dark:text-tactical-text"
          >
            {t('subscription.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 dark:text-tactical-dim"
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
            <label className="block label-mono mb-2">
              {t('subscription.select_currency')}
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="rounded-lg bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border px-4 py-2 font-sans text-slate-900 dark:text-tactical-text focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-signal-green"
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
            <div className="rounded-lg border border-slate-200 dark:border-tactical-border bg-white dark:bg-tactical-surface p-1 inline-flex flex-wrap justify-center gap-1">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`rounded-md px-6 py-2 font-sans text-sm transition-all ${
                  selectedPlan === 'monthly'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'text-slate-500 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text'
                }`}
              >
                {t('subscription.monthly')}
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`rounded-md px-6 py-2 font-sans text-sm transition-all flex items-center gap-2 ${
                  selectedPlan === 'yearly'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'text-slate-500 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text'
                }`}
              >
                {t('subscription.yearly')}
                <span className="text-signal-green text-xs font-semibold">
                  -{yearlySavings}%
                </span>
              </button>
              {hasLifetimePrice && (
                <button
                  onClick={() => setSelectedPlan('lifetime')}
                  className={`rounded-md px-6 py-2 font-sans text-sm transition-all flex items-center gap-2 ${
                    selectedPlan === 'lifetime'
                      ? 'bg-signal-amber text-black'
                      : 'text-slate-500 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text'
                  }`}
                >
                  {t('subscription.one_time')}
                  <span className="text-signal-amber text-xs font-semibold whitespace-nowrap">
                    {t('subscription.lifetime_access_label')}
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Plan Cards */}
          <div className={`grid gap-6 ${hasLifetimePrice ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={() => setSelectedPlan('monthly')}
              className={`relative tactical-panel p-6 cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-brand-500 dark:border-signal-green'
                  : 'hover:border-slate-400 dark:hover:border-tactical-line'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">
                  {t('subscription.monthly_plan')}
                </h3>
                <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                  selectedPlan === 'monthly' ? 'border-brand-500 dark:border-signal-green bg-brand-500 dark:bg-signal-green' : 'border-slate-400 dark:border-tactical-line'
                }`}>
                  {selectedPlan === 'monthly' && (
                    <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-mono font-bold text-slate-900 dark:text-tactical-text">
                  {formatPrice(pricingData.monthlyPrice, pricingData)}
                </span>
                <span className="text-slate-400 dark:text-tactical-label ml-2 font-sans">/ {t('common.month')}</span>
              </div>
              <p className="label-mono">
                {t('subscription.billed_monthly')}
              </p>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setSelectedPlan('yearly')}
              className={`relative tactical-panel p-6 cursor-pointer transition-all ${
                selectedPlan === 'yearly'
                  ? 'border-brand-500 dark:border-signal-green'
                  : 'hover:border-slate-400 dark:hover:border-tactical-line'
              }`}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="rounded-full bg-emerald-500 text-white text-[11px] font-sans font-semibold px-3 py-1 whitespace-nowrap">
                  {t('subscription.best_value')}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">
                  {t('subscription.yearly_plan')}
                </h3>
                <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                  selectedPlan === 'yearly' ? 'border-brand-500 dark:border-signal-green bg-brand-500 dark:bg-signal-green' : 'border-slate-400 dark:border-tactical-line'
                }`}>
                  {selectedPlan === 'yearly' && (
                    <svg className="w-3 h-3 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-mono font-bold text-slate-900 dark:text-tactical-text">
                  {formatPrice(pricingData.yearlyPrice, pricingData)}
                </span>
                <span className="text-slate-400 dark:text-tactical-label ml-2 font-sans">/ {t('common.year')}</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-400 dark:text-tactical-label line-through font-sans">
                  {formatPrice(pricingData.monthlyPrice * 12, pricingData)}
                </p>
                <span className="text-emerald-600 dark:text-signal-green text-xs font-sans font-semibold">
                  {t('subscription.save')} {yearlySavings}%
                </span>
              </div>
            </motion.div>
            {hasLifetimePrice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => setSelectedPlan('lifetime')}
                className={`relative tactical-panel p-6 cursor-pointer transition-all ${
                  selectedPlan === 'lifetime'
                    ? 'border-signal-amber'
                    : 'hover:border-slate-400 dark:hover:border-tactical-line'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="rounded-full bg-amber-100 text-amber-800 text-[11px] font-sans font-semibold px-3 py-1 whitespace-nowrap dark:bg-signal-amber/20 dark:text-signal-amber">
                    {t('subscription.one_time')}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">
                    {t('subscription.lifetime_plan')}
                  </h3>
                  <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                    selectedPlan === 'lifetime' ? 'border-signal-amber bg-signal-amber' : 'border-slate-400 dark:border-tactical-line'
                  }`}>
                    {selectedPlan === 'lifetime' && (
                      <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-mono font-bold text-slate-900 dark:text-tactical-text">
                    {pricingData.lifetimePrice ? formatPrice(pricingData.lifetimePrice, pricingData) : '--'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-tactical-dim">
                  {t('subscription.lifetime_description')}
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 text-xs font-sans font-medium whitespace-nowrap dark:bg-signal-amber/10 dark:text-signal-amber">
                    {t('subscription.lifetime_access_label')}
                  </span>
                  <span className="text-slate-500 dark:text-tactical-dim text-xs font-sans whitespace-nowrap">
                    {t('subscription.pay_once')}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Features & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 tactical-panel p-8"
          >
            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 font-sans text-sm text-slate-600 dark:text-tactical-dim">
                  <svg className="w-5 h-5 text-signal-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-200 text-white dark:text-black px-6 py-4 font-sans font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {selectedPlan === 'lifetime'
                    ? `${t('subscription.get_lifetime_access')} - ${pricingData.lifetimePrice ? formatPrice(pricingData.lifetimePrice, pricingData) : ''}`
                    : `${t('subscription.subscribe_now')} - ${
                        selectedPlan === 'yearly' 
                          ? `${formatPrice(pricingData.yearlyPrice, pricingData)}/${t('common.year')}`
                          : `${formatPrice(pricingData.monthlyPrice, pricingData)}/${t('common.month')}`
                      }`
                  }
                </>
              )}
            </button>
            
            <p className="text-center font-sans text-xs text-slate-500 dark:text-tactical-label mt-4">
              {selectedPlan === 'lifetime' ? t('subscription.lifetime_note') : t('subscription.cancel_anytime')}
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
          <h3 className="text-2xl font-sans font-bold tracking-tight mb-4">{t('subscription.why_buy_title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
            <div className="tactical-panel p-6">
              <h4 className="label-mono mb-2 text-brand-600 dark:text-signal-cyan">{t('subscription.why_practical_title')}</h4>
              <p className="text-slate-500 dark:text-tactical-dim">
                {t('subscription.why_practical_desc')}
              </p>
            </div>
            <div className="tactical-panel p-6">
              <h4 className="label-mono mb-2 text-purple-500 dark:text-signal-cyan">{t('subscription.why_updated_title')}</h4>
              <p className="text-slate-500 dark:text-tactical-dim">
                {t('subscription.why_updated_desc')}
              </p>
            </div>
            <div className="tactical-panel p-6">
              <h4 className="label-mono mb-2 text-yellow-500 dark:text-signal-amber">{t('subscription.why_career_title')}</h4>
              <p className="text-slate-500 dark:text-tactical-dim">
                {t('subscription.why_career_desc')}
              </p>
            </div>
            <div className="tactical-panel p-6">
              <h4 className="label-mono mb-2 text-orange-500 dark:text-signal-amber">{t('subscription.why_community_title')}</h4>
              <p className="text-slate-500 dark:text-tactical-dim">
                {t('subscription.why_community_desc')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 