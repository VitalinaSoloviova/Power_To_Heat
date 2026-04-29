/**
 * Storage Forecast Utils - complete interfaces and calculation functions
 */

// =====================================================================
// Core Data Interfaces
// =====================================================================

export interface WeatherDataPoint {
  month: string;
  year?: number;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  forecastTemp?: number;
}

export interface WeatherRangeForMonth {
  month: string;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
}

export interface ScoreBreakdown {
  price: number;
  demand: number;
  weather: number;
  storage: number;
  total: number;
}

export type BuyDecision = 'buy' | 'wait' | 'do-not-buy';

export interface BuyRecommendationInput {
  forecastMonths: Date[];
  currentLevelPct: number;
  yearsBack: number;
}

export interface BuyRecommendationResult {
  decision: BuyDecision;
  score: number;
  breakdown: ScoreBreakdown;
  explanation: string;
  currentPrice: number;
  historicalAvgPrice: number;
  forecastAvgPrice: number;
  forecastAvgDemand: number;
  forecastAvgTemperature: number;
  forecastPrices: number[];
  forecastDemand: number[];
  forecastTemperature: number[];
  historicalPrices: number[];
  historicalDemand: number[];
  historicalTemperature: number[];
  weatherHistory: WeatherRangeForMonth[];
}

// =====================================================================
// Mock Data Generation Functions
// =====================================================================

/** Get forecast months starting next month */
export function getForecastMonths(durationMonths: number, now: Date = new Date()): Date[] {
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Array.from({ length: durationMonths }, (_, i) =>
    new Date(start.getFullYear(), start.getMonth() + i, 1)
  );
}

/** Format month as short label */
export function formatMonth(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/** Simple deterministic random for consistent mock data */
function seeded(year: number, month: number, salt: number = 0): number {
  const x = Math.sin(year * 1000 + month * 37 + salt * 7.3) * 10000;
  return x - Math.floor(x);
}

/** Mock price data with seasonal variation */
function mockPrice(year: number, month: number): number {
  const seasonal = 70 + 30 * Math.sin(((month - 9) / 12) * 2 * Math.PI);
  const noise = (seeded(year, month, 1) - 0.5) * 25;
  return Math.max(15, Math.round(seasonal + noise));
}

/** Mock demand data with seasonal variation */
function mockDemand(year: number, month: number): number {
  const seasonal = 600 + 350 * Math.sin(((month - 9) / 12) * 2 * Math.PI);
  const noise = (seeded(year, month, 2) - 0.5) * 120;
  return Math.max(80, Math.round(seasonal + noise));
}

/** Mock temperature data with seasonal variation */
function mockTemperature(year: number, month: number): number {
  const seasonal = 11 + 11 * Math.sin(((month - 3) / 12) * 2 * Math.PI);
  const noise = (seeded(year, month, 3) - 0.5) * 4;
  return Math.round((seasonal + noise) * 10) / 10;
}

/** Mock historical weather record */
function mockWeatherRecord(year: number, month: number): WeatherDataPoint {
  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'short' });
  const seasonalAvg = 11 + 11 * Math.sin(((month - 3) / 12) * 2 * Math.PI);
  
  const avgNoise = (seeded(year, month, 3) - 0.5) * 4;
  const minNoise = (seeded(year, month, 4) - 0.5) * 3;
  const maxNoise = (seeded(year, month, 5) - 0.5) * 3;

  const avgTemp = Math.round((seasonalAvg + avgNoise) * 10) / 10;
  const minTemp = Math.round((seasonalAvg - 6 + minNoise) * 10) / 10;
  const maxTemp = Math.round((seasonalAvg + 7 + maxNoise) * 10) / 10;

  return { month: monthLabel, year, avgTemp, minTemp, maxTemp };
}

/** Get weather history for forecast months */
export function getWeatherHistoryForRange(
  forecastMonths: Date[],
  yearsBack: number
): WeatherRangeForMonth[] {
  const baseYear = forecastMonths[0].getFullYear();
  return forecastMonths.map((m) => {
    const monthLabel = m.toLocaleDateString('en-GB', { month: 'short' });
    const records: WeatherDataPoint[] = [];
    for (let i = 1; i <= yearsBack; i++) {
      records.push(mockWeatherRecord(baseYear - i, m.getMonth()));
    }
    const minTemp = Math.min(...records.map((r) => r.minTemp));
    const maxTemp = Math.max(...records.map((r) => r.maxTemp));
    const avgTemp = records.reduce((acc, r) => acc + r.avgTemp, 0) / Math.max(1, records.length);
    return {
      month: monthLabel,
      minTemp: Math.round(minTemp * 10) / 10,
      maxTemp: Math.round(maxTemp * 10) / 10,
      avgTemp: Math.round(avgTemp * 10) / 10,
    };
  });
}

