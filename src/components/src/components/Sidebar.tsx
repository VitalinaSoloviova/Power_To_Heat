import { Box, Tooltip } from '@mui/material';
import {
  HomeRounded,
  BarChartRounded,
  PieChartRounded,
  SettingsRounded,
} from '@mui/icons-material';
import { useState } from 'react';
import { colors } from './theme/colors';
import { LogoComponent } from './LogoComponent';
import { HelpComponent } from './HelpCmponent';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: <HomeRounded /> },
  { id: 'simulation', label: 'Simulation', icon: <BarChartRounded /> },
  { id: 'analysis', label: 'Analysis', icon: <PieChartRounded /> },
  { id: 'settings', label: 'Settings', icon: <SettingsRounded /> },
];

const Sidebar = () => {
  const [active, setActive] = useState('overview');

  return (
    <Box
      sx={{
        width: 78,
        flexShrink: 0,
        bgcolor: colors.bgDeep,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1,
      }}
    >
      {/* Logo */}
      <LogoComponent/>
      {/* Nav */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <Tooltip key={item.id} title={item.label} placement="right" arrow>
              <Box
                onClick={() => setActive(item.id)}
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
      {/* Help */}
         <HelpComponent/>
    </Box>
  );
};

export default Sidebar;