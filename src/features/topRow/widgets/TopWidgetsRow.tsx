import { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowUpRounded, KeyboardArrowDownRounded } from "@mui/icons-material";
import EnergyPriceWidget from "./EnergyPriceWidget";
import LocationWidget from "./LocationWidget";
import Next24hPriceWidget from "./Next24hPriceWidget";
import WeatherWidget from "./WeatherWidget";
import { useColors } from "@theme/useTheme";

const TopWidgetsRow: React.FC = () => {
    const colors = useColors();
    const [open, setOpen] = useState(true);

    return (
        <Box sx={{ px: { xs: 2, md: 3 }, mb: open ? 2 : 0.5 }}>
            {/* Collapsible widget area */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.28s cubic-bezier(0.4,0,0.2,1)",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        overflow: "hidden",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        minWidth: 0,
                        pb: open ? 0 : 0,
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.20s",
                    }}
                >
                    <LocationWidget />
                    <WeatherWidget />
                    <EnergyPriceWidget />
                    <Next24hPriceWidget />
                </Box>
            </Box>

            {/* Toggle button — right-aligned slim bar */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: open ? 0.5 : 0 }}>
                <Tooltip title={open ? "Hide widgets" : "Show widgets"} placement="left">
                    <IconButton
                        size="small"
                        onClick={() => setOpen((o) => !o)}
                        sx={{
                            p: 0.3,
                            borderRadius: 1,
                            color: colors.textMuted,
                            bgcolor: "transparent",
                            border: `1px solid ${colors.border}`,
                            "& svg": { fontSize: 14 },
                            "&:hover": { color: colors.textSecondary, bgcolor: colors.bgSurface },
                        }}
                    >
                        {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default TopWidgetsRow;
