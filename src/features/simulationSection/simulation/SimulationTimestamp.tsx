import { Typography } from '@mui/material';

import type { SimulationRange } from '@services/types';

interface SimulationTimestampProps {
  timestamp?: string;
  range: SimulationRange;
  formatTimestamp: (ts: string, range: SimulationRange) => string;
}

const SimulationTimestamp: React.FC<SimulationTimestampProps> = ({ timestamp, range, formatTimestamp }) => {
  return (
    <Typography
      sx={{
        fontVariantNumeric: 'tabular-nums',
        color: 'text.primary',
        fontSize: 12,
        minWidth: 100,
        textAlign: 'right',
      }}
    >
      {timestamp ? formatTimestamp(timestamp, range) : '—'}
    </Typography>
  );
};

export default SimulationTimestamp;
