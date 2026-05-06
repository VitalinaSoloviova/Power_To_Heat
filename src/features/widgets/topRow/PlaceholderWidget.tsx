import { Typography } from "@mui/material";
import { DashboardCustomizeRounded } from "@mui/icons-material";
import WidgetCard from "./WidgetCard";
import { useColors } from "@theme/useTheme";

/** Reserved slot for the next dashboard widget. Keeps the row balanced. */
const PlaceholderWidget: React.FC = () => {
    const colors = useColors();
    return (
        <WidgetCard
            label="Coming soon"
            icon={<DashboardCustomizeRounded sx={{ fontSize: 14 }} />}
        >
            <Typography
                sx={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: colors.textMuted,
                    lineHeight: 1,
                    mt: 0.2,
                }}
            >
                —
            </Typography>
            <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.4 }}>
                Reserved for future widget
            </Typography>
        </WidgetCard>
    );
};

export default PlaceholderWidget;
