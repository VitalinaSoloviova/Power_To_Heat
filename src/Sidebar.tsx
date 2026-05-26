import { Box, Tooltip } from '@mui/material';
import {
  LocalFireDepartmentRounded,
  PieChartRounded,
  SettingsRounded,
} from '@mui/icons-material';

import { useColors } from '@theme/useTheme';
import { HelpComponent } from './HelpComponent';

interface NavItem {
  id: string;
  label?: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <LocalFireDepartmentRounded sx={{width: 34, height: 34}} /> },
  { id: 'analysis', label: 'Analysis', icon: <PieChartRounded sx={{width: 24, height: 24}} /> },
  { id: 'settings', label: 'Settings', icon: <SettingsRounded sx={{width: 24, height: 24}} /> },
];

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const colors = useColors();

  return (
    <Box
      sx={{
        width: 78,
        flexShrink: 0,
        bgcolor: colors.bgCard,
        backdropFilter: colors.backdropBlur,
        WebkitBackdropFilter: colors.backdropBlur,
        borderRight: `1px solid ${colors.border}`,
        boxShadow: `4px 0 24px rgba(0,0,0,0.12)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1,
      }}
    >

      {/* Nav */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <Tooltip key={item.id} title={item.label} placement="right" arrow>
              <Box
                onClick={() => onPageChange(item.id)}
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.3,
                  cursor: 'pointer',
                  color: isActive ? colors.primary : colors.textSecondary,
                  bgcolor: isActive ? colors.primarySoft : 'transparent',
                  transition: 'all .2s',
                  '&:hover': { bgcolor: colors.bgSurface, color: colors.textPrimary },
                  '& svg': { fontSize: 22 },
                }}
              >
                {item.icon}
                <Box sx={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.2 }}>{item.label}</Box>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      {/* Help at the bottom */}
      <Box sx={{ mb: 1 }}>
        <Tooltip title="Help" placement="right" arrow>
          <Box
            onClick={() => onPageChange('help')}
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.3,
              cursor: 'pointer',
              color: activePage === 'help' ? colors.primary : colors.textSecondary,
              bgcolor: activePage === 'help' ? colors.primarySoft : 'transparent',
              transition: 'all .2s',
              '&:hover': { bgcolor: colors.bgSurface, color: colors.textPrimary },
              '& svg': { fontSize: 22 },
            }}
          >
            <HelpComponent />
            <Box sx={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.2 }}>Help</Box>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;