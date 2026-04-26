import { Box, Typography } from '@mui/material';
import { useColors } from './theme/useTheme';
import type { AppColors } from './theme/colors';
import { Sparkline, type SparklineType } from './Sparkline';

type BadgeTone = 'success' | 'warning' | 'danger' | 'info';

interface Badge {
  text: string;
  color: BadgeTone;
}

interface StatCardProps {
  /** Small label shown above the value, e.g. "Electricity Price". */
  label: string;
  /** Main numeric value displayed prominently. */
  value: string;
  /** Optional unit shown next to the value, e.g. "ct/kWh". */
  unit?: string;
  /** Optional status pill on the right side of the value (e.g. "low"). */
  badge?: Badge;
  /** Time series for the inline sparkline preview. */
  spark?: number[];
  /** Stroke / fill color used for the sparkline. */
  sparkColor?: string;
  /** Sparkline rendering style. */
  sparkType?: SparklineType;
  /** Optional small caption shown below the sparkline. */
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
    <Typography sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>
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
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6, mt: 0.2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary, lineHeight: 1 }}>
        {value}
      </Typography>
      {unit && (
        <Typography sx={{ fontSize: 12, color: colors.textSecondary, fontWeight: 500 }}>
          {unit}
        </Typography>
      )}
      {badge && (
        <Typography
          sx={{
            ml: 'auto',
            fontSize: 11,
            fontWeight: 700,
            color: getBadgeColor(badge.color, colors),
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
    <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.2 }}>{text}</Typography>
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
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        bgcolor: colors.bgCardSolid,
        border: `1px solid ${colors.border}`,
        borderRadius: 2.5,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardHeader label={label} />
      <CardValueRow value={value} unit={unit} badge={badge} />

      {spark && spark.length > 0 && (
        <Box sx={{ mt: 0.5, mx: -0.5 }}>
          <Sparkline
            type={sparkType}
            data={spark}
            color={sparkColor ?? colors.energy}
            gradientKey={label}
          />
        </Box>
      )}

      {trend && <CardTrend text={trend} />}
    </Box>
  );
};

export default MetricsCard;
