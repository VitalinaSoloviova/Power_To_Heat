import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useColors } from "@theme/useTheme";

interface WidgetCardProps {
    label: string;
    icon?: ReactNode;
    children: ReactNode;
}

/**
 * Shared shell for the four top-row dashboard widgets.
 * Keeps every widget visually consistent with the existing MetricsCard.
 */
const WidgetCard: React.FC<WidgetCardProps> = ({ label, icon, children }) => {
    const colors = useColors();
    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                bgcolor: colors.bgCardSolid,
                border: `1px solid ${colors.border}`,
                borderRadius: 2.5,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.6,
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                {icon && (
                    <Box sx={{ color: colors.textSecondary, display: "flex" }}>
                        {icon}
                    </Box>
                )}
                <Typography
                    sx={{
                        fontSize: 11,
                        color: colors.textSecondary,
                        fontWeight: 500,
                    }}
                >
                    {label}
                </Typography>
            </Box>
            {children}
        </Box>
    );
};

export default WidgetCard;
