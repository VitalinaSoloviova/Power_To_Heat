import { Box, Typography, LinearProgress } from '@mui/material';
import { useColors } from '../../../theme/useTheme';

interface ScoreRowProps {
  label: string;
  value: number;
  color: string;
}

const ScoreRow = ({ label, value, color }: ScoreRowProps) => {
  const colors = useColors();
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
        <Typography sx={{ fontSize: 11, color: colors.textSecondary }}>{label}</Typography>
        <Typography sx={{ fontSize: 11, color: colors.textPrimary, fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: colors.border,
          '& .MuiLinearProgress-bar': { bgcolor: color },
        }}
      />
    </Box>
  );
};

export default ScoreRow;
