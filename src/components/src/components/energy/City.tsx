import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FloatingIsland from './FloatingIsland';

interface CityProps {
  consumption: number; // 0..1
}

const BUILDINGS = [
  { w: 18, h: 60, windows: 6 },
  { w: 22, h: 90, windows: 10 },
  { w: 16, h: 50, windows: 4 },
  { w: 24, h: 78, windows: 8 },
  { w: 18, h: 65, windows: 6 },
];

const City: React.FC<CityProps> = ({ consumption }) => {
  const buildings = useMemo(() => BUILDINGS, []);

  return (
    <FloatingIsland accent="rgba(244, 114, 182, 0.28)" delay={0.2}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, color: '#ec4899', textTransform: 'uppercase' }}>
        Consumption
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' }}>
        {buildings.map((b, i) => (
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

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>Demand</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#ec4899', lineHeight: 1.1 }}>
          {(consumption * 100).toFixed(0)}%
        </Typography>
      </Box>
    </FloatingIsland>
  );
};

export default City;
