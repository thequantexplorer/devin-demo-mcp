// Each warehouse ships Monday to Friday, in its own local time.
// `holidays` are local calendar dates (yyyy-MM-dd) when the warehouse is closed.
export const warehouses = {
  LAX: {
    id: 'LAX',
    name: 'Los Angeles',
    timeZone: 'America/Los_Angeles',
    cutoffHour: 14,
    holidays: ['2026-11-26', '2026-11-27', '2026-12-25'],
  },
  BER: {
    id: 'BER',
    name: 'Berlin',
    timeZone: 'Europe/Berlin',
    cutoffHour: 15,
    holidays: ['2026-12-24', '2026-12-25', '2026-12-26'],
  },
  SYD: {
    id: 'SYD',
    name: 'Sydney',
    timeZone: 'Australia/Sydney',
    cutoffHour: 12,
    holidays: ['2026-12-25', '2026-12-28'],
  },
};
