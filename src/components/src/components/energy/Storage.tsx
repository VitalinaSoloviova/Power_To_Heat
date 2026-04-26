import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface StorageProps {
  storageLevel: number; // 0..1
  isCharging: boolean;
  isDischarging: boolean;
  size?: number;
}

const Storage: React.FC<StorageProps> = ({
  storageLevel,
  isCharging,
  isDischarging,
  size = 240,
}) => {
  const fillColor =
    storageLevel > 0.6 ? '#10b981' : storageLevel > 0.3 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        width: size,
        height: size * 1.15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 18px',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: `0 20px 60px -20px rgba(99, 102, 241, 0.28), 0 8px 24px -12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.6)`,
        zIndex: 2,
      }}
    >
      {/* Ground shadow */}
      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -16,
          width: size * 0.55,
          height: size * 0.06,
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
          zIndex: 0,
        }}
        animate={{ scaleX: [1, 0.92, 1], opacity: [0.9, 0.7, 0.9] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      />

      {/* Floating motion wrapper */}
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      >
        <Typography 
          sx={{ 
            fontSize: 12, 
            fontWeight: 600, 
            letterSpacing: 1.2, 
            color: '#6366f1', 
            textTransform: 'uppercase' 
          }}
        >
          Storage
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              width: 80,
              height: 120,
              borderRadius: 3,
              border: '3px solid #e5e7eb',
              overflow: 'hidden',
              background: '#f9fafb',
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 8,
                background: '#e5e7eb',
                borderRadius: '3px 3px 0 0',
              }}
            />
            <motion.div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to top, ${fillColor}, ${fillColor}cc)`,
                borderRadius: '0 0 6px 6px',
              }}
              animate={{ height: `${storageLevel * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            {/* Shimmer effect */}
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 4,
                background: 'rgba(255,255,255,0.6)',
                filter: 'blur(2px)',
              }}
              animate={{ bottom: [`0%`, `${storageLevel * 100}%`] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
                    fontSize: 32,
                    color: 'white',
                    fontWeight: 700,
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
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
          <Typography sx={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>
            Charge Level
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: fillColor, lineHeight: 1.1 }}>
            {(storageLevel * 100).toFixed(0)}%
          </Typography>
        </Box>
      </motion.div>
    </motion.div>
  );
};


export default Storage;
