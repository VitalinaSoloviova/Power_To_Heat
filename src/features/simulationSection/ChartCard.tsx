import { memo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useColors } from '@theme/useTheme';
import { getChartSx } from '@theme/colors';

const COMPACT_H = 140;
const EXPANDED_H = 320;

export interface CardSeries {
  data: number[];
  color: string;
  label: string;
  area: boolean;
}

export interface CardConfig {
  id: string;
  title: string;
  mainValue: number;
  unit: string;
  formatValue: (v: number) => string;
  series: CardSeries[];
  xLabels: string[];
}

const miniChartSx = (base: object) => ({
  ...base,
  '& .MuiChartsAxis-root': { display: 'none' },
  '& .MuiChartsLegend-root': { display: 'none' },
  '& .MuiLineElement-root': { strokeWidth: 2.5 },
  '& .MuiLineChart-area': { opacity: '0.10 !important' },
});

const fullChartSx = (base: object) => ({
  ...base,
  '& .MuiLineElement-root': { strokeWidth: 2.5 },
  '& .MuiLineChart-area': { opacity: '0.10 !important' },
});

export const ChartCard = memo<{
  card: CardConfig;
  expanded: boolean;
  vertical: boolean;
  onToggle: (id: string | null) => void;
}>(function ChartCard({ card, expanded, vertical, onToggle }) {
  const colors = useColors();
  const chartSx = getChartSx(colors);
  const hasData = card.series[0]?.data.length > 0;

  const handleClick = useCallback(
    () => onToggle(expanded ? null : card.id),
    [onToggle, expanded, card.id],
  );

  return (
    <Box
      onClick={handleClick}
      sx={{
        ...(vertical ? { width: '100%' } : { flex: 1, minWidth: 0 }),
        height: expanded ? EXPANDED_H : COMPACT_H,
        transition: 'height 0.32s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s, border-color 0.25s',
        overflow: 'hidden',
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${expanded ? colors.primary : colors.border}`,
        borderRadius: 2.5,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: expanded
          ? `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${colors.primary}30`
          : 'none',
        position: 'relative',
      }}
    >
      <Typography sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
        {card.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.25 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, lineHeight: 1 }}>
          {hasData ? card.formatValue(card.mainValue) : '—'}
        </Typography>
        <Typography sx={{ fontSize: 12, color: colors.textSecondary, mb: 0.25 }}>
          {card.unit}
        </Typography>
      </Box>
      <Box sx={{ mt: 'auto', height: 50, mx: -0.5, opacity: expanded ? 0 : 1, transition: 'opacity 0.15s' }}>
        {hasData && (
          <LineChart
            xAxis={[{ data: card.xLabels, scaleType: 'point' }]}
            series={card.series.map((s) => ({
              data: s.data,
              color: s.color,
              area: s.area,
              baseline: 'min' as const,
              showMark: false,
              curve: 'monotoneX' as const,
            }))}
            margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
            height={50}
            sx={miniChartSx(chartSx)}
          />
        )}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 80,
          left: 8,
          right: 8,
          bottom: 8,
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.22s 0.1s',
          pointerEvents: expanded ? 'auto' : 'none',
        }}
      >
        {hasData && (
          <LineChart
            xAxis={[{ data: card.xLabels, scaleType: 'point', tickLabelStyle: { fontSize: 9 } }]}
            series={card.series.map((s) => ({
              data: s.data,
              label: s.label,
              color: s.color,
              area: s.area,
              baseline: 'min' as const,
              showMark: false,
              curve: 'monotoneX' as const,
            }))}
            margin={{ left: 44, right: 8, top: 8, bottom: 32 }}
            sx={fullChartSx(chartSx)}
          />
        )}
      </Box>
    </Box>
  );
});
