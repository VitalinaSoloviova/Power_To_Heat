import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import FloatingIsland, { type TimeOfDay, type Weather } from './FloatingIsland';

interface EnergyIslandProps {
  windProduction: number;  // 0..1
  solarProduction: number; // 0..1
  size?: number;
  timeOfDay?: TimeOfDay;
  weather?: Weather;
}

const EnergyIsland: React.FC<EnergyIslandProps> = ({
  windProduction,
  solarProduction,
  size = 240,
  timeOfDay = 'day',
  weather = 'clear',
}) => {
  const spinDuration = Math.max(0.6, 4 - windProduction * 3.5);

  return (
    <FloatingIsland
      size={size}
      timeOfDay={timeOfDay}
      weather={weather}
      label="Generation"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        {/* Wind turbines */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.svg
                width={26}
                height={26}
                viewBox="-12 -12 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: spinDuration + i * 0.2, repeat: Infinity, ease: 'linear' }}
              >
                {[0, 120, 240].map((angle) => (
                  <ellipse
                    key={angle}
                    cx={0}
                    cy={-6}
                    rx={1.6}
                    ry={6}
                    transform={`rotate(${angle})`}
                    fill="#374151"
                  />
                ))}
                <circle cx={0} cy={0} r={2} fill="#111827" />
              </motion.svg>
              <Box sx={{ width: 2, height: 22, background: 'linear-gradient(to bottom, #9ca3af, #d1d5db)', borderRadius: 1 }} />
            </Box>
          ))}
        </Box>

        {/* Solar panels */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 14px)', gap: '3px', mt: 0.5 }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: 14,
                height: 9,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #fde68a, #f59e0b)',
              }}
              animate={{
                opacity: solarProduction > 0.05 ? [0.6, 1, 0.6] : 0.3,
                boxShadow:
                  solarProduction > 0.3
                    ? `0 0 ${solarProduction * 12}px rgba(251, 191, 36, 0.7)`
                    : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </Box>
      </Box>
    </FloatingIsland>
  );
};

export default EnergyIsland;
