import { Box, Typography } from '@mui/material';
import type { SimulationPoint } from '@services/types';
import { useColors } from '@theme/useTheme';

interface InfoToolbarProps {
  point: SimulationPoint;
}

const InfoToolbar: React.FC<InfoToolbarProps> = ({ point }) => {
  const colors = useColors();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: 1.5,
        columnGap: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 1.5, sm: 3 },
        py: 1.5,
        borderRadius: 2,
        background: `rgba(48, 61, 91, 0.85)`,
        border: `1px solid rgba(255,255,255,0.1)`,
        backdropFilter: 'blur(12px)',
        boxShadow: `
          0 4px 12px rgba(0,0,0,0.25),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        width: '100%',
        maxWidth: 750,
        minWidth: 0,
      }}
    >

      {/* Storage */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}>
        <Typography sx={{ 
          fontSize: 9, 
          fontWeight: 600, 
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 0.5
        }}>
        Storage capacity
        </Typography>
        <Typography sx={{ 
          fontSize: 14, 
          fontWeight: 800, 
          color: colors.textPrimary,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {Math.round(point.storage.level)} kWh
        </Typography>
        <Typography sx={{ 
          fontSize: 8, 
          color: colors.textMuted,
          mt: 0.5
        }}>
        </Typography>
      </Box>

      {/* City Demand */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}>
        <Typography sx={{ 
          fontSize: 9, 
          fontWeight: 600, 
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 0.5
        }}>
          Demand
        </Typography>
        <Typography sx={{ 
          fontSize: 14, 
          fontWeight: 800, 
          color: colors.textPrimary,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {Math.round(point.demand.current)} kW
        </Typography>
      </Box>

      {/* Weather Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}>
        <Typography sx={{ 
          fontSize: 9, 
          fontWeight: 600, 
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 0.5
        }}>
          Temperature
        </Typography>
        <Typography sx={{ 
          fontSize: 14, 
          fontWeight: 800, 
          color: colors.textPrimary
        }}>
          {point.weather.temperature.toFixed(1)}°C
        </Typography>
      </Box>

      {/* Wind Speed */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}>
        <Typography sx={{ 
          fontSize: 9, 
          fontWeight: 600, 
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 0.5
        }}>
          Wind Speed
        </Typography>
        <Typography sx={{ 
          fontSize: 14, 
          fontWeight: 800, 
          color: colors.textPrimary,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {point.weather.windSpeed?.toFixed(1) ?? 0} m/s
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoToolbar;