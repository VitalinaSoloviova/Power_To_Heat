import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import FloatingIsland, { type TimeOfDay, type Weather } from './FloatingIsland';

interface CityProps {
  consumption: number; // 0..1
  size?: number;
  timeOfDay?: TimeOfDay;
  weather?: Weather;
}

const BUILDINGS = [
  { w: 16, h: 50, windows: 6 },
  { w: 20, h: 72, windows: 10 },
  { w: 14, h: 42, windows: 4 },
  { w: 22, h: 64, windows: 8 },
  { w: 16, h: 54, windows: 6 },
];

const City: React.FC<CityProps> = ({
  consumption,
  size = 240,
  timeOfDay = 'day',
  weather = 'clear',
}) => (
  <FloatingIsland size={size} timeOfDay={timeOfDay} weather={weather} label="Consumption" delay={0.2}>
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px' }}>
      {BUILDINGS.map((b, i) => (
        <Box
          key={i}
          sx={{
            width: b.w,
            height: b.h,
            background: 'linear-gradient(to bottom, #475569, #334155)',
            borderRadius: '4px 4px 0 0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2px',
            padding: '4px 3px',
            alignContent: 'start',
          }}
        >
          {[...Array(b.windows)].map((_, j) => {
            const lit = consumption > j / b.windows;
            return (
              <motion.div
                key={j}
                style={{
                  width: '100%',
                  height: 4,
                  borderRadius: 1,
                  background: lit ? '#fde047' : 'rgba(255,255,255,0.08)',
                }}
                animate={{
                  boxShadow: lit ? `0 0 6px rgba(253, 224, 71, 0.9)` : 'none',
                  opacity: lit ? [0.85, 1, 0.85] : 0.3,
                }}
                transition={{ duration: 1.8, repeat: Infinity, delay: j * 0.05 }}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  </FloatingIsland>
);

export default City;
