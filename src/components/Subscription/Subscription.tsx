import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import ReactGA from 'react-ga4';
import Countdown from '../Countdown/Countdown';
import { useTranslation } from 'react-i18next';
import { calculatePricing, formatPrice, getAvailableCurrencies, detectUserCurrency } from '../../utils/pricing';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Subscription() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => detectUserCurrency());
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
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

  // Validate coupon format (basic validation)
  const validateCouponFormat = (code: string): boolean => {
    // Basic validation: 3-20 characters, alphanumeric and dashes/underscores
    const couponRegex = /^[A-Z0-9_-]{3,20}$/;
    return couponRegex.test(code);
  };

  const handleCouponChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    setCouponCode(upperValue);
    setCouponApplied(false);
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      ReactGA.event({
        category: 'User',
        action: 'Clicked on Payment Button',
        label: couponCode.trim() ? `With Coupon: ${couponCode}` : 'No Coupon',
      });
      
      // Track coupon usage
      if (couponCode.trim()) {
        ReactGA.event({
          category: 'Coupon',
          action: 'Coupon Used',
          label: couponCode.trim(),
        });
      }
      
      setError(null);

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const requestBody = {
        priceId: import.meta.env.VITE_ONEOFF_PRICE_ID,
        userId: user?.uid,
        userEmail: user?.email,
        ...(couponCode.trim() && validateCouponFormat(couponCode) && { promotionCode: couponCode.trim() }),
      };
      
      console.log('Creating checkout session with:', requestBody);

      const response = await fetch(`${import.meta.env.VITE_FIREBASE_FUNCTIONS_BASE_URL}/createCheckoutSession`, {
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
            <div className="absolute -right-12 top-8 bg-blue-500 text-white px-12 py-1 rotate-45 text-sm font-medium">
              {t('common.new_offer')}
            </div>
            <div className="text-center mb-4">
              <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm mb-4">
                {t('subscription.limited_offer')}
              </div>
              <Countdown />
            </div>
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

            {/* Coupon Code Input */}
            <div className="text-center mb-6">
              <label className="block text-sm text-zinc-400 mb-2">
                {t('subscription.coupon_code', { defaultValue: 'Coupon Code (Optional)' })}
              </label>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => handleCouponChange(e.target.value)}
                  placeholder={t('subscription.enter_coupon', { defaultValue: 'Enter coupon code' })}
                  className={`flex-1 bg-zinc-800 border rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 text-center transition-colors ${
                    couponCode.trim() && !validateCouponFormat(couponCode) 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-zinc-700 focus:ring-blue-500'
                  }`}
                  maxLength={20}
                />
                {couponCode.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('');
                      setCouponApplied(false);
                    }}
                    className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                    title={t('subscription.clear_coupon', { defaultValue: 'Clear coupon' })}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {couponCode.trim() && (
                <div className="mt-2 text-sm">
                  {validateCouponFormat(couponCode) ? (
                    <div className="text-blue-400">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {t('subscription.coupon_will_apply', { 
                        code: couponCode,
                        defaultValue: 'Coupon "{{code}}" will be applied at checkout'
                      })}
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('subscription.coupon_invalid_format', { 
                        defaultValue: 'Invalid coupon format. Use 3-20 characters (letters, numbers, - or _)'
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center mb-8">
              <div className="mb-2">
                <span className="text-lg text-zinc-500 line-through">
                  {formatPrice(pricingData.originalPrice, pricingData)}
                </span>
                <div className="text-4xl font-bold text-blue-500">
                  {formatPrice(pricingData.discountedPrice, pricingData)}
                </div>
                <p className="text-sm text-green-400">
                  {t('common.discount_off', { percent: pricingData.discount })}
                </p>
              </div>
              <p className="text-zinc-400">{t('subscription.one_time_lifetime')}</p>
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