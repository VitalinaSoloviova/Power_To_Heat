import { Box, Typography, Slider, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { useColors } from '@theme/useTheme';
import { tx } from '@theme/tokens';
import { InfoOutlineRounded } from '@mui/icons-material';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: { xs: 140, sm: 260 }, flex: 1 }}>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '1 1 20px' }}>
        <Typography sx={{ fontSize: tx.base, color: colors.textSecondary }}>
        Initial Storage Capacity
      </Typography>
        <Tooltip
          arrow
          placement="top"
          title="Storage Capacity to Start the Simulation."
        >
          <IconButton
            size="small"
            aria-label="The Storage Capacity to Start the Simulation with."
            sx={{ color: colors.textMuted, p: 0 }}
          >
            <InfoOutlineRounded sx={{ fontSize: tx.lg }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', minWidth: 0 }}>
        <Slider
          value={value}
          min={0}
          max={100}
          onChange={(_, v) => onChange(v as number)}
          sx={{ color: colors.heat, flex: '1 1 120px', minWidth: 100 }}
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
            width: { xs: 72, sm: 100 },
            input: { color: colors.textPrimary },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
          }}
        />
      </Box>
    </Box>
  );
};

export default StorageLevelControl;
