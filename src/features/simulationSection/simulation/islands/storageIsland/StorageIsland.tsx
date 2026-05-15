import { motion } from 'framer-motion';
import { storageFraction } from './storageCalculationUtils';
import type { SimulationPoint } from '@services/types/index';
import StorageTank from './StorageTank';
import StorageHeader from './StorageHeader';

interface StorageIslandProps {
  point: SimulationPoint;
  isCharging: boolean;
  isDischarging: boolean;
  size?: number;
}

const StorageIsland: React.FC<StorageIslandProps> = ({
  point,
  isCharging,
  isDischarging,
  size = 250,
}) => {
  const fraction = storageFraction(point.storage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <StorageHeader />

      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          width: size,
          height: size * 1.15,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <StorageTank
          fraction={fraction}
          isCharging={isCharging}
          isDischarging={isDischarging}
          size={size}
        />
      </motion.div>
    </motion.div>
  );
};

export default StorageIsland;
