import { useState } from 'react';
import { Box } from '@mui/material';
import ToolbarComponent from './ToolbarComponent';
import TopWidgetsRow from '@features/topRow/widgets/TopWidgetsRow';
import AnalyticsPage from '@features/analytics/AnalyticsPage';
import SettingsPage from '@features/settings/SettingsPage';
import HelpPageComponent from './HelpPagecomponent';
import { useSimulationHistory } from '@features/analytics/useSimulationHistory';
import { useColors } from '@theme/useTheme';
import type { SimulationRun } from '@features/analytics/analyticsTypes';
import { DEFAULT_HISTORY_YEARS, type HistoryYears } from '@services/ui/ChartUIService';
import SimulationComponent from '@features/simulationSection/simulation/SimulationComponent';
import type { ReplayParams } from '@services/types';

interface MainContentProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ activePage, onPageChange }) => {
  const colors = useColors();
  const { runs, saveRun, deleteRun } = useSimulationHistory();
  const [replayParams, setReplayParams] = useState<ReplayParams | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = (run: SimulationRun) => {
    setReplayParams({
      startDay: new Date(run.params.startDay),
      range: run.params.range,
      storageLevel: run.params.storageLevel,
      historyYears: (run.params.historyYears ?? DEFAULT_HISTORY_YEARS) as HistoryYears,
    });
    setReplayKey((k) => k + 1); // force SimulationComponent to remount with new initial values
    onPageChange('overview');
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: colors.bgBase,
        overflow: activePage === 'analysis' ? 'hidden' : 'auto',
        minHeight: 0,
        color: colors.textPrimary,
      }}
    >
      <ToolbarComponent />
      {activePage === 'analysis' ? (
        <AnalyticsPage runs={runs} onDelete={deleteRun} onReplay={handleReplay} />
      ) : activePage === 'settings' ? (
        <SettingsPage />
      ) : activePage === 'help' ? (
        <HelpPageComponent />
      ) : (
        <>
          <TopWidgetsRow />
          <SimulationComponent
            key={replayKey}
            initialParams={replayParams ?? undefined}
            onRunComplete={(run: SimulationRun) => saveRun(run)}
          />
        </>
      )}
    </Box>
  );
};

export default MainContent;
