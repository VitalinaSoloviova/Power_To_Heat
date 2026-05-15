import { Box } from '@mui/material';
import StorageLevelControl from '@features/forecast/components/StorageLevelControl';
import { useColors } from '@theme/useTheme';

import SimulationSlider from './SimulationSlider';
import type { PlaybackControl, StorageControl, TimelineControl } from '@services/types';

interface SimulationControlsProps {
  /** Storage-level slider state. */
  storage: StorageControl;
  /** Range / index / series state for the timeline slider. */
  timeline: TimelineControl;
  /** Play / pause + speed selection. */
  playback: PlaybackControl;
  /** Disabled while data is still loading. */
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
