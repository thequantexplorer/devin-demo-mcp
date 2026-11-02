# acme-delivery-eta

The delivery promise on the Acme checkout page: "Ships Mon, Nov 2 · Arrives by Wed, Nov 4".

```sh
npm install
npm test        # unit tests (node --test)
npm run eta     # print the promise for a few sample orders
```

## Delivery promise rules

`estimateDelivery(orderedAt, warehouse, transitDays)` in `src/eta.js` returns `{ shipsOn, arrivesBy, label }`. Warehouses are in `src/warehouses.js`.

1. Everything uses the warehouse's local time (`warehouse.timeZone`), not UTC and not the server's time zone.
2. Shipping days are Monday to Friday, except the warehouse's `holidays` (local dates, `yyyy-MM-dd`).
3. An order ships the same day if that day is a shipping day and it was placed before `cutoffHour` local time. Otherwise it ships on the next shipping day.
4. `arrivesBy` is `transitDays` shipping days after `shipsOn`. `transitDays: 0` means it arrives the day it ships.
5. `shipsOn` and `arrivesBy` are local dates (`yyyy-MM-dd`). `label` uses the format `Ships EEE, MMM d · Arrives by EEE, MMM d`.

## Known issue

The current code works in UTC and ignores weekends and holidays, so `npm test` fails. For example, an order placed at 13:30 on a Monday in Los Angeles is promised for Tuesday, and Friday orders in Berlin are promised to arrive on a Sunday.

---

This repo is a starter for a Devin demo. See [DEVIN_DEMO.md](DEVIN_DEMO.md) for setup and the prompt.
