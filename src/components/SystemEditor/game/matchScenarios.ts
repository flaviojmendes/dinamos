// Curated, story-driven match scenarios. Each one is a fully scripted match
// based on a real-world operational incident: a starting architecture (from the
// preset library), escalating rounds with traffic shapes, scripted chaos at
// known offsets, and per-round scoring tuned to the story (e.g. tight budgets
// when the lesson is "you can't just buy your way out").
//
// Chaos `startSec` is relative to the round start: the client sim resets to
// t=0 every round, so a 45s offset always lands mid-round for every player.

import { DEFAULT_SCORING, ScoringConfig } from '../engine/scoring';
import { ChaosEvent } from '../engine/scenarios';

export interface ScenarioRound {
  name: string;
  /** Player-facing one-liner shown in the banner / results. */
  story: string;
  intervalSec: number;
  durationSec: number;
  loadProfile: { type: string; multiplier?: number };
  chaosEvents: ChaosEvent[];
  scoringConfig: ScoringConfig;
  weight: number;
}

export interface MatchScenario {
  id: string;
  name: string;
  /** Admin/lobby-facing pitch for the scenario. */
  description: string;
  /** Preset id from engine/scenarios.ts used as the starting architecture. */
  presetId: string;
  /** Components players cannot delete (usually the traffic source). */
  lockedNodeIds: string[];
  rounds: ScenarioRound[];
}

const chaos = (
  id: string,
  type: ChaosEvent['type'],
  targetId: string,
  startSec: number,
  durationSec: number,
  magnitude?: number,
): ChaosEvent => ({ id, type, targetId, startSec, durationSec, magnitude });

const scoring = (overrides: Partial<ScoringConfig> = {}): ScoringConfig => ({
  ...DEFAULT_SCORING,
  ...overrides,
});

/** Black Friday at an e-commerce store: cache is king, until it dies. */
const blackFriday: MatchScenario = {
  id: 'black-friday',
  name: 'Black Friday',
  description:
    'An e-commerce read path on its biggest day of the year. Survive the door-opening rush, then a cache wipe at peak traffic.',
  presetId: 'read-heavy-cache',
  lockedNodeIds: ['c1'],
  rounds: [
    {
      name: 'Midnight teaser',
      story: 'Early deals are live. Traffic is up 50% and climbing.',
      intervalSec: 90,
      durationSec: 90,
      loadProfile: { type: 'constant', multiplier: 1.5 },
      chaosEvents: [],
      scoringConfig: scoring({ latencyTargetMs: 300 }),
      weight: 1,
    },
    {
      name: 'Doors open',
      story: 'The main sale begins. Expect a sharp spike and a database under pressure.',
      intervalSec: 75,
      durationSec: 120,
      loadProfile: { type: 'spike', multiplier: 2.5 },
      chaosEvents: [chaos('bf-db-slow', 'latencyInjection', 'db', 60, 20, 4)],
      scoringConfig: scoring({ latencyTargetMs: 300 }),
      weight: 1.5,
    },
    {
      name: 'Cache meltdown',
      story: 'Peak traffic, and the cache cluster just went down. Finance is also watching the bill.',
      intervalSec: 75,
      durationSec: 150,
      loadProfile: { type: 'diurnal', multiplier: 3 },
      chaosEvents: [chaos('bf-cache-kill', 'killNode', 'cache', 45, 25)],
      scoringConfig: scoring({ latencyTargetMs: 300, budgetPerHour: 60 }),
      weight: 2,
    },
  ],
};

/** A social post goes viral: fan-out pressure and a thundering herd. */
const goingViral: MatchScenario = {
  id: 'going-viral',
  name: 'Going Viral',
  description:
    'A social feed when one post hits the front page of the internet. Ramping reads, fan-out queues backing up, then the flood.',
  presetId: 'social-feed',
  lockedNodeIds: ['c1'],
  rounds: [
    {
      name: 'A normal Tuesday',
      story: 'Baseline traffic. Tune your system while it is quiet.',
      intervalSec: 90,
      durationSec: 90,
      loadProfile: { type: 'constant', multiplier: 1 },
      chaosEvents: [],
      scoringConfig: scoring(),
      weight: 1,
    },
    {
      name: 'Front page of the internet',
      story: 'The post is everywhere. Reads ramp to 3x and the posts DB is feeling it.',
      intervalSec: 75,
      durationSec: 150,
      loadProfile: { type: 'ramp', multiplier: 3 },
      chaosEvents: [chaos('gv-db-slow', 'latencyInjection', 'db', 80, 20, 3)],
      scoringConfig: scoring(),
      weight: 1.5,
    },
    {
      name: 'The flood',
      story: 'Reply storms. The feed cache dies at peak, then the timeline workers wobble.',
      intervalSec: 75,
      durationSec: 180,
      loadProfile: { type: 'spike', multiplier: 4 },
      chaosEvents: [
        chaos('gv-cache-kill', 'killNode', 'feed', 40, 20),
        chaos('gv-workers-kill', 'killNode', 'w', 100, 15),
      ],
      scoringConfig: scoring({ budgetPerHour: 80 }),
      weight: 2,
    },
  ],
};

