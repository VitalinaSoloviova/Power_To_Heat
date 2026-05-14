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

import type { SimulationPoint, SimulationRange } from '@features/simulationSection/simulationTypes';

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
  totalCost: number;       // € — what our price-aware strategy actually spent
  alwaysCost: number;      // € — what always running at full power would have cost
  savings: number;         // € — alwaysCost − totalCost (positive = we saved money)
  cheapCount: number;      // number of hours where price < 60 €/MWh (P2H ran at max)
  expensiveCount: number;  // number of hours where price ≥ 60 €/MWh (P2H reduced/off)
  totalPurchases: number;  // total hours where any electricity was purchased
  cheapCost: number;       // € — share of cost from cheap hours
  expensiveCost: number;   // € — share of cost from expensive hours
}

/**
 * Computes RunStats from a SimulationPoint series.
 *
 * Price thresholds mirror EnergyStorageResolver:
 *   < 60 €/MWh  → cheap:     P2H runs at max (3 000 kW), storage is charged
 *   60–100 €/MWh → medium:   P2H covers demand only, no net storage change
 *   > 100 €/MWh → expensive: P2H off, storage discharges to cover demand
 *
 * Always-On baseline: P2H runs at max power (3 000 kW) every single hour
 * regardless of price.  Cost = 3 kW·h × price per step.  The difference
 * between this and totalCost is how much the smart strategy saved.
 */
export function computeRunStats(series: SimulationPoint[]): RunStats {
  const P2H_MAX_KW = 3_000; // must match EnergyStorageResolver.MAX_P2H_KW
  const CHEAP_THRESHOLD = 60; // €/MWh — same threshold used during simulation

  const purchases   = series.filter((p) => p.energy.generated > 0);
  const cheap       = purchases.filter((p) => p.energy.price < CHEAP_THRESHOLD);
  const expensive   = purchases.filter((p) => p.energy.price >= CHEAP_THRESHOLD);

  // Cost formula: kW × €/MWh ÷ 1 000 = € per hour
  const costOf      = (p: SimulationPoint) => (p.energy.generated * p.energy.price) / 1_000;
  const totalCost   = purchases.reduce((s, p) => s + costOf(p), 0);
  const cheapCost   = cheap.reduce((s, p) => s + costOf(p), 0);
  const expensiveCost = expensive.reduce((s, p) => s + costOf(p), 0);

  // Always-On: buy P2H_MAX_KW every hour at whatever the market price is
  const alwaysCost  = series.reduce((s, p) => s + (P2H_MAX_KW * p.energy.price) / 1_000, 0);

  return {
    totalCost,
    alwaysCost,
    savings: alwaysCost - totalCost,
    cheapCount: cheap.length,
    expensiveCount: expensive.length,
    totalPurchases: purchases.length,
    cheapCost,
    expensiveCost,
  };
}
