import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";

import { useColors } from "@theme/useTheme";
import {
  DEFAULT_STORAGE_LEVEL,
  DEFAULT_HISTORY_YEARS,
  type HistoryYears,
} from "@services/ui/ChartUIService";
import type { SimulationRun } from "@features/analytics/analyticsTypes";
import SimulationChartCards from "../charts/SimulationChartCards";
import { useSimulationData } from "./useSimulationData";
import SimulationControls from "./SimulationControls";
import SimulationHeader from "./SimulationHeader";
import SimulationPriceTicker from "./priceTicker/SimulationPriceTicker";
import SimulationScene from "./SimulationScene";
import type { ReplayParams, SimulationRange } from "@services/types";
import SimulationSlider from "./SimulationSlider";

interface Props {
  onRunComplete?: (run: SimulationRun) => void;
  initialParams?: ReplayParams;
}

const SimulationComponent: React.FC<Props> = ({ onRunComplete, initialParams }) => {
  const colors = useColors();
  const [range, setRange] = useState<SimulationRange>(initialParams?.range ?? "day");
  const [index, setIndex] = useState(0);
  const [startDay, setStartDay] = useState<Date>(
    () =>
      initialParams?.startDay ??
      (() => {
        const now = new Date();
        return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      })(),
  );
  const [storageLevel, setStorageLevel] = useState<number>(
    initialParams?.storageLevel ?? DEFAULT_STORAGE_LEVEL,
  );
  const [historyYears, setHistoryYears] = useState<HistoryYears>(
    initialParams?.historyYears ?? DEFAULT_HISTORY_YEARS,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const { series, loading, dataYears } = useSimulationData(
    range,
    startDay,
    storageLevel,
    historyYears,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((i) => Math.min(i, Math.max(0, series.length - 1)));
  }, [series.length]);

  const handleStorageLevelChange = useCallback((value: number) => {
    setStorageLevel(value);
    setIndex(0);
    setIsPlaying(false);
  }, []);

  const handleStartDayChange = useCallback((d: Date) => {
    setStartDay(d);
    setIndex(0);
  }, []);

  const handleRangeChange = useCallback((r: SimulationRange) => {
    setRange(r);
    setIndex(0);
  }, []);

  const handleHistoryYearsChange = useCallback((value: HistoryYears) => {
    setHistoryYears(value);
    setIndex(0);
    setIsPlaying(false);
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) setHasStarted(true);
      return next;
    });
  }, []);

  // Auto-save when simulation plays to the last frame
  const wasPlayingRef = useRef(false);
  useEffect(() => {
    if (wasPlayingRef.current && !isPlaying && index === series.length - 1 && series.length > 0) {
      onRunComplete?.({
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        params: {
          startDay: startDay.toISOString(),
          range,
          storageLevel,
          historyYears,
          dataYears: {
            weather: dataYears?.weatherYears ?? 0,
            price: dataYears?.priceYears ?? 0,
          },
        },
        series,
      });
    }
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isPlaying || series.length === 0) return;
    const intervalTime = 800 / speedMultiplier;
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

  const storageProp = useMemo(
    () => ({ currentStoragePercent: storageLevel, onStorageChange: handleStorageLevelChange }),
    [storageLevel, handleStorageLevelChange],
  );

  const timelineProp = useMemo(
    () => ({
      range,
      onRangeChange: handleRangeChange,
      index,
      onIndexChange: setIndex,
      series,
    }),
    [range, handleRangeChange, index, series],
  );

  const playbackProp = useMemo(
    () => ({
      isPlaying,
      onTogglePlay: toggleSimulation,
      speedMultiplier,
      onSpeedMultiplierChange: setSpeedMultiplier,
      hasStarted,
      onCancel: () => {
        setIsPlaying(false);
        setIndex(0);
        const now = new Date();
        setStartDay(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
        setStorageLevel(DEFAULT_STORAGE_LEVEL);
        setHistoryYears(DEFAULT_HISTORY_YEARS);
        setSpeedMultiplier(1);
        setHasStarted(false);
      },
    }),
    [isPlaying, toggleSimulation, speedMultiplier, hasStarted],
  );

  return (
    <Box sx={{ mx: 3, mb: 2 }}>
      {!point ? (
        <Box
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
        </Box>
      ) : (
        <Box
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "stretch",
              gap: 1.5,
              flex: 1,
              minHeight: 0,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <SimulationScene point={point} />
              <SimulationSlider
                timeline={timelineProp}
                playback={playbackProp}
                loading={loading}
                startDay={startDay}
                onStartDayChange={handleStartDayChange}
              />
              <Box
                sx={{
                  display: "flex",
                  paddingBlock: 2,
                  flexDirection: { xs: "column", lg: "row" },
                }}
              >
                <Box sx={{ flex: "1 1 100%", minWidth: 0, paddingLeft: 1 }}>
                  <SimulationChartCards
                    startDay={startDay}
                    range={range}
                    historyYears={historyYears}
                    onHistoryYearsChange={handleHistoryYearsChange}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                flexShrink: 0,
                display: "flex",
                flex: "0 1 23%",
                width: { xs: "100%", lg: 320 },
                flexDirection: "column",
                bgcolor: colors.bgCard,
                borderLeft: { xs: "none", lg: `1px solid ${colors.border}` },
              }}
            >
              <SimulationControls
                loading={loading}
                startDay={startDay}
                onStartDayChange={handleStartDayChange}
                storage={storageProp}
                timeline={timelineProp}
                playback={playbackProp}
                historyYears={historyYears}
                setHistoryYears={handleHistoryYearsChange}
              />
              <Box sx={{ width: "100%", px: 0.5, py: 1 }}>
                <SimulationPriceTicker series={series} currentIndex={index} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SimulationComponent;
