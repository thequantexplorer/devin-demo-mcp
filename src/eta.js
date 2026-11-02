// Delivery promise shown on the checkout page: "Ships Mon, Nov 2 · Arrives by Wed, Nov 4".

export function estimateDelivery(orderedAt, warehouse, transitDays) {
  if (!Number.isInteger(transitDays) || transitDays < 0) {
    throw new RangeError('transitDays must be a whole number >= 0');
  }

  const shipDate = new Date(orderedAt);
  if (Number.isNaN(shipDate.getTime())) {
    throw new RangeError(`invalid orderedAt: ${orderedAt}`);
  }

  // Orders placed after the cutoff ship the next day.
  if (shipDate.getUTCHours() >= warehouse.cutoffHour) {
    shipDate.setUTCDate(shipDate.getUTCDate() + 1);
  }

  const deliveryDate = new Date(shipDate);
  deliveryDate.setUTCDate(deliveryDate.getUTCDate() + transitDays);

  return {
    shipsOn: toISODate(shipDate),
    arrivesBy: toISODate(deliveryDate),
    label: `Ships ${toLabel(shipDate)} · Arrives by ${toLabel(deliveryDate)}`,
  };
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function toLabel(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
}
