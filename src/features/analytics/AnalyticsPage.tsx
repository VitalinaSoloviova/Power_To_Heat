import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import { useColors } from '@theme/useTheme';
import { getSectionLabelSx } from '@theme/colors';
import { tx, duration, easing } from '@theme/tokens';
import RunCard from './RunCard';
import RunDetail from './RunDetail';
import CompareView from './CompareView';
import type { SimulationRun } from './analyticsTypes';

interface Props {
  runs: SimulationRun[];
  onDelete: (id: string) => void;
  onReplay: (run: SimulationRun) => void;
}

const SIDEBAR_W = 260;
const COLLAPSED_W = 44;

const AnalyticsPage: React.FC<Props> = ({ runs, onDelete, onReplay }) => {
  const colors = useColors();
  const [selectedId, setSelectedId] = useState<string | null>(runs[0]?.id ?? null);
  const [compareId, setCompareId]   = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const selected = runs.find((r) => r.id === selectedId) ?? null;
  const compared = runs.find((r) => r.id === compareId) ?? null;

  const handleDelete = (id: string) => {
    onDelete(id);
    if (selectedId === id) {
      const next = runs.find((r) => r.id !== id);
      setSelectedId(next?.id ?? null);
    }
    if (compareId === id) setCompareId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    // clear compare if it was the newly selected run, or if ranges don't match
    const newSelected = runs.find((r) => r.id === id);
    const currentCompared = runs.find((r) => r.id === compareId);
    if (compareId === id || (newSelected && currentCompared && newSelected.params.range !== currentCompared.params.range)) {
      setCompareId(null);
    }
  };

  const handleCompare = (id: string) => {
    setCompareId((prev) => (prev === id ? null : id));
  };

  const showCompare = selected !== null && compared !== null;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flex: 1, overflow: 'hidden', minWidth: 0 }}>

      {/* ── Left: collapsible run list ─────────────────────────────── */}
      <Box
        sx={{
          width: { xs: '100%', md: open ? SIDEBAR_W : COLLAPSED_W },
          flexShrink: 0,
          transition: `width ${duration.base} ${easing.standard}`,
          overflow: 'hidden',
          borderRight: { xs: 'none', md: `1px solid ${colors.border}` },
          borderBottom: { xs: `1px solid ${colors.border}`, md: 'none' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, pt: 2, pb: 1, gap: 0.5, flexShrink: 0 }}>
          <Typography
            sx={{
              ...getSectionLabelSx(colors), flex: 1,
              whiteSpace: 'nowrap', overflow: 'hidden',
              opacity: open ? 1 : 0, transition: `opacity ${duration.fast}`,
            }}
          >
            Simulation History
          </Typography>
          <Tooltip title={open ? 'Collapse' : 'Expand'} placement="right">
            <IconButton
              size="small"
              onClick={() => setOpen((o) => !o)}
              sx={{ flexShrink: 0, color: colors.textSecondary, p: 0.5, borderRadius: 1.5,
                '&:hover': { bgcolor: colors.bgSurface, color: colors.textPrimary } }}
            >
              {open
                ? <ChevronLeftRounded sx={{ fontSize: tx.xl }} />
                : <ChevronRightRounded sx={{ fontSize: tx.xl }} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Scrollable list */}
        <Box
          sx={{
            flex: 1, overflowY: 'auto', px: 1.5, pb: 2,
            opacity: open ? 1 : 0, transition: `opacity ${duration.fast}`,
            pointerEvents: open ? 'auto' : 'none',
          }}
        >
          {runs.length === 0 ? (
            <Typography sx={{ fontSize: tx.base, color: colors.textMuted, mt: 4, textAlign: 'center' }}>
              No simulations saved yet.
            </Typography>
          ) : (
            runs.map((run) => (
              <RunCard
                key={run.id}
                run={run}
                selected={run.id === selectedId}
                isComparing={run.id === compareId}
                onSelect={() => handleSelect(run.id)}
                onDelete={() => handleDelete(run.id)}
                onCompare={run.id !== selectedId && run.params.range === selected?.params.range ? () => handleCompare(run.id) : undefined}
              />
            ))
          )}
        </Box>
      </Box>

      {/* ── Right: detail or compare ───────────────────────────────── */}
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', p: 2.5 }}>
        {showCompare ? (
          <CompareView
            runA={selected!}
            runB={compared!}
            onClose={() => setCompareId(null)}
          />
        ) : selected ? (
          <RunDetail run={selected} onReplay={() => onReplay(selected)} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography sx={{ color: colors.textMuted, fontSize: tx.md }}>
              Select a simulation
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
