import { Box, Typography } from '@mui/material';

import { useTheme } from './theme/ThemeContext';
import ThemeToggle from './ThemeToggle';

const ToolbarComponent = () => {
  const { theme, setTheme, colors } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        px: 3,
        py: 2,
        mb: 2,
      }}
    >
      {/* Title */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: 1.5,
            lineHeight: 1.1,
          }}
        >
          POWER TO HEAT
        </Typography>
        <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.3 }}>
          District heating powered by electricity
        </Typography>
      </Box>
      {/* Theme toggle */}
      <ThemeToggle theme={theme} onChange={setTheme} />
    </Box>
  );
};

export default ToolbarComponent;