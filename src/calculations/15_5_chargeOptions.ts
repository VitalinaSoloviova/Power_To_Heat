const fullInputCapacity_kwH: number = 20000;
const maxCharge: number = 0.89; // it is never charged more then 99 %
const roundTripEfficiency = 0.9;
const outputCapacity_kWh: number = fullInputCapacity_kwH * roundTripEfficiency;

const halfCapacity_kWh: number = outputCapacity_kWh * 0.5;
const lowCapacity_kWh: number = outputCapacity_kWh * 0.4;
const nearCritical_kWh: number = outputCapacity_kWh * 0.3; // 30 %
const critical_kWh: number = outputCapacity_kWh * 0.25; // 25 %

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
  date: string,
  currentPrice: number, // €/MWh
): boolean {
  // 89 % full, no charge // the number is low because one charge 2000 kWh == 10 % of the storage
  if (currentCapacity_kWh > fullInputCapacity_kwH * maxCharge) {
    return false;
  }

  if (currentPrice <= 0) {
    // if price is negative the storage will always charge
    return true;
  }

  let prices: number[] = [
    // an array with hourly price data from three months prior to the chosen date from teh DB
    -1, -1, 0, 1, 2, 3, 5, 6, 8, 9, 11, 15, 33, 55,
  ];

  prices = prices.filter((price) => price < 0); // filter out negative values
  prices.sort((a, b) => a - b); // sort

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
    // 25 % charged
    return true;
  }

  if (
    currentCapacity_kWh <= nearCritical_kWh && // 30 % charged
    currentPrice < median
  ) {
    return true;
  }

  if (currentCapacity_kWh <= lowCapacity_kWh && currentPrice <= P25) {
    return true;
  }

  if (currentCapacity_kWh <= halfCapacity_kWh && currentPrice <= P10) {
    return true;
  }

  return false; // if none of the above conditions are met, no charge
}
