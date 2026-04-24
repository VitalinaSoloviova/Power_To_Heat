import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingIsland from './FloatingIsland';

interface StorageProps {
  storageLevel: number; // 0..1
  isCharging: boolean;
  isDischarging: boolean;
}

const Storage: React.FC<StorageProps> = ({ storageLevel, isCharging, isDischarging }) => {
  const fillColor =
    storageLevel > 0.6 ? '#10b981' : storageLevel > 0.3 ? '#f59e0b' : '#ef4444';

  return (
    <FloatingIsland accent="rgba(99, 102, 241, 0.28)" delay={0.1}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, color: '#6366f1', textTransform: 'uppercase' }}>
        Storage
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            width: 70,
            height: 110,
            borderRadius: 3,
            border: '2.5px solid #e5e7eb',
            overflow: 'hidden',
            background: '#f9fafb',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* battery cap */}
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 22,
              height: 6,
              background: '#e5e7eb',
              borderRadius: '2px 2px 0 0',
            }}
          />
          {/* fill */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(to top, ${fillColor}, ${fillColor}cc)`,
            }}
            animate={{ height: `${storageLevel * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <AnimatePresence>
            {(isCharging || isDischarging) && (
              <motion.div
                key={isCharging ? 'c' : 'd'}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  {isCharging ? '↑' : '↓'}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>Charge</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: fillColor, lineHeight: 1.1 }}>
          {(storageLevel * 100).toFixed(0)}%
        </Typography>
      </Box>
    </FloatingIsland>
  );
};

export default Storage;
