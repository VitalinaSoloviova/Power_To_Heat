import { useEffect, useState } from 'react';
import { Paper, Box } from '@mui/material';
import EnergyIsland from './energy/EnergyIsland';
import Storage from './energy/Storage';
import City from './energy/City';
import EnergyFlow from './energy/EnergyFlow';

interface EnergyState {
  windProduction: number;
  solarProduction: number;
  consumption: number;
  storageLevel: number;
}

const SimulationComponent: React.FC = () => {
  const [state, setState] = useState<EnergyState>({
    windProduction: 0.65,
    solarProduction: 0.55,
    consumption: 0.45,
    storageLevel: 0.5,
  });

  const production = (state.windProduction + state.solarProduction) / 2;
  const balance = production - state.consumption;
  const isCharging = balance > 0.02;
  const isDischarging = balance < -0.02 && state.storageLevel > 0.02;

  // Storage evolves over time based on production vs consumption.
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        const prod = (s.windProduction + s.solarProduction) / 2;
        const delta = (prod - s.consumption) * 0.015;
        return { ...s, storageLevel: Math.max(0, Math.min(1, s.storageLevel + delta)) };
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  const flow1Active = production > 0.05;
  const flow1Intensity = Math.min(1, production);
  const flow2Active = state.consumption > 0.05 && (state.storageLevel > 0.02 || production > 0);
  const flow2Intensity = Math.min(1, state.consumption);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 5,
        background: 'linear-gradient(180deg, #fafbff 0%, #f4f6fb 100%)',
        boxShadow:
          '0 1px 3px rgba(0,0,0,0.04), 0 20px 60px -30px rgba(99,102,241,0.15)',
        border: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minHeight: '70vh',
      }}
    >
      

      <Box sx={{ display: 'flex', gap: 4, flex: 1, alignItems: 'stretch' }}>
        

        {/* Canvas with islands and flows */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 4,
            borderRadius: 4,
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.6) 100%)',
            overflow: 'hidden',
          }}
        >
          {/* subtle dot grid */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              maskImage:
                'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <EnergyIsland
              windProduction={state.windProduction}
              solarProduction={state.solarProduction}
            />
          </Box>

          <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <EnergyFlow
              intensity={flow1Intensity}
              active={flow1Active}
              color="#10b981"
            />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Storage
              storageLevel={state.storageLevel}
              isCharging={isCharging}
              isDischarging={isDischarging}
            />
          </Box>

          <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <EnergyFlow
              intensity={flow2Intensity}
              active={flow2Active}
              color="#ec4899"
            />
          </Box>

          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <City consumption={state.consumption} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SimulationComponent;
