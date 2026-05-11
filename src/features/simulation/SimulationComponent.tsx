import { useEffect, useState, useCallback } from "react";
import { Box, Paper } from "@mui/material";
import SimulationHeader from "./SimulationHeader";
import SimulationScene from "./SimulationScene";
import SimulationControls from "./SimulationControls";
import SimulationChartCards from "./SimulationChartCards";
import { useSimulationData } from "./hooks/useSimulationData";
import { useColors } from "@theme/useTheme";
import type { SimulationRange } from "./simulationTypes";
import { DEFAULT_STORAGE_LEVEL } from "@services/UIService";

const SimulationComponent: React.FC = () => {
  const colors = useColors();
  const [range, setRange] = useState<SimulationRange>("day");
  const [index, setIndex] = useState(0);
  const [startDay, setStartDay] = useState<Date>(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  });
  const [storageLevel, setStorageLevel] = useState<number>(DEFAULT_STORAGE_LEVEL);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const { series, loading } = useSimulationData(range, startDay, storageLevel);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((i) => Math.min(i, Math.max(0, series.length - 1)));
  }, [series.length]);

  const handleStorageLevelChange = (value: number) => {
    setStorageLevel(value);
    setIndex(0);
    setIsPlaying(false);
  };

  const toggleSimulation = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying || series.length === 0) return;
    const intervalTime = 800 / speedMultiplier;
    const interval = setInterval(() => {
      setIndex((current) => {
        const next = current + 1;
        if (next >= series.length) { setIsPlaying(false); return current; }
        return next;
      });
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isPlaying, series.length, speedMultiplier]);

  const point = series[index] ?? series[0];

  return (
    <Box sx={{ mx: 3, mb: 2, display: 'flex', flexDirection: 'row', gap: 1.5, alignItems: 'flex-start' }}>
      {/* Simulation (left) */}
      {!point ? (
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minWidth: 0,
            p: 4,
            borderRadius: 3,
            border: `1px solid ${colors.border}`,
            color: colors.textSecondary,
            fontSize: 13,
          }}
        >
          Loading simulation…
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            minWidth: 0,
            p: 0,
            borderRadius: 3,
            background: colors.bgBase,
            border: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            minHeight: "clamp(500px, 72vh, 920px)",
          }}
        >
          <SimulationHeader loading={loading} />
          <SimulationScene point={point} />
          <SimulationControls
            loading={loading}
            startDay={startDay}
            onStartDayChange={(d) => { setStartDay(d); setIndex(0); }}
            storage={{
              currentStoragePercent: (point.storage.level / point.storage.capacity) * 100,
              onStorageChange: handleStorageLevelChange,
            }}
            timeline={{
              range,
              onRangeChange: (r) => { setRange(r); setIndex(0); },
              index,
              onIndexChange: setIndex,
              series,
            }}
            playback={{
              isPlaying,
              onTogglePlay: toggleSimulation,
              speedMultiplier,
              onSpeedMultiplierChange: setSpeedMultiplier,
            }}
          />
        </Paper>
      )}

      {/* Chart cards sidebar (right) */}
      <Box sx={{ width: 300, flexShrink: 0 }}>
        <SimulationChartCards startDay={startDay} range={range} vertical />
      </Box>
    </Box>
  );
};

export default SimulationComponent;
