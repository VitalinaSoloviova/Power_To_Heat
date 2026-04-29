import { Box } from '@mui/material';
import MetricsCard from './MetricsCard';
import { useColors } from './theme/useTheme';

/**
 * Generates a smooth, slightly noisy time series for sparkline previews.
 *
 * @param pointCount    Number of data points to generate.
 * @param baseValue     Center value the series oscillates around.
 * @param amplitude     Peak deviation from the base value (sine wave height).
 * @returns             Array of `pointCount` values: a sine wave around
 *                      `baseValue` with small random jitter for a natural look.
 */
const generateSparklineSeries = (
  pointCount: number,
  baseValue: number,
  amplitude: number,
): number[] => {
  const WAVE_FREQUENCY = 1.6;   // smaller -> faster oscillation
  const NOISE_RATIO = 0.4;      // jitter relative to amplitude

  return Array.from({ length: pointCount }, (_, index) => {
    const wave = Math.sin(index / WAVE_FREQUENCY) * amplitude;
    const noise = (Math.random() - 0.5) * amplitude * NOISE_RATIO;
    return baseValue + wave + noise;
  });
};

const StatsRow = () => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', gap: 2, px: 3, mb: 2 }}>
      <MetricsCard
        label="Current Price"
        value="4,32"
        unit="EUR/MWhe"
        spark={generateSparklineSeries(28, 4.3, 0.8)}  
        sparkColor={colors.energy}
      />
      <MetricsCard
        label="Estimated Price" 
        value="14,6"
        unit="EUR/MWhe"
        spark={generateSparklineSeries(28, 14.6, 1.4)}
        sparkColor={colors.cool}
      />
      <MetricsCard
        label="Estimated Heat Demand"
        value="28,4"
        unit="MW"
        badge={{ text: 'high', color: 'danger' }}
        spark={generateSparklineSeries(28, 28, 4)}
        sparkColor={colors.danger}
      />
      <MetricsCard 
        label="Storage Level"
        value="72"
        unit="%"
        trend="1.440 / 2.000 MWh"
        badge={{ text: 'stable', color: 'info'  }}
      />
    </Box>
  );
};

export default StatsRow;
