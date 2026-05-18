import { Box, Typography } from "@mui/material";
import { TrendingUpRounded } from "@mui/icons-material";
import WidgetCard from "./WidgetCard";
import { useColors } from "@theme/useTheme";
import { useCurrentEnergyPrice } from "../hooks/useCurrentEnergyPrice";
import type React from "react";
import EnergyPriceAroundNowChart from "./EnergyPriceAroundNowChart";
import { tx, fw } from "@theme/tokens";

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
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.6 }}>
                        <Typography
                            sx={{
                                fontSize: 22,
                                fontWeight: fw.bold,
                                color: colors.textPrimary,
                                lineHeight: 1,
                            }}
                        >
                            {loading ? "…" : avgPrice.toFixed(1)}
                        </Typography>
                        <Typography
                            sx={{ fontSize: tx.base, color: colors.textSecondary, fontWeight: fw.medium }}
                        >
                            ct/kWh
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: tx.sm, color: colors.textMuted, mt: 0.4 }}>
                        Average next 24 hours • {trend}
                    </Typography>
                </Box>
                <Box sx={{ ml: 2, maxHeight: '100px', maxWidth: '80%', flexShrink: 0, width: '60%' }}>
                    <EnergyPriceAroundNowChart />
                </Box>
            </Box>
        </WidgetCard>
    );
};

export default Next24hPriceWidget;