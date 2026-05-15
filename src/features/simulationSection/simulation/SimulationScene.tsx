import { Box } from '@mui/material';
import EnergyIsland from './islands/energyIsland/EnergyIsland';
import CityIsland from './islands/cityIsland/CityIsland';
import EnergyFlow from './EnergyFlow';
import StorageIsland from './islands/storageIsland/StorageIsland';
import WeatherBackdrop from './WeatherBackdrop';
import InfoToolbar from './InfoToolbar';
import { SimulationConfig } from './SimulationConfig';
import type { SimulationPoint } from '@services/types';

interface SimulationSceneProps {
  point: SimulationPoint;
}

const SimulationScene: React.FC<SimulationSceneProps> = ({ point }) => {
  // Derive flow / charge state from the current frame.
  const generatedKw = point.energy.generated;
  const demandKw = point.demand.current;
  const storageFraction = point.storage.level / point.storage.capacity;
  const balance = generatedKw - demandKw;
  
  const { 
    chargeThreshold, 
    dischargeThreshold, 
    maxIntensityKw, 
    storage: storageCfg 
  } = SimulationConfig.THRESHOLDS;

  const isCharging = balance > chargeThreshold;
  const isDischarging = balance < dischargeThreshold && storageFraction > storageCfg.empty;

  const productionIntensity = Math.min(1, generatedKw / maxIntensityKw);
  const consumptionIntensity = Math.min(1, demandKw / maxIntensityKw);

  return (
    <Box sx={{ display: 'flex', gap: 4, flex: 1, alignItems: 'stretch' }}>
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          py: 3,
          minHeight: 500,
        }}
      >
        {/* Full-width sky / weather behind everything */}
        <WeatherBackdrop timestamp={point.timestamp} weather={point.weather} />

        {/* subtle dot grid on top of the sky */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            maskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 85%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 2, minWidth: 80 }}>
          <EnergyIsland point={point} />
        </Box>

        <Box sx={{ flex: 1, position: 'relative', zIndex: 1, minWidth: 80 }}>
          <EnergyFlow
            intensity={productionIntensity}
            color="#16a34a"
          />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 2, minWidth: 80 }}>
          <StorageIsland
            point={point}
            isCharging={isCharging}
            isDischarging={isDischarging}
          />
        </Box>

        <Box sx={{ flex: 1, position: 'relative', zIndex: 1, minWidth: 80 }}>
          <EnergyFlow
            intensity={consumptionIntensity}
            color="#0ea5e9"
          />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <CityIsland point={point} />
        </Box>

        {/* InfoToolbar positioned at the bottom INSIDE simulationBox */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 5,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: 'auto',
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ pointerEvents: 'auto', minWidth: 320 }}>
            <InfoToolbar point={point} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SimulationScene;
