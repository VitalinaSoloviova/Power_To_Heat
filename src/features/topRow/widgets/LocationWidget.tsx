import { Box, Typography } from "@mui/material";
import { PlaceRounded } from "@mui/icons-material";
import { useColors } from "@theme/useTheme";
import { useLocation } from "../hooks/useLocation";
import { useSettings } from "@features/settings/useSettings";
import WidgetCard from "./WidgetCard";
import { tx, fw } from "@theme/tokens";

const LocationWidget: React.FC = () => {
    const colors = useColors();
    const { data, loading } = useLocation();
    const { settings } = useSettings();

    return (
        <WidgetCard label="Location" icon={<PlaceRounded sx={{ fontSize: 20 }} />}>
            <Typography
                sx={{
                    fontSize: 22,
                    fontWeight: fw.bold,
                    color: colors.textPrimary,
                    lineHeight: 1.1,
                    mt: 0.2,
                }}
            >
                {loading ? "…" : data?.name ?? "—"}
            </Typography>
            <Box sx={{ mt: 0.6 }}>
                <Typography sx={{ fontSize: tx.sm, color: colors.textMuted }}>
                    {data
                        ? `${data.countryCode} · ${data.latitude.toFixed(2)}, ${data.longitude.toFixed(2)}`
                        : ""}
                </Typography>
                <Typography sx={{ fontSize: tx.sm, color: colors.textMuted }}>
                    {data ? `${settings.residents.toLocaleString('en-DE')} residents` : ""}
                </Typography>
            </Box>
        </WidgetCard>
    );
};

export default LocationWidget;
