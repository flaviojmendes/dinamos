import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  NodeProps,
  Handle,
  Position,
  EdgeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Users,
  Server,
  Database as DatabaseIcon,
  Network,
  Shield,
  HardDrive,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NodeData {
  label: string;
  throughput?: number;
  algorithm?: 'roundRobin';
  rateLimit?: number;
  hitRate?: number; // For cache
  maxQueue?: number; // For message queue
  dequeueRate?: number; // For message queue
  failureRate?: number; // Failure rate for any node
  onThroughputChange?: (value: number) => void;
  onAlgorithmChange?: (value: 'roundRobin') => void;
  onRateLimitChange?: (value: number) => void;
  onHitRateChange?: (value: number) => void; // For cache
  onDequeueRateChange?: (value: number) => void; // For message queue
  onMaxQueueChange?: (value: number) => void; // For message queue
  onFailureRateChange?: (value: number) => void; // For failure rate
  metrics?: {
    requestsPerSecond: number;
    activeRequests: number;
    responseTime: number;
    load: number;
    failedRequests: number;
    throttledRequests?: number;
    cumulativeLatency?: number;
    cacheHits?: number;
    cacheMisses?: number;
    hitRate?: number;
    queueLength?: number;
    droppedMessages?: number;
    dequeueRate?: number;
    maxQueue?: number;
  };
}

// Define the structure of the .din file format
interface DistributedSystemDesign {
  nodes: Node<NodeData>[];
  edges: Edge[];
  version: string;
}

// Node components with metrics display
const ClientNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-blue-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="flex items-center gap-2 font-bold text-white">
        <Users className="w-4 h-4" />
        {data.label}
      </div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-brand-600 dark:text-brand-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
          <div className="text-cyan-300">{t('editor.metrics.total_latency_ms')}: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
          <div className="text-red-300">{t('editor.metrics.failures_per_s')}: {data.metrics.failedRequests}</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.throughput_reqs')}</label>
        <input type="range" min="1" max="200" value={data.throughput || 50} onChange={(e) => data.onThroughputChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.throughput || 50} req/s</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.failure_rate_percent')}</label>
        <input type="range" min="0" max="100" value={data.failureRate || 0} onChange={(e) => data.onFailureRateChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.failureRate || 0}%</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

const ServerNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-purple-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="flex items-center gap-2 font-bold text-white">
        <Server className="w-4 h-4" />
        {data.label}
      </div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-yellow-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
          <div className="text-cyan-300">{t('editor.metrics.total_latency_ms')}: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
          <div className="text-red-300">{t('editor.metrics.failures_per_s')}: {data.metrics.failedRequests}</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.throughput_reqs')}</label>
        <input type="range" min="10" max="200" value={data.throughput || 100} onChange={(e) => data.onThroughputChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.throughput || 100} req/s</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.failure_rate_percent')} </label>
        <input type="range" min="0" max="100" value={data.failureRate || 0} onChange={(e) => data.onFailureRateChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.failureRate || 0}%</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

const DatabaseNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-yellow-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex items-center gap-2 font-bold text-white">
        <DatabaseIcon className="w-4 h-4" />
        {data.label}
      </div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-yellow-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
          <div className="text-cyan-300">{t('editor.metrics.total_latency_ms')}: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
          <div className="text-red-300">{t('editor.metrics.failures_per_s')}: {data.metrics.failedRequests}</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.throughput_reqs')}</label>
        <input type="range" min="10" max="200" value={data.throughput || 50} onChange={(e) => data.onThroughputChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.throughput || 50} req/s</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.failure_rate_percent')}</label>
        <input type="range" min="0" max="100" value={data.failureRate || 0} onChange={(e) => data.onFailureRateChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.failureRate || 0}%</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

const LoadBalancerNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-green-500 bg-slate-100 dark:bg-slate-800 min-w-[180px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="flex items-center gap-2 font-bold text-white">
        <Network className="w-4 h-4" />
        {data.label}
      </div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-yellow-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
          <div className="text-cyan-300">{t('editor.metrics.total_latency_ms')}: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
          <div className="text-red-300">{t('editor.metrics.failures_per_s')}: {data.metrics.failedRequests}</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.throughput_reqs')}</label>
        <input type="range" min="10" max="300" value={data.throughput || 150} onChange={(e) => data.onThroughputChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.throughput || 150} req/s</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.algorithm')}</label>
        <select value={data.algorithm || 'roundRobin'} onChange={(e) => data.onAlgorithmChange?.(e.target.value as 'roundRobin')} className="w-full mt-1 bg-zinc-700 rounded px-2 py-1 text-white">
          <option value="roundRobin">Round Robin</option>
        </select>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.failure_rate_percent')}</label>
        <input type="range" min="0" max="100" value={data.failureRate || 0} onChange={(e) => data.onFailureRateChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.failureRate || 0}%</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

const APIGatewayNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-indigo-500 bg-slate-100 dark:bg-slate-800 min-w-[220px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="flex items-center gap-2 font-bold text-white">
        <Shield className="w-4 h-4" />
        {data.label}
      </div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-yellow-300">{t('editor.metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.metrics.response_time_ms')}: {data.metrics.responseTime.toFixed(0)}ms</div>
          <div className="text-cyan-300">{t('editor.metrics.total_latency_ms')}: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
          <div className="text-red-300">{t('editor.metrics.failures_per_s')}: {data.metrics.failedRequests}</div>
          <div className="text-orange-300 flex justify-between">
            <span>{t('editor.metrics.throttled_per_s')}</span> 
            <span className="font-bold">{data.metrics.throttledRequests || 0}</span>
          </div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.throughput_reqs')}</label>
        <input type="range" min="10" max="300" value={data.throughput || 200} onChange={(e) => data.onThroughputChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.throughput || 200} req/s</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.rate_limit_reqs')}</label>
        <input type="range" min="10" max="250" value={data.rateLimit || 100} onChange={(e) => data.onRateLimitChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.rateLimit || 100} req/s</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.failure_rate_percent')}</label>
        <input type="range" min="0" max="100" value={data.failureRate || 0} onChange={(e) => data.onFailureRateChange?.(Number(e.target.value))} className="w-full" />
        <div className="text-right">{data.failureRate || 0}%</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${data.metrics?.load || 0}%`, backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e' }} />
      </div>
    </div>
  );
};

// CacheNode component
const CacheNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-pink-500 bg-slate-100 dark:bg-slate-800 min-w-[200px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="flex items-center gap-2 font-bold text-white">
        <HardDrive className="w-4 h-4" />
        {data.label}
      </div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-pink-300">{t('editor.cache_metrics.requests_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.cache_metrics.response_time')}: {data.metrics.responseTime.toFixed(0)}ms</div>
          <div className="text-cyan-300">{t('editor.cache_metrics.total_latency')}: {data.metrics.cumulativeLatency?.toFixed(0)}ms</div>
          <div className="text-yellow-300">{t('editor.cache_metrics.hits_per_second')}: {data.metrics.cacheHits}</div>
          <div className="text-red-300">{t('editor.cache_metrics.misses_per_second')}: {data.metrics.cacheMisses}</div>
          <div className="text-purple-300">{t('editor.cache_metrics.hit_rate')}: {Math.round((data.metrics.hitRate ?? 0) * 100)}%</div>
          <div className="text-red-300">{t('editor.cache_metrics.failures_per_second')}: {data.metrics.failedRequests}</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.throughput_reqs')}</label>
        <input
          type="range"
          min="10"
          max="300"
          value={data.throughput || 100}
          onChange={(e) => data.onThroughputChange?.(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-right">{data.throughput || 100} req/s</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.hit_rate')} (%):</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.hitRate !== undefined ? Math.round(data.hitRate * 100) : 80}
          onChange={(e) => data.onHitRateChange?.(Number(e.target.value) / 100)}
          className="w-full"
        />
        <div className="text-right">{data.hitRate !== undefined ? Math.round(data.hitRate * 100) : 80}%</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.failure_rate_percent')}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.failureRate || 0}
          onChange={(e) => data.onFailureRateChange?.(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-right">{data.failureRate || 0}%</div>
      </div>
      <div className="mt-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${data.metrics?.load || 0}%`,
            backgroundColor: (data.metrics?.load || 0) > 80 ? '#ef4444' : (data.metrics?.load || 0) > 60 ? '#eab308' : '#22c55e',
          }}
        />
      </div>
    </div>
  );
};

// MessageQueueNode component
const MessageQueueNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 border-orange-500 bg-slate-100 dark:bg-slate-800 min-w-[220px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <div className="flex items-center gap-2 font-bold text-white">
        <MessageSquare className="w-4 h-4" />
        {data.label}
      </div>
      {data.metrics && (
        <div className="text-xs mt-2">
          <div className="text-orange-300">{t('editor.queue_metrics.queue')}: {data.metrics.queueLength}</div>
          <div className="text-yellow-300">{t('editor.queue_metrics.enqueued_per_second')}: {data.metrics.requestsPerSecond}</div>
          <div className="text-green-300">{t('editor.queue_metrics.dequeued_per_second')}: {data.metrics.dequeueRate}</div>
          <div className="text-red-300">{t('editor.queue_metrics.dropped_per_second')}: {data.metrics.droppedMessages}</div>
          <div className="text-cyan-300">{t('editor.queue_metrics.latency')}: {data.metrics.responseTime.toFixed(0)}ms</div>
        </div>
      )}
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.queue_capacity')}</label>
        <input
          type="range"
          min="10"
          max="500"
          value={data.maxQueue || 100}
          onChange={(e) => data.onMaxQueueChange?.(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-right">{data.maxQueue || 100}</div>
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.dequeue_msgs_per_s')}</label>
        <input
          type="range"
          min="1"
          max="200"
          value={data.dequeueRate || 50}
          onChange={(e) => data.onDequeueRateChange?.(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-right">{data.dequeueRate || 50} msgs/s</div>
      </div>
      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: 10 }).map((_, index) => {
          const queuePercentage = ((data.metrics?.queueLength || 0) / (data.maxQueue || 100)) * 100;
          const blockPercentage = (index + 1) * 10;
          const isActive = queuePercentage >= blockPercentage;
          const isWarning = queuePercentage >= 80;
          const isDanger = queuePercentage >= 90;
          
          return (
            <div
              key={index}
              className={`h-4 flex-1 rounded-sm transition-colors ${
                isActive
                  ? isDanger
                    ? 'bg-red-500'
                    : isWarning
                      ? 'bg-yellow-500'
                      : 'bg-orange-500'
                  : 'bg-zinc-700'
              }`}
            />
          );
        })}
      </div>
      <div className="mt-2 text-xs text-white">
        <label>{t('editor.metrics.failure_rate_percent')}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.failureRate || 0}
          onChange={(e) => data.onFailureRateChange?.(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-right">{data.failureRate || 0}%</div>
      </div>
    </div>
  );
};

const nodeTypes = {
  client: ClientNode,
  server: ServerNode,
  database: DatabaseNode,
  loadBalancer: LoadBalancerNode,
  apiGateway: APIGatewayNode,
  cache: CacheNode,
  messageQueue: MessageQueueNode,
};

// Initial nodes will be created dynamically with translations in the component

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4', animated: true },
  { id: 'e3-5', source: '3', target: '5', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

// Available components configuration - this will be dynamically generated in the component using translations

// --- Cost Estimation Model ---
const COST_MODELS = {
  aws: {
    compute: { price: 0.0348, product: 'EC2 (t3.medium)' },
    database: { price: 0.095, product: 'RDS (db.t3.medium)' },
    messageQueue: { price: 0.40, product: 'SQS Standard' },
    apiGateway: { price: 3.50, product: 'API Gateway' },
    loadBalancer: { price: 0.025, product: 'Elastic Load Balancer' },
    storage: { price: 0.10, product: 'EBS' },
    cache: { price: 0.0348, product: 'ElastiCache' },
  },
  gcp: {
    compute: { price: 0.0332, product: 'Compute Engine (e2-standard-2, 2 vCPU, 8GB RAM)' },
    database: { price: 0.090, product: 'Cloud SQL (db-f1-micro)' },
    messageQueue: { price: 0.40, product: 'Pub/Sub' },
    apiGateway: { price: 3.00, product: 'API Gateway' },
    loadBalancer: { price: 0.025, product: 'Cloud Load Balancer' },
    storage: { price: 0.10, product: 'Persistent Disk' },
    cache: { price: 0.0332, product: 'Memorystore' },
  },
};

function estimateNodeCost(
  node: Node<NodeData>,
  provider: 'aws' | 'gcp',
  secondsPerMonth: number = 30 * 24 * 3600
): { cost: number; product: string } {
  const model = COST_MODELS[provider];
  switch (node.type) {
    case 'server':
      // Assume 1 vCPU per server node
      return { cost: model.compute.price * 24 * 30, product: model.compute.product };
    case 'database':
      return { cost: model.database.price * 24 * 30, product: model.database.product };
    case 'messageQueue': {
      const reqs = node.data.metrics?.requestsPerSecond || 0;
      const monthlyReqs = reqs * secondsPerMonth;
      return { cost: (monthlyReqs / 1_000_000) * model.messageQueue.price, product: model.messageQueue.product };
    }
    case 'apiGateway': {
      const reqs = node.data.metrics?.requestsPerSecond || 0;
      const monthlyReqs = reqs * secondsPerMonth;
      return { cost: (monthlyReqs / 1_000_000) * model.apiGateway.price, product: model.apiGateway.product };
    }
    case 'loadBalancer':
      return { cost: model.loadBalancer.price * 24 * 30, product: model.loadBalancer.product };
    case 'cache':
      return { cost: model.cache.price * 24 * 30, product: model.cache.product };
    default:
      return { cost: 0, product: '' };
  }
}

// Helper to attach all slider callbacks to nodes
function withNodeCallbacks(
  nodes: Node<NodeData>[],
  callbacks: {
    onThroughputChange: (id: string, v: number) => void,
    onAlgorithmChange: (id: string, v: 'roundRobin') => void,
    onRateLimitChange: (id: string, v: number) => void,
    onHitRateChange: (id: string, v: number) => void,
    onDequeueRateChange: (id: string, v: number) => void,
    onMaxQueueChange: (id: string, v: number) => void,
    onFailureRateChange: (id: string, v: number) => void,
  }
): Node<NodeData>[] {
  return nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onThroughputChange: (value: number) => callbacks.onThroughputChange(node.id, value),
      onAlgorithmChange: (value: 'roundRobin') => callbacks.onAlgorithmChange(node.id, value),
      onRateLimitChange: (value: number) => callbacks.onRateLimitChange(node.id, value),
      onHitRateChange: (value: number) => callbacks.onHitRateChange(node.id, value),
      onDequeueRateChange: (value: number) => callbacks.onDequeueRateChange(node.id, value),
      onMaxQueueChange: (value: number) => callbacks.onMaxQueueChange(node.id, value),
      onFailureRateChange: (value: number) => callbacks.onFailureRateChange(node.id, value),
    }
  }));
}

