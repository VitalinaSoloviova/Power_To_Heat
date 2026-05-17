/**
 * analyticsTypes.ts
 *
 * Shared data types and pure helper functions for the Analytics feature.
 *
 * A SimulationRun is a snapshot of one completed simulation: the input
 * parameters the user chose plus the full series of hourly/daily data points.
 * Runs are persisted in localStorage by useSimulationHistory.
 *
 * computeRunStats derives all display-ready numbers from a series — costs,
 * savings, purchase counts — without touching state or storage.
 */

import type { SimulationPoint, SimulationRange } from "@services/types";


// One completed simulation saved to history.
export interface SimulationRun {
  id: string;           // crypto.randomUUID() assigned at save time
  savedAt: string;      // ISO timestamp of when the run was saved
  params: {
    startDay: string;   // ISO date — first day of the simulated period
    range: SimulationRange;
    storageLevel: number;  // initial storage fill level in percent (0–100)
    historyYears: number;  // years of historical data requested (1/5/10/20/30/50)
    dataYears: {           // actual years found in the DB at save time
      weather: number;
      price: number;
    };
  };
  series: SimulationPoint[]; // full time-series produced by useSimulationData
}

// Derived statistics shown in RunCard and RunDetail.
export interface RunStats {
  totalCost: number;        // € — what our price-aware strategy actually spent
  alwaysCost: number;       // € — what direct demand-based buying would have cost
  savings: number;          // € — baseline cost − totalCost (positive = we saved money)
  cheapCount: number;       // number of purchase hours with price below the series median
  expensiveCount: number;   // number of purchase hours with price at or above the series median
  totalPurchases: number;   // total hours where any electricity was purchased
  cheapCost: number;        // € — share of cost from below-median hours
  expensiveCost: number;    // € — share of cost from above-median hours
  priceThreshold: number;   // €/MWh — dynamic median used to split cheap vs expensive
}

/**
 * Computes RunStats from a SimulationPoint series.
 *
 * Baseline: buy exactly the heat demand in the hour/day where it occurs,
 * without shifting cheap energy into storage. The demand per step is derived
 * from the storage balance:
 *   previous storage + purchased energy − current storage = demand served
 */
export function computeRunStats(series: SimulationPoint[]): RunStats {
  // Dynamic threshold: median price of all points in the series
  const sortedPrices = [...series.map((p) => p.energy.price)].sort((a, b) => a - b);
  const priceThreshold = sortedPrices[Math.floor(sortedPrices.length / 2)] ?? 60;

  const purchases   = series.filter((p) => p.energy.generated > 0);
  const cheap       = purchases.filter((p) => p.energy.price < priceThreshold);
  const expensive   = purchases.filter((p) => p.energy.price >= priceThreshold);

  // Cost formula: kWh × €/MWh ÷ 1 000 = €
  const costOf      = (p: SimulationPoint) => (p.energy.generated * p.energy.price) / 1_000;
  const totalCost   = purchases.reduce((s, p) => s + costOf(p), 0);
  const cheapCost   = cheap.reduce((s, p) => s + costOf(p), 0);
  const expensiveCost = expensive.reduce((s, p) => s + costOf(p), 0);

  const alwaysCost = series.reduce((sum, point, index) => {
    if (index === 0) return sum;

    const previous = series[index - 1];
    const demandServed =
      previous.storage.level + point.energy.generated - point.storage.level;
    const directPurchase = Math.max(0, demandServed);

    return sum + (directPurchase * point.energy.price) / 1_000;
  }, 0);

  return {
    totalCost,
    alwaysCost,
    savings: alwaysCost - totalCost,
    cheapCount: cheap.length,
    expensiveCount: expensive.length,
    totalPurchases: purchases.length,
    cheapCost,
    expensiveCost,
    priceThreshold,
  };
}