/** Average historical value across years */
function avgHistorical(
  forecastMonths: Date[],
  yearsBack: number,
  fn: (year: number, month: number) => number
): number {
  const baseYear = forecastMonths[0].getFullYear();
  let sum = 0;
  let count = 0;
  for (let i = 1; i <= yearsBack; i++) {
    forecastMonths.forEach((m) => {
      sum += fn(baseYear - i, m.getMonth());
      count++;
    });
  }
  return sum / Math.max(1, count);
}

/** Per-month historical average */
function avgHistoricalPerMonth(
  forecastMonths: Date[],
  yearsBack: number,
  fn: (year: number, month: number) => number
): number[] {
  const baseYear = forecastMonths[0].getFullYear();
  return forecastMonths.map((m) => {
    let sum = 0;
    for (let i = 1; i <= yearsBack; i++) {
      sum += fn(baseYear - i, m.getMonth());
    }
    return sum / Math.max(1, yearsBack);
  });
}

/** Main buy recommendation calculation */
export function calculateBuyRecommendation(input: BuyRecommendationInput): BuyRecommendationResult {
  const { forecastMonths, currentLevelPct, yearsBack } = input;
  const now = new Date();

  // Generate all mock data
  const currentPrice = mockPrice(now.getFullYear(), now.getMonth());
  const forecastPrices = forecastMonths.map((m) => mockPrice(m.getFullYear(), m.getMonth()));
  const forecastDemand = forecastMonths.map((m) => mockDemand(m.getFullYear(), m.getMonth()));
  const forecastTemperature = forecastMonths.map((m) => mockTemperature(m.getFullYear(), m.getMonth()));
  
  const historicalPrices = avgHistoricalPerMonth(forecastMonths, yearsBack, mockPrice);
  const historicalDemand = avgHistoricalPerMonth(forecastMonths, yearsBack, mockDemand);
  const historicalTemperature = avgHistoricalPerMonth(forecastMonths, yearsBack, mockTemperature);
  const weatherHistory = getWeatherHistoryForRange(forecastMonths, yearsBack);

  // Calculate averages
  const historicalAvgPrice = Math.round(avgHistorical(forecastMonths, yearsBack, mockPrice));
  const forecastAvgPrice = forecastPrices.reduce((a, b) => a + b, 0) / forecastPrices.length;
  const forecastAvgDemand = forecastDemand.reduce((a, b) => a + b, 0) / forecastDemand.length;
  const forecastAvgTemperature = forecastTemperature.reduce((a, b) => a + b, 0) / forecastTemperature.length;

  // Calculate scores (0-100, higher = more reason to buy)
  const referencePrice = (historicalAvgPrice + forecastAvgPrice) / 2;
  const priceScore = Math.round(Math.max(0, Math.min(100, ((referencePrice * 1.4 - currentPrice) / (referencePrice * 0.8)) * 100)));
  const demandScore = Math.round(Math.max(0, Math.min(100, ((forecastAvgDemand - 200) / (1000 - 200)) * 100)));
  const weatherScore = Math.round(Math.max(0, Math.min(100, ((20 - forecastAvgTemperature) / 25) * 100)));
  const storageScore = Math.round(Math.max(0, Math.min(100, (100 - currentLevelPct))));

  const total = Math.round(priceScore * 0.45 + demandScore * 0.35 + weatherScore * 0.15 + storageScore * 0.05);

  const breakdown: ScoreBreakdown = {
    price: priceScore,
    demand: demandScore,
    weather: weatherScore,
    storage: storageScore,
    total,
  };

  // Determine decision
  const decision: BuyDecision = total >= 70 ? 'buy' : total >= 45 ? 'wait' : 'do-not-buy';

  // Generate explanation
  const parts: string[] = [];
  if (priceScore >= 65) parts.push('current electricity price is low');
  else if (priceScore <= 30) parts.push('current electricity price is high');
  if (demandScore >= 65) parts.push('expected heat demand is high');
  if (weatherScore >= 65) parts.push('upcoming temperatures are cold');
  if (storageScore >= 65) parts.push(`storage is low (${currentLevelPct}%)`);

  const explanation = parts.length > 0
    ? capitalize(parts.join(', ')) + '.'
    : 'All indicators are close to historical averages — no strong signal.';

  return {
    decision,
    score: total,
    breakdown,
    explanation,
    currentPrice,
    historicalAvgPrice,
    forecastAvgPrice: Math.round(forecastAvgPrice),
    forecastAvgDemand: Math.round(forecastAvgDemand),
    forecastAvgTemperature: Math.round(forecastAvgTemperature * 10) / 10,
    forecastPrices,
    forecastDemand,
    forecastTemperature,
    historicalPrices: historicalPrices.map((v) => Math.round(v)),
    historicalDemand: historicalDemand.map((v) => Math.round(v)),
    historicalTemperature: historicalTemperature.map((v) => Math.round(v * 10) / 10),
    weatherHistory,
  };
}

export function buyDecisionLabel(decision: BuyDecision): string {
  switch (decision) {
    case 'buy':
      return 'Buy now';
    case 'wait':
      return 'Wait';
    case 'do-not-buy':
      return 'Do not buy';
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}