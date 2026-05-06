import { Box } from '@mui/material';
import SimulationSlider from './SimulationSlider';
import StorageLevelControl from '@features/forecast/components/StorageLevelControl';
import { useColors } from '@theme/useTheme';
import type {
  PlaybackControl,
  StorageControl,
  TimelineControl,
} from './simulationTypes';

interface SimulationControlsProps {
  /** Storage-level slider state. */
  storage: StorageControl;
  /** Range / index / series state for the timeline slider. */
  timeline: TimelineControl;
  /** Play / pause + speed selection. */
  playback: PlaybackControl;
  /** Disabled while data is still loading. */
  loading: boolean;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  storage,
  timeline,
  playback,
  loading,
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
      />
    </>
  );
};

export default SimulationControls;
