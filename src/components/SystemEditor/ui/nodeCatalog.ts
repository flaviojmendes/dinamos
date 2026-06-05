// UI metadata for each node kind: icon, accent colour and handle layout. Keeps
// the presentational node component generic instead of duplicating 12 nearly
// identical components.

import {
  Users,
  Network,
  Shield,
  HardDrive,
  Server,
  Database as DatabaseIcon,
  Layers,
  Split,
  MessageSquare,
  Zap,
  TrendingUp,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { NodeKind } from '../engine/types';

export interface NodeCatalogEntry {
  kind: NodeKind;
  icon: LucideIcon;
  /** Tailwind border colour class for the node card + palette accent. */
  accent: string;
  /** Hex used for edges / charts when this node is the target. */
  hex: string;
  hasTarget: boolean;
  hasSource: boolean;
}

export const NODE_CATALOG: Record<NodeKind, NodeCatalogEntry> = {
  client: { kind: 'client', icon: Users, accent: 'border-blue-500', hex: '#3b82f6', hasTarget: false, hasSource: true },
  loadBalancer: { kind: 'loadBalancer', icon: Network, accent: 'border-green-500', hex: '#22c55e', hasTarget: true, hasSource: true },
  apiGateway: { kind: 'apiGateway', icon: Shield, accent: 'border-indigo-500', hex: '#6366f1', hasTarget: true, hasSource: true },
  cache: { kind: 'cache', icon: HardDrive, accent: 'border-pink-500', hex: '#ec4899', hasTarget: true, hasSource: true },
  server: { kind: 'server', icon: Server, accent: 'border-purple-500', hex: '#a855f7', hasTarget: true, hasSource: true },
  database: { kind: 'database', icon: DatabaseIcon, accent: 'border-yellow-500', hex: '#eab308', hasTarget: true, hasSource: false },
  replicatedDb: { kind: 'replicatedDb', icon: Layers, accent: 'border-amber-500', hex: '#f59e0b', hasTarget: true, hasSource: false },
  shardRouter: { kind: 'shardRouter', icon: Split, accent: 'border-teal-500', hex: '#14b8a6', hasTarget: true, hasSource: true },
  messageQueue: { kind: 'messageQueue', icon: MessageSquare, accent: 'border-orange-500', hex: '#f97316', hasTarget: true, hasSource: true },
  circuitBreaker: { kind: 'circuitBreaker', icon: Zap, accent: 'border-red-500', hex: '#ef4444', hasTarget: true, hasSource: true },
  autoScaler: { kind: 'autoScaler', icon: TrendingUp, accent: 'border-cyan-500', hex: '#06b6d4', hasTarget: true, hasSource: true },
  externalDependency: { kind: 'externalDependency', icon: Globe, accent: 'border-slate-400', hex: '#94a3b8', hasTarget: true, hasSource: false },
};

/** Palette ordering for the components drawer. */
export const PALETTE_ORDER: NodeKind[] = [
  'client',
  'loadBalancer',
  'apiGateway',
  'cache',
  'server',
  'autoScaler',
  'circuitBreaker',
  'messageQueue',
  'shardRouter',
  'database',
  'replicatedDb',
  'externalDependency',
];

/** i18n key for a kind's display label, with a sensible English default. */
export function kindLabelKey(kind: NodeKind): string {
  return `editor.kinds.${kind}`;
}

export const KIND_DEFAULT_LABEL: Record<NodeKind, string> = {
  client: 'Client',
  loadBalancer: 'Load Balancer',
  apiGateway: 'API Gateway',
  cache: 'Cache',
  server: 'Server',
  database: 'Database',
  replicatedDb: 'Replicated DB',
  shardRouter: 'Shard Router',
  messageQueue: 'Message Queue',
  circuitBreaker: 'Circuit Breaker',
  autoScaler: 'Auto-Scaler',
  externalDependency: 'External Dependency',
};
