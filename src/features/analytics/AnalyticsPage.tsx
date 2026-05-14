/**
 * AnalyticsPage
 *
 * Two-panel layout for the Analytics section (reachable via the sidebar).
 *
 * Left panel  (260 px) — scrollable list of saved SimulationRuns (RunCard).
 *                        Clicking a card selects it; the trash icon deletes it.
 * Right panel (flex 1) — RunDetail for the selected run: 2×2 chart grid,
 *                        purchase log, pie chart, and savings comparison.
 *
 * This component receives runs and onDelete from MainContent, which owns the
 * useSimulationHistory hook so the same data is available across page switches.
 */

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import RunCard from './RunCard';
import RunDetail from './RunDetail';
import type { SimulationRun } from './analyticsTypes';

interface Props {
  runs: SimulationRun[];
  onDelete: (id: string) => void;
  onReplay: (run: SimulationRun) => void;
}

const AnalyticsPage: React.FC<Props> = ({ runs, onDelete, onReplay }) => {
  const colors = useColors();
  const [selectedId, setSelectedId] = useState<string | null>(runs[0]?.id ?? null);
  const selected = runs.find((r) => r.id === selectedId) ?? null;

  const handleDelete = (id: string) => {
    onDelete(id);
    if (selectedId === id) {
      const next = runs.find((r) => r.id !== id);
      setSelectedId(next?.id ?? null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left: run list */}
      <Box sx={{
        width: 260,
        flexShrink: 0,
        borderRight: `1px solid ${colors.border}`,
        overflowY: 'auto',
        px: 1.5,
        py: 2,
      }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, letterSpacing: 0.8, mb: 1.5, textTransform: 'uppercase' }}>
          Simulation History
        </Typography>

        {runs.length === 0 ? (
          <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 4, textAlign: 'center' }}>
            No simulations saved yet.{'\n'}Play a simulation to the end to save it.
          </Typography>
        ) : (
          runs.map((run) => (
            <RunCard
              key={run.id}
              run={run}
              selected={run.id === selectedId}
              onSelect={() => setSelectedId(run.id)}
              onDelete={() => handleDelete(run.id)}
            />
          ))
        )}
      </Box>

      {/* Right: detail */}
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', p: 2.5 }}>
        {selected ? (
          <RunDetail run={selected} onReplay={() => onReplay(selected)} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography sx={{ color: colors.textMuted, fontSize: 13 }}>
              Select a simulation
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
