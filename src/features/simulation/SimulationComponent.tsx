import { useEffect, useState, useCallback } from "react";
import { Paper } from "@mui/material";
import SimulationHeader from "./SimulationHeader";
import SimulationScene from "./SimulationScene";
import SimulationControls from "./SimulationControls";
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

  // Reset / clamp the slider when the series length changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((i) => Math.min(i, Math.max(0, series.length - 1)));
  }, [series.length]);

  const handleStorageLevelChange = (value: number) => {
    setStorageLevel(value);
    setIndex(0);
    setIsPlaying(false); // Stop simulation when changing storage level
  };

  const toggleSimulation = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Auto-simulation: advance index every 0.8 second when playing
  useEffect(() => {
    if (!isPlaying || series.length === 0) return;

    const baseInterval = 800;
    const intervalTime = baseInterval / speedMultiplier;

    const interval = setInterval(() => {
      setIndex((current) => {
        const next = current + 1;
        if (next >= series.length) {
          setIsPlaying(false);
          return current;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, series.length, speedMultiplier]);

  const point = series[index] ?? series[0];
  if (!point) {
    return (
      <Paper
        elevation={0}
        sx={{
          mx: 3,
          mb: 2,
          p: 4,
          borderRadius: 3,
          border: `1px solid ${colors.border}`,
          color: colors.textSecondary,
          fontSize: 13,
        }}
      >
        Loading simulation…
      </Paper>
    );
  }

  const currentStoragePercent = (point.storage.level / point.storage.capacity) * 100;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mx: 3,
        mb: 2,
        borderRadius: 3,
        background: colors.bgBase,
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        minHeight: 700,
        overflow: "hidden",
      }}
    >
      <SimulationHeader loading={loading} />

      <SimulationScene point={point} />

      <SimulationControls
        loading={loading}
        storage={{
          currentStoragePercent,
          onStorageChange: handleStorageLevelChange,
        }}
        timeline={{
          range,
          onRangeChange: (r) => {
            setRange(r);
            setIndex(0);
          },
          index,
          onIndexChange: (i) => {
            setIndex(i);
          },
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
  );
};

export default SimulationComponent;
