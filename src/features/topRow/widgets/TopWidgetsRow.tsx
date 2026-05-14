import { Box } from "@mui/material";
import EnergyPriceWidget from "./EnergyPriceWidget";
import LocationWidget from "./LocationWidget";
import Next24hPriceWidget from "./Next24hPriceWidget";
import WeatherWidget from "./WeatherWidget";

const TopWidgetsRow: React.FC = () => {
    return (
        <Box sx={{ display: "flex", gap: 2, px: 3, mb: 2 }}>
            <LocationWidget />
            <WeatherWidget />
            <EnergyPriceWidget />
            <Next24hPriceWidget /> 
        </Box>
    );
};

export default TopWidgetsRow;