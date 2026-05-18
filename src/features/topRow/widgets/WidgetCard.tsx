import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useColors } from "@theme/useTheme";
import { getGlassSx } from "@theme/colors";
import { tx, fw, duration } from "@theme/tokens";

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
                ...getGlassSx(colors),
                flex: 1,
                minWidth: 0,
                minHeight: 140,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.6,
                position: "relative",
                overflow: "hidden",
                transition: `box-shadow ${duration.base}, transform ${duration.base}`,
                '&:hover': {
                  boxShadow: `0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 ${colors.borderStrong}, inset 0 -1px 0 ${colors.border}`,
                  transform: 'translateY(-2px)',
                },
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
                        fontSize: tx.sm,
                        color: colors.textSecondary,
                        fontWeight: fw.medium,
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
