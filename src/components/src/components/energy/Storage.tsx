import { Box, Typography } from '@mui/material';
import React from 'react';

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
    <div
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
      {/* Static ground shadow */}
      <div
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
      />

      {/* Static content wrapper */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
        }}
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
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${storageLevel * 100}%`,
                background: `linear-gradient(to top, ${fillColor}, ${fillColor}cc)`,
                borderRadius: '0 0 6px 6px',
              }}
            />
            {/* Static charging/discharging indicator */}
            {(isCharging || isDischarging) && (
              <div
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
                <span>
                  {isCharging ? '↑' : '↓'}
                </span>
              </div>
            )}
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
      </div>
    </div>
  );
};


export default Storage;
