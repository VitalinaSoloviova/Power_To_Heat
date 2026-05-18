import { Box, Typography } from "@mui/material";
import { BoltRounded } from "@mui/icons-material";
import WidgetCard from "./WidgetCard";
import { useColors } from "@theme/useTheme";
import { useCurrentEnergyPrice } from "../hooks/useCurrentEnergyPrice";
import type { EnergyPriceStatus } from "@features/topRow/currentData/CurrentEnergyPriceService";
import type { AppColors } from "@theme/colors";
import { tx, fw } from "@theme/tokens";

const statusColor = (status: EnergyPriceStatus, colors: AppColors): string => {
    switch (status) {
        case "low":
            return colors.energy;
        case "medium":
            return colors.warning;
        case "high":
            return colors.danger;
    }
};

const EnergyPriceWidget: React.FC = () => {
    const colors = useColors();
    const { data, loading } = useCurrentEnergyPrice();

    const value = data ? data.value.toFixed(2).replace(".", ",") : "—";
    const unit = data?.unit ?? "ct/kWh";
    const status = data?.status;

    return (
        <WidgetCard
            label="Current Energy Price"
            icon={<BoltRounded sx={{ fontSize: 14 }} />}
        >
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.6, mt: 0.2 }}>
                <Typography
                    sx={{
                        fontSize: 22,
                        fontWeight: fw.bold,
                        color: colors.textPrimary,
                        lineHeight: 1,
                    }}
                >
                    {loading ? "…" : value}
                </Typography>
                <Typography
                    sx={{ fontSize: tx.base, color: colors.textSecondary, fontWeight: fw.medium }}
                >
                    {unit}
                </Typography>
                {status && (
                    <Typography
                        sx={{
                            ml: "auto",
                            fontSize: tx.sm,
                            fontWeight: fw.bold,
                            color: statusColor(status, colors),
                            textTransform: "lowercase",
                        }}
                    >
                        {status}
                    </Typography>
                )}
            </Box>
            <Typography sx={{ fontSize: tx.sm, color: colors.textMuted, mt: 0.4 }}>
                Day-ahead spot price
            </Typography>
        </WidgetCard>
    );
};

export default EnergyPriceWidget;
