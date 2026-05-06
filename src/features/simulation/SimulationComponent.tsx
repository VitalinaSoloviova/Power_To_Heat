import { useEffect, useState, useCallback } from 'react';
import { Paper } from '@mui/material';
import SimulationHeader from './SimulationHeader';
import SimulationScene from './SimulationScene';
import SimulationControls from './SimulationControls';
import { useSimulationData } from './hooks/useSimulationData';
import { useColors } from '@theme/useTheme';
import type { SimulationRange } from './simulationTypes';
import { DEFAULT_STORAGE_LEVEL } from '@services/UIService';

const SimulationComponent: React.FC = () => {
  const colors = useColors();
  const [range, setRange] = useState<SimulationRange>('day');
  const [index, setIndex] = useState(0);
  const [storageLevel, setStorageLevel] = useState<number>(DEFAULT_STORAGE_LEVEL);
  const [isPlaying, setIsPlaying] = useState(false);
  const { series, loading } = useSimulationData(range, storageLevel);

  // Reset / clamp the slider when the series length changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((i) => Math.min(i, Math.max(0, series.length - 1)));
  }, [series.length]);

  const handleStorageLevelChange = (value: number) => {
    setStorageLevel(value);
    setIndex(0);
    setIsPlaying(false); // Stop simulation when changing storage level
  };

  const toggleSimulation = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Auto-simulation: advance index every 4 seconds when playing
  useEffect(() => {
    if (!isPlaying || series.length === 0) return;

    const interval = setInterval(() => {
      setIndex(current => {
        const next = current + 1;
        if (next >= series.length) {
          setIsPlaying(false); // Stop at the end
          return current;
        }
        return next;
      });
    }, 4000); // 4 seconds per step

    return () => clearInterval(interval);
  }, [isPlaying, series.length]);

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

  const currentStoragePercent = (point.storage.level / point.storage.capacity) * 100;

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
        minHeight: 700,
        overflow: 'hidden',
      }}
    >
      <SimulationHeader 
        loading={loading}
        isPlaying={isPlaying}
        onTogglePlay={toggleSimulation}
        hasData={series.length > 0}
      />

      <SimulationScene point={point} />

      <SimulationControls 
        currentStoragePercent={currentStoragePercent}
        onStorageChange={handleStorageLevelChange}
        range={range}
        onRangeChange={(r) => {
          setRange(r);
          setIndex(0);
          setIsPlaying(false);
        }}
        index={index}
        onIndexChange={(i) => {
          setIndex(i);
          setIsPlaying(false);
        }}
        series={series}
      />
    </Paper>
  );
};

export default SimulationComponent;

