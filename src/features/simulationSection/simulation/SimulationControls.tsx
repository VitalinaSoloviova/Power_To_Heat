import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';

import type { PlaybackControl, StorageControl, TimelineControl } from '@services/types';
import DateSimulationControlComponent from './DateSimulationControlComponent';
import StorageLevelControl from '../StorageLevelControl';
import type { HistoryYears } from '@services/ui/ChartUIService';

interface SimulationControlsProps {
  storage: StorageControl;
  timeline: TimelineControl;
  playback: PlaybackControl;
  loading: boolean;
  startDay: Date;
  onStartDayChange: (d: Date) => void;
  historyYears: HistoryYears;
  setHistoryYears: (v: HistoryYears) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  storage,
  timeline,
  playback,
  startDay,
  onStartDayChange,
  historyYears,
  setHistoryYears,
}) => {
  const colors = useColors();

  return (
    <Box>
       <Typography
      sx={{
        px: 3,
        pt: 2,
        pb: 2,
        fontSize: 16,
        fontWeight: 600,
        color: colors.textPrimary,
        letterSpacing: 0.3,
      }}
    >
      Simulation Controls
    </Typography>
      <DateSimulationControlComponent
        timeline={timeline}
        playback={playback}
        startDay={startDay}
        onStartDayChange={onStartDayChange}
        historyYears={historyYears}
        setHistoryYears={setHistoryYears}
      />
      
       <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'flex-start',
          gap: 2,
          px: 3,
          py: 1.5,
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
          bgcolor: colors.bgCard,
          backdropFilter: colors.backdropBlur,
          WebkitBackdropFilter: colors.backdropBlur,
        }}
      >
        <StorageLevelControl
          value={storage.currentStoragePercent}
          onChange={storage.onStorageChange}
        />
      </Box>
    </Box>
  );
};

export default SimulationControls;
