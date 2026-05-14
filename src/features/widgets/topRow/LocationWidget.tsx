import { Box, Typography } from "@mui/material";
import { PlaceRounded } from "@mui/icons-material";
import WidgetCard from "./WidgetCard";
import { useColors } from "@theme/useTheme";
import { useLocation } from "./hooks/useLocation";

const LocationWidget: React.FC = () => {
    const colors = useColors();
    const { data, loading } = useLocation();

    return (
        <WidgetCard label="Location" icon={<PlaceRounded sx={{ fontSize: 14 }} />}>
            <Typography
                sx={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    lineHeight: 1.1,
                    mt: 0.2,
                }}
            >
                {loading ? "…" : data?.name ?? "—"}
            </Typography>
            <Box sx={{ mt: 0.6 }}>
                <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                    {data
                        ? `${data.countryCode} · ${data.latitude.toFixed(2)}, ${data.longitude.toFixed(2)}`
                        : ""}
                </Typography>
                <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                    {data ? "55,000 residents" : ""}
                </Typography>
            </Box>
        </WidgetCard>
    );
};

export default LocationWidget;
