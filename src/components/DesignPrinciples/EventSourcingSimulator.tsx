import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Event {
  id: number;
  type: 'ORDER_CREATED' | 'PAYMENT_RECEIVED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'ORDER_CANCELLED';
  timestamp: number;
  data: {
    orderId?: string;
    items?: { name: string; quantity: number }[];
    amount?: number;
    trackingNumber?: string;
    reason?: string;
  };
}

interface OrderState {
  orderId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: { name: string; quantity: number }[];
  amount: number;
  trackingNumber?: string;
  events: Event[];
}

interface SimulationConfig {
  autoAdvance: boolean;
  eventDelay: number;
  showEventData: boolean;
  animationDuration: number;
}

const products = [
  { name: 'Laptop', price: 2500 },
  { name: 'Smartphone', price: 1500 },
  { name: 'Headphones', price: 300 },
  { name: 'Monitor', price: 800 },
];

const defaultConfig: SimulationConfig = {
  autoAdvance: true,
  eventDelay: 1000,
  showEventData: true,
  animationDuration: 0.3,
};

export default function EventSourcingSimulator() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [currentState, setCurrentState] = useState<OrderState | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ name: string; quantity: number }[]>([]);
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replaySpeed, setReplaySpeed] = useState(1000);
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [showSettings, setShowSettings] = useState(false);

  // Function to generate a random order ID
  const generateOrderId = () => {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Function to calculate total amount
  const calculateTotal = (items: { name: string; quantity: number }[]) => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.name === item.name);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  // Function to add a new event
  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  // Function to rebuild state from events
  const rebuildState = (eventList: Event[]): OrderState | null => {
    if (eventList.length === 0) return null;

    const state: OrderState = {
      orderId: '',
      status: 'PENDING',
      items: [],
      amount: 0,
      events: eventList,
    };

    eventList.forEach(event => {
      switch (event.type) {
        case 'ORDER_CREATED':
          state.orderId = event.data.orderId || '';
          state.items = event.data.items || [];
          state.amount = event.data.amount || 0;
          break;
        case 'PAYMENT_RECEIVED':
          state.status = 'PAID';
          break;
        case 'ORDER_SHIPPED':
          state.status = 'SHIPPED';
          state.trackingNumber = event.data.trackingNumber;
          break;
        case 'ORDER_DELIVERED':
          state.status = 'DELIVERED';
          break;
        case 'ORDER_CANCELLED':
          state.status = 'CANCELLED';
          break;
      }
    });

    return state;
  };

  // Effect to update state when events change
  useEffect(() => {
    if (!isReplayMode) {
      setCurrentState(rebuildState(events));
    }
  }, [events, isReplayMode]);

  // Effect for replay mode
  useEffect(() => {
    if (isReplayMode && replayIndex < events.length) {
      const timer = setTimeout(() => {
        setCurrentState(rebuildState(events.slice(0, replayIndex + 1)));
        setReplayIndex(prev => prev + 1);
      }, replaySpeed);

      return () => clearTimeout(timer);
    } else if (isReplayMode && replayIndex >= events.length) {
      setIsReplayMode(false);
      setReplayIndex(0);
    }
  }, [isReplayMode, replayIndex, events, replaySpeed]);

  // Function to create a new order
  const createOrder = () => {
    if (selectedItems.length === 0) return;

    const orderId = generateOrderId();
    const amount = calculateTotal(selectedItems);

    addEvent({
      id: events.length + 1,
      type: 'ORDER_CREATED',
      timestamp: Date.now(),
      data: {
        orderId,
        items: selectedItems,
        amount,
      },
    });

    setSelectedItems([]);
  };

  // Function to handle item selection
  const handleItemSelection = (productName: string) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.name === productName);
      if (existing) {
        return prev.map(item =>
          item.name === productName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { name: productName, quantity: 1 }];
    });
  };

  // Function to start replay mode
  const startReplay = () => {
    setIsReplayMode(true);
    setReplayIndex(0);
    setCurrentState(null);
  };

  // Reset function
  const resetSimulator = () => {
    setEvents([]);
    setCurrentState(null);
    setSelectedItems([]);
    setIsReplayMode(false);
    setReplayIndex(0);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">
            {t('simulators.event_sourcing.title')}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('simulators.event_sourcing.buttons.settings')}
            </button>
            <button
              onClick={resetSimulator}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('simulators.event_sourcing.buttons.reset')}
            </button>
          </div>
        </div>
        <p className="text-xl text-zinc-300">
          {t('simulators.event_sourcing.intro')}
        </p>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-zinc-900 p-6 rounded-lg mb-8"
          >
            <h2 className="text-xl font-bold text-zinc-200 mb-6">{t('simulators.event_sourcing.settings.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={config.autoAdvance}
                    onChange={(e) => setConfig(prev => ({ ...prev, autoAdvance: e.target.checked }))}
                    className="rounded border-zinc-600"
                  />
                  {t('simulators.event_sourcing.settings.auto_advance')}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  {t('simulators.event_sourcing.settings.event_delay', { ms: config.eventDelay })}
                </label>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100"
                  value={config.eventDelay}
                  onChange={(e) => setConfig(prev => ({ ...prev, eventDelay: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={config.showEventData}
                    onChange={(e) => setConfig(prev => ({ ...prev, showEventData: e.target.checked }))}
                    className="rounded border-zinc-600"
                  />
                  {t('simulators.event_sourcing.settings.show_event_data')}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  {t('simulators.event_sourcing.settings.animation_duration', { seconds: config.animationDuration })}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={config.animationDuration}
                  onChange={(e) => setConfig(prev => ({ ...prev, animationDuration: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Event Creation */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: config.animationDuration }}
        >
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-zinc-200 mb-4">{t('simulators.event_sourcing.create_order.title')}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {products.map(product => (
                <button
                  key={product.name}
                  onClick={() => handleItemSelection(product.name)}
                  className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <div className="font-medium text-zinc-200">{product.name}</div>
                  <div className="text-sm text-zinc-400">R$ {product.price}</div>
                </button>
              ))}
            </div>
            {selectedItems.length > 0 && (
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <h3 className="font-medium text-zinc-200 mb-2">{t('simulators.event_sourcing.create_order.selected_items')}</h3>
                {selectedItems.map(item => (
                  <div key={item.name} className="text-sm text-zinc-400">
                    {item.name} x{item.quantity}
                  </div>
                ))}
                <div className="mt-2 text-zinc-200">
                  {t('simulators.event_sourcing.create_order.total', { amount: calculateTotal(selectedItems) })}
                </div>
              </div>
            )}
            <button
              onClick={createOrder}
              disabled={selectedItems.length === 0}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
            >
              {t('simulators.event_sourcing.create_order.create_button')}
            </button>
          </div>

          {currentState && (
            <div className="space-y-4">
              <button
                onClick={() => addEvent({
                  id: events.length + 1,
                  type: 'PAYMENT_RECEIVED',
                  timestamp: Date.now(),
                  data: { orderId: currentState.orderId },
                })}
                disabled={currentState.status !== 'PENDING'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
              >
                {t('simulators.event_sourcing.actions.pay')}
              </button>

              <button
                onClick={() => addEvent({
                  id: events.length + 1,
                  type: 'ORDER_SHIPPED',
                  timestamp: Date.now(),
                  data: {
                    orderId: currentState.orderId,
                    trackingNumber: 'TRK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                  },
                })}
                disabled={currentState.status !== 'PAID'}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
              >
                {t('simulators.event_sourcing.actions.ship')}
              </button>

              <button
                onClick={() => addEvent({
                  id: events.length + 1,
                  type: 'ORDER_DELIVERED',
                  timestamp: Date.now(),
                  data: { orderId: currentState.orderId },
                })}
                disabled={currentState.status !== 'SHIPPED'}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
              >
                {t('simulators.event_sourcing.actions.deliver')}
              </button>

              <button
                onClick={() => addEvent({
                  id: events.length + 1,
                  type: 'ORDER_CANCELLED',
                  timestamp: Date.now(),
                  data: {
                    orderId: currentState.orderId,
                    reason: 'Cliente cancelou o pedido',
                  },
                })}
                disabled={!['PENDING', 'PAID'].includes(currentState.status)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
              >
                {t('simulators.event_sourcing.actions.cancel')}
              </button>
            </div>
          )}
        </motion.div>

        {/* Right Column - Current State and Events */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: config.animationDuration }}
        >
          {/* Current State */}
          <AnimatePresence mode="wait">
            {currentState && (
              <motion.div
                key={currentState.orderId + currentState.status}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: config.animationDuration }}
                className="bg-zinc-900 p-6 rounded-lg"
              >
                <h2 className="text-xl font-bold text-zinc-200 mb-4">{t('simulators.event_sourcing.state.title')}</h2>
                <div className="space-y-2 text-zinc-300">
                  <div>{t('simulators.event_sourcing.state.order', { id: currentState.orderId })}</div>
                  <motion.div
                    key={currentState.status}
                    initial={{ color: '#60A5FA' }}
                    animate={{ color: '#E5E7EB' }}
                    transition={{ duration: 1 }}
                  >
                    {t('simulators.event_sourcing.state.status', { status: currentState.status })}
                  </motion.div>
                  <div>{t('simulators.event_sourcing.state.total', { amount: currentState.amount })}</div>
                  {currentState.trackingNumber && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: config.animationDuration }}
                    >
                      {t('simulators.event_sourcing.state.tracking', { code: currentState.trackingNumber })}
                    </motion.div>
                  )}
                  <div className="mt-4">
                    <div className="font-medium mb-2">{t('simulators.event_sourcing.state.items')}</div>
                    {currentState.items.map(item => (
                      <div key={item.name} className="text-sm text-zinc-400">
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event Log */}
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-zinc-200">{t('simulators.event_sourcing.events.title')}</h2>
              {events.length > 0 && (
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-zinc-400">{t('simulators.event_sourcing.events.speed')}</label>
                    <select
                      value={replaySpeed}
                      onChange={(e) => setReplaySpeed(Number(e.target.value))}
                      className="bg-zinc-800 text-zinc-200 rounded px-2 py-1"
                    >
                      <option value={500}>{t('simulators.event_sourcing.events.speed_opts.half')}</option>
                      <option value={1000}>{t('simulators.event_sourcing.events.speed_opts.one')}</option>
                      <option value={2000}>{t('simulators.event_sourcing.events.speed_opts.two')}</option>
                    </select>
                  </div>
                  <button
                    onClick={startReplay}
                    disabled={isReplayMode}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('simulators.event_sourcing.buttons.replay')}
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: config.animationDuration }}
                    className={`p-3 rounded ${
                      isReplayMode && index === replayIndex - 1
                        ? 'bg-blue-900/30 border border-blue-700'
                        : 'bg-zinc-800'
                    }`}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-200">{event.type}</span>
                      <span className="text-zinc-400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {config.showEventData && (
                      <div className="mt-2 text-xs text-zinc-400">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(event.data, null, 2)}</pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 