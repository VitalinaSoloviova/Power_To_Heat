import { Typography } from '@mui/material';

import type { SimulationRange } from '@services/types';
import { tx } from '@theme/tokens';

interface SimulationTimestampProps {
  timestamp?: string;
  range: SimulationRange;
  formatTimestamp: (timestamp: string, range: SimulationRange) => string;
}

const SimulationTimestamp: React.FC<SimulationTimestampProps> = ({ timestamp, range, formatTimestamp }) => {
  return (
    <Typography
      sx={{
        fontVariantNumeric: 'tabular-nums',
        color: 'textSecondary',
        fontSize: tx.base,
        minWidth: { xs: 60, sm: 100 },
        textAlign: 'right',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        
      }}
    >
      {timestamp ? formatTimestamp(timestamp, range) : '—'}
    </Typography>
  );
};

export default SimulationTimestamp;
