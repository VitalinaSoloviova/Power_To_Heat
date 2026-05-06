import { Box } from '@mui/material';
import HistoryControl from './HistoryControl';
import type { HistoryYears } from '@services/UIService';

interface ControlsBarProps {
  historyYears: HistoryYears;
  onHistoryYearsChange: (value: HistoryYears) => void;
}

/** Bar with all the controls (storage level, history years). */
const ControlsBar = ({
  historyYears,
  onHistoryYearsChange,
}: ControlsBarProps) => (
  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
    <HistoryControl value={historyYears} onChange={onHistoryYearsChange} />
  </Box>
);

export default ControlsBar;
