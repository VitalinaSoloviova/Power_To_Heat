import type { SimulationRange, SimulationPoint } from './simulation.types';
import type { HistoryYears } from '../ui/ChartUIService';

/** Play / pause + speed selection for the auto-simulation loop. */
export interface PlaybackControl {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speedMultiplier: number;
  onSpeedMultiplierChange: (multiplier: number) => void;
}

/** Time-range selection and current frame index of the simulation slider. */
export interface TimelineControl {
  range: SimulationRange;
  onRangeChange: (r: SimulationRange) => void;
  index: number;
  onIndexChange: (i: number) => void;
  series: SimulationPoint[];
}

/** Storage level slider (battery start-of-day percentage). */
export interface StorageControl {
  currentStoragePercent: number;
  onStorageChange: (val: number) => void;
}

/** Parameters needed to replay a saved SimulationRun from scratch. */
export interface ReplayParams {
  startDay: Date;
  range: SimulationRange;
  storageLevel: number;
  historyYears: HistoryYears;
}
