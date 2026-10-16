# System editor simulation model

The `/editor` is a deterministic educational simulation, not a capacity test of a deployed application. The same graph, seed and scenario produce the same results. A tick describes the interval `[t, t + dt)`; UI playback speed changes wall-clock playback, not simulated behavior.

## Requests and routing

Client rates and enabled cron jobs generate offered traffic. Processing nodes have service time, parallel workers and replicas. Requests follow one outgoing destination, selected by routing weights. Edges do not represent simultaneous required dependencies: fan-out, joins and distributed transactions are not modeled. A client without a destination fails; a cache without an origin can serve hits, but its misses fail. A closed cycle without a terminating response is not a successful request.

Failure probabilities propagate back through all required hops on the selected route. Retries amplify downstream attempts and reduce the residual failure probability using a truncated geometric model. Sampled latency includes failed attempts and exponential backoff, with optional full jitter. Deadlines apply to each node's own processing and waiting time; they do not propagate an end-to-end caller deadline through the dependency graph. No-op client timeout and latency-distribution controls are hidden.

## Queues and asynchronous acceptance

Ordinary processing nodes use steady-state M/M/c queueing. Finite waiting rooms use M/M/c/K, including a zero-slot loss system. These are analytical approximations even when another service-time distribution is selected. Unbounded overload has no finite steady state; displayed waiting time is capped at 60 seconds rather than predicting a finite real backlog.

A message broker has a separate fluid backlog advanced exactly once per tick. Producers and consumers operate concurrently. Backlog changes by accepted arrivals minus drain and overflow, with time units preserved. An unavailable broker rejects new arrivals and preserves its durable backlog until recovery.

A successful logical request may be an asynchronous enqueue acknowledgement. It does **not** imply that a consumer has finished the work. Queue drain, worker throughput and backlog are separate node metrics. Consumer failures do not retroactively fail producer acknowledgements. The broker timeout applies to enqueue acknowledgement and does not expire waiting messages. Message TTL, consumer acknowledgements, redelivery, deduplication, persistence loss and delivery guarantees are not simulated.

## Capacity, failures and control loops

Weighted balancing uses the same branch weights for traffic and failure propagation. Least-connections is approximated by healthy effective backend capacity, rather than socket-level active connection tracking. Without individual keys, hashing has the same aggregate split as uniform round robin. Sharding represents an aggregate hotspot controlled by skew; it does not simulate key placement or migrations.

Replicated databases spread reads across replicas and serialize writes on a primary. Strong/quorum writes include a configured acknowledgement delay; reads and eventual writes do not inherit this delay. Quorum membership, follower lag distributions, stale reads and consistency anomalies are not simulated.

Circuit breakers trip from observed downstream failures, wait their reset interval, and admit at most one half-open probe per simulation interval. No admitted probe means no evidence of recovery. This is a simplified error-rate controller without a rolling minimum sample window.

Autoscaling evaluates every 15 simulated seconds, uses the utilization ratio to recommend a bounded replica count, applies a 10% tolerance, and stabilizes scale-down recommendations over 300 seconds. It is inspired by Kubernetes HPA, but does not model pod startup, metrics delay or provisioning failures.

Partitions make the selected component unreachable while preserving the graph. This models a node-isolation fault, not arbitrary asymmetric network links or consensus partitions.

## Metrics, cost and persistence

System throughput counts successful synchronous responses or accepted asynchronous requests. Latency percentiles use sampled traces, including failed requests; a broker ends the producer trace and starts separate consumer samples. In-flight and queue metrics remain estimates rather than a per-request event ledger. The error-budget display uses accumulated failures across the run, so a recovered last tick does not erase earlier errors.

Idle systems receive no throughput or availability score. A design must meet the existing game house rules to earn game points; those rules are a game constraint, not a universal architecture prescription.

Costs use fixed illustrative AWS/GCP coefficients, not current provider quotes. Storage, network traffic, region and taxes are excluded. Database concurrency and replicas affect provisioning estimates; latency injected by chaos does not make provisioned hardware cheaper.

Design imports and API payloads validate numeric ranges, IDs and edge references. Worker and replica counts are bounded to keep the analytical solver usable. Missing parameters receive defaults. JSON `null` for an unbounded queue restores `Infinity`; a zero-slot queue stays zero. Seed zero is distinct and reproducible. Provider and traffic multiplier survive file and API round trips. Read-only views permit simulation and inspection while blocking graph and scenario changes.

## Validation and references

Regression coverage checks conservation, ordering independence, deep failure chains, cycles, weighted routing, finite buffers, async acceptance, durable broker recovery, retry latency, cron traces, replicated writes, circuit-breaker probes, autoscaler timing, state cleanup, costs, score guards, design round trips and read-only controls. Browser tests cover run/pause/reset, editing/undo, import/export, invalid imports, and shared embeds.

Primary references informing the model:

- [Kubernetes Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/): utilization-ratio scaling, default control interval, tolerance and downscale stabilization.
- [PostgreSQL synchronous replication](https://www.postgresql.org/docs/current/warm-standby.html#SYNCHRONOUS-REPLICATION): synchronous write acknowledgement and quorum behavior.
- [NGINX least-connections](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#least_conn): actual connection-based balancing, contrasted with this aggregate approximation.
- [Martin Fowler: Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html): closed, open and half-open trial transitions.
