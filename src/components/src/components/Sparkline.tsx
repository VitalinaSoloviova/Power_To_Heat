import { useColors } from './theme/useTheme';

const SPARKLINE_WIDTH = 160;
const SPARKLINE_HEIGHT = 32;
const BAR_GAP = 2;
const AREA_FILL_OPACITY = 0.35;

interface SparklineProps {
  data: number[];
  color: string;
  /** Used to build a unique <linearGradient> id per card. */
  gradientKey: string;
}

/** Returns min/max/range, guarding against a flat series (range = 0). */
const getDataRange = (data: number[]) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return { min, max, range: max - min || 1 };
};

/** Maps a value to its Y coordinate inside the sparkline box (top = high). */
const buildScaleY = (min: number, range: number) =>
  (value: number) => SPARKLINE_HEIGHT - ((value - min) / range) * SPARKLINE_HEIGHT;

/** Renders a smooth area+line sparkline. */
export const SparklineLine: React.FC<SparklineProps> = ({ data, color, gradientKey }) => {
  if (!data.length) return null;

  const { min, range } = getDataRange(data);
  const scaleY = buildScaleY(min, range);
  const stepX = SPARKLINE_WIDTH / (data.length - 1);

  const linePoints = data
    .map((value, i) => `${i * stepX},${scaleY(value)}`)
    .join(' ');
  const areaPoints = `0,${SPARKLINE_HEIGHT} ${linePoints} ${SPARKLINE_WIDTH},${SPARKLINE_HEIGHT}`;
  const gradientId = `sparkfill-${gradientKey}`;

  return (
    <svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={AREA_FILL_OPACITY} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** Renders bars that grow from the baseline up to each value. */
export const SparklineBars: React.FC<Omit<SparklineProps, 'gradientKey'>> = ({ data, color }) => {
  if (!data.length) return null;

  const { min, range } = getDataRange(data);
  const barWidth = SPARKLINE_WIDTH / data.length - BAR_GAP;

  return (
    <svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT} style={{ overflow: 'visible' }}>
      {data.map((value, i) => {
        const barHeight = ((value - min) / range) * SPARKLINE_HEIGHT;
        return (
          <rect
            key={i}
            x={i * (barWidth + BAR_GAP)}
            y={SPARKLINE_HEIGHT - barHeight}
            width={barWidth}
            height={barHeight}
            rx={1}
            fill={color}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
};

export type SparklineType = 'line' | 'bar';

interface SparklineProxyProps {
  type: SparklineType;
  data: number[];
  color?: string;
  gradientKey: string;
}

/** Public entry point: picks the right sparkline renderer. */
export const Sparkline: React.FC<SparklineProxyProps> = ({
  type,
  data,
  color,
  gradientKey,
}) => {
  const colors = useColors();
  const resolvedColor = color ?? colors.energy;
  if (type === 'bar') return <SparklineBars data={data} color={resolvedColor} />;
  return <SparklineLine data={data} color={resolvedColor} gradientKey={gradientKey} />;
};
