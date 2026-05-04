import { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type { WeatherRangeForMonth } from '@features/forecast/storageForecastUtils';
import ComparisonChart from './ComparisonChart';
import TemperatureChart from './TemperatureChart';

interface ComparisonChartsSectionProps {
  xLabels: string[];
  actualPriceYears: number;
  actualWeatherYears: number;
  actualWeatherFirstDate: string | null;
  actualPriceFirstDate: string | null;
  actualWeatherLastDate: string | null;
  actualPriceLastDate: string | null;
  historicalPrices: number[];
  forecastPrices: number[];
  historicalDemand: number[];
  forecastDemand: number[];
  weatherHistory: WeatherRangeForMonth[];
  forecastTemperature?: number[];
}

const ComparisonChartsSection = ({
  xLabels,
  actualPriceYears,
  actualWeatherYears,
  actualWeatherFirstDate,
  actualPriceFirstDate,
  actualWeatherLastDate,
  actualPriceLastDate,
  historicalPrices,
  forecastPrices,
  historicalDemand,
  forecastDemand,
  weatherHistory,
}: ComparisonChartsSectionProps) => {
  const colors = useColors();
  const [isExpanded, setIsExpanded] = useState(true);

  const getYearText = (value: string | null): string => {
    if (!value) return 'unknown';
    return value.slice(0, 4);
  };

  const priceLabel = `Avg since ${getYearText(actualPriceFirstDate)} (${actualPriceYears}y)`;
  const demandLabel = `Avg energy demand since ${getYearText(actualWeatherFirstDate)} (${actualWeatherYears}y)`;

  const formatLastDate = (value: string | null): string => {
    if (!value) return 'No data';
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header mit Toggle Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          cursor: 'pointer',
        }}
        onClick={toggleExpanded}
      >
        <Typography
          variant="h6"
          sx={{
            color: colors.textPrimary,
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          Comparison Charts
        </Typography>
        <IconButton
          size="small"
          sx={{ color: colors.textSecondary }}
        >
          <Typography sx={{ fontSize: '1.2rem' }}>
            {isExpanded ? '▲' : '▼'}
          </Typography>
        </IconButton>
      </Box>

      {/* Collapsible Charts */}
      <Collapse in={isExpanded}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <ComparisonChart
            title="Electricity price (€/MWh)"
            lastUsedDate={formatLastDate(actualPriceLastDate)}
            xLabels={xLabels}
            historical={historicalPrices}
            forecast={forecastPrices}
            historicalLabel={priceLabel}
            historyColor={colors.cool}
            forecastColor={colors.heat}
          />
          <ComparisonChart
            title="Heat demand (MWh)"
            lastUsedDate={formatLastDate(actualWeatherLastDate)}
            xLabels={xLabels}
            historical={historicalDemand}
            forecast={forecastDemand}
            historicalLabel={demandLabel}
            historyColor={colors.cool}
            forecastColor={colors.energy}
          />
          <TemperatureChart
            xLabels={xLabels}
            weatherHistory={weatherHistory}
            actualYears={actualWeatherYears}
            firstYear={getYearText(actualWeatherFirstDate)}
            lastUsedDate={formatLastDate(actualWeatherLastDate)}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ComparisonChartsSection;