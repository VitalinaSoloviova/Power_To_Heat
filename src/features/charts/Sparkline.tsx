import { useColors } from '@theme/useTheme';

const SPARKLINE_WIDTH = 160;
const SPARKLINE_HEIGHT = 32;
const BAR_GAP = 2;
const AREA_FILL_OPACITY = 0.35;

interface SparklineProps {
  data: number[];
  color?: string;
  gradientKey: string;
}

const getDataRange = (data: number[]) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return { min, max, range: max - min || 1 };
};

const buildScaleY = (min: number, range: number) =>
  (value: number) => SPARKLINE_HEIGHT - ((value - min) / range) * SPARKLINE_HEIGHT;

export const SparklineLine: React.FC<SparklineProps> = ({ data, color, gradientKey }) => {
  const colors = useColors();
  const lineColor = color || colors.heat;

  if (!data.length) return null;

  const { min, range } = getDataRange(data);
  const scaleY = buildScaleY(min, range);

  if (data.length === 1) {
    const y = scaleY(data[0]);
    return (
      <svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT} style={{ overflow: 'visible' }}>
        <line
          x1={0} x2={SPARKLINE_WIDTH} y1={y} y2={y}
          stroke={lineColor} strokeWidth={1.8} strokeLinecap="round"
        />
      </svg>
    );
  }

  const stepX = SPARKLINE_WIDTH / (data.length - 1);
  const linePoints = data.map((value, i) => `${i * stepX},${scaleY(value)}`).join(' ');
  const areaPoints = `0,${SPARKLINE_HEIGHT} ${linePoints} ${SPARKLINE_WIDTH},${SPARKLINE_HEIGHT}`;
  const gradientId = `sparkfill-${gradientKey}`;

  return (
    <svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity={AREA_FILL_OPACITY} />
          <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={linePoints}
        fill="none"
        stroke={lineColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SparklineBars: React.FC<Omit<SparklineProps, 'gradientKey'>> = ({ data, color }) => {
  const colors = useColors();
  const barColor = color || colors.heat;
  // ... (rest of the function remains the same)
  // Just make sure it uses barColor
};

export type SparklineType = 'line' | 'bar';

interface SparklineProxyProps {
  type: SparklineType;
  data: number[];
  color?: string;
  gradientKey: string;
}

export const Sparkline: React.FC<SparklineProxyProps> = ({
  type,
  data,
  color,
  gradientKey,
}) => {
  const colors = useColors();
  const resolvedColor = color ?? colors.heat;   // Default to heat color for right sidebar

  if (type === 'bar') return <SparklineBars data={data} color={resolvedColor} />;
  return <SparklineLine data={data} color={resolvedColor} gradientKey={gradientKey} />;
};