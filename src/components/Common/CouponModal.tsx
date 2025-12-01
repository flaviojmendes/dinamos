import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../../utils/analytics';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
}

export default function CouponModal({ isOpen, onClose, couponCode = 'BLACKNOVEMBER' }: CouponModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubscribe = () => {
    trackEvent('Coupon', 'Modal Subscribe Clicked', couponCode);
    // Navigate to payment page and store coupon in sessionStorage for immediate use
    sessionStorage.setItem('applyCoupon', couponCode);
    navigate('/pagamento');
    onClose();
  };

  const handleClose = () => {
    trackEvent('Coupon', 'Modal Closed', couponCode);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative max-w-md w-full bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-xl p-6 border border-slate-300 dark:border-slate-700/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('coupon_modal.welcome_title', { defaultValue: 'Welcome! 🎉' })}
              </h2>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {t('coupon_modal.welcome_subtitle', { 
                  defaultValue: 'Get exclusive access with our special Black November offer!' 
                })}
              </p>

              {/* Coupon code display */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  {t('coupon_modal.coupon_code', { defaultValue: 'Your exclusive coupon code:' })}
                </div>
                <div className="text-2xl font-mono font-bold text-brand-600 dark:text-brand-400 tracking-wider">
                  {couponCode}
                </div>
                <div className="text-sm text-green-400 mt-1">
                  {t('coupon_modal.discount_amount', { defaultValue: '30% OFF - Valid All November!' })}
                </div>
              </div>

              {/* Features list */}
              <div className="text-left mb-6">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  {t('coupon_modal.features_title', { defaultValue: 'What you\'ll get:' })}
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('coupon_modal.feature_1', { defaultValue: 'Complete systems design course' })}
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('coupon_modal.feature_2', { defaultValue: 'Interactive simulators' })}
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('coupon_modal.feature_3', { defaultValue: 'Real-world case studies' })}
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('coupon_modal.feature_4', { defaultValue: 'Lifetime access' })}
                  </li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {t('coupon_modal.subscribe_now', { defaultValue: 'Subscribe Now & Save 30%' })}
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full text-slate-500 dark:text-slate-400 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {t('coupon_modal.maybe_later', { defaultValue: 'Maybe later' })}
                </button>
              </div>

              {/* Timer indication */}
              <div className="text-xs text-zinc-500 mt-4">
                {t('coupon_modal.timer_note', { 
                  defaultValue: 'This offer is valid throughout the entire month of November!'
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
