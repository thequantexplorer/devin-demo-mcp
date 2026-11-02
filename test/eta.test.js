import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { estimateDelivery } from '../src/eta.js';
import { warehouses } from '../src/warehouses.js';

const { LAX, BER, SYD } = warehouses;
const utcWarehouse = { id: 'TST', timeZone: 'UTC', cutoffHour: 14, holidays: [] };

const eta = (orderedAt, warehouse, transitDays) => {
  const { shipsOn, arrivesBy } = estimateDelivery(orderedAt, warehouse, transitDays);
  return { shipsOn, arrivesBy };
};

describe('basics', () => {
  test('a Tuesday morning order ships the same day', () => {
    assert.deepEqual(estimateDelivery('2026-11-03T09:00:00Z', utcWarehouse, 2), {
      shipsOn: '2026-11-03',
      arrivesBy: '2026-11-05',
      label: 'Ships Tue, Nov 3 · Arrives by Thu, Nov 5',
    });
  });

  test('rejects a negative transit time', () => {
    assert.throws(() => estimateDelivery('2026-11-03T09:00:00Z', utcWarehouse, -1), RangeError);
  });

  test('rejects an invalid order time', () => {
    assert.throws(() => estimateDelivery('not a date', utcWarehouse, 1), RangeError);
  });
});

// The server's own time zone must not change any answer.
for (const serverTimeZone of ['UTC', 'Asia/Kolkata']) {
  describe(`warehouse local time (server TZ=${serverTimeZone})`, () => {
    const withServerTimeZone = (fn) => () => {
      const previous = process.env.TZ;
      process.env.TZ = serverTimeZone;
      try { fn(); } finally { process.env.TZ = previous; }
    };

    test('cutoff uses the warehouse clock: 13:30 in Los Angeles ships today', withServerTimeZone(() => {
      // Mon Nov 2, 13:30 PST
      assert.deepEqual(eta('2026-11-02T21:30:00Z', LAX, 2), { shipsOn: '2026-11-02', arrivesBy: '2026-11-04' });
    }));

    test('an order at exactly the cutoff ships the next day', withServerTimeZone(() => {
      // Mon Nov 2, 14:00 PST
      assert.deepEqual(eta('2026-11-02T22:00:00Z', LAX, 1), { shipsOn: '2026-11-03', arrivesBy: '2026-11-04' });
    }));

    test('Friday after cutoff ships Monday and transit skips the weekend', withServerTimeZone(() => {
      // Fri Oct 30, 14:30 PDT (the clocks change on Sun Nov 1)
      assert.deepEqual(eta('2026-10-30T21:30:00Z', LAX, 3), { shipsOn: '2026-11-02', arrivesBy: '2026-11-05' });
    }));

    test('Friday after cutoff in Berlin ships Monday', withServerTimeZone(() => {
      // Fri Nov 6, 16:30 CET
      assert.deepEqual(eta('2026-11-06T15:30:00Z', BER, 1), { shipsOn: '2026-11-09', arrivesBy: '2026-11-10' });
    }));

    test('a Saturday order in Sydney ships Monday', withServerTimeZone(() => {
      // Sat Nov 7, 09:00 AEDT (still Friday in UTC)
      assert.deepEqual(eta('2026-11-06T22:00:00Z', SYD, 1), { shipsOn: '2026-11-09', arrivesBy: '2026-11-10' });
    }));

    test('a late Saturday order in Los Angeles with same-day transit', withServerTimeZone(() => {
      // Sat Oct 31, 23:30 PDT (already Sunday in UTC)
      assert.deepEqual(eta('2026-11-01T06:30:00Z', LAX, 0), { shipsOn: '2026-11-02', arrivesBy: '2026-11-02' });
    }));

    test('transit skips warehouse holidays (Thanksgiving)', withServerTimeZone(() => {
      // Wed Nov 25, 10:00 PST; Thu 26 and Fri 27 are holidays
      assert.deepEqual(eta('2026-11-25T18:00:00Z', LAX, 1), { shipsOn: '2026-11-25', arrivesBy: '2026-11-30' });
    }));

    test('an order before a holiday weekend ships after it (Christmas in Berlin)', withServerTimeZone(() => {
      // Wed Dec 23, 16:00 CET; Dec 24-26 are holidays
      assert.deepEqual(eta('2026-12-23T15:00:00Z', BER, 2), { shipsOn: '2026-12-28', arrivesBy: '2026-12-30' });
    }));

    test('the label uses warehouse-local dates', withServerTimeZone(() => {
      assert.equal(
        estimateDelivery('2026-11-02T21:30:00Z', LAX, 2).label,
        'Ships Mon, Nov 2 · Arrives by Wed, Nov 4',
      );
    }));
  });
}
