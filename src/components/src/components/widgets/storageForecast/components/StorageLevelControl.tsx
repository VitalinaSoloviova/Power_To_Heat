import { Box, Typography, Slider, TextField, InputAdornment } from '@mui/material';
import { useColors } from '../../../theme/useTheme';

interface StorageLevelControlProps {
  value: number;
  onChange: (value: number) => void;
}

const StorageLevelControl = ({ value, onChange }: StorageLevelControlProps) => {
  const colors = useColors();

  const handleNumber = (raw: string) => {
    const v = Number(raw);
    if (!Number.isNaN(v)) onChange(Math.max(0, Math.min(100, v)));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 260, flex: 1 }}>
      <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
        Current storage level (input)
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Slider
          value={value}
          min={0}
          max={100}
          onChange={(_, v) => onChange(v as number)}
          sx={{ color: colors.heat, flex: 1 }}
        />
        <TextField
          size="small"
          type="number"
          value={value}
          onChange={(e) => handleNumber(e.target.value)}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            },
          }}
          sx={{
            width: 100,
            input: { color: colors.textPrimary },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
          }}
        />
      </Box>
    </Box>
  );
};

export default StorageLevelControl;
