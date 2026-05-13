import { Box, Typography } from '@mui/material';
import { useColors } from '@theme/useTheme';
import type { AppColors } from '@theme/colors';
import { Sparkline, type SparklineType } from '@features/charts/Sparkline';

type BadgeTone = 'success' | 'warning' | 'danger' | 'info';

interface Badge {
  text: string;
  color: BadgeTone;
}

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  badge?: Badge;
  spark?: number[];
  sparkColor?: string;
  sparkType?: SparklineType;
  trend?: string;
}

const getBadgeColor = (tone: BadgeTone, colors: AppColors): string => {
  const map: Record<BadgeTone, string> = {
    success: colors.energy,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.cool,
  };
  return map[tone];
};

const CardHeader: React.FC<{ label: string }> = ({ label }) => {
  const colors = useColors();
  return (
    <Typography 
      sx={{ 
        fontSize: 11.5, 
        color: colors.textSecondary, 
        fontWeight: 600,
        letterSpacing: '0.3px'
      }}
    >
      {label}
    </Typography>
  );
};

const CardValueRow: React.FC<{ value: string; unit?: string; badge?: Badge }> = ({
  value,
  unit,
  badge,
}) => {
  const colors = useColors();
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mt: 0.3 }}>
      <Typography 
        sx={{ 
          fontSize: 23, 
          fontWeight: 700, 
          color: colors.textPrimary, 
          lineHeight: 1.1 
        }}
      >
        {value}
      </Typography>
      {unit && (
        <Typography 
          sx={{ 
            fontSize: 13, 
            color: colors.textSecondary, 
            fontWeight: 500 
          }}
        >
          {unit}
        </Typography>
      )}
      {badge && (
        <Typography
          sx={{
            ml: 'auto',
            fontSize: 11.5,
            fontWeight: 700,
            color: getBadgeColor(badge.color, colors),
            textTransform: 'uppercase',
          }}
        >
          {badge.text}
        </Typography>
      )}
    </Box>
  );
};

const CardTrend: React.FC<{ text: string }> = ({ text }) => {
  const colors = useColors();
  return (
    <Typography 
      sx={{ 
        fontSize: 11, 
        color: colors.textMuted, 
        mt: 0.4 
      }}
    >
      {text}
    </Typography>
  );
};

const MetricsCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  badge,
  spark,
  sparkColor,
  sparkType = 'line',
  trend,
}) => {
  const colors = useColors();

  // Smart default color for sparklines based on label
  const getDefaultSparkColor = (): string => {
    if (label.toLowerCase().includes('heat') || label.toLowerCase().includes('demand')) {
      return colors.heat;
    }
    if (label.toLowerCase().includes('temp') || label.toLowerCase().includes('temperature')) {
      return colors.cool;
    }
    return colors.energy; // default for electricity price
  };

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${colors.border}`,
        borderRadius: 2.5,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardHeader label={label} />
      <CardValueRow value={value} unit={unit} badge={badge} />

      {spark && spark.length > 0 && (
        <Box sx={{ mt: 1, mx: -0.5 }}>
          <Sparkline
            type={sparkType}
            data={spark}
            color={sparkColor ?? getDefaultSparkColor()}
            gradientKey={label.replace(/\s+/g, '')}
          />
        </Box>
      )}

      {trend && <CardTrend text={trend} />}
    </Box>
  );
};

export default MetricsCard;