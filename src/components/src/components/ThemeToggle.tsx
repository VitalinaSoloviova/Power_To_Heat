import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { WbSunnyRounded, NightlightRounded } from '@mui/icons-material';
import { useColors } from './theme/useTheme';
import type { ThemeMode } from './theme/colors';

export type { ThemeMode };

interface ThemeToggleProps {
  /** Currently active theme. */
  theme: ThemeMode;
  /** Called when the user picks a different theme. */
  onChange: (theme: ThemeMode) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onChange }) => {
  const colors = useColors();
  return (
    <ToggleButtonGroup
      value={theme}
      exclusive
      onChange={(_, value: ThemeMode | null) => value && onChange(value)}
      size="small"
      sx={{
        bgcolor: colors.bgSurface,
        borderRadius: 2,
        p: 0.5,
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRadius: '8px !important',
          color: colors.textSecondary,
          textTransform: 'none',
          fontSize: 12,
          fontWeight: 600,
          px: 1.8,
          py: 0.6,
          gap: 0.6,
          '&.Mui-selected': {
            bgcolor: colors.primarySoft,
            color: colors.primary,
            '&:hover': { bgcolor: colors.primarySoft },
          },
        },
      }}
    >
      <ToggleButton value="light">
        <WbSunnyRounded sx={{ fontSize: 16 }} />
        Light
      </ToggleButton>
      <ToggleButton value="dark">
        <NightlightRounded sx={{ fontSize: 16 }} />
        Dark
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ThemeToggle;
