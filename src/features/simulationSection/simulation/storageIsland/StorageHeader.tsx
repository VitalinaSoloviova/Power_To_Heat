import React from 'react';

// Header styles / colors (kept local to the header component)
const ENERGY_HIGH = '#a855f7';
const ENERGY_GLOW = '#f9a8d4';

const StorageHeader: React.FC = () => (
  <div style={{ textAlign: 'center', marginBottom: 8 }}>
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1.6,
        color: ENERGY_HIGH,
        textTransform: 'uppercase',
        textShadow: `0 0 8px ${ENERGY_GLOW}`,
      }}
    >
      Energy Storage
    </div>
  </div>
);

export default StorageHeader;
