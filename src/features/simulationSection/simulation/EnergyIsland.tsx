
import type { SimulationPoint } from '@services/types/SimulationTypes';
import { sunElevation, phaseForTimestamp, NIGHT_PHASES } from '../simulationUtils';
import GroundPatch from './GroundPatch';
import IslandFrame from './IslandFrame';
import SolarPanel from './SolarPanel';
import Tree from './Tree';
import WindTurbine from './WindTurbine';

interface EnergyIslandProps {
  point: SimulationPoint;
  size?: number;
}

const ACCENT = '#86efac';

/**
 * Power island — three wind turbines on a grass patch with solar panels in
 * front. Turbine spin is driven by wind; panel sheen pulses with the sun.
 */
const EnergyIsland: React.FC<EnergyIslandProps> = ({ point, size = 220 }) => {
  const wind = point.weather.windSpeed ?? 0;
  const cloud = Math.min(1, Math.max(0, point.weather.cloudCoverage ?? 0));
  const elevation = sunElevation(point.timestamp);
  const phase = phaseForTimestamp(point.timestamp);
  const isNight = NIGHT_PHASES.has(phase);

  const spinDuration = Math.max(0.6, 5 - wind * 0.3);
  const activity = Math.min(1, point.energy.generated / 800);
  const sunPower = (1 - cloud * 0.6) * (isNight ? 0.1 : 0.55 + elevation * 0.45);

  return (
    <IslandFrame
      label="Power"
      accent={ACCENT}
      activity={activity}
      size={size}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="pwBladeG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <radialGradient id="pwHubG" cx="40%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <linearGradient id="pwGrassG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="pwTreeG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          <linearGradient id="pwPanelG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="pwPanelFrameG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        <GroundPatch gradientId="pwGrassG" />

        {/* background trees */}
        <Tree x={28} y={148} size={12} gradientId="pwTreeG" />
        <Tree x={172} y={150} size={10} gradientId="pwTreeG" />
        <Tree x={18} y={154} size={6} gradientId="pwTreeG" />

        {/* Wind turbines */}
        <WindTurbine x={60} y={110} scale={0.9} direction={1} delay={0} spinDuration={spinDuration} />
        <WindTurbine x={100} y={88} scale={1.1} direction={1} delay={0.2} spinDuration={spinDuration} />
        <WindTurbine x={140} y={110} scale={0.85} direction={1} delay={0.4} spinDuration={spinDuration} />

        {/* Solar panels */}
        <SolarPanel x={60} y={160} sunPower={sunPower} />
        <SolarPanel x={105} y={160} sunPower={sunPower} />
      </svg>
    </IslandFrame>
  );
};

export default EnergyIsland;
