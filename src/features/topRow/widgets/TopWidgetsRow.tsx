import { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowUpRounded, KeyboardArrowDownRounded } from "@mui/icons-material";
import EnergyPriceWidget from "./EnergyPriceWidget";
import LocationWidget from "./LocationWidget";
import Next24hPriceWidget from "./Next24hPriceWidget";
import WeatherWidget from "./WeatherWidget";
import { useColors } from "@theme/useTheme";
import { radii, duration, easing } from "@theme/tokens";

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
                    transition: `grid-template-rows ${duration.base} ${easing.standard}`,
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
                        transition: `opacity ${duration.fast}`,
                    }}
                >
                    <LocationWidget />
                    <WeatherWidget />
                    <EnergyPriceWidget />
                    <Next24hPriceWidget />
                </Box>
            </Box>
        </Box>
    );
};

export default TopWidgetsRow;
