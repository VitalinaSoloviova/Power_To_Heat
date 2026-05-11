import { Box } from "@mui/material";
import LocationWidget from "./LocationWidget";
import WeatherWidget from "./WeatherWidget";
import EnergyPriceWidget from "./EnergyPriceWidget";
import Next24hPriceWidget from "./Next24hPriceWidget";   // ← Keep this

/** Top dashboard row: 4 horizontally aligned widgets. */
const TopWidgetsRow: React.FC = () => {
    return (
        <Box sx={{ display: "flex", gap: 2, px: 3, mb: 2 }}>
            <LocationWidget />
            <WeatherWidget />
            <EnergyPriceWidget />
            <Next24hPriceWidget />        {/* ← Replaced the placeholder */}
        </Box>
    );
};

export default TopWidgetsRow;