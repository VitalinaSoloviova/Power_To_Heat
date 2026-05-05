import { Box } from '@mui/material';
import StorageLevelControl from './StorageLevelControl';
import HistoryControl from './HistoryControl';
import type { HistoryYears } from '@services/UIService';

interface ControlsBarProps {
  storageLevel: number;
  onStorageLevelChange: (value: number) => void;
  historyYears: HistoryYears;
  onHistoryYearsChange: (value: HistoryYears) => void;
}

/** Bar with all the controls (storage level, duration, history years). */
const ControlsBar = ({
  storageLevel,
  onStorageLevelChange,
  historyYears,
  onHistoryYearsChange,
}: ControlsBarProps) => (
  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
    <StorageLevelControl value={storageLevel} onChange={onStorageLevelChange} />
    <HistoryControl value={historyYears} onChange={onHistoryYearsChange} />
  </Box>
);

export default ControlsBar;
