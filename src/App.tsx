import React from 'react';
import { SimulationProvider, useSimulation } from './store/simulationStore';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { ScenarioLabPage } from './pages/ScenarioLabPage';
import { RecoveryPlansPage } from './pages/RecoveryPlansPage';
import { HistoryPage } from './pages/HistoryPage';
import { ModelAssumptionsPage } from './pages/ModelAssumptionsPage';
import { DigitalTwin3DPage } from './pages/DigitalTwin3DPage';
import { SpaceXHomePage } from './pages/SpaceXHomePage';

const PageRenderer: React.FC = () => {
  const { state } = useSimulation();

  switch (state.currentPage) {
    case 'overview':
      return <OverviewPage />;
    case 'digital-twin-3d':
      return <DigitalTwin3DPage />;
    case 'scenario-lab':
      return <ScenarioLabPage />;
    case 'recovery-plans':
      return <RecoveryPlansPage />;
    case 'history':
      return <HistoryPage />;
    case 'model-assumptions':
      return <ModelAssumptionsPage />;
    case 'spacex-portal':
      return <SpaceXHomePage />;
    default:
      return <OverviewPage />;
  }
};

const MainApp: React.FC = () => {
  const { state } = useSimulation();

  // Full-bleed standalone aerospace landing page
  if (state.currentPage === 'spacex-portal') {
    return <SpaceXHomePage />;
  }

  return (
    <AppShell>
      <PageRenderer />
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <MainApp />
    </SimulationProvider>
  );
};

export default App;