export default function SimpleSystemEditor() {
  const { t } = useTranslation();
  
  // Create initial nodes with translations
  const getInitialNodes = (): Node<NodeData>[] => [
    {
      id: '1',
      type: 'client',
      data: { label: t('editor.node_labels.client') },
      position: { x: 400, y: 50 },
    },
    {
      id: '2',
      type: 'loadBalancer',
      data: { label: t('editor.node_labels.load_balancer'), algorithm: 'roundRobin' },
      position: { x: 400, y: 200 },
    },
    {
      id: '3',
      type: 'server',
      data: { label: `${t('editor.node_labels.server')} 1` },
      position: { x: 200, y: 400 },
    },
    {
      id: '4',
      type: 'server',
      data: { label: `${t('editor.node_labels.server')} 2` },
      position: { x: 600, y: 400 },
    },
    {
      id: '5',
      type: 'database',
      data: { label: t('editor.node_labels.database') },
      position: { x: 400, y: 550 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [roundRobinCounters, setRoundRobinCounters] = useState<Record<string, number>>({});
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    edgeId: string;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'aws' | 'gcp'>('aws');
  const [isCostPanelOpen, setIsCostPanelOpen] = useState(true);
  
  // Hidden file input for importing
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available components configuration with translations
  const availableComponents = [
    { type: 'client', label: t('editor.components.client'), className: 'border-blue-500', icon: Users },
    { type: 'loadBalancer', label: t('editor.components.load_balancer'), className: 'border-green-500', icon: Network },
    { type: 'apiGateway', label: t('editor.components.api_gateway'), className: 'border-indigo-500', icon: Shield },
    { type: 'cache', label: t('editor.components.cache'), className: 'border-pink-500', icon: HardDrive },
    { type: 'messageQueue', label: t('editor.components.message_queue'), className: 'border-orange-500', icon: MessageSquare },
    { type: 'server', label: t('editor.components.server'), className: 'border-purple-500', icon: Server },
    { type: 'database', label: t('editor.components.database'), className: 'border-yellow-500', icon: DatabaseIcon },
  ];

  // --- All slider callbacks ---
  const onThroughputChange = useCallback((nodeId: string, throughput: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, throughput } }
          : node
      )
    );
  }, [setNodes]);

  const onAlgorithmChange = useCallback((nodeId: string, algorithm: 'roundRobin') => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, algorithm } }
          : node
      )
    );
  }, [setNodes]);

  const onRateLimitChange = useCallback((nodeId: string, rateLimit: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, rateLimit } }
          : node
      )
    );
  }, [setNodes]);

  const onHitRateChange = useCallback((nodeId: string, hitRate: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, hitRate } }
          : node
      )
    );
  }, [setNodes]);

  const onDequeueRateChange = useCallback((nodeId: string, dequeueRate: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, dequeueRate } }
          : node
      )
    );
  }, [setNodes]);

  const onMaxQueueChange = useCallback((nodeId: string, maxQueue: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, maxQueue } }
          : node
      )
    );
  }, [setNodes]);

  const onFailureRateChange = useCallback((nodeId: string, failureRate: number) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, failureRate } }
          : node
      )
    );
  }, [setNodes]);

  // Attach callbacks to initial nodes on mount
  useEffect(() => {
    setNodes(nds => withNodeCallbacks(nds, {
      onThroughputChange,
      onAlgorithmChange,
      onRateLimitChange,
      onHitRateChange,
      onDequeueRateChange,
      onMaxQueueChange,
      onFailureRateChange,
    }));
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulation function
  const simulateMetrics = useCallback(() => {
    if (!isSimulationRunning) return;

    setNodes((nds) => {
      // Calculate request flow through the system
      const requestFlow = new Map<string, number>(); // edgeId -> flow
      const failedRequestsMap = new Map<string, number>();
      const throttledRequestsMap = new Map<string, number>();
      const activeRequestsMap = new Map<string, number>();
      
      // --- Topological Sort Helper ---
      function topologicalSort(nodes: Node<NodeData>[], edges: Edge[]): Node<NodeData>[] {
        const inDegree: Record<string, number> = {};
        const graph: Record<string, string[]> = {};
        nodes.forEach(node => {
          inDegree[node.id] = 0;
          graph[node.id] = [];
        });
        edges.forEach(edge => {
          inDegree[edge.target]++;
          graph[edge.source].push(edge.target);
        });
        const queue: string[] = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
        const sorted: Node<NodeData>[] = [];
        const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
        while (queue.length > 0) {
          const id = queue.shift()!;
          sorted.push(nodeMap[id]);
          for (const neighbor of graph[id]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) queue.push(neighbor);
          }
        }
        return sorted;
      }

      // --- Unified Node Processing in Topological Order ---
      const sortedNodes = topologicalSort(nds, edges);
      sortedNodes.forEach(node => {
        const incomingEdges = edges.filter(e => e.target === node.id);
        const incomingRequests = incomingEdges
          .map(e => requestFlow.get(e.id) || 0)
          .reduce((sum, curr) => sum + curr, 0);
        switch (node.type) {
          case 'client': {
            const throughput = node.data.throughput || 50;
            const randomFactor = 0.9 + Math.random() * 0.2;
            const baseRequests = Math.floor(throughput * randomFactor);
            const failureRate = node.data.failureRate || 0;
            const failedRequests = Math.floor(baseRequests * (failureRate / 100));
            const outgoingRequests = baseRequests - failedRequests;
            
            edges.filter(e => e.source === node.id).forEach(e => {
              requestFlow.set(e.id, outgoingRequests);
            });
            failedRequestsMap.set(node.id, failedRequests);
            break;
          }
          case 'cache': {
            const cacheThroughput = node.data.throughput || 100;
            const cacheHitRate = node.data.hitRate !== undefined ? node.data.hitRate : 0.8;
            const failureRate = node.data.failureRate || 0;
            const processed = Math.min(incomingRequests, cacheThroughput);
            const failedDueToCapacity = incomingRequests - processed;
            const failedDueToError = Math.floor(processed * (failureRate / 100));
            const actualProcessed = processed - failedDueToError;
            const cacheHits = Math.floor(actualProcessed * cacheHitRate);
            const cacheMisses = actualProcessed - cacheHits;
            const activeRequestsCache = Math.ceil(actualProcessed * 0.05);
            
            const missesToSend = cacheMisses;
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(missesToSend / outgoingEdges.length);
              const remainder = missesToSend % outgoingEdges.length;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
              });
            }
            failedRequestsMap.set(node.id, failedDueToCapacity + failedDueToError);
            activeRequestsMap.set(node.id, activeRequestsCache);
            node.data.metrics = {
              requestsPerSecond: incomingRequests,
              activeRequests: activeRequestsCache,
              responseTime: 5 + Math.random() * 5,
              load: Math.min(100, (incomingRequests / cacheThroughput) * 100),
              failedRequests: failedDueToCapacity + failedDueToError,
              cacheHits,
              cacheMisses,
              hitRate: cacheHitRate,
            };
            break;
          }
          case 'apiGateway': {
            const throughput = node.data.throughput || 200;
            const rateLimit = node.data.rateLimit || 100;
            const failureRate = node.data.failureRate || 0;
            let requestsAfterRateLimit = Math.min(incomingRequests, rateLimit);
            let throttledRequests = Math.max(0, incomingRequests - rateLimit);
            let requestsAfterThroughput = Math.min(requestsAfterRateLimit, throughput);
            let failedDueToCapacity = Math.max(0, requestsAfterRateLimit - throughput);
            let failedDueToError = Math.floor(requestsAfterThroughput * (failureRate / 100));
            let actualProcessed = requestsAfterThroughput - failedDueToError;
            
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(actualProcessed / outgoingEdges.length);
              const remainder = actualProcessed % outgoingEdges.length;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
              });
            }
            throttledRequestsMap.set(node.id, throttledRequests);
            failedRequestsMap.set(node.id, failedDueToCapacity + failedDueToError);
            activeRequestsMap.set(node.id, Math.ceil(actualProcessed * 0.05));
            break;
          }
          case 'loadBalancer': {
            const throughput = node.data.throughput || 150;
            const failureRate = node.data.failureRate || 0;
            const maxHandled = Math.min(incomingRequests, throughput);
            const failedDueToCapacity = incomingRequests - maxHandled;
            const failedDueToError = Math.floor(maxHandled * (failureRate / 100));
            const actualProcessed = maxHandled - failedDueToError;
            
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(actualProcessed / outgoingEdges.length);
              const remainder = actualProcessed % outgoingEdges.length;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
              });
            }
            failedRequestsMap.set(node.id, failedDueToCapacity + failedDueToError);
            activeRequestsMap.set(node.id, Math.ceil(actualProcessed * 0.05));
            break;
          }
          case 'server': {
            const throughput = node.data.throughput || 100;
            const failureRate = node.data.failureRate || 0;
            const maxHandled = Math.min(incomingRequests, throughput);
            const failedDueToCapacity = incomingRequests - maxHandled;
            const failedDueToError = Math.floor(maxHandled * (failureRate / 100));
            const actualProcessed = maxHandled - failedDueToError;
            
            const outgoingEdges = edges.filter(e => e.source === node.id);
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(actualProcessed / outgoingEdges.length);
              const remainder = actualProcessed % outgoingEdges.length;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
              });
            }
            failedRequestsMap.set(node.id, failedDueToCapacity + failedDueToError);
            activeRequestsMap.set(node.id, Math.ceil(actualProcessed * 0.1));
            break;
          }
          case 'database': {
            const throughput = node.data.throughput || 50;
            const failureRate = node.data.failureRate || 0;
            const maxHandled = Math.min(incomingRequests, throughput);
            const failedDueToCapacity = incomingRequests - maxHandled;
            const failedDueToError = Math.floor(maxHandled * (failureRate / 100));
            const actualProcessed = maxHandled - failedDueToError;
            
            failedRequestsMap.set(node.id, failedDueToCapacity + failedDueToError);
            activeRequestsMap.set(node.id, Math.ceil(actualProcessed * 0.1));
            break;
          }
          case 'messageQueue': {
            if (!('queueState' in node.data)) {
              (node.data as any).queueState = { length: 0, reprocessing: 0 };
            }
            const queueState = (node.data as any).queueState;
            const maxQueue = node.data.maxQueue || 100;
            const dequeueRate = node.data.dequeueRate || 50;
            const failureRate = node.data.failureRate || 0;
            
            // Calculate downstream failures that need to be requeued
            const outgoingEdges = edges.filter(e => e.source === node.id);
            let totalRequeued = 0;
            outgoingEdges.forEach(edge => {
              const targetNode = nodes.find(n => n.id === edge.target);
              if (targetNode?.data.metrics && targetNode.data.failureRate) {
                const edgeFlow = requestFlow.get(edge.id) || 0;
                const downstreamFailureRate = targetNode.data.failureRate / 100;
                const requeueCount = Math.floor(edgeFlow * downstreamFailureRate);
                totalRequeued += requeueCount;
              }
            });
            
            // Add new incoming requests
            const toEnqueue = incomingRequests + totalRequeued;
            let dropped = 0;
            
            // Check if we can accommodate new requests plus requeued messages
            if (queueState.length + toEnqueue > maxQueue) {
              dropped = queueState.length + toEnqueue - maxQueue;
              queueState.length = maxQueue;
            } else {
              queueState.length += toEnqueue;
            }
            
            // Process dequeue with failure rate
            const baseDequeue = Math.min(queueState.length, dequeueRate);
            const failedDueToError = Math.floor(baseDequeue * (failureRate / 100));
            const toDequeue = baseDequeue - failedDueToError;
            
            // Failed messages due to queue's own failure rate are requeued
            queueState.length = Math.min(maxQueue, queueState.length - toDequeue + failedDueToError);
            
            // Distribute successfully dequeued messages
            if (outgoingEdges.length > 0) {
              const baseShare = Math.floor(toDequeue / outgoingEdges.length);
              const remainder = toDequeue % outgoingEdges.length;
              outgoingEdges.forEach((e, index) => {
                let share = baseShare;
                if (index < remainder) share += 1;
                requestFlow.set(e.id, share);
              });
            }
            
            const responseTime = 5 + queueState.length * 2;
            node.data.metrics = {
              requestsPerSecond: incomingRequests,
              dequeueRate: toDequeue,
              queueLength: queueState.length,
              droppedMessages: dropped,
              responseTime,
              load: Math.min(100, (queueState.length / maxQueue) * 100),
              failedRequests: failedDueToError,
              maxQueue,
              activeRequests: toDequeue,
            };
            break;
          }
          default:
            break;
        }
      });

      // Update metrics for each node
      const cumulativeLatencyMap = new Map<string, number>();

      // First, set cumulative latency for client nodes to their own response time
      nds.forEach(node => {
        if (node.type === 'client' && node.data.metrics) {
          cumulativeLatencyMap.set(node.id, node.data.metrics.responseTime);
        }
      });

      // Now, for all other nodes, propagate cumulative latency from their sources
      nds.forEach(node => {
        if (node.type !== 'client' && node.data.metrics) {
          // Find all incoming edges
          const incomingEdges = edges.filter(e => e.target === node.id);
          // Get the max cumulative latency from all sources
          let maxSourceLatency = 0;
          incomingEdges.forEach(edge => {
            const sourceLatency = cumulativeLatencyMap.get(edge.source) || 0;
            if (sourceLatency > maxSourceLatency) maxSourceLatency = sourceLatency;
          });
          // This node's cumulative latency is its own response time plus max of sources
          cumulativeLatencyMap.set(node.id, node.data.metrics.responseTime + maxSourceLatency);
        }
      });

      // Add a new function to calculate propagated failures
      const calculatePropagatedFailures = (nodes: Node<NodeData>[], edges: Edge[]) => {
        const propagatedFailures = new Map<string, number>();
        
        // Process nodes in reverse topological order to propagate failures upstream
        const reversedNodes = [...nodes].reverse();
        
        reversedNodes.forEach(node => {
          // Get all incoming edges to this node
          const incomingEdges = edges.filter(e => e.target === node.id);
          const outgoingEdges = edges.filter(e => e.source === node.id);
          
          // Calculate total requests sent to downstream nodes
          const totalDownstreamRequests = outgoingEdges.reduce((sum, edge) => 
            sum + (requestFlow.get(edge.id) || 0), 0);
          
          if (totalDownstreamRequests > 0) {
            // Calculate failure rate from downstream nodes
            let totalDownstreamFailures = 0;
            outgoingEdges.forEach(edge => {
              const targetNode = nodes.find(n => n.id === edge.target);
              if (targetNode?.data.metrics) {
                const edgeFlow = requestFlow.get(edge.id) || 0;
                const downstreamFailureRate = targetNode.data.metrics.failedRequests / 
                  (targetNode.data.metrics.requestsPerSecond + targetNode.data.metrics.failedRequests);
                totalDownstreamFailures += edgeFlow * downstreamFailureRate;
              }
            });
            
            // Add downstream failures to this node's failures
            const currentFailures = failedRequestsMap.get(node.id) || 0;
            failedRequestsMap.set(node.id, currentFailures + Math.floor(totalDownstreamFailures));
          }
        });
        
        return propagatedFailures;
      };

      // After processing all nodes in the first pass, add:
      calculatePropagatedFailures(nds, edges);

      // Update the metrics calculation for each node to include propagated failures
      return nds.map(node => {
        // Always sum the incoming edges' request flows for this node
        const incomingEdges = edges.filter(e => e.target === node.id);
        const nodeRequests = incomingEdges
          .map(e => requestFlow.get(e.id) || 0)
          .reduce((sum, curr) => sum + curr, 0);
        const activeRequests = activeRequestsMap.get(node.id) || 0;
        const failedRequests = failedRequestsMap.get(node.id) || 0;
        const throttledRequests = throttledRequestsMap.get(node.id) || 0;
        let metrics;

        switch (node.type) {
          case 'client':
            const clientThroughput = node.data.throughput || 50;
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests: Math.floor(nodeRequests * 0.05),
              responseTime: 100 + Math.random() * 50,
              load: Math.min(100, (nodeRequests / clientThroughput) * 100),
              failedRequests: failedRequests,
            };
            break;

          case 'server':
            const serverThroughput = node.data.throughput || 100;
            const serverLoad = (nodeRequests / serverThroughput) * 100;
            
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 30 + (serverLoad > 80 ? (serverLoad - 80) * 2 : 0) + Math.random() * 10,
              load: Math.min(100, serverLoad),
              failedRequests: failedRequests,
            };
            break;

          case 'database':
            const dbThroughput = node.data.throughput || 50;
            const dbLoad = (nodeRequests / dbThroughput) * 100;
            
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 10 + (dbLoad > 80 ? (dbLoad - 80) * 5 : 0) + Math.random() * 5,
              load: Math.min(100, dbLoad),
              failedRequests: failedRequests,
            };
            break;

          case 'loadBalancer':
            const lbThroughput = node.data.throughput || 150;
            const lbLoad = (nodeRequests / lbThroughput) * 100;
            
            metrics = {
              requestsPerSecond: nodeRequests,
              activeRequests,
              responseTime: 10 + (lbLoad > 80 ? (lbLoad - 80) : 0) + Math.random() * 5,
              load: Math.min(100, lbLoad),
              failedRequests,
            };
            break;

          case 'apiGateway':
            const gatewayThroughput = node.data.throughput || 200;
            const gatewayRateLimit = node.data.rateLimit || 100;
            
            // Get incoming requests to this gateway directly from source nodes
            const gatewayIncomingEdges = edges.filter(e => e.target === node.id);
            const gatewayIncomingRequests = gatewayIncomingEdges
              .map(e => {
                const sourceNode = nds.find(n => n.id === e.source);
                return sourceNode?.data.metrics?.requestsPerSecond || 0;
              })
              .reduce((sum, curr) => sum + curr, 0);
            
            // Get the actual throttled and failed requests from our simulation
            const actualThrottled = throttledRequests;
            const actualFailed = failedRequests;
            
            // Calculate load based on throughput capacity
            const gatewayLoad = (nodeRequests / gatewayThroughput) * 100;
            
            // Response time calculation factors
            const isThrottling = actualThrottled > 0;
            const baseResponseTime = 20; // Base response time in ms
            const loadFactor = gatewayLoad > 70 ? (gatewayLoad - 70) * 0.5 : 0;
            const throttlingFactor = isThrottling ? 10 : 0; // Additional latency when throttling is active
            
            metrics = {
              requestsPerSecond: nodeRequests, // Successfully processed requests
              activeRequests,
              responseTime: baseResponseTime + loadFactor + throttlingFactor + Math.random() * 5,
              load: Math.min(100, gatewayLoad),
              failedRequests: actualFailed,
              throttledRequests: actualThrottled,
            };
            break;

          case 'cache':
            // Only set metrics here; forwarding of misses is handled in the first simulation pass
            metrics = node.data.metrics || {
              requestsPerSecond: 0,
              activeRequests: 0,
              responseTime: 0,
              load: 0,
              failedRequests: 0,
              cacheHits: 0,
              cacheMisses: 0,
              hitRate: 0,
            };
            break;

          case 'messageQueue':
            // Only set metrics here; queue processing is handled in the first simulation pass
            metrics = node.data.metrics || {
              requestsPerSecond: 0,
              dequeueRate: 0,
              queueLength: 0,
              droppedMessages: 0,
              responseTime: 0,
              load: 0,
              failedRequests: 0,
              maxQueue: 0,
              activeRequests: 0,
            };
            break;

          default:
            return node;
        }

        const cumulativeLatency = cumulativeLatencyMap.get(node.id) || metrics.responseTime;
        return {
          ...node,
          data: {
            ...node.data,
            metrics: {
              ...metrics,
              cumulativeLatency,
            },
            onThroughputChange: (value: number) => onThroughputChange(node.id, value),
            onAlgorithmChange: (value: 'roundRobin') => onAlgorithmChange(node.id, value),
            onRateLimitChange: (value: number) => onRateLimitChange(node.id, value),
            onHitRateChange: (value: number) => onHitRateChange(node.id, value),
            onDequeueRateChange: (value: number) => onDequeueRateChange(node.id, value),
            onMaxQueueChange: (value: number) => onMaxQueueChange(node.id, value),
            onFailureRateChange: (value: number) => onFailureRateChange(node.id, value),
          },
        };
      });
    });

    // Update edge animations and thicknesses
    setEdges((eds) => {
      return eds.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (!sourceNode?.data.metrics || !targetNode) return edge;

        const requestFlow = sourceNode.data.metrics.requestsPerSecond;
        const strokeWidth = Math.max(1, Math.min(8, Math.log10(requestFlow + 1) * 2));
        const targetLoad = targetNode.data.metrics?.load || 0;
        const stroke = targetLoad > 80 ? '#ef4444' : targetLoad > 60 ? '#eab308' : undefined;

        return {
          ...edge,
          animated: requestFlow > 0,
          style: { 
            ...edge.style, 
            strokeWidth,
            stroke,
          },
        };
      });
    });
  }, [isSimulationRunning, setNodes, setEdges, nodes, edges, onThroughputChange, onAlgorithmChange, onRateLimitChange, roundRobinCounters]);

  // Run simulation every second
  useEffect(() => {
    const interval = setInterval(simulateMetrics, 1000);
    return () => clearInterval(interval);
  }, [simulateMetrics]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (!type || !reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNodeLabel = type === 'server' 
        ? `${t('editor.node_labels.server')} ${nodes.filter(n => n.type === 'server').length + 1}`
        : type === 'database'
          ? `${t('editor.node_labels.database')} ${nodes.filter(n => n.type === 'database').length + 1}`
          : type === 'loadBalancer'
            ? `${t('editor.node_labels.load_balancer')} ${nodes.filter(n => n.type === 'loadBalancer').length + 1}`
            : type === 'apiGateway'
              ? `${t('editor.node_labels.api_gateway')} ${nodes.filter(n => n.type === 'apiGateway').length + 1}`
              : type === 'cache'
                ? `${t('editor.node_labels.cache')} ${nodes.filter(n => n.type === 'cache').length + 1}`
                : type === 'messageQueue'
                  ? `${t('editor.node_labels.message_queue')} ${nodes.filter(n => n.type === 'messageQueue').length + 1}`
                  : `${t('editor.node_labels.client')} ${nodes.filter(n => n.type === 'client').length + 1}`;

      // Set default values based on node type
      let nodeData: any = { 
        label: newNodeLabel,
        failureRate: 0 // Default failure rate
      };
      
      if (type === 'loadBalancer') {
        nodeData.algorithm = 'roundRobin';
      } else if (type === 'apiGateway') {
        nodeData.rateLimit = 100;
        nodeData.throughput = 200;
      } else if (type === 'server') {
        nodeData.throughput = 100;
      } else if (type === 'database') {
        nodeData.throughput = 50;
      } else if (type === 'client') {
        nodeData.throughput = 50;
      } else if (type === 'cache') {
        nodeData.throughput = 100;
        nodeData.hitRate = 0.8;
      } else if (type === 'messageQueue') {
        nodeData.maxQueue = 100;
        nodeData.dequeueRate = 50;
      }

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: {
          ...nodeData,
          onThroughputChange: (value: number) => onThroughputChange(newNode.id, value),
          onAlgorithmChange: (value: 'roundRobin') => onAlgorithmChange(newNode.id, value),
          onRateLimitChange: (value: number) => onRateLimitChange(newNode.id, value),
          onHitRateChange: (value: number) => onHitRateChange(newNode.id, value),
          onDequeueRateChange: (value: number) => onDequeueRateChange(newNode.id, value),
          onMaxQueueChange: (value: number) => onMaxQueueChange(newNode.id, value),
          onFailureRateChange: (value: number) => onFailureRateChange(newNode.id, value),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onNodesDelete = useCallback((deleted: Node[]) => {
    // Remove any edges connected to deleted nodes
    setEdges((eds) => eds.filter(edge => 
      !deleted.some(node => node.id === edge.source || node.id === edge.target)
    ));
  }, [setEdges]);

  const onEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      // Prevent default context menu
      event.preventDefault();
      
      // Set the position of the custom context menu
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edgeId: edge.id,
      });
    },
    []
  );

  const onPaneClick = useCallback(() => {
    // Close the context menu when clicking elsewhere
    setContextMenu(null);
  }, []);

  const onRemoveEdge = useCallback(() => {
    if (contextMenu) {
      setEdges((eds) => eds.filter((edge) => edge.id !== contextMenu.edgeId));
      setContextMenu(null);
    }
  }, [contextMenu, setEdges]);

  // Close the context menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Export system design to .din file
  const exportSystemDesign = useCallback(() => {
    // Stop simulation if running
    if (isSimulationRunning) {
      setIsSimulationRunning(false);
    }
    
    // Prepare the design data
    const designData: DistributedSystemDesign = {
      nodes: nodes.map(node => ({
        ...node,
        data: {
          label: node.data.label,
          throughput: node.data.throughput,
          algorithm: node.data.algorithm,
          rateLimit: node.data.rateLimit,
        }
      })),
      edges,
      version: '1.0'
    };
    
    // Convert to JSON and create blob
    const designJson = JSON.stringify(designData, null, 2);
    const blob = new Blob([designJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger it
    const link = document.createElement('a');
    link.href = url;
    link.download = `distributed-system-${new Date().toISOString().slice(0, 10)}.din`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
  }, [nodes, edges, isSimulationRunning]);
  
  // Trigger file input click
  const handleImportClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  // Handle file import
  const importSystemDesign = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Stop simulation if running
    if (isSimulationRunning) {
      setIsSimulationRunning(false);
    }
    
    // Reset any previous errors
    setImportError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const design = JSON.parse(content) as DistributedSystemDesign;
        
        // Basic validation
        if (!design.nodes || !design.edges || !design.version) {
          throw new Error(t('editor.errors.invalid_file'));
        }
        
        // Import the design
        setNodes(design.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onThroughputChange: (value: number) => onThroughputChange(node.id, value),
            onAlgorithmChange: (value: 'roundRobin') => onAlgorithmChange(node.id, value),
            onRateLimitChange: (value: number) => onRateLimitChange(node.id, value),
            onHitRateChange: (value: number) => onHitRateChange(node.id, value),
            onDequeueRateChange: (value: number) => onDequeueRateChange(node.id, value),
            onMaxQueueChange: (value: number) => onMaxQueueChange(node.id, value),
            onFailureRateChange: (value: number) => onFailureRateChange(node.id, value),
          }
        })));
        setEdges(design.edges);
        
        // Reset round robin counters
        setRoundRobinCounters({});
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error importing file:', error);
        setImportError(t('editor.errors.import_error'));
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      setImportError(t('editor.errors.read_error'));
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  }, [isSimulationRunning, onThroughputChange, onAlgorithmChange, onRateLimitChange, onHitRateChange, onDequeueRateChange, onMaxQueueChange, onFailureRateChange, setNodes, setEdges]);

  // --- Cost Estimation ---
  const costBreakdown = nodes.map(node => {
    const { cost, product } = estimateNodeCost(node, provider);
    return {
      id: node.id,
      label: node.data.label,
      type: node.type,
      cost,
      product,
    };
  });
  const totalCost = costBreakdown.reduce((sum, n) => sum + n.cost, 0);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="prose prose-invert prose-lg max-w-none mb-8">
        <h1 className="text-3xl font-bold mb-4 text-brand-600 dark:text-brand-400">
          {t('editor.title')}
        </h1>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              className={`px-4 py-2 ${
                isSimulationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } text-white rounded transition-colors`}
            >
              {isSimulationRunning ? t('editor.buttons.stop') : t('editor.buttons.start')}
            </button>
            
            <div className="border-l border-slate-300 dark:border-slate-700 h-8 mx-2"></div>
            
            <button
              onClick={exportSystemDesign}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('editor.buttons.export')}
            </button>
            
            <button
              onClick={handleImportClick}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t('editor.buttons.import')}
            </button>
            
            
            
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".din"
              className="hidden"
              onChange={importSystemDesign}
            />
          </div>
          
          {importError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {importError}
              </div>
            </div>
          )}

          <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div>{t('editor.labels.load_status')}</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{t('editor.labels.normal')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>{t('editor.labels.warning')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>{t('editor.labels.critical')}</span>
            </div>
          </div>

          {/* Cost Estimation Panel */}
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg mt-2 shadow-lg w-full max-w-3xl">
            <div
              className={`flex items-center justify-between px-4 py-2 cursor-pointer select-none rounded-t-lg ${!isCostPanelOpen ? 'bg-white dark:bg-slate-900/80' : ''}`}
              onClick={() => setIsCostPanelOpen(open => !open)}
              aria-label={isCostPanelOpen ? t('editor.labels.monthly_cost_estimate', { provider: provider === 'aws' ? 'AWS' : 'Google Cloud' }) : t('editor.labels.monthly_cost_estimate', { provider: provider === 'aws' ? 'AWS' : 'Google Cloud' })}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <label className="text-white font-semibold">{t('editor.labels.cloud')}</label>
                <select
                  value={provider}
                  onClick={e => e.stopPropagation()} // Prevent toggle when changing provider
                  onChange={e => setProvider(e.target.value as 'aws' | 'gcp')}
                  className="bg-zinc-700 text-white rounded px-2 py-1"
                >
                  <option value="aws">AWS</option>
                  <option value="gcp">Google Cloud</option>
                </select>
                <span className="text-white font-bold text-lg ml-2 whitespace-nowrap">
                  {t('editor.labels.monthly_cost_estimate', { provider: provider === 'aws' ? 'AWS' : 'Google Cloud' })}
                </span>
              </div>
              <ChevronDown
                className={`w-6 h-6 text-white chevron-animated ${isCostPanelOpen ? 'expanded' : 'collapsed'}`}
              />
            </div>
            <div className={`cost-panel-content${isCostPanelOpen ? '' : ' collapsed'}`}
              style={{ maxHeight: isCostPanelOpen ? 1000 : 0, opacity: isCostPanelOpen ? 1 : 0, transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s', overflow: 'hidden' }}
            >
              <div className="flex flex-col gap-1 text-sm px-4 pt-2">
                {costBreakdown.map(n => (
                  <div key={n.id} className="flex justify-between items-baseline">
                    <span className="text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-baseline gap-0.5">
                      <span>{n.label} <span className="text-zinc-500">({n.type})</span></span>
                      {n.product && (
                        <span className="text-slate-500 dark:text-slate-400 italic text-xs sm:ml-2">{n.product}</span>
                      )}
                    </span>
                    <span className="text-green-400 font-mono">${n.cost.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-300 dark:border-slate-700 mt-2 pt-2 font-bold">
                  <span className="text-white">{t('editor.labels.total')}</span>
                  <span className="text-green-300 font-mono text-lg">${totalCost.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-4 pb-2">
                {t('editor.labels.note_prefix', { provider: provider === 'aws' ? 'AWS' : 'Google Cloud' })}
                <br />
                <a href="https://aws.amazon.com/pricing/" target="_blank" rel="noopener noreferrer" className="underline">AWS Pricing</a> | <a href="https://cloud.google.com/pricing" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Pricing</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '600px' }} className="bg-white dark:bg-slate-900 rounded-lg relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          deleteKeyCode={['Backspace', 'Delete']}
          draggable={true}
          fitView
          fitViewOptions={{
            padding: 0.5,
            maxZoom: 1,
          }}
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          onEdgeContextMenu={onEdgeContextMenu}
          onPaneClick={onPaneClick}
        >
          <Panel position="top-left" className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-semibold mb-2">{t('editor.labels.components')}</h3>
              <div className="flex flex-col gap-2">
                {availableComponents.map((component) => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.type}
                      className={`px-4 py-2 bg-zinc-700 rounded cursor-move hover:bg-zinc-600 
                        transition-colors border-2 ${component.className} text-white`}
                      onDragStart={(e) => onDragStart(e, component.type)}
                      draggable
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {component.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
        
        {/* Custom context menu */}
        {contextMenu && (
          <div
            className="absolute z-50 bg-slate-100 dark:bg-slate-800 rounded shadow-lg p-2"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onRemoveEdge}
              className="text-white hover:bg-red-600 py-1 px-3 rounded w-full text-left flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t('editor.buttons.remove_edge')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 