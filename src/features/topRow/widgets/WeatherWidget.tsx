import { Box, Typography } from "@mui/material";
import {
    WbSunnyRounded,
    CloudRounded,
    UmbrellaRounded,
    AcUnitRounded,
    ThunderstormRounded,
    FilterDramaRounded,
    AirRounded as WindIcon,
    HelpOutlineRounded,
} from "@mui/icons-material";
import type { ReactNode } from "react";
import WidgetCard from "./WidgetCard";
import { useColors } from "@theme/useTheme";
import { useCurrentWeather } from "../hooks/useCurrentWeather";
import { useLocation } from "../hooks/useLocation";
import type { WeatherCondition } from "@features/topRow/currentData/CurrentWeatherService";
import { tx, fw } from "@theme/tokens";

const conditionIcon = (
    condition: WeatherCondition,
    color: string
): ReactNode => {
    const sx = { fontSize: 20, color };
    switch (condition) {
        case "sunny":
            return <WbSunnyRounded sx={sx} />;
        case "cloudy":
            return <CloudRounded sx={sx} />;
        case "rainy":
            return <UmbrellaRounded sx={sx} />;
        case "snowy":
            return <AcUnitRounded sx={sx} />;
        case "stormy":
            return <ThunderstormRounded sx={sx} />;
        case "foggy":
            return <FilterDramaRounded sx={sx} />;
        case "windy":
            return <WindIcon sx={sx} />;
        default:
            return <HelpOutlineRounded sx={sx} />;
    }
};

const WeatherWidget: React.FC = () => {
    const colors = useColors();
    const { data: location } = useLocation();
    const { data: weather, loading } = useCurrentWeather(location);

    const condition = weather?.condition ?? "unknown";
    const description = weather?.description ?? "";
    const temperature = weather ? `${weather.temperatureCelsius.toFixed(1)}` : "—";
    const wind = weather ? `${weather.windKilometersPerHour}` : "—";

    return (
        <WidgetCard
            label="Current Weather"
            icon={conditionIcon(condition, colors.textSecondary)}
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
                    {loading ? "…" : temperature}
                </Typography>
                <Typography
                    sx={{ fontSize: tx.base, color: colors.textSecondary, fontWeight: fw.medium }}
                >
                    °C
                </Typography>
                {description && (
                    <Typography
                        sx={{
                            ml: "auto",
                            fontSize: tx.sm,
                            fontWeight: fw.semibold,
                            color: colors.textSecondary,
                            textTransform: "capitalize",
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.4 }}>
                <WindIcon sx={{ fontSize: 14, color: colors.textMuted }} />
                <Typography sx={{ fontSize: tx.sm, color: colors.textMuted }}>
                    Wind {wind} km/h
                </Typography>
            </Box>
        </WidgetCard>
    );
};

export default WeatherWidget;
