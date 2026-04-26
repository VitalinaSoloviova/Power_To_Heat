import { Box, Typography } from '@mui/material';
import { useColors } from '../theme/useTheme';

const FlowWidget = () => {
  const colors = useColors();

  return (
    <Box
      sx={{
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${colors.border}`,
        borderRadius: 2.5,
        p: 2.5,
        flex: 1.3,
        minWidth: 0,
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, mb: 2 }}>
        Energy Flow 
      </Typography>
    </Box>
  );
};

export default FlowWidget;
