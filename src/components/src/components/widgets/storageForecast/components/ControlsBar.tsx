import { Box } from '@mui/material';
import StorageLevelControl from './StorageLevelControl';
import DurationControl from './DurationControl';
import HistoryControl from './HistoryControl';
import type { Duration, HistoryYears } from '../constants';

interface ControlsBarProps {
  storageLevel: number;
  onStorageLevelChange: (value: number) => void;
  duration: Duration;
  onDurationChange: (value: Duration) => void;
  historyYears: HistoryYears;
  onHistoryYearsChange: (value: HistoryYears) => void;
}

/** Bar with all the controls (storage level, duration, history years). */
const ControlsBar = ({
  storageLevel,
  onStorageLevelChange,
  duration,
  onDurationChange,
  historyYears,
  onHistoryYearsChange,
}: ControlsBarProps) => (
  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
    <StorageLevelControl value={storageLevel} onChange={onStorageLevelChange} />
    <DurationControl value={duration} onChange={onDurationChange} />
    <HistoryControl value={historyYears} onChange={onHistoryYearsChange} />
  </Box>
);

export default ControlsBar;
