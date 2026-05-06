import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import {
  DEFAULT_HISTORY_YEARS,
  type HistoryYears
} from '@services/UIService';
import { useChartsData } from '@features/charts/hooks/useChartsData';
import ControlsBar from './components/ControlsBar';
import ComparisonChartsSection from '@features/charts/ComparisonChartsSection';

const StorageForecast = () => {
  const colors = useColors();

  const [historyYears, setHistoryYears] = useState<HistoryYears>(DEFAULT_HISTORY_YEARS);

  const { data: charts, loading: chartsLoading } =
    useChartsData(historyYears);

  const xLabels = charts?.xLabels ?? [];
  const historicalPrices = charts?.hours.map((h) => h.price) ?? [];
  const historicalDemand = charts?.hours.map((h) => h.energyDemand) ?? [];
  const weatherHistory =
    charts?.hours.map((h) => ({
      month: h.datetime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      minTemp: h.weather.minTemp,
      maxTemp: h.weather.maxTemp,
      avgTemp: h.weather.temp,
    })) ?? [];

  return (
    <Box
      sx={{
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${colors.border}`,
        borderRadius: 2.5,
        p: 2.5,
        mx: 3,
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <ControlsBar
        historyYears={historyYears}
        onHistoryYearsChange={setHistoryYears}
      />

      {chartsLoading && !charts && (
        <Typography sx={{ color: colors.textSecondary, fontSize: 13 }}>
          Loading chart data…
        </Typography>
      )}

      <ComparisonChartsSection
        xLabels={xLabels}
        actualPriceYears={charts?.dataYears.priceYears ?? historyYears}
        actualWeatherYears={charts?.dataYears.weatherYears ?? historyYears}
        actualWeatherFirstDate={charts?.dataYears.weatherFirstDate ?? null}
        actualPriceFirstDate={charts?.dataYears.priceFirstDate ?? null}
        actualWeatherLastDate={charts?.dataYears.weatherLastDate ?? null}
        actualPriceLastDate={charts?.dataYears.priceLastDate ?? null}
        historicalPrices={historicalPrices}
        forecastPrices={[]}
        historicalDemand={historicalDemand}
        forecastDemand={[]}
        weatherHistory={weatherHistory}
      />
    </Box>
  );
};

export default StorageForecast;
