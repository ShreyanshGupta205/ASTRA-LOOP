import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  AlertEvent,
  ForecastPoint,
  HabitatState,
  NavPage,
  RecoveryPlan,
  ScenarioDefinition,
  ScenarioId,
  SimulationResult,
  SimulationRun,
} from '../types/habitat';
import { HABITAT_THRESHOLDS, INITIAL_HABITAT_STATE, INITIAL_LOADS } from '../data/initialState';
import { SCENARIO_DEFINITIONS } from '../scenarios/scenarioDefinitions';
import {
  triggerScenario,
  applyRecoveryPlan,
  generateResourceForecast,
  computeHabitatStatus,
} from '../engine/simulation';
import { soundEngine } from '../utils/audio';

const HISTORY_STORAGE_KEY = 'astraloop_sim_history_v1';

export interface SimulationStoreState {
  habitat: HabitatState;
  activeScenario: ScenarioDefinition | null;
  activeScenarioInputs: Record<string, number>;
  simulationResult: SimulationResult | null;
  selectedPlanForPreview: RecoveryPlan | null;
  events: AlertEvent[];
  forecastPoints: ForecastPoint[];
  forecastResource: 'battery' | 'water' | 'oxygen';
  currentPage: NavPage;
  history: SimulationRun[];
  isComputing: boolean;
  // Dynamic Simulation Playback
  simTimeHours: number;      // Current simulation elapsed time in hours (0.0 to simMaxHours)
  isSimPlaying: boolean;     // Whether the simulation clock is actively running
  simSpeed: number;          // 1x, 10x, 60x
  simMaxHours: number;       // Maximum scrub range (default 16h for solar, 720h for water, 40h for oxygen)
  initialBatteryReserve: number;
  initialWaterReserve: number;
  initialOxygenReserve: number;
  planAppliedAtSimTime: number | null;
  planAppliedBatteryKWh: number | null;
  planAppliedWaterLitres: number | null;
  planAppliedO2Pct: number | null;
}

type SimulationAction =
  | { type: 'NAVIGATE'; payload: NavPage }
  | { type: 'TRIGGER_SCENARIO'; payload: { scenarioId: ScenarioId; customInputs?: Record<string, number> } }
  | { type: 'UPDATE_SCENARIO_INPUTS'; payload: Record<string, number> }
  | { type: 'PREVIEW_PLAN'; payload: RecoveryPlan | null }
  | { type: 'APPLY_PLAN'; payload: RecoveryPlan }
  | { type: 'RESTORE_FAULTED_BASELINE' }
  | { type: 'RESET_SIMULATION' }
  | { type: 'SET_FORECAST_RESOURCE'; payload: 'battery' | 'water' | 'oxygen' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'ADD_EVENT'; payload: AlertEvent }
  | { type: 'SET_COMPUTING'; payload: boolean }
  | { type: 'SET_SIM_PLAYING'; payload: boolean }
  | { type: 'SET_SIM_SPEED'; payload: number }
  | { type: 'TICK_SIMULATION'; payload: number }  // delta hours
  | { type: 'SCRUB_SIM_TIME'; payload: number };   // target hour

function getInitialHistory(): SimulationRun[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse simulation history:', err);
  }
  return [];
}

const INITIAL_EVENT: AlertEvent = {
  id: 'evt-init',
  timestamp: Date.now(),
  formattedTime: new Date().toLocaleTimeString(),
  type: 'info',
  source: 'AVIONICS EXEC',
  message: 'DEMO-01 Habitat initialized in nominal steady state equilibrium.',
};

const initialForecast = generateResourceForecast('battery', INITIAL_HABITAT_STATE, null);

const initialState: SimulationStoreState = {
  habitat: INITIAL_HABITAT_STATE,
  activeScenario: null,
  activeScenarioInputs: {},
  simulationResult: null,
  selectedPlanForPreview: null,
  events: [INITIAL_EVENT],
  forecastPoints: initialForecast,
  forecastResource: 'battery',
  currentPage: 'spacex-portal',
  history: getInitialHistory(),
  isComputing: false,
  simTimeHours: 0,
  isSimPlaying: false,
  simSpeed: 1,
  simMaxHours: 16,
  initialBatteryReserve: 38,
  initialWaterReserve: 640,
  initialOxygenReserve: 82,
  planAppliedAtSimTime: null,
  planAppliedBatteryKWh: null,
  planAppliedWaterLitres: null,
  planAppliedO2Pct: null,
};

function recalculateDynamicStateAtTime(
  state: SimulationStoreState,
  targetTimeHours: number
): HabitatState {
  const t = Math.max(0, Math.min(state.simMaxHours, targetTimeHours));
  let batteryKWh = state.initialBatteryReserve;
  let waterLitres = state.initialWaterReserve;
  let oxygenIndicatorPct = state.initialOxygenReserve;

  const currentDrain = state.habitat.netDrainKW;
  const currentWaterLoss = state.habitat.waterLossRateLPD;
  const currentO2Decline = state.habitat.oxygenDeclineRatePctPerHour;

  if (state.activeScenario?.id === 'solar-drop') {
    const floor = HABITAT_THRESHOLDS.batteryFloorKWh; // 18.0 kWh
    const faultedDrainRate = Math.max(
      0,
      (state.activeScenarioInputs['powerDemandKW'] ?? 8.0) - (state.activeScenarioInputs['solarOutputKW'] ?? 3.0)
    );

    if (state.planAppliedAtSimTime !== null && state.planAppliedBatteryKWh !== null) {
      if (t <= state.planAppliedAtSimTime) {
        const calculated = state.initialBatteryReserve - (faultedDrainRate * t);
        batteryKWh = Math.max(floor, Math.round(calculated * 10) / 10);
      } else {
        const timeSincePlan = t - state.planAppliedAtSimTime;
        const calculated = state.planAppliedBatteryKWh - (currentDrain * timeSincePlan);
        batteryKWh = Math.max(floor, Math.round(calculated * 10) / 10);
      }
    } else {
      const calculated = state.initialBatteryReserve - (faultedDrainRate * t);
      batteryKWh = Math.max(floor, Math.round(calculated * 10) / 10);
    }
  } else if (state.activeScenario?.id === 'water-recovery-fault') {
    const floor = HABITAT_THRESHOLDS.waterFloorLitres; // 340 L
    const faultedLossRate = state.activeScenarioInputs['netWaterLossLPD'] ?? 25;

    if (state.planAppliedAtSimTime !== null && state.planAppliedWaterLitres !== null) {
      if (t <= state.planAppliedAtSimTime) {
        const calculated = state.initialWaterReserve - (faultedLossRate * (t / 24));
        waterLitres = Math.max(floor, Math.round(calculated * 10) / 10);
      } else {
        const timeSincePlanDays = (t - state.planAppliedAtSimTime) / 24;
        const calculated = state.planAppliedWaterLitres - (currentWaterLoss * timeSincePlanDays);
        waterLitres = Math.max(floor, Math.round(calculated * 10) / 10);
      }
    } else {
      const calculated = state.initialWaterReserve - (faultedLossRate * (t / 24));
      waterLitres = Math.max(floor, Math.round(calculated * 10) / 10);
    }
  } else if (state.activeScenario?.id === 'air-filter-fault') {
    const floor = HABITAT_THRESHOLDS.oxygenThresholdPct; // 42%
    const faultedDeclineRate = state.activeScenarioInputs['declineRatePctPerHour'] ?? 1.6;

    if (state.planAppliedAtSimTime !== null && state.planAppliedO2Pct !== null) {
      if (t <= state.planAppliedAtSimTime) {
        const calculated = state.initialOxygenReserve - (faultedDeclineRate * t);
        oxygenIndicatorPct = Math.max(floor, Math.round(calculated * 10) / 10);
      } else {
        const timeSincePlanHours = t - state.planAppliedAtSimTime;
        const calculated = state.planAppliedO2Pct - (currentO2Decline * timeSincePlanHours);
        oxygenIndicatorPct = Math.max(floor, Math.round(calculated * 10) / 10);
      }
    } else {
      const calculated = state.initialOxygenReserve - (faultedDeclineRate * t);
      oxygenIndicatorPct = Math.max(floor, Math.round(calculated * 10) / 10);
    }
  }

  const updatedState: HabitatState = {
    ...state.habitat,
    batteryKWh,
    waterLitres,
    oxygenIndicatorPct,
  };

  updatedState.status = computeHabitatStatus(updatedState);
  return updatedState;
}

function simulationReducer(
  state: SimulationStoreState,
  action: SimulationAction
): SimulationStoreState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentPage: action.payload };

    case 'SET_COMPUTING':
      return { ...state, isComputing: action.payload };

    case 'UPDATE_SCENARIO_INPUTS':
      return {
        ...state,
        activeScenarioInputs: {
          ...state.activeScenarioInputs,
          ...action.payload,
        },
      };

    case 'TRIGGER_SCENARIO': {
      const scenario = SCENARIO_DEFINITIONS[action.payload.scenarioId];
      if (!scenario) return state;

      const mergedInputs = {
        ...(scenario.defaultInputs as unknown as Record<string, number>),
        ...action.payload.customInputs,
      };

      const { faultedState, simulationResult, event } = triggerScenario(
        action.payload.scenarioId,
        mergedInputs
      );

      const targetResource = scenario.primaryResource === 'solar' ? 'battery' : (scenario.primaryResource as 'battery' | 'water' | 'oxygen');
      const forecastPoints = generateResourceForecast(targetResource, faultedState, null);
      const topPlan = simulationResult.planOutcomes.find((p) => p.isRecommended)?.plan || null;

      // Adjust max hours for timeline scrubber based on scenario domain
      const maxHours = scenario.id === 'solar-drop' ? 16 : (scenario.id === 'water-recovery-fault' ? 720 : 40);

      const initBatt = mergedInputs['batteryReserveKWh'] ?? 38;
      const initWater = mergedInputs['waterReserveLitres'] ?? 640;
      const initO2 = mergedInputs['startingIndicatorPct'] ?? 82;

      return {
        ...state,
        habitat: faultedState,
        activeScenario: scenario,
        activeScenarioInputs: mergedInputs,
        simulationResult,
        selectedPlanForPreview: topPlan,
        events: [event, ...state.events],
        forecastPoints,
        forecastResource: targetResource,
        isComputing: false,
        simTimeHours: 0,
        isSimPlaying: false,
        simMaxHours: maxHours,
        initialBatteryReserve: initBatt,
        initialWaterReserve: initWater,
        initialOxygenReserve: initO2,
        planAppliedAtSimTime: null,
        planAppliedBatteryKWh: null,
        planAppliedWaterLitres: null,
        planAppliedO2Pct: null,
      };
    }

    case 'PREVIEW_PLAN': {
      if (!state.activeScenario) return state;
      const forecastPoints = generateResourceForecast(
        state.forecastResource,
        state.habitat,
        action.payload
      );
      return {
        ...state,
        selectedPlanForPreview: action.payload,
        forecastPoints,
      };
    }

    case 'APPLY_PLAN': {
      if (!state.activeScenario) return state;

      const { updatedState, updatedSimulationResult, event } = applyRecoveryPlan(
        state.habitat,
        state.activeScenario,
        action.payload
      );

      const targetResource = state.activeScenario.primaryResource === 'solar' ? 'battery' : (state.activeScenario.primaryResource as 'battery' | 'water' | 'oxygen');
      const forecastPoints = generateResourceForecast(
        targetResource,
        updatedState,
        action.payload
      );

      // Record this run to history
      const prevRunway = state.simulationResult?.faultedRunway ?? 0;
      const appliedOutcome = updatedSimulationResult.planOutcomes.find(
        (p) => p.plan.id === action.payload.id
      );
      const postRunway = appliedOutcome?.predictedRunway ?? 0;

      const newRun: SimulationRun = {
        id: `run-${Date.now()}`,
        timestamp: Date.now(),
        formattedTime: new Date().toLocaleTimeString(),
        scenarioId: state.activeScenario.id,
        scenarioName: state.activeScenario.name,
        inputs: { ...state.activeScenarioInputs },
        faultedRunway: prevRunway,
        runwayUnit: state.activeScenario.runwayUnit,
        appliedPlanId: action.payload.id,
        appliedPlanName: action.payload.name,
        postRecoveryRunway: postRunway,
        runwayDelta: Math.round((postRunway - prevRunway) * 100) / 100,
        warnings: [state.simulationResult?.warningMessage || '', updatedSimulationResult.warningMessage],
      };

      const updatedHistory = [newRun, ...state.history];
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }

      return {
        ...state,
        habitat: updatedState,
        simulationResult: updatedSimulationResult,
        selectedPlanForPreview: action.payload,
        events: [event, ...state.events],
        forecastPoints,
        forecastResource: targetResource,
        history: updatedHistory,
        simTimeHours: state.simTimeHours,
        planAppliedAtSimTime: state.simTimeHours,
        planAppliedBatteryKWh: state.habitat.batteryKWh,
        planAppliedWaterLitres: state.habitat.waterLitres,
        planAppliedO2Pct: state.habitat.oxygenIndicatorPct,
      };
    }

    case 'RESTORE_FAULTED_BASELINE': {
      if (!state.activeScenario) return state;
      const scenario = state.activeScenario;
      const mergedInputs = {
        ...(scenario.defaultInputs as unknown as Record<string, number>),
        ...state.activeScenarioInputs,
      };

      const { faultedState, simulationResult, event } = triggerScenario(
        scenario.id,
        mergedInputs
      );

      const restoreEvent: AlertEvent = {
        id: `evt-${Date.now()}-restore-fault`,
        timestamp: Date.now(),
        formattedTime: new Date().toLocaleTimeString(),
        type: 'warning',
        source: 'FAULT MANAGER',
        message: `Restored initial faulted baseline for ${scenario.name} at T+00:00 (Ready for plan comparison).`,
      };

      const targetResource = scenario.primaryResource === 'solar' ? 'battery' : (scenario.primaryResource as 'battery' | 'water' | 'oxygen');
      const forecastPoints = generateResourceForecast(targetResource, faultedState, null);
      const topPlan = simulationResult.planOutcomes.find((p) => p.isRecommended)?.plan || null;

      return {
        ...state,
        habitat: faultedState,
        simulationResult,
        selectedPlanForPreview: topPlan,
        events: [restoreEvent, ...state.events],
        forecastPoints,
        forecastResource: targetResource,
        simTimeHours: 0,
        isSimPlaying: false,
        initialBatteryReserve: mergedInputs['batteryReserveKWh'] ?? 38,
        initialWaterReserve: mergedInputs['waterReserveLitres'] ?? 640,
        initialOxygenReserve: mergedInputs['startingIndicatorPct'] ?? 82,
        planAppliedAtSimTime: null,
        planAppliedBatteryKWh: null,
        planAppliedWaterLitres: null,
        planAppliedO2Pct: null,
      };
    }

    case 'RESET_SIMULATION': {
      const resetEvent: AlertEvent = {
        id: `evt-${Date.now()}-reset`,
        timestamp: Date.now(),
        formattedTime: new Date().toLocaleTimeString(),
        type: 'info',
        source: 'AVIONICS EXEC',
        message: 'System reset dispatched. Baseline resource equilibrium restored (Solar 8.0 kW, Battery 38 kWh, Water 640 L, O2 82%).',
      };

      const forecastPoints = generateResourceForecast('battery', INITIAL_HABITAT_STATE, null);

      return {
        ...state,
        habitat: INITIAL_HABITAT_STATE,
        activeScenario: null,
        activeScenarioInputs: {},
        simulationResult: null,
        selectedPlanForPreview: null,
        events: [resetEvent, ...state.events],
        forecastPoints,
        forecastResource: 'battery',
        isComputing: false,
        simTimeHours: 0,
        isSimPlaying: false,
        simSpeed: 1,
        simMaxHours: 16,
        initialBatteryReserve: 38,
        initialWaterReserve: 640,
        initialOxygenReserve: 82,
        planAppliedAtSimTime: null,
        planAppliedBatteryKWh: null,
        planAppliedWaterLitres: null,
        planAppliedO2Pct: null,
      };
    }

    case 'SET_FORECAST_RESOURCE': {
      const forecastPoints = generateResourceForecast(
        action.payload,
        state.habitat,
        state.selectedPlanForPreview
      );
      return {
        ...state,
        forecastResource: action.payload,
        forecastPoints,
      };
    }

    case 'CLEAR_HISTORY': {
      try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
      return { ...state, history: [] };
    }

    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };

    // Dynamic Simulation Controls
    case 'SET_SIM_PLAYING':
      return { ...state, isSimPlaying: action.payload };

    case 'SET_SIM_SPEED':
      return { ...state, simSpeed: action.payload };

    case 'TICK_SIMULATION': {
      const newTime = Math.min(state.simMaxHours, state.simTimeHours + action.payload);
      const isStillPlaying = newTime < state.simMaxHours && state.isSimPlaying;

      const dynamicHabitat = recalculateDynamicStateAtTime(state, newTime);

      // Check if threshold breached during this tick
      let newEvents = state.events;
      if (
        state.habitat.batteryKWh > HABITAT_THRESHOLDS.batteryFloorKWh &&
        dynamicHabitat.batteryKWh <= HABITAT_THRESHOLDS.batteryFloorKWh
      ) {
        const breachEvent: AlertEvent = {
          id: `evt-breach-batt-${Date.now()}`,
          timestamp: Date.now(),
          formattedTime: new Date().toLocaleTimeString(),
          type: 'critical',
          source: 'BATT SENSOR',
          message: `CRITICAL THRESHOLD BREACH: Battery depleted to ${dynamicHabitat.batteryKWh} kWh safety floor at T+${newTime.toFixed(1)}h!`,
        };
        newEvents = [breachEvent, ...newEvents];
      }
      if (
        state.habitat.waterLitres > HABITAT_THRESHOLDS.waterFloorLitres &&
        dynamicHabitat.waterLitres <= HABITAT_THRESHOLDS.waterFloorLitres
      ) {
        const breachEvent: AlertEvent = {
          id: `evt-breach-water-${Date.now()}`,
          timestamp: Date.now(),
          formattedTime: new Date().toLocaleTimeString(),
          type: 'critical',
          source: 'WRS SENSOR',
          message: `CRITICAL THRESHOLD BREACH: Water reserve depleted to ${dynamicHabitat.waterLitres} L safety floor at T+${newTime.toFixed(1)}h!`,
        };
        newEvents = [breachEvent, ...newEvents];
      }
      if (
        state.habitat.oxygenIndicatorPct > HABITAT_THRESHOLDS.oxygenThresholdPct &&
        dynamicHabitat.oxygenIndicatorPct <= HABITAT_THRESHOLDS.oxygenThresholdPct
      ) {
        const breachEvent: AlertEvent = {
          id: `evt-breach-o2-${Date.now()}`,
          timestamp: Date.now(),
          formattedTime: new Date().toLocaleTimeString(),
          type: 'critical',
          source: 'ECLSS SENSOR',
          message: `CRITICAL THRESHOLD BREACH: Air-filter indicator dropped to ${dynamicHabitat.oxygenIndicatorPct.toFixed(1)}% safety floor at T+${newTime.toFixed(1)}h!`,
        };
        newEvents = [breachEvent, ...newEvents];
      }

      return {
        ...state,
        simTimeHours: Math.round(newTime * 100) / 100,
        isSimPlaying: isStillPlaying,
        habitat: dynamicHabitat,
        events: newEvents,
      };
    }

    case 'SCRUB_SIM_TIME': {
      const targetTime = Math.max(0, Math.min(state.simMaxHours, action.payload));
      const dynamicHabitat = recalculateDynamicStateAtTime(state, targetTime);

      return {
        ...state,
        simTimeHours: Math.round(targetTime * 100) / 100,
        habitat: dynamicHabitat,
      };
    }

    default:
      return state;
  }
}

const SimulationContext = createContext<{
  state: SimulationStoreState;
  dispatch: React.Dispatch<SimulationAction>;
  triggerScenarioWithFeedback: (scenarioId: ScenarioId, customInputs?: Record<string, number>) => void;
  applyPlanWithFeedback: (plan: RecoveryPlan) => void;
  restoreFaultedState: () => void;
  resetSimulation: () => void;
  navigate: (page: NavPage) => void;
  setForecastResource: (resource: 'battery' | 'water' | 'oxygen') => void;
  clearHistory: () => void;
  // Simulation Player controls
  setSimPlaying: (playing: boolean) => void;
  setSimSpeed: (speed: number) => void;
  scrubSimTime: (timeHours: number) => void;
  stepSimForward: (deltaHours: number) => void;
} | null>(null);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  // Active Simulation Loop Timer with exact physical pacing:
  // At 1x speed: 1 simulated minute per real second (1/60 hr/sec)
  // At 10x speed: 10 simulated minutes per real second (10/60 hr/sec)
  // At 60x speed: 60 simulated minutes per real second (1.0 hr/sec)
  useEffect(() => {
    if (!state.isSimPlaying) return;

    let lastRealTime = performance.now();
    let animId: number;

    const tick = () => {
      const now = performance.now();
      const deltaRealSeconds = (now - lastRealTime) / 1000;

      // Tick smoothly every ~50ms
      if (deltaRealSeconds >= 0.05) {
        lastRealTime = now;
        const deltaHours = (deltaRealSeconds * state.simSpeed) / 60;
        dispatch({ type: 'TICK_SIMULATION', payload: deltaHours });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [state.isSimPlaying, state.simSpeed]);

  const navigate = (page: NavPage) => {
    soundEngine.playClick();
    dispatch({ type: 'NAVIGATE', payload: page });
  };

  const triggerScenarioWithFeedback = (
    scenarioId: ScenarioId,
    customInputs?: Record<string, number>
  ) => {
    soundEngine.playAlarm();
    dispatch({ type: 'SET_COMPUTING', payload: true });
    setTimeout(() => {
      dispatch({
        type: 'TRIGGER_SCENARIO',
        payload: { scenarioId, customInputs },
      });
    }, 180);
  };

  const applyPlanWithFeedback = (plan: RecoveryPlan) => {
    soundEngine.playDeploySuccess();
    dispatch({ type: 'APPLY_PLAN', payload: plan });
  };

  const restoreFaultedState = () => {
    soundEngine.playChirp();
    dispatch({ type: 'RESTORE_FAULTED_BASELINE' });
  };

  const resetSimulation = () => {
    soundEngine.playChirp();
    dispatch({ type: 'RESET_SIMULATION' });
  };

  const setForecastResource = (resource: 'battery' | 'water' | 'oxygen') => {
    dispatch({ type: 'SET_FORECAST_RESOURCE', payload: resource });
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  const setSimPlaying = (playing: boolean) => {
    dispatch({ type: 'SET_SIM_PLAYING', payload: playing });
  };

  const setSimSpeed = (speed: number) => {
    dispatch({ type: 'SET_SIM_SPEED', payload: speed });
  };

  const scrubSimTime = (timeHours: number) => {
    dispatch({ type: 'SCRUB_SIM_TIME', payload: timeHours });
  };

  const stepSimForward = (deltaHours: number) => {
    dispatch({ type: 'TICK_SIMULATION', payload: deltaHours });
  };

  return (
    <SimulationContext.Provider
      value={{
        state,
        dispatch,
        triggerScenarioWithFeedback,
        applyPlanWithFeedback,
        restoreFaultedState,
        resetSimulation,
        navigate,
        setForecastResource,
        clearHistory,
        setSimPlaying,
        setSimSpeed,
        scrubSimTime,
        stepSimForward,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return ctx;
}
