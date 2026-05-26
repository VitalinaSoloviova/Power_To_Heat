import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useColors } from '@theme/useTheme';

const HelpPageComponent = () => {
	const colors = useColors();
	return (
		<Box sx={{ p: 4, color: colors.textPrimary, bgcolor: colors.bgBase, minHeight: '100vh' }}>
			<Typography variant="h4" gutterBottom>
				Help & Guide
			</Typography>
			<Typography variant="body1" gutterBottom>
				Welcome to the help page! Here you will find information on how to use the application:
			</Typography>
			<List>
				<ListItem>
					<ListItemText primary="Start Simulation: Select your desired parameters and click 'Start Simulation'." />
				</ListItem>
				<ListItem>
					<ListItemText primary="Analysis: Switch to the analysis page to compare simulation results." />
				</ListItem>
				<ListItem>
					<ListItemText primary="Settings: Adjust the application to your preferences." />
				</ListItem>
				<ListItem>
					<ListItemText primary="Further help: Contact support or read the documentation for more information." />
				</ListItem>
			</List>
		</Box>
	);
};

export default HelpPageComponent;
