import { Box, Typography, LinearProgress } from "@mui/material";
import { TrendingUpRounded } from "@mui/icons-material";
import WidgetCard from "./WidgetCard";
import { useColors } from "@theme/useTheme";
import { useCurrentEnergyPrice } from "./hooks/useCurrentEnergyPrice";

const Next24hPriceWidget: React.FC = () => {
    const colors = useColors();
    const { data: currentPrice, loading } = useCurrentEnergyPrice();

    const avgPrice = currentPrice?.avg24h ?? currentPrice?.value ?? 0;
    const trend = currentPrice?.trend ?? "stable";

    return (
        <WidgetCard
            label="Next 24h Price"
            icon={<TrendingUpRounded sx={{ fontSize: 14 }} />}
        >
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.6, mt: 0.2 }}>
                <Typography
                    sx={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        lineHeight: 1,
                    }}
                >
                    {loading ? "…" : avgPrice.toFixed(1)}
                </Typography>
                <Typography
                    sx={{ fontSize: 12, color: colors.textSecondary, fontWeight: 500 }}
                >
                    ct/kWh
                </Typography>
            </Box>

            <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.4 }}>
                Average next 24 hours • {trend}
            </Typography>

            {/* Simple visual bar */}
            <LinearProgress
                variant="determinate"
                value={Math.min(Math.max((avgPrice - 10) * 3, 0), 100)}
                sx={{
                    mt: 1.5,
                    height: 6,
                    borderRadius: 1,
                    bgcolor: colors.bgSurface,
                    "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${colors.energy}, ${colors.warning})`,
                    },
                }}
            />
        </WidgetCard>
    );
};

export default Next24hPriceWidget;