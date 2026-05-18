const fullInputCapacity_kwH: number = 2_000_000; // 2000 MWh input capacity
const maxCharge: number = 0.89; // it is never charged more than 89 %
const roundTripEfficiency = 0.9;
const outputCapacity_kWh: number = fullInputCapacity_kwH * roundTripEfficiency;

const halfCapacity_kWh: number = outputCapacity_kWh * 0.5;
const lowCapacity_kWh: number = outputCapacity_kWh * 0.4;
const nearCritical_kWh: number = outputCapacity_kWh * 0.3; // 30 %
const critical_kWh: number = outputCapacity_kWh * 0.25; // 25 %
const maxStorageLevel_kWh: number = outputCapacity_kWh * maxCharge;

export const CHARGE_AMOUNT_KWH = 20_000; // 20 MWh added to storage per hourly charge event
export const STORAGE_CAPACITY_KWH = outputCapacity_kWh; // 1800 MWh usable storage capacity

/* deciding weather to charge or not:

- we look at hourly data, UI gets a value (date:time) from the user
- we need the price data for that value
- we need to retrieve the hourly data of three months prior to this value to determine whether the current price is cheap
- we organise the retrieved 3 months' values in an array from smallest to biggest
- we trim out negative values
- we determine percentile 10 (P10) of the trimmed array == which prices are in the smallest 10 %
    (for array of 2000 items, that would be 2000 / 10 = 200
    => values smaller than array[200] are considerd cheap
    => always recharge)
- we determine percentile 25 (P25) of the trimmed array == which prices are in the smallest 25 %
    (for array of 2000 items, that would be 2000 / 4 = 500
    => values smaller than array[500] are considerd relatively cheap
    => recharge if capacity is 50 %
- we determine median of the trimmed array == which prices are in the smallest 50 %
    (for array of 2000 items, that would be 2000 / 2 = 1000
    => values smaller than array[1000] are considerd acceptable
    => recharge only if capacity 40 %
    => if current price > median, only recharge if capcaity is nearing critical limit i.e. 4000 kWh

    NOTE: if the function charge() returns true
    => the currentCapacity_KWh has to be increased by 2000 kWh before next round

*/

export function charge(
  currentCapacity_kWh: number,
  _date: string,
  currentPrice: number, // €/MWh
  historicalPrices: number[], // hourly price data from the DB for percentile calculation
): boolean {
  return calculateChargeAmount(currentCapacity_kWh, currentPrice, historicalPrices) > 0;
}

export function calculateChargeAmount(
  currentCapacity_kWh: number,
  currentPrice: number, // €/MWh
  historicalPrices: number[], // hourly price data from the DB for percentile calculation
): number {
  const freeCapacity_kWh = Math.max(0, maxStorageLevel_kWh - currentCapacity_kWh);

  if (freeCapacity_kWh === 0) {
    return 0;
  }

  if (currentPrice <= 0) {
    // if price is negative the storage will charge as much as possible
    return freeCapacity_kWh;
  }

  let prices: number[] = historicalPrices.slice();
  prices = prices.filter((price) => price >= 0); // filter out negative values
  prices.sort((a, b) => a - b); // sort

  if (prices.length === 0) {
    return currentCapacity_kWh <= critical_kWh
      ? Math.min(lowCapacity_kWh - currentCapacity_kWh, freeCapacity_kWh)
      : 0;
  }

  // determine indexes for percentiles
  const l: number = prices.length;
  const indexP10: number = Math.floor(l * 0.1);
  const indexP25: number = Math.floor(l * 0.25);
  const indexMedian: number = Math.floor(l * 0.5);

  // determine values from the prices array based on indexes
  const P10 = prices[indexP10];
  const P25 = prices[indexP25];
  const median = prices[indexMedian];

  // there are the cases when energy is purchased:

  if (currentCapacity_kWh <= critical_kWh) {
    // critical storage: charge up to the low-capacity threshold
    return Math.min(lowCapacity_kWh - currentCapacity_kWh, freeCapacity_kWh);
  }

  if (
    currentCapacity_kWh <= nearCritical_kWh && // 30 % charged
    currentPrice < median
  ) {
    return Math.min(CHARGE_AMOUNT_KWH * 1.5, freeCapacity_kWh);
  }

  if (currentCapacity_kWh <= lowCapacity_kWh && currentPrice <= P25) {£
    return Math.min(CHARGE_AMOUNT_KWH, freeCapacity_kWh);
  }

  if (currentCapacity_kWh <= halfCapacity_kWh && currentPrice <= P10) {
    return Math.min(CHARGE_AMOUNT_KWH * 0.5, freeCapacity_kWh);
  }

  return 0; // if none of the above conditions are met, no charge
}

const households: number = 4900;
const heat_loss_coefficient: number = 0.11225; // kW/K per household, approx. 11 MWh/h at 0 °C
const tempIn: number = 20; // target inside temp

export function updateStorage(
  currentCapacity_kWh: number,
  tempOut: number,
  dt: number, // hours **
): number {
  const updatedCapacity_kWh =
    currentCapacity_kWh - households * heat_loss_coefficient * (tempIn - tempOut) * dt;
  return updatedCapacity_kWh;
}

// ** for hourly capacity update dt = 1,  for daily average energy demand: tempOut = averageTemp, dt = 24
// if the 24h / daily functionality is not deeded dt can be omitted from params and function
