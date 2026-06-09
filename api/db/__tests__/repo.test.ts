import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';

const mockDb = createDbMock();
vi.mock('../client', () => ({ db: mockDb.db }));

let repo: typeof import('../repo');
beforeAll(async () => {
  repo = await import('../repo');
});

const user = { id: 'u1', email: 'u1@x.com', nickname: 'Uno', role: 'Estudante', roleId: 2, tokens: 5 };

beforeEach(() => mockDb.reset());

describe('getUserRow / getRoleRow / permissions', () => {
  it('getUserRow returns the first row or null', async () => {
    mockDb.setResults([[user]]);
    expect(await repo.getUserRow('u1')).toEqual(user);
    mockDb.setResults([[]]);
    expect(await repo.getUserRow('u1')).toBeNull();
  });

  it('getRoleRow returns null for a null id without querying', async () => {
    expect(await repo.getRoleRow(null)).toBeNull();
  });

  it('getRoleRow returns the role row', async () => {
    mockDb.setResults([[{ id: 2, name: 'Estudante' }]]);
    expect(await repo.getRoleRow(2)).toEqual({ id: 2, name: 'Estudante' });
  });

  it('getPermissionCodesForRole returns [] for null', async () => {
    expect(await repo.getPermissionCodesForRole(null)).toEqual([]);
  });

  it('getPermissionCodesForRole maps codes', async () => {
    mockDb.setResults([[{ code: 'A' }, { code: 'B' }]]);
    expect(await repo.getPermissionCodesForRole(2)).toEqual(['A', 'B']);
  });

  it('getRoleByName returns the role', async () => {
    mockDb.setResults([[{ id: 1, name: 'Admin' }]]);
    expect(await repo.getRoleByName('Admin')).toEqual({ id: 1, name: 'Admin' });
  });
});

describe('getUserContext', () => {
  it('returns null when the user does not exist', async () => {
    mockDb.setResults([[]]);
    expect(await repo.getUserContext('u1')).toBeNull();
  });

  it('assembles user, role and permission codes', async () => {
    mockDb.setResults([
      [user], // getUserRow
      [{ id: 2, name: 'Estudante' }], // getRoleRow
      [{ code: 'A' }], // permissions
    ]);
    const ctx = await repo.getUserContext('u1');
    expect(ctx?.role?.name).toBe('Estudante');
    expect(ctx?.permissionCodes).toEqual(['A']);
  });
});

describe('createUser', () => {
  it('creates a user with the default role', async () => {
    mockDb.setResults([
      [{ id: 2, name: 'Estudante' }], // getRoleByName
      [{ ...user }], // insert returning
    ]);
    const created = await repo.createUser('u1', 'u1@x.com', 'Uno');
    expect(created.id).toBe('u1');
  });
});

describe('awardTokens', () => {
  it('returns 0 for a non-positive amount', async () => {
    expect(await repo.awardTokens('u1', 0, 'CREATE_TOPIC')).toBe(0);
  });

  it('returns 0 when the user is missing', async () => {
    mockDb.setResults([[]]);
    expect(await repo.awardTokens('u1', 5, 'CREATE_TOPIC')).toBe(0);
  });

  it('awards tokens for an uncapped action', async () => {
    mockDb.setResults([[user], undefined, undefined]);
    expect(await repo.awardTokens('u1', 5, 'CREATE_TOPIC')).toBe(5);
  });

  it('respects the daily cap', async () => {
    mockDb.setResults([[user], [{ count: 50 }]]);
    expect(await repo.awardTokens('u1', 3, 'RECEIVE_UPVOTE_TOPIC')).toBe(0);
  });

  it('awards a capped action under the cap', async () => {
    mockDb.setResults([[user], [{ count: 1 }], undefined, undefined]);
    expect(await repo.awardTokens('u1', 3, 'RECEIVE_UPVOTE_TOPIC')).toBe(3);
  });

  it('skips a duplicate one-time QUALITY_BONUS', async () => {
    mockDb.setResults([[user], [{ id: 1 }]]);
    expect(await repo.awardTokens('u1', 20, 'QUALITY_BONUS', 1, 'topic')).toBe(0);
  });

  it('awards a first-time QUALITY_BONUS', async () => {
    mockDb.setResults([[user], [], undefined, undefined]);
    expect(await repo.awardTokens('u1', 20, 'QUALITY_BONUS', 1, 'topic')).toBe(20);
  });
});

describe('getUserBatchAuthors', () => {
  it('returns an empty map for no ids', async () => {
    const map = await repo.getUserBatchAuthors([]);
    expect(map.size).toBe(0);
  });

  it('maps users to their roles', async () => {
    mockDb.setResults([
      [{ id: 'u1', roleId: 2 }, { id: 'u2', roleId: null }], // users
      [{ id: 2, name: 'Estudante' }], // roles
    ]);
    const map = await repo.getUserBatchAuthors(['u1', 'u2']);
    expect(map.get('u1')?.role?.name).toBe('Estudante');
    expect(map.get('u2')?.role).toBeNull();
  });
});
