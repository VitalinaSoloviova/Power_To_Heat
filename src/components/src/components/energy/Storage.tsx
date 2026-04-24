import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingIsland, { type TimeOfDay, type Weather } from './FloatingIsland';

interface StorageProps {
  storageLevel: number; // 0..1
  isCharging: boolean;
  isDischarging: boolean;
  size?: number;
  timeOfDay?: TimeOfDay;
  weather?: Weather;
}

const Storage: React.FC<StorageProps> = ({
  storageLevel,
  isCharging,
  isDischarging,
  size = 240,
  timeOfDay = 'day',
  weather = 'clear',
}) => {
  const fillColor =
    storageLevel > 0.6 ? '#10b981' : storageLevel > 0.3 ? '#f59e0b' : '#ef4444';

  return (
    <FloatingIsland size={size} timeOfDay={timeOfDay} weather={weather} label="Storage" delay={0.1}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            width: 56,
            height: 88,
            borderRadius: 2,
            border: '2.5px solid #e5e7eb',
            overflow: 'hidden',
            background: '#f9fafb',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 18,
              height: 5,
              background: '#e5e7eb',
              borderRadius: '2px 2px 0 0',
            }}
          />
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
                  fontSize: 24,
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
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: fillColor, mt: 0.5 }}>
          {(storageLevel * 100).toFixed(0)}%
        </Typography>
      </Box>
    </FloatingIsland>
  );
};

export default Storage;
