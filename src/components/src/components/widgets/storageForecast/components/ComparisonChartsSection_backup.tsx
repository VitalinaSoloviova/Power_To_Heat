import { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { useColors } from '../../../theme/useTheme';
import type { WeatherRangeForMonth } from '../../storageForecastUtils';
import ComparisonChart from './ComparisonChart';
import TemperatureChart from './TemperatureChart';

interface ComparisonChartsSectionProps {
  xLabels: string[];
  historyYears: number;
  historicalPrices: number[];
  forecastPrices: number[];
  historicalDemand: number[];
  forecastDemand: number[];
  weatherHistory: WeatherRangeForMonth[];
  forecastTemperature: number[];
}

const ComparisonChartsSection = ({
  xLabels,
  historyYears,
  historicalPrices,
  forecastPrices,
  historicalDemand,
  forecastDemand,
  weatherHistory,
  forecastTemperature,
}: ComparisonChartsSectionProps) => {
  const colors = useColors();
  const [isExpanded, setIsExpanded] = useState(true);
  const historicalLabel = `Avg last ${historyYears}y`;

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
            xLabels={xLabels}
            historical={historicalPrices}
            forecast={forecastPrices}
            historicalLabel={historicalLabel}
            historyColor={colors.cool}
            forecastColor={colors.heat}
          />
          <ComparisonChart
            title="Heat demand (MWh)"
            xLabels={xLabels}
            historical={historicalDemand}
            forecast={forecastDemand}
            historicalLabel={historicalLabel}
            historyColor={colors.cool}
            forecastColor={colors.energy}
          />
          <TemperatureChart
            xLabels={xLabels}
            weatherHistory={weatherHistory}
            forecastTemperature={forecastTemperature}
            historyYears={historyYears}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ComparisonChartsSection;

interface ComparisonChartsSectionProps {
  xLabels: string[];
  historyYears: number;
  historicalPrices: number[];
  forecastPrices: number[];
  historicalDemand: number[];
  forecastDemand: number[];
  weatherHistory: WeatherRangeForMonth[];
  forecastTemperature: number[];
}

const ComparisonChartsSection = ({
  xLabels,
  historyYears,
  historicalPrices,
  forecastPrices,
  historicalDemand,
  forecastDemand,
  weatherHistory,
  forecastTemperature,
}: ComparisonChartsSectionProps) => {
  const colors = useColors();
  const [isExpanded, setIsExpanded] = useState(true);
  const historicalLabel = `Avg last ${historyYears}y`;

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
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Collapsible Charts */}
      <Collapse in={isExpanded}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <ComparisonChart
            title="Electricity price (€/MWh)"
            xLabels={xLabels}
            historical={historicalPrices}
            forecast={forecastPrices}
            historicalLabel={historicalLabel}
            historyColor={colors.cool}
            forecastColor={colors.heat}
          />
          <ComparisonChart
            title="Heat demand (MWh)"
            xLabels={xLabels}
            historical={historicalDemand}
            forecast={forecastDemand}
            historicalLabel={historicalLabel}
            historyColor={colors.cool}
            forecastColor={colors.energy}
          />
          <TemperatureChart
            xLabels={xLabels}
            weatherHistory={weatherHistory}
            forecastTemperature={forecastTemperature}
            historyYears={historyYears}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ComparisonChartsSection;
