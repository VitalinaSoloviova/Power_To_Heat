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
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStoragePercent,
  onStorageChange,
  range,
  onRangeChange,
  index,
  onIndexChange,
  series
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
      />
    </>
  );
};

export default SimulationControls;
