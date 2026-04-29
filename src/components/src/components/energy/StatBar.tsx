import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number; // 0..1
  color: string;
}

/** Reusable label + animated progress bar. */
const StatBar: React.FC<StatBarProps> = ({ label, value, color }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: 11, color: '#374151', fontWeight: 700 }}>
        {Math.round(value * 100)}%
      </Typography>
    </Box>
    <Box sx={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <motion.div
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ height: '100%', background: color, borderRadius: 2 }}
      />
    </Box>
  </Box>
);

export default StatBar;
