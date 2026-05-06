import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type { SimulationPoint } from './simulationTypes';

interface InfoToolbarProps {
  point: SimulationPoint;
}

const InfoToolbar: React.FC<InfoToolbarProps> = ({ point }) => {
  const colors = useColors();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        background: `rgba(48, 61, 91, 0.85)`,
        border: `1px solid rgba(255,255,255,0.1)`,
        backdropFilter: 'blur(12px)',
        boxShadow: `
          0 4px 12px rgba(0,0,0,0.25),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `,
        width: '700px',
      }}
    >
      {/* Energy Generation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90 }}>
        <Typography sx={{ 
          fontSize: 9, 
          fontWeight: 600, 
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          mb: 0.5
        }}>
         Generation  
      </Typography>
        <Typography sx={{ 
          fontSize: 14, 
          fontWeight: 800, 
          color: colors.textPrimary,
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {Math.round(point.energy.generated)} kW
        </Typography>
      </Box>

      {/* Storage */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90 }}>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
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
          {point.weather.temperature}°C
        </Typography>
      </Box>

      {/* Wind Speed */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
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