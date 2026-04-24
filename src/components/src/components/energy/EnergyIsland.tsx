import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FloatingIsland from './FloatingIsland';

interface EnergyIslandProps {
  windProduction: number;  // 0..1
  solarProduction: number; // 0..1
}

const EnergyIsland: React.FC<EnergyIslandProps> = ({ windProduction, solarProduction }) => {
  const total = (windProduction + solarProduction) / 2;
  const spinDuration = Math.max(0.6, 4 - windProduction * 3.5);

  return (
    <FloatingIsland accent="rgba(16, 185, 129, 0.28)">
      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, color: '#10b981', textTransform: 'uppercase' }}>
        Generation
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
        {/* Wind turbines */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.svg
                width={28}
                height={28}
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
              <Box sx={{ width: 2, height: 18, background: 'linear-gradient(to bottom, #9ca3af, #d1d5db)', borderRadius: 1 }} />
            </Box>
          ))}
        </Box>

        {/* Solar panels */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 14px)', gap: '3px', mt: 1 }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: 14,
                height: 10,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #fde68a, #f59e0b)',
              }}
              animate={{
                opacity: solarProduction > 0.05 ? [0.6, 1, 0.6] : 0.3,
                boxShadow: solarProduction > 0.3
                  ? `0 0 ${solarProduction * 12}px rgba(251, 191, 36, 0.7)`
                  : '0 0 0px rgba(0,0,0,0)',
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>Output</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#10b981', lineHeight: 1.1 }}>
          {(total * 100).toFixed(0)}%
        </Typography>
      </Box>
    </FloatingIsland>
  );
};

export default EnergyIsland;
