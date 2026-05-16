import { Box } from '@mui/material';
import StorageLevelControl from '@features/forecast/components/StorageLevelControl';
import { useColors } from '@theme/useTheme';

import SimulationSlider from './SimulationSlider';
import type { PlaybackControl, StorageControl, TimelineControl } from '@services/types';
import DateSimulationControlComponent from './DateSimulationControlComponent';

interface SimulationControlsProps {
  storage: StorageControl;
  timeline: TimelineControl;
  playback: PlaybackControl;
  loading: boolean;
  startDay: Date;
  onStartDayChange: (d: Date) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  storage,
  timeline,
  playback,
  loading,
  startDay,
  onStartDayChange,
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
        <StorageLevelControl
          value={storage.currentStoragePercent}
          onChange={storage.onStorageChange}
        />
      </Box>
      <DateSimulationControlComponent
        timeline={timeline}
        playback={playback}
        startDay={startDay}
        onStartDayChange={onStartDayChange}
      />
      <SimulationSlider
        timeline={timeline}
        playback={playback}
        loading={loading}
        startDay={startDay}
        onStartDayChange={onStartDayChange}
      />
    </>
  );
};

export default SimulationControls;
