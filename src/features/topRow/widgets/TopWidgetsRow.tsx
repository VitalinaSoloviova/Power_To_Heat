import { Box } from "@mui/material";
import EnergyPriceWidget from "./EnergyPriceWidget";
import LocationWidget from "./LocationWidget";
import Next24hPriceWidget from "./Next24hPriceWidget";
import WeatherWidget from "./WeatherWidget";

const TopWidgetsRow: React.FC = () => {
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, px: { xs: 2, md: 3 }, mb: 2, minWidth: 0,  "& > *": { maxHeight: 50 } }}>
            <LocationWidget />
            <WeatherWidget />
            <EnergyPriceWidget />
            <Next24hPriceWidget /> 
        </Box>
    );
};

export default TopWidgetsRow;