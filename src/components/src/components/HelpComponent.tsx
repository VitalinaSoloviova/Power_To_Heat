import { HelpOutlineRounded } from '@mui/icons-material';
import { Tooltip, Box } from '@mui/material';
import { useColors } from './theme/useTheme';

export const HelpComponent = () => {
  const colors = useColors();

  return (
    <Tooltip title="Help" placement="right" arrow>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.textSecondary,
          cursor: 'pointer',
          '&:hover': { bgcolor: colors.bgSurface, color: colors.textPrimary },
        }}
      >
        <HelpOutlineRounded />
        <Box sx={{ fontSize: 9.5, fontWeight: 600, mt: 0.3 }}>Help</Box>
      </Box>
    </Tooltip>
  );
};
