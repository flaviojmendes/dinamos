import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton } from '../tactical';

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
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h2 className="font-sans text-lg font-semibold text-slate-900 dark:text-tactical-text mb-2">
          {t('simulators.firewall.title')}
        </h2>
        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
          {t('simulators.firewall.lead')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Panel
            title={t('simulators.firewall.rules.title')}
            accent="cyan"
            action={
              <div className="flex items-center gap-2">
                <TacticalButton
                  size="sm"
                  variant="ghost"
                  onClick={resetSimulator}
                  title={t('simulators.firewall.rules.restore_title')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('simulators.firewall.buttons.reset', { defaultValue: 'Resetar' })}
                </TacticalButton>
                <TacticalButton size="sm" variant="primary" onClick={() => setShowAddRule(true)}>
                  + {t('simulators.firewall.rules.add_rule')}
                </TacticalButton>
              </div>
            }
          >
            <div className="space-y-2">
              <AnimatePresence>
                {rules.map(rule => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2.5"
                  >
                    <div className="min-w-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-slate-500 dark:text-tactical-dim">
                      <span className="text-slate-900 dark:text-tactical-text">{rule.source} → {rule.destination}</span>
                      <span className="text-slate-300 dark:text-tactical-line">|</span>
                      <span>{t('simulators.firewall.labels.port')}: {rule.port || '*'}</span>
                      <span className="text-slate-300 dark:text-tactical-line">|</span>
                      <span>{rule.protocol}</span>
                      <span className="text-slate-300 dark:text-tactical-line">|</span>
                      <span>{rule.type}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge
                        variant={rule.action === 'allow' ? 'active' : 'classified'}
                        label={rule.action === 'allow' ? t('simulators.firewall.labels.action_allow') : t('simulators.firewall.labels.action_block')}
                      />
                      {rule.id !== rules[rules.length - 1].id && (
                        <button
                          onClick={() => removeRule(rule.id)}
                          className="text-slate-400 dark:text-tactical-label hover:text-signal-red transition-colors"
                          title={t('simulators.firewall.rules.remove_rule_title')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Panel>

          <Panel title={t('simulators.firewall.stats.title')} accent="green">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-cyan">{stats.total}</div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.firewall.stats.total')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-green">{stats.allowed}</div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.firewall.stats.allowed')}</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-3xl font-bold tabular-nums leading-none text-signal-red">{stats.blocked}</div>
                <div className="font-sans text-xs font-medium text-slate-500 dark:text-tactical-label mt-2">{t('simulators.firewall.stats.blocked')}</div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          title={t('simulators.firewall.traffic.title')}
          accent="amber"
          action={isAutoGenerating ? <StatusBadge variant="active" label="Auto" /> : undefined}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <TacticalButton
              size="sm"
              variant="primary"
              onClick={generateRandomPacket}
              disabled={isAutoGenerating}
            >
              {t('simulators.firewall.traffic.generate_packet')}
            </TacticalButton>
            <TacticalButton size="sm" variant="secondary" onClick={() => setShowCustomPacket(true)}>
              {t('simulators.firewall.traffic.custom_packet')}
            </TacticalButton>
            <TacticalButton
              size="sm"
              variant={isAutoGenerating ? 'danger' : 'secondary'}
              onClick={toggleAutoGenerate}
            >
              {isAutoGenerating ? t('simulators.firewall.traffic.stop_autogen') : t('simulators.firewall.traffic.start_autogen')}
            </TacticalButton>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {packets.map(packet => (
                <motion.div
                  key={packet.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="rounded-lg border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2.5"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-mono text-xs text-slate-900 dark:text-tactical-text truncate">
                        {packet.source} → {packet.destination}
                      </span>
                      <StatusBadge
                        variant={packet.status === 'allowed' ? 'active' : 'classified'}
                        label={packet.status === 'allowed' ? t('simulators.firewall.badges.allow') : t('simulators.firewall.badges.block')}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[11px] text-slate-500 dark:text-tactical-label">
                      <span>{t('simulators.firewall.labels.port')}: {packet.port}</span>
                      <span className="text-slate-300 dark:text-tactical-line">|</span>
                      <span>{t('simulators.firewall.labels.protocol')}: {packet.protocol}</span>
                      <span className="text-slate-300 dark:text-tactical-line">|</span>
                      <span>{t('simulators.firewall.labels.type')}: {packet.type}</span>
                      <span className="text-slate-300 dark:text-tactical-line">|</span>
                      <span>{t('simulators.firewall.labels.payload')}: {packet.payload}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {packets.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center">
                <p className="font-sans text-xs text-slate-400 dark:text-tactical-label">
                  {t('simulators.firewall.empty')}
                </p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      {/* Add Rule Modal */}
      <AnimatePresence>
        {showAddRule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="tactical-panel p-6 w-full max-w-lg"
            >
              <h3 className="font-sans text-lg font-semibold mb-6 text-slate-900 dark:text-tactical-text">{t('simulators.firewall.add_rule_modal.title')}</h3>
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
                      className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
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
                      className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
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
                      className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.add_rule_modal.protocol')}
                    </label>
                    <select
                      value={newRule.protocol}
                      onChange={e => setNewRule(prev => ({ ...prev, protocol: e.target.value }))}
                      className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
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
                      className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
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
                      <span className="text-signal-green font-sans text-sm">{t('simulators.firewall.labels.action_allow')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={newRule.action === 'block'}
                        onChange={() => setNewRule(prev => ({ ...prev, action: 'block' }))}
                        className="mr-2"
                      />
                      <span className="text-signal-red font-sans text-sm">{t('simulators.firewall.labels.action_block')}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <TacticalButton variant="ghost" onClick={() => setShowAddRule(false)}>
                  {t('simulators.firewall.add_rule_modal.button_cancel')}
                </TacticalButton>
                <TacticalButton variant="primary" onClick={addRule}>
                  {t('simulators.firewall.add_rule_modal.button_add')}
                </TacticalButton>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="tactical-panel p-6 w-full max-w-lg"
            >
              <h3 className="font-sans text-lg font-semibold mb-6 text-slate-900 dark:text-tactical-text">{t('simulators.firewall.custom_packet_modal.title')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.origin')} <span className="text-signal-red">*</span>
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
                      className={`w-full bg-white dark:bg-tactical-raised border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text transition-colors focus:outline-none ${
                        formErrors.source ? 'border-signal-red' : 'border-slate-300 dark:border-tactical-border'
                      }`}
                    />
                    {formErrors.source && (
                      <p className="text-signal-red text-sm mt-1">{formErrors.source}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.destination')} <span className="text-signal-red">*</span>
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
                      className={`w-full bg-white dark:bg-tactical-raised border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text transition-colors focus:outline-none ${
                        formErrors.destination ? 'border-signal-red' : 'border-slate-300 dark:border-tactical-border'
                      }`}
                    />
                    {formErrors.destination && (
                      <p className="text-signal-red text-sm mt-1">{formErrors.destination}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.port')} <span className="text-signal-red">*</span>
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
                      className={`w-full bg-white dark:bg-tactical-raised border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text transition-colors focus:outline-none ${
                        formErrors.port ? 'border-signal-red' : 'border-slate-300 dark:border-tactical-border'
                      }`}
                    />
                    {formErrors.port && (
                      <p className="text-signal-red text-sm mt-1">{formErrors.port}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      {t('simulators.firewall.custom_packet_modal.protocol')}
                    </label>
                    <select
                      value={customPacket.protocol}
                      onChange={e => setCustomPacket(prev => ({ ...prev, protocol: e.target.value }))}
                      className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
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
                      className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
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
                    className="w-full bg-white dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-sm text-slate-900 dark:text-tactical-text focus:outline-none focus:border-signal-green"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <TacticalButton
                  variant="ghost"
                  onClick={() => {
                    setShowCustomPacket(false);
                    setFormErrors({ source: '', destination: '', port: '' });
                  }}
                >
                  {t('simulators.firewall.custom_packet_modal.button_cancel')}
                </TacticalButton>
                <TacticalButton variant="primary" onClick={sendCustomPacket}>
                  {t('simulators.firewall.custom_packet_modal.button_send')}
                </TacticalButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tactical-panel rounded-lg border-l-2 border-l-signal-cyan dark:border-l-signal-cyan p-5">
        <h3 className="font-sans text-sm font-semibold text-signal-cyan mb-3">{t('simulators.firewall.info.title')}</h3>
        <ul className="space-y-1.5 font-sans text-sm text-slate-600 dark:text-tactical-dim list-disc list-inside">
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