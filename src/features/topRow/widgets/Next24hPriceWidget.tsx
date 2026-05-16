import { Box, Typography } from "@mui/material";
import { TrendingUpRounded } from "@mui/icons-material";
import WidgetCard from "./WidgetCard";
import { useColors } from "@theme/useTheme";
import { useCurrentEnergyPrice } from "../hooks/useCurrentEnergyPrice";
import type React from "react";
import EnergyPriceAroundNowChart from "./EnergyPriceAroundNowChart";

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
            <Box sx={{ mt: 1.2 }}>
                <EnergyPriceAroundNowChart height={84} />
            </Box>
        </WidgetCard>
    );
};

export default Next24hPriceWidget;