/** Region trouble in a microservice mesh: redundancy or downtime. */
const datacenterOutage: MatchScenario = {
  id: 'datacenter-outage',
  name: 'Datacenter Outage',
  description:
    'A microservice mesh during infrastructure failures: first a rack, then a cascading failure. Redundancy beats raw capacity.',
  presetId: 'microservice-mesh',
  lockedNodeIds: ['c1'],
  rounds: [
    {
      name: 'Steady state',
      story: 'All green. Build in the headroom you will need later.',
      intervalSec: 90,
      durationSec: 90,
      loadProfile: { type: 'constant', multiplier: 1.5 },
      chaosEvents: [],
      scoringConfig: scoring(),
      weight: 1,
    },
    {
      name: 'Rack failure',
      story: 'Service A just lost its rack for 30 seconds. Does anything else absorb the traffic?',
      intervalSec: 75,
      durationSec: 150,
      loadProfile: { type: 'constant', multiplier: 1.5 },
      chaosEvents: [chaos('dc-svca-kill', 'killNode', 'svcA', 30, 30)],
      scoringConfig: scoring(),
      weight: 1.5,
    },
    {
      name: 'Cascading failure',
      story: 'Load steps up while the shared cache dies and the database degrades. Stop the cascade.',
      intervalSec: 75,
      durationSec: 180,
      loadProfile: { type: 'step', multiplier: 1 },
      chaosEvents: [
        chaos('dc-cache-kill', 'killNode', 'cache', 40, 20),
        chaos('dc-db-slow', 'latencyInjection', 'db', 90, 25, 5),
      ],
      scoringConfig: scoring({ budgetPerHour: 70 }),
      weight: 2,
    },
  ],
};

/** Live sports streaming: everyone tunes in at exactly the same moment. */
const worldCupFinal: MatchScenario = {
  id: 'world-cup-final',
  name: 'World Cup Final',
  description:
    'A streaming platform on match day. Kickoff spikes, a slow origin store, and the CDN edge failing during the penalty shootout.',
  presetId: 'video-streaming',
  lockedNodeIds: ['c1'],
  rounds: [
    {
      name: 'Pre-match warmup',
      story: 'Viewers trickle in. Make sure the edge cache is doing its job.',
      intervalSec: 90,
      durationSec: 90,
      loadProfile: { type: 'ramp', multiplier: 1.5 },
      chaosEvents: [],
      scoringConfig: scoring(),
      weight: 1,
    },
    {
      name: 'Kickoff',
      story: 'Everyone presses play at once, and the origin object store slows down.',
      intervalSec: 75,
      durationSec: 150,
      loadProfile: { type: 'spike', multiplier: 3 },
      chaosEvents: [chaos('wc-store-slow', 'latencyInjection', 'store', 70, 20, 4)],
      scoringConfig: scoring(),
      weight: 1.5,
    },
    {
      name: 'Penalty shootout',
      story: 'Peak concurrent viewers in history, and a CDN edge node just dropped.',
      intervalSec: 75,
      durationSec: 150,
      loadProfile: { type: 'spike', multiplier: 5 },
      chaosEvents: [chaos('wc-cdn-kill', 'killNode', 'cdn', 50, 20)],
      scoringConfig: scoring({ budgetPerHour: 90 }),
      weight: 2,
    },
  ],
};

/** Concert tickets on sale: queues, payments, and angry fans. */
const ticketOnSale: MatchScenario = {
  id: 'ticket-on-sale',
  name: 'Ticket On-Sale',
  description:
    'A booking site the second tickets drop. Waiting-room queues, a degrading payment provider, and a second surprise drop.',
  presetId: 'ticket-booking',
  lockedNodeIds: ['c1'],
  rounds: [
    {
      name: 'Queue forms',
      story: 'Fans are camping on the page. Size your waiting room before the drop.',
      intervalSec: 90,
      durationSec: 90,
      loadProfile: { type: 'constant', multiplier: 1 },
      chaosEvents: [],
      scoringConfig: scoring({ latencyTargetMs: 400 }),
      weight: 1,
    },
    {
      name: 'Tickets live',
      story: 'The drop. 3x traffic, and the payment provider starts timing out.',
      intervalSec: 75,
      durationSec: 150,
      loadProfile: { type: 'spike', multiplier: 3 },
      chaosEvents: [chaos('ts-pay-slow', 'latencyInjection', 'pay', 60, 30, 6)],
      scoringConfig: scoring({ latencyTargetMs: 400 }),
      weight: 1.5,
    },
    {
      name: 'Second drop',
      story: 'Extra dates announced mid-sale. Inventory DB blips, payments degrade again.',
      intervalSec: 75,
      durationSec: 180,
      loadProfile: { type: 'step', multiplier: 2 },
      chaosEvents: [
        chaos('ts-db-kill', 'killNode', 'db', 50, 15),
        chaos('ts-pay-slow2', 'latencyInjection', 'pay', 110, 20, 4),
      ],
      scoringConfig: scoring({ latencyTargetMs: 400, budgetPerHour: 80 }),
      weight: 2,
    },
  ],
};

export const MATCH_SCENARIOS: MatchScenario[] = [
  blackFriday,
  goingViral,
  datacenterOutage,
  worldCupFinal,
  ticketOnSale,
];

export function getMatchScenario(id: string): MatchScenario | undefined {
  return MATCH_SCENARIOS.find((s) => s.id === id);
}
