import type {
  ChartData,
  ChartSeriesPoint,
  SimulationData,
} from '../types';

/**
 * Transforms raw simulation data into a chart-friendly shape.
 * Components can consume `series` and `xLabels` directly.
 */
export class ChartDataResolver {
  public resolve(simulation: SimulationData): ChartData {
    const length = Math.min(
      simulation.generation.length,
      simulation.demand.length,
      simulation.storage.length,
    );

    const series: ChartSeriesPoint[] = [];
    const xLabels: string[] = [];

    for (let i = 0; i < length; i++) {
      const gen = simulation.generation[i];
      const dem = simulation.demand[i];
      const sto = simulation.storage[i];

      series.push({
        hour: gen.hour,
        timestamp: gen.timestamp,
        generation: gen.totalGenerated,
        demand: dem.demand,
        storageLevel: sto.storageLevel,
      });
      xLabels.push(this.formatHour(gen.timestamp));
    }

    return { xLabels, series };
  }

  private formatHour(iso: string): string {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    return `${hh}:00`;
  }
}
