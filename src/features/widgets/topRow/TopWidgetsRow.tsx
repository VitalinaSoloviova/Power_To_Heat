import { Box } from "@mui/material";
import LocationWidget from "./LocationWidget";
import WeatherWidget from "./WeatherWidget";
import EnergyPriceWidget from "./EnergyPriceWidget";
import PlaceholderWidget from "./PlaceholderWidget";

/** Top dashboard row: 4 horizontally aligned widgets. */
const TopWidgetsRow: React.FC = () => {
    return (
        <Box sx={{ display: "flex", gap: 2, px: 3, mb: 2 }}>
            <LocationWidget />
            <WeatherWidget />
            <EnergyPriceWidget />
            <PlaceholderWidget />
        </Box>
    );
};

export default TopWidgetsRow;
