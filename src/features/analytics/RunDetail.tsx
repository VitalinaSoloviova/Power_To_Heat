/**
 * RunDetail
 *
 * Full detail view for one SimulationRun, rendered in the right panel of
 * AnalyticsPage.  Layout:
 *
 *   ┌─────────────────┬──────────────────────────────────┐
 *   │  Pie chart      │  Electricity Price │  Heat Demand │
 *   │  VS. Direct Buy ├────────────────────┼──────────────┤
 *   │  Purchase Log   │  Temperature       │  Storage Lvl │
 *   └─────────────────┴──────────────────────────────────┘
 *
 * Sub-components defined in this file (kept local — not exported):
 *   AutoHeight   — ResizeObserver wrapper so LineChart fills its grid cell
 *   ChartCard    — single metric card (value + full line chart)
 *   BuyHistory   — scrollable purchase log
 *
 * Note on Heat Demand units:
 *   demand.current in SimulationPoint = energyDemand / 100 (kW, simulation scale).
 *   The main-page chart uses energyDemand / 1 000 to get MW.
 *   Therefore here we divide by 10 ( = /100 then ×10 ) to recover MW.
 */

import { useMemo, useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { PieChart } from '@mui/x-charts/PieChart';
import { useColors } from '@theme/useTheme';
import { getChartSx, getGlassSx } from '@theme/colors';
import { tx, fw, radii } from '@theme/tokens';
import { getSectionLabelSx } from '@theme/colors';
import { computeRunStats } from './analyticsTypes';
import type { SimulationRun } from './analyticsTypes';
import type { SimulationPoint } from '@services/types';

const mean = (arr: number[]) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const AutoHeight: React.FC<{ children: (h: number) => React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(160);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      if (h > 0) setHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div ref={ref} style={{ flex: 1, minHeight: 0 }}>{children(height)}</div>;
};

// ── Chart card — same visual style as SimulationChartCards (always expanded) ──

const ChartCard: React.FC<{
  title: string;
  unit: string;
  data: number[];
  labels: string[];
  color: string;
  formatValue?: (v: number) => string;
}> = ({ title, unit, data, labels, color, formatValue }) => {
  const colors = useColors();
  const chartSx = getChartSx(colors);
  const avg = mean(data);

  return (
    <Box sx={{
      ...getGlassSx(colors),
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    }}>
      <Typography sx={{ fontSize: tx.sm, color: colors.textSecondary, fontWeight: fw.medium }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.25 }}>
        <Typography sx={{ fontSize: tx.display, fontWeight: fw.bold, color: colors.textPrimary, lineHeight: 1 }}>
          {data.length > 0 ? (formatValue ? formatValue(avg) : avg.toFixed(1)) : '—'}
        </Typography>
        <Typography sx={{ fontSize: tx.base, color: colors.textSecondary, mb: 0.25 }}>{unit}</Typography>
      </Box>

      <AutoHeight>
        {(h) => data.length > 0 ? (
          <LineChart
            xAxis={[{ data: labels, scaleType: 'point', tickLabelStyle: { fontSize: 9 } }]}
            series={[{
              data,
              color,
              area: true,
              baseline: 'min' as const,
              showMark: false,
              curve: 'monotoneX' as const,
              label: title,
            }]}
            height={h}
            margin={{ left: 44, right: 8, top: 8, bottom: 32 }}
            sx={{
              ...chartSx,
              '& .MuiLineElement-root': { strokeWidth: 2.5 },
              '& .MuiLineChart-area': { opacity: '0.10 !important' },
              '& .MuiChartsLegend-root': { display: 'none' },
            }}
          >
            <ChartsReferenceLine
              y={avg}
              lineStyle={{ stroke: color, strokeDasharray: '6 5', opacity: 0.35, strokeWidth: 1.5 }}
            />
          </LineChart>
        ) : null}
      </AutoHeight>
    </Box>
  );
};

// ── Buy history ────────────────────────────────────────────────────────────────

const BuyHistory: React.FC<{ series: SimulationPoint[]; priceThreshold: number }> = ({ series, priceThreshold }) => {
  const colors = useColors();
  const entries = [...series].filter((p) => p.energy.generated > 0).reverse();

  return (
    <Box sx={{
      ...getGlassSx(colors),
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${colors.border}` }}>
        <Typography sx={{ ...getSectionLabelSx(colors) }}>
          PURCHASE LOG
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
        {entries.map((p, i) => {
          const ts = new Date(p.timestamp).toLocaleString('en-US', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
          });
          const cost = (p.energy.generated * p.energy.price) / 1_000;
          const emergency = p.energy.mode === 'emergency';
          const cheap     = !emergency && p.energy.price < priceThreshold;
          const accentColor = emergency ? colors.danger : cheap ? colors.cool : colors.warning;
          return (
            <Box key={i} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1,
              borderRadius: 1.5,
              border: `1px solid ${accentColor}66`,
              bgcolor: `${accentColor}1a`,
            }}>
              <Typography sx={{ fontSize: tx.sm, color: colors.textSecondary, minWidth: 76 }}>{ts}</Typography>
              <Typography sx={{ fontSize: tx.md, fontWeight: fw.bold, color: accentColor, flex: 1 }}>
                {p.energy.price.toFixed(1)}
                <Typography component="span" sx={{ fontSize: tx.xs, fontWeight: fw.medium, ml: 0.4 }}>€/MWh</Typography>
              </Typography>
              {emergency && (
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: colors.danger, letterSpacing: 0.5, mr: 0.5 }}>
                  EMERGENCY
                </Typography>
              )}
              <Typography sx={{ fontSize: tx.base, fontWeight: fw.semibold, color: colors.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                {cost.toFixed(2)} €
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// ── Main detail view ───────────────────────────────────────────────────────────

const RunDetail: React.FC<{ run: SimulationRun; onReplay: () => void }> = ({ run, onReplay }) => {
  const colors = useColors();
  const stats = useMemo(() => computeRunStats(run.series), [run.series]);

  const xLabels = useMemo(() =>
    run.series.map((p) =>
      new Date(p.timestamp).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
    ),
  [run.series]);

  const prices         = useMemo(() => run.series.map((p) => p.energy.price),            [run.series]);
  const demands        = useMemo(() => run.series.map((p) => p.demand.current / 10),      [run.series]); // demand.current = energyDemand/100, so /10 gives MW
  const temps          = useMemo(() => run.series.map((p) => p.weather.temperature),      [run.series]);
  const storagePercent = useMemo(() => run.series.map((p) => Math.round((p.storage.level / p.storage.capacity) * 100)), [run.series]);

  const startDate = new Date(run.params.startDay).toLocaleDateString('en-US', {
    day: '2-digit', month: 'long',
  });
  const rangeLabel = run.params.range === 'day' ? 'Day' : run.params.range === 'week' ? 'Week' : 'Month';

  const { cityName, residents, storageCapacityMwh, maxChargePercent,
          criticalThresholdPct, nearCriticalThresholdPct, halfCapacityThresholdPct,
          emergencyBuyEnabled } = run.params;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: tx.lg, fontWeight: fw.bold, color: colors.textPrimary, flex: 1 }}>
          {startDate} · {rangeLabel} · Storage {run.params.storageLevel} %
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ReplayRoundedIcon />}
          onClick={onReplay}
          sx={{ fontSize: tx.sm, borderRadius: radii.md, borderColor: colors.primary, color: colors.primary, '&:hover': { bgcolor: `${colors.primary}18` } }}
        >
          Replay
        </Button>
        {run.params.historyYears !== undefined && run.params.historyYears !== undefined && run.params.dataYears && (
          <Typography sx={{ fontSize: tx.sm, color: colors.textMuted }}>
            {run.params.historyYears}Y requested ·{' '}
            <Typography component="span" sx={{ color: run.params.dataYears.weather >= run.params.historyYears ? colors.cool : colors.warning, fontWeight: fw.semibold, fontSize: tx.sm }}>
              {run.params.dataYears.weather}Y weather
            </Typography>
            {' / '}
            <Typography component="span" sx={{ color: run.params.dataYears.price >= run.params.historyYears ? colors.cool : colors.warning, fontWeight: fw.semibold, fontSize: tx.sm }}>
              {run.params.dataYears.price}Y price
            </Typography>
            {' '}actual coverage
          </Typography>
        )}
      </Box>

      {/* Simulation parameters summary */}
      {(cityName || residents !== undefined || storageCapacityMwh !== undefined) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, flexShrink: 0 }}>
          {cityName && (
            <Chip
              icon={<LocationOnRoundedIcon sx={{ fontSize: 13 }} />}
              label={cityName}
              size="small"
              sx={{ fontSize: tx.xs, bgcolor: `${colors.primary}18`, color: colors.primary, border: `1px solid ${colors.primary}33` }}
            />
          )}
          {residents !== undefined && (
            <Chip
              label={`${residents.toLocaleString('en-US')} residents`}
              size="small"
              sx={{ fontSize: tx.xs, bgcolor: colors.bgSurface, color: colors.textSecondary, border: `1px solid ${colors.border}` }}
            />
          )}
          {storageCapacityMwh !== undefined && (
            <Chip
              label={`${storageCapacityMwh.toLocaleString('en-US')} MWh storage`}
              size="small"
              sx={{ fontSize: tx.xs, bgcolor: colors.bgSurface, color: colors.textSecondary, border: `1px solid ${colors.border}` }}
            />
          )}
          {maxChargePercent !== undefined && (
            <Chip
              label={`Max charge: ${maxChargePercent} %`}
              size="small"
              sx={{ fontSize: tx.xs, bgcolor: colors.bgSurface, color: colors.textSecondary, border: `1px solid ${colors.border}` }}
            />
          )}
          {criticalThresholdPct !== undefined && nearCriticalThresholdPct !== undefined && halfCapacityThresholdPct !== undefined && (
            <Chip
              label={`Thresholds: ${criticalThresholdPct} / ${nearCriticalThresholdPct} / ${halfCapacityThresholdPct} %`}
              size="small"
              sx={{ fontSize: tx.xs, bgcolor: colors.bgSurface, color: colors.textSecondary, border: `1px solid ${colors.border}` }}
            />
          )}
          {emergencyBuyEnabled !== undefined && (
            <Chip
              label={emergencyBuyEnabled ? 'Emergency buy: on' : 'Emergency buy: off'}
              size="small"
              sx={{ fontSize: tx.xs,
                bgcolor: emergencyBuyEnabled ? `${colors.warning}18` : colors.bgSurface,
                color: emergencyBuyEnabled ? colors.warning : colors.textMuted,
                border: `1px solid ${emergencyBuyEnabled ? `${colors.warning}44` : colors.border}` }}
            />
          )}
        </Box>
      )}

      {/* Body */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, flex: 1, minHeight: 0, minWidth: 0 }}>

        {/* Left: Pie + Savings + Purchase Log */}
        <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0, minWidth: 0 }}>
          {/* Pie */}
          <Box sx={{ ...getGlassSx(colors), p: 2, flexShrink: 0 }}>
            <Typography sx={{ ...getSectionLabelSx(colors), mb: 0.5 }}>
              PURCHASES
            </Typography>
            <PieChart
              series={[{
                data: [
                  { id: 'cheap',     value: stats.cheapCount,     color: colors.cool    },
                  { id: 'expensive', value: stats.expensiveCount, color: colors.warning },
                  ...(stats.emergencyCount > 0
                    ? [{ id: 'emergency', value: stats.emergencyCount, color: colors.danger }]
                    : []),
                ],
                innerRadius: 36,
                paddingAngle: 2,
                cornerRadius: 3,
              }]}
              width={200}
              height={130}
              sx={{ '& .MuiChartsLegend-root': { display: 'none' } }}
            />
            {/* Custom legend — never overflows the card */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 0.5 }}>
              {[
                { label: 'Cheap',     color: colors.cool,    count: stats.cheapCount     },
                { label: 'Expensive', color: colors.warning, count: stats.expensiveCount },
                ...(stats.emergencyCount > 0
                  ? [{ label: 'Emergency', color: colors.danger, count: stats.emergencyCount }]
                  : []),
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: tx.xs, color: colors.textSecondary }}>
                    {item.label} ({item.count})
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Savings */}
          <Box sx={{
            ...getGlassSx(colors),
            border: `1px solid ${stats.savings >= 0 ? colors.cool : colors.warning}55`,
            p: 2,
            background: [
              colors.iridescent,
              stats.savings >= 0 ? `${colors.cool}0d` : `${colors.warning}0d`,
            ].join(', '),
            flexShrink: 0,
          }}>
            <Typography sx={{ ...getSectionLabelSx(colors), mb: 1.5 }}>
              VS. DIRECT BUY
            </Typography>
            {([
              { label: 'Our Cost',  value: `${stats.totalCost.toFixed(2)} €`,  color: colors.textPrimary },
              { label: 'Direct Buy', value: `${stats.alwaysCost.toFixed(2)} €`, color: colors.textMuted   },
              { label: 'Savings',
                value: `${stats.savings >= 0 ? '+' : ''}${stats.savings.toFixed(2)} €`,
                color: stats.savings >= 0 ? colors.cool : colors.warning },
            ] as { label: string; value: string; color: string }[]).map((row) => (
              <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.75 }}>
                <Typography sx={{ fontSize: tx.sm, color: colors.textSecondary }}>{row.label}</Typography>
                <Typography sx={{ fontSize: tx.md, fontWeight: fw.bold, color: row.color }}>{row.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* Purchase Log */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <BuyHistory series={run.series} priceThreshold={stats.priceThreshold} />
          </Box>
        </Box>

        {/* Right: 2×2 chart grid */}
        <Box sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 1.5,
        }}>
          <ChartCard
            title="Electricity Price" unit="€/MWh"
            data={prices} labels={xLabels}
            color={colors.cool} formatValue={(v) => v.toFixed(0)}
          />
          <ChartCard
            title="Heat Demand" unit="MW"
            data={demands} labels={xLabels}
            color={colors.heat} formatValue={(v) => v.toFixed(1)}
          />
          <ChartCard
            title="Temperature" unit="°C"
            data={temps} labels={xLabels}
            color={colors.textSecondary} formatValue={(v) => v.toFixed(1)}
          />
          <ChartCard
            title="Storage Level" unit="%"
            data={storagePercent} labels={xLabels}
            color={colors.primary} formatValue={(v) => v.toFixed(0)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RunDetail;
