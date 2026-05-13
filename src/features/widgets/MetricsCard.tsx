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

  // Smart color selection based on card type
  const getSparkColor = (): string => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('heat') || lowerLabel.includes('demand')) {
      return colors.heat;
    }
    if (lowerLabel.includes('temperature') || lowerLabel.includes('temp')) {
      return colors.cool;
    }
    return sparkColor ?? colors.energy; // Electricity price fallback
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
      }}
    >
      {/* Header */}
      <Typography 
        sx={{ 
          fontSize: 11.5, 
          color: colors.textSecondary, 
          fontWeight: 600 
        }}
      >
        {label}
      </Typography>

      {/* Value + Badge */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
        <Typography 
          sx={{ 
            fontSize: 23, 
            fontWeight: 700, 
            color: colors.textPrimary, 
            lineHeight: 1.05 
          }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 500 }}>
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

      {/* Sparkline */}
      {spark && spark.length > 0 && (
        <Box sx={{ mt: 1, mx: -0.5 }}>
          <Sparkline
            type={sparkType}
            data={spark}
            color={getSparkColor()}
            gradientKey={label.replace(/\s+/g, '-')}
          />
        </Box>
      )}

      {/* Trend text */}
      {trend && (
        <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.4 }}>
          {trend}
        </Typography>
      )}
    </Box>
  );
};

export default MetricsCard;