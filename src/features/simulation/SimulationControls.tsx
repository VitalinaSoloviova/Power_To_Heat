import { Box } from '@mui/material';
import SimulationSlider from './SimulationSlider';
import StorageLevelControl from '@features/forecast/components/StorageLevelControl';
import { useColors } from '@theme/useTheme';
import type { SimulationRange, SimulationPoint } from './simulationTypes';

interface SimulationControlsProps {
  currentStoragePercent: number;
  onStorageChange: (val: number) => void;
  range: SimulationRange;
  onRangeChange: (r: SimulationRange) => void;
  index: number;
  onIndexChange: (i: number) => void;
  series: SimulationPoint[];
  loading: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speedMultiplier: number;
  onSpeedMultiplierChange: (multiplier: number) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStoragePercent,
  onStorageChange,
  range,
  onRangeChange,
  index,
  onIndexChange,
  series,
  loading,
  isPlaying,
  onTogglePlay,
  speedMultiplier,
  onSpeedMultiplierChange,
}) => {
  const colors = useColors();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'center',
          gap: 2,
          px: 3,
          py: 1.5,
          borderTop: `1px solid ${colors.border}`,
          bgcolor: colors.bgCard,
        }}
      >
        <StorageLevelControl value={currentStoragePercent} onChange={onStorageChange} />
      </Box>
      <SimulationSlider
        range={range}
        onRangeChange={onRangeChange}
        index={index}
        onIndexChange={onIndexChange}
        series={series}
        loading={loading}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        speedMultiplier={speedMultiplier}
        onSpeedMultiplierChange={onSpeedMultiplierChange}
      />
    </>
  );
};

export default SimulationControls;
