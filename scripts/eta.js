// Print the delivery promise for a few sample orders: npm run eta
import { estimateDelivery } from '../src/eta.js';
import { warehouses } from '../src/warehouses.js';

const samples = [
  ['2026-11-02T21:30:00Z', 'LAX', 2],
  ['2026-10-30T21:30:00Z', 'LAX', 3],
  ['2026-11-06T15:30:00Z', 'BER', 1],
  ['2026-11-06T22:00:00Z', 'SYD', 1],
  ['2026-11-25T18:00:00Z', 'LAX', 1],
];

for (const [orderedAt, id, transitDays] of samples) {
  const { label } = estimateDelivery(orderedAt, warehouses[id], transitDays);
  console.log(`${id}  ordered ${orderedAt}  transit ${transitDays}d  ->  ${label}`);
}
