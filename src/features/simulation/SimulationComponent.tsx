import { useEffect, useState } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import EnergyIsland from './EnergyIsland';
import CityIsland from './CityIsland';
import EnergyFlow from './EnergyFlow';
import SimulationSlider from './SimulationSlider';
import WeatherBackdrop from './WeatherBackdrop';
import { useSimulationData } from './hooks/useSimulationData';
import { useColors } from '@theme/useTheme';
import type { SimulationRange } from './simulationTypes';
import StorageIsland from './StorageIsland';

const SimulationComponent: React.FC = () => {
  const colors = useColors();
  const [range, setRange] = useState<SimulationRange>('day');
  const [index, setIndex] = useState(0);
  const { series, loading } = useSimulationData(range);

  // Reset / clamp the slider when the series length changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((i) => Math.min(i, Math.max(0, series.length - 1)));
  }, [series.length]);

  const point = series[index] ?? series[0];
  if (!point) {
    return (
      <Paper
        elevation={0}
        sx={{
          mx: 3,
          mb: 2,
          p: 4,
          borderRadius: 3,
          border: `1px solid ${colors.border}`,
          color: colors.textSecondary,
          fontSize: 13,
        }}
      >
        Loading simulation…
      </Paper>
    );
  }

  // Derive flow / charge state from the current frame.
  const generatedKw = point.energy.generated;
  const demandKw = point.demand.current;
  const storageFraction = point.storage.level / point.storage.capacity;
  const balance = generatedKw - demandKw;
  const isCharging = balance > 20;
  const isDischarging = balance < -20 && storageFraction > 0.02;

  const productionIntensity = Math.min(1, generatedKw / 800);
  const consumptionIntensity = Math.min(1, demandKw / 800);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mx: 3,
        mb: 2,
        borderRadius: 3,
        background: colors.bgBase,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minHeight: 600,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          pt: 2,
        }}
      >
        <Typography
          sx={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 1.2,
            py: 2,
            textTransform: 'uppercase',
          }}
        >
          Energy Flow Simulation
        </Typography>
        {loading && (
          <Typography sx={{ color: colors.textMuted, fontSize: 11 }}>
            Loading data…
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flex: 1, alignItems: 'stretch' }}>
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 3,
            overflow: 'hidden',
          }}
        >
          {/* Full-width sky / weather behind everything */}
          <WeatherBackdrop timestamp={point.timestamp} weather={point.weather} />

          {/* subtle dot grid on top of the sky */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              maskImage:
                'radial-gradient(ellipse at center, black 40%, transparent 85%)',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <EnergyIsland point={point} />
          </Box>

          <Box sx={{ flex: 1, position: 'relative', zIndex: 1, minWidth: 80 }}>
            <EnergyFlow
              intensity={productionIntensity}
              color="#16a34a"
            />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <StorageIsland
              point={point}
              isCharging={isCharging}
              isDischarging={isDischarging}
            />
          </Box>

          <Box sx={{ flex: 1, position: 'relative', zIndex: 1, minWidth: 80 }}>
            <EnergyFlow
              intensity={consumptionIntensity}
              color="#0ea5e9"
            />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <CityIsland point={point} />
          </Box>
        </Box>
      </Box>

      <SimulationSlider
        range={range}
        onRangeChange={(r) => {
          setRange(r);
          setIndex(0);
        }}
        index={index}
        onIndexChange={setIndex}
        series={series}
      />
    </Paper>
  );
};

export default SimulationComponent;
