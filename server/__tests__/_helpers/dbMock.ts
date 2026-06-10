/**
 * A tiny chainable stand-in for the drizzle `db` handle.
 *
 * Real query builders (`db.select().from().where()...`) are thenables that
 * resolve to a row array once awaited. This mock mirrors that: every chain
 * method returns the same proxy, and awaiting the chain pops the next canned
 * result from an ordered queue. Tests provide results in the exact order the
 * handler awaits them via `setResults`.
 *
 * The exported object name is intentionally prefixed so it can be referenced
 * from inside a hoisted `vi.mock('../../db/client', () => ({ db: mockDb.db }))`
 * factory (Vitest permits `mock*`-prefixed identifiers there).
 */
export interface DbMock {
  db: any;
  setResults: (results: unknown[]) => void;
  reset: () => void;
  calls: { op: string; args: unknown[] }[];
  remaining: () => number;
}

export function createDbMock(): DbMock {
  const state: { queue: unknown[] } = { queue: [] };
  const calls: { op: string; args: unknown[] }[] = [];

  function nextResult(): unknown {
    return state.queue.length ? state.queue.shift() : [];
  }

  function makeChain(): any {
    const proxy: any = new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === 'then') {
            return (onFulfilled: any, onRejected: any) =>
              Promise.resolve(nextResult()).then(onFulfilled, onRejected);
          }
          if (prop === 'catch') {
            return (onRejected: any) =>
              Promise.resolve(nextResult()).catch(onRejected);
          }
          if (prop === 'finally') {
            return (cb: any) => Promise.resolve(nextResult()).finally(cb);
          }
          // Record the payload passed to `.values(...)` so tests can assert on
          // exactly what would be inserted (the rest of the chain is opaque).
          if (prop === 'values') {
            return (...args: unknown[]) => {
              calls.push({ op: 'values', args });
              return proxy;
            };
          }
          // Any builder method (from/where/orderBy/limit/returning/
          // onConflictDoUpdate/innerJoin/groupBy/...) just continues the chain.
          return () => proxy;
        },
      }
    );
    return proxy;
  }

  const db: any = {
    select: (...args: unknown[]) => {
      calls.push({ op: 'select', args });
      return makeChain();
    },
    selectDistinct: (...args: unknown[]) => {
      calls.push({ op: 'selectDistinct', args });
      return makeChain();
    },
    insert: (...args: unknown[]) => {
      calls.push({ op: 'insert', args });
      return makeChain();
    },
    update: (...args: unknown[]) => {
      calls.push({ op: 'update', args });
      return makeChain();
    },
    delete: (...args: unknown[]) => {
      calls.push({ op: 'delete', args });
      return makeChain();
    },
    execute: (...args: unknown[]) => {
      calls.push({ op: 'execute', args });
      return Promise.resolve(nextResult());
    },
    transaction: async (cb: (tx: any) => unknown) => {
      calls.push({ op: 'transaction', args: [] });
      return cb(db);
    },
  };

  return {
    db,
    setResults: (results: unknown[]) => {
      state.queue = [...results];
    },
    reset: () => {
      state.queue = [];
      calls.length = 0;
    },
    remaining: () => state.queue.length,
    calls,
  };
}
