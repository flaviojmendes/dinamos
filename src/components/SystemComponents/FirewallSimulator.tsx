import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface PacketType {
  id: number;
  source: string;
  destination: string;
  port: number;
  protocol: string;
  type: string;
  payload: string;
  status: 'pending' | 'allowed' | 'blocked';
  timestamp: number;
}

interface FirewallRule {
  id: number;
  source: string;
  destination: string;
  port: number;
  protocol: string;
  type: string;
  action: 'allow' | 'block';
}

interface Stats {
  allowed: number;
  blocked: number;
  total: number;
}

// Add new interface for form errors
interface FormErrors {
  source: string;
  destination: string;
  port: string;
}

export default function FirewallSimulator() {
  const { t } = useTranslation();
  const defaultRules: FirewallRule[] = [
    { id: 1, source: '*', destination: '10.0.0.1', port: 80, protocol: 'TCP', type: 'HTTP', action: 'allow' },
    { id: 2, source: '*', destination: '10.0.0.1', port: 443, protocol: 'TCP', type: 'HTTPS', action: 'allow' },
    { id: 3, source: '*', destination: '*', port: 0, protocol: '*', type: '*', action: 'block' },
  ];

  const [packets, setPackets] = useState<PacketType[]>([]);
  const [rules, setRules] = useState<FirewallRule[]>(defaultRules);
  const [stats, setStats] = useState<Stats>({ allowed: 0, blocked: 0, total: 0 });
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState<Omit<FirewallRule, 'id'>>({
    source: '',
    destination: '',
    port: 0,
    protocol: 'TCP',
    type: '',
    action: 'allow'
  });

  // Add new state for custom packet modal and form
  const [showCustomPacket, setShowCustomPacket] = useState(false);
  const [customPacket, setCustomPacket] = useState<Omit<PacketType, 'id' | 'status' | 'timestamp'>>({
    source: '',
    destination: '10.0.0.1',
    port: 80,
    protocol: 'TCP',
    type: 'HTTP',
    payload: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    source: '',
    destination: '',
    port: ''
  });

  const autoGenerateInterval = useRef<number>();

  const protocols = ['TCP', 'UDP', 'ICMP'];
  const packetTypes = ['HTTP', 'HTTPS', 'FTP', 'SSH', 'DNS', 'SMTP'];
  const commonPorts = [80, 443, 22, 53, 21, 25, 3306];

  const generateRandomPacket = () => {
    const newPacket: PacketType = {
      id: Date.now(),
      source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination: '10.0.0.1',
      port: commonPorts[Math.floor(Math.random() * commonPorts.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      type: packetTypes[Math.floor(Math.random() * packetTypes.length)],
      payload: `Data-${Math.random().toString(36).substring(7)}`,
      status: 'pending',
      timestamp: Date.now()
    };

    const matchingRule = rules.find(rule => {
      return (rule.source === '*' || rule.source === newPacket.source) &&
             (rule.destination === '*' || rule.destination === newPacket.destination) &&
             (rule.port === 0 || rule.port === newPacket.port) &&
             (rule.protocol === '*' || rule.protocol === newPacket.protocol) &&
             (rule.type === '*' || rule.type === newPacket.type);
    });

    newPacket.status = matchingRule?.action === 'allow' ? 'allowed' : 'blocked';
    
    setPackets(prev => [...prev.slice(-9), newPacket]);
    setStats(prev => ({
      allowed: prev.allowed + (newPacket.status === 'allowed' ? 1 : 0),
      blocked: prev.blocked + (newPacket.status === 'blocked' ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const toggleAutoGenerate = () => {
    if (isAutoGenerating) {
      clearInterval(autoGenerateInterval.current);
    } else {
      autoGenerateInterval.current = window.setInterval(generateRandomPacket, 2000);
    }
    setIsAutoGenerating(!isAutoGenerating);
  };

  const addRule = () => {
    if (newRule.source && newRule.destination) {
      setRules(prev => [...prev.slice(0, -1), { ...newRule, id: Date.now() }, prev[prev.length - 1]]);
      setNewRule({
        source: '',
        destination: '',
        port: 0,
        protocol: 'TCP',
        type: '',
        action: 'allow'
      });
      setShowAddRule(false);
    }
  };

  const removeRule = (id: number) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const resetSimulator = () => {
    if (isAutoGenerating) {
      clearInterval(autoGenerateInterval.current);
      setIsAutoGenerating(false);
    }
    setRules(defaultRules);
    setPackets([]);
    setStats({ allowed: 0, blocked: 0, total: 0 });
  };

  // Update sendCustomPacket function with validation
  const sendCustomPacket = () => {
    const errors: FormErrors = {
      source: '',
      destination: '',
      port: ''
    };

    if (!customPacket.source) {
      errors.source = t('simulators.firewall.errors.source_required');
    }
    if (!customPacket.destination) {
      errors.destination = t('simulators.firewall.errors.destination_required');
    }
    if (!customPacket.port) {
      errors.port = t('simulators.firewall.errors.port_required');
    }

    setFormErrors(errors);

    if (!errors.source && !errors.destination && !errors.port) {
      const newPacket: PacketType = {
        id: Date.now(),
        ...customPacket,
        status: 'pending',
        timestamp: Date.now()
      };

      const matchingRule = rules.find(rule => {
        return (rule.source === '*' || rule.source === newPacket.source) &&
               (rule.destination === '*' || rule.destination === newPacket.destination) &&
               (rule.port === 0 || rule.port === newPacket.port) &&
               (rule.protocol === '*' || rule.protocol === newPacket.protocol) &&
               (rule.type === '*' || rule.type === newPacket.type);
      });

      newPacket.status = matchingRule?.action === 'allow' ? 'allowed' : 'blocked';
      
      setPackets(prev => [...prev.slice(-9), newPacket]);
      setStats(prev => ({
        allowed: prev.allowed + (newPacket.status === 'allowed' ? 1 : 0),
        blocked: prev.blocked + (newPacket.status === 'blocked' ? 1 : 0),
        total: prev.total + 1
      }));
      setShowCustomPacket(false);
      // Reset form errors when closing
      setFormErrors({ source: '', destination: '', port: '' });
    }
  };

  useEffect(() => {
    return () => {
      if (autoGenerateInterval.current) {
        clearInterval(autoGenerateInterval.current);
      }
    };
  }, []);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <h1 className="text-4xl font-bold mb-8 text-brand-600 dark:text-brand-400">
          {t('simulators.firewall.title')}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          {t('simulators.firewall.lead')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300">{t('simulators.firewall.rules.title')}</h2>
              <div className="flex gap-4">
                <button
                  onClick={resetSimulator}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                  title={t('simulators.firewall.rules.restore_title')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('simulators.firewall.buttons.reset', { defaultValue: 'Resetar' })}
                </button>
                <button
                  onClick={() => setShowAddRule(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  {t('simulators.firewall.rules.add_rule')}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {rules.map(rule => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <span>{rule.source} → {rule.destination}</span>
                          <span className="text-zinc-500">|</span>
                          <span>{t('simulators.firewall.labels.port')}: {rule.port || '*'}</span>
                          <span className="text-zinc-500">|</span>
                          <span>{rule.protocol}</span>
                          <span className="text-zinc-500">|</span>
                          <span>{rule.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded ${
                          rule.action === 'allow' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {rule.action === 'allow' ? t('simulators.firewall.labels.action_allow') : t('simulators.firewall.labels.action_block')}
                        </span>
                        {rule.id !== rules[rules.length - 1].id && (
                          <button
                            onClick={() => removeRule(rule.id)}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                            title={t('simulators.firewall.rules.remove_rule_title')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-brand-600 dark:text-brand-300">{t('simulators.firewall.stats.title')}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">{stats.total}</div>
                <div className="text-slate-500 dark:text-slate-400">{t('simulators.firewall.stats.total')}</div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-400">{stats.allowed}</div>
                <div className="text-slate-500 dark:text-slate-400">{t('simulators.firewall.stats.allowed')}</div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-400">{stats.blocked}</div>
                <div className="text-slate-500 dark:text-slate-400">{t('simulators.firewall.stats.blocked')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300">{t('simulators.firewall.traffic.title')}</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCustomPacket(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                {t('simulators.firewall.traffic.custom_packet')}
              </button>
              <button
                onClick={generateRandomPacket}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                disabled={isAutoGenerating}
              >
                {t('simulators.firewall.traffic.generate_packet')}
              </button>
              <button
                onClick={toggleAutoGenerate}
                className={`px-4 py-2 rounded transition-colors ${
                  isAutoGenerating 
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isAutoGenerating ? t('simulators.firewall.traffic.stop_autogen') : t('simulators.firewall.traffic.start_autogen')}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {packets.map(packet => (
                <motion.div
                  key={packet.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300">
                        {packet.source} → {packet.destination}
                      </span>
                      <span className={`px-3 py-1 rounded ${
                        packet.status === 'allowed' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {packet.status === 'allowed' ? t('simulators.firewall.badges.allow') : t('simulators.firewall.badges.block')}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>{t('simulators.firewall.labels.port')}: {packet.port}</span>
                      <span>|</span>
                      <span>{t('simulators.firewall.labels.protocol')}: {packet.protocol}</span>
                      <span>|</span>
                      <span>{t('simulators.firewall.labels.type')}: {packet.type}</span>
                      <span>|</span>
                      <span>{t('simulators.firewall.labels.payload')}: {packet.payload}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {packets.length === 0 && (
              <p className="text-zinc-500 text-center py-4">
                {t('simulators.firewall.empty')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Rule Modal */}
      <AnimatePresence>
        {showAddRule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-lg w-full max-w-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-brand-600 dark:text-brand-300">{t('simulators.firewall.add_rule_modal.title')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.add_rule_modal.origin')}
                    </label>
                    <input
                      type="text"
                      value={newRule.source}
                      onChange={e => setNewRule(prev => ({ ...prev, source: e.target.value }))}
                      placeholder={t('simulators.firewall.add_rule_modal.placeholder_ip_or_star') || 'IP or *'}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.add_rule_modal.destination')}
                    </label>
                    <input
                      type="text"
                      value={newRule.destination}
                      onChange={e => setNewRule(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder={t('simulators.firewall.add_rule_modal.placeholder_ip_or_star') || 'IP or *'}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.add_rule_modal.port')}
                    </label>
                    <input
                      type="number"
                      value={newRule.port}
                      onChange={e => setNewRule(prev => ({ ...prev, port: parseInt(e.target.value) || 0 }))}
                      placeholder={t('simulators.firewall.add_rule_modal.placeholder_port_or_zero') || 'Port or 0'}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.add_rule_modal.protocol')}
                    </label>
                    <select
                      value={newRule.protocol}
                      onChange={e => setNewRule(prev => ({ ...prev, protocol: e.target.value }))}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    >
                      {protocols.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                      <option value="*">*</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.add_rule_modal.type')}
                    </label>
                    <select
                      value={newRule.type}
                      onChange={e => setNewRule(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    >
                      <option value="">{t('simulators.firewall.add_rule_modal.option_select')}</option>
                      {packetTypes.map(tk => (
                        <option key={tk} value={tk}>{tk}</option>
                      ))}
                      <option value="*">*</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t('simulators.firewall.add_rule_modal.action')}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={newRule.action === 'allow'}
                        onChange={() => setNewRule(prev => ({ ...prev, action: 'allow' }))}
                        className="mr-2"
                      />
                      <span className="text-green-400">{t('simulators.firewall.labels.action_allow')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={newRule.action === 'block'}
                        onChange={() => setNewRule(prev => ({ ...prev, action: 'block' }))}
                        className="mr-2"
                      />
                      <span className="text-red-400">{t('simulators.firewall.labels.action_block')}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowAddRule(false)}
                  className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
                >
                  {t('simulators.firewall.add_rule_modal.button_cancel')}
                </button>
                <button
                  onClick={addRule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  {t('simulators.firewall.add_rule_modal.button_add')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Custom Packet Modal */}
      <AnimatePresence>
        {showCustomPacket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-lg w-full max-w-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-brand-600 dark:text-brand-300">{t('simulators.firewall.custom_packet_modal.title')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.origin')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={customPacket.source}
                      onChange={e => {
                        setCustomPacket(prev => ({ ...prev, source: e.target.value }));
                        if (formErrors.source) {
                          setFormErrors(prev => ({ ...prev, source: '' }));
                        }
                      }}
                      placeholder={t('simulators.firewall.custom_packet_modal.placeholder_origin_ip') || 'IP (e.g., 192.168.1.1)'}
                      className={`w-full bg-slate-100 dark:bg-slate-800 border rounded px-3 py-2 text-white transition-colors ${
                        formErrors.source ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.source && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.source}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.destination')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={customPacket.destination}
                      onChange={e => {
                        setCustomPacket(prev => ({ ...prev, destination: e.target.value }));
                        if (formErrors.destination) {
                          setFormErrors(prev => ({ ...prev, destination: '' }));
                        }
                      }}
                      placeholder={t('simulators.firewall.custom_packet_modal.placeholder_destination_ip') || 'IP (e.g., 10.0.0.1)'}
                      className={`w-full bg-slate-100 dark:bg-slate-800 border rounded px-3 py-2 text-white transition-colors ${
                        formErrors.destination ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.destination && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.destination}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.port')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={customPacket.port}
                      onChange={e => {
                        setCustomPacket(prev => ({ ...prev, port: parseInt(e.target.value) || 0 }));
                        if (formErrors.port) {
                          setFormErrors(prev => ({ ...prev, port: '' }));
                        }
                      }}
                      placeholder={t('simulators.firewall.custom_packet_modal.placeholder_port') || 'Port (e.g., 80)'}
                      className={`w-full bg-slate-100 dark:bg-slate-800 border rounded px-3 py-2 text-white transition-colors ${
                        formErrors.port ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                    {formErrors.port && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.port}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.protocol')}
                    </label>
                    <select
                      value={customPacket.protocol}
                      onChange={e => setCustomPacket(prev => ({ ...prev, protocol: e.target.value }))}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    >
                      {protocols.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.type')}
                    </label>
                    <select
                      value={customPacket.type}
                      onChange={e => setCustomPacket(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                    >
                      {packetTypes.map(tk => (
                        <option key={tk} value={tk}>{tk}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t('simulators.firewall.custom_packet_modal.payload')}
                  </label>
                  <input
                    type="text"
                    value={customPacket.payload}
                    onChange={e => setCustomPacket(prev => ({ ...prev, payload: e.target.value }))}
                    placeholder={t('simulators.firewall.custom_packet_modal.placeholder_payload') || 'Packet data'}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowCustomPacket(false);
                    setFormErrors({ source: '', destination: '', port: '' });
                  }}
                  className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
                >
                  {t('simulators.firewall.custom_packet_modal.button_cancel')}
                </button>
                <button
                  onClick={sendCustomPacket}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                >
                  {t('simulators.firewall.custom_packet_modal.button_send')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 bg-blue-900/20 p-6 rounded-lg border border-blue-800">
        <h3 className="text-xl font-bold text-brand-600 dark:text-brand-300 mb-4">{t('simulators.firewall.info.title')}</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
          <li>{t('simulators.firewall.info.i1')}</li>
          <li>{t('simulators.firewall.info.i2')}</li>
          <li>{t('simulators.firewall.info.i3')}</li>
          <li>{t('simulators.firewall.info.i4')}</li>
          <li>{t('simulators.firewall.info.i5')}</li>
          <li>{t('simulators.firewall.info.i6')}</li>
        </ul>
      </div>
    </div>
  );
} 