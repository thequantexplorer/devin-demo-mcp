// Delivery promise shown on the checkout page: "Ships Mon, Nov 2 · Arrives by Wed, Nov 4".
import { addDays, format, getHours, isWeekend, startOfDay } from 'date-fns';
import { tz } from '@date-fns/tz';

export function estimateDelivery(orderedAt, warehouse, transitDays) {
  if (!Number.isInteger(transitDays) || transitDays < 0) {
    throw new RangeError('transitDays must be a whole number >= 0');
  }

  const orderDate = new Date(orderedAt);
  if (Number.isNaN(orderDate.getTime())) {
    throw new RangeError(`invalid orderedAt: ${orderedAt}`);
  }

  const inWarehouse = { in: tz(warehouse.timeZone) };
  const holidays = new Set(warehouse.holidays ?? []);
  const isShippingDay = (date) =>
    !isWeekend(date, inWarehouse) && !holidays.has(format(date, 'yyyy-MM-dd', inWarehouse));
  const nextShippingDay = (date) => {
    let next = addDays(date, 1, inWarehouse);
    while (!isShippingDay(next)) next = addDays(next, 1, inWarehouse);
    return next;
  };

  let shipDate = startOfDay(orderDate, inWarehouse);
  if (!isShippingDay(shipDate) || getHours(orderDate, inWarehouse) >= warehouse.cutoffHour) {
    shipDate = nextShippingDay(shipDate);
  }

  let deliveryDate = shipDate;
  for (let i = 0; i < transitDays; i++) deliveryDate = nextShippingDay(deliveryDate);

  const toISODate = (date) => format(date, 'yyyy-MM-dd', inWarehouse);
  const toLabel = (date) => format(date, 'EEE, MMM d', inWarehouse);

  return {
    shipsOn: toISODate(shipDate),
    arrivesBy: toISODate(deliveryDate),
    label: `Ships ${toLabel(shipDate)} · Arrives by ${toLabel(deliveryDate)}`,
  };
}
