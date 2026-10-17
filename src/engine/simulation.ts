import {
  AlertEvent,
  ForecastPoint,
  HabitatState,
  HabitatStatus,
  RecoveryPlan,
  ScenarioDefinition,
  ScenarioId,
  SimulationResult,
} from '../types/habitat';
import { HABITAT_THRESHOLDS, INITIAL_HABITAT_STATE, INITIAL_LOADS } from '../data/initialState';
import { SCENARIO_DEFINITIONS } from '../scenarios/scenarioDefinitions';
import {
  calculateBatteryRunway,
  calculateWaterRunway,
  calculateOxygenRunway,
} from './runway';
import { evaluateRecoveryPlans } from './recommendations';

/**
 * Computes habitat status based on active faults, thresholds, and net drains.
 */
export function computeHabitatStatus(state: HabitatState): HabitatStatus {
  if (!state.isFaultActive) {
    return 'STABLE';
  }

  // Critical conditions
  if (
    state.batteryKWh <= HABITAT_THRESHOLDS.batteryFloorKWh ||
    state.waterLitres <= HABITAT_THRESHOLDS.waterFloorLitres ||
    state.oxygenIndicatorPct <= HABITAT_THRESHOLDS.oxygenThresholdPct
  ) {
    return 'CRITICAL';
  }

  // Active high-rate drain without mitigation
  if (state.activeScenarioId === 'solar-drop' && state.netDrainKW >= 3.0 && !state.appliedPlanId) {
    return 'CRITICAL';
  }

  if (state.activeScenarioId === 'air-filter-fault' && !state.appliedPlanId) {
    return 'CRITICAL';
  }

  return 'WARNING';
}

/**
 * Executes the fault trigger for a selected scenario with specified inputs.
 */
export function triggerScenario(
  scenarioId: ScenarioId,
  customInputs?: Record<string, number>
): {
  faultedState: HabitatState;
  simulationResult: SimulationResult;
  event: AlertEvent;
} {
  const scenario = SCENARIO_DEFINITIONS[scenarioId];
  if (!scenario) {
    throw new Error(`Unknown scenario ID: ${scenarioId}`);
  }

  // Clone initial baseline loads
  const loads = INITIAL_LOADS.map((load) => ({ ...load }));

  let solarOutputKW = INITIAL_HABITAT_STATE.solarOutputKW;
  let powerDemandKW = INITIAL_HABITAT_STATE.powerDemandKW;
  let batteryKWh = INITIAL_HABITAT_STATE.batteryKWh;
  let waterLitres = INITIAL_HABITAT_STATE.waterLitres;
  let waterLossRateLPD = 0;
  let oxygenIndicatorPct = INITIAL_HABITAT_STATE.oxygenIndicatorPct;
  let oxygenDeclineRatePctPerHour = 0;

  let faultedRunway = 0;
  let warningMessage = '';

  if (scenarioId === 'solar-drop') {
    solarOutputKW = customInputs?.solarOutputKW ?? 3.0;
    powerDemandKW = customInputs?.powerDemandKW ?? 8.0;
    batteryKWh = customInputs?.batteryReserveKWh ?? 38.0;

    const runwayRes = calculateBatteryRunway(batteryKWh, solarOutputKW, powerDemandKW);
    faultedRunway = runwayRes.runway ?? 0;
    warningMessage = `Solar generation dropped from 8.0 kW to ${solarOutputKW.toFixed(1)} kW. Net battery draw is ${(powerDemandKW - solarOutputKW).toFixed(1)} kW. Depletion runway: ${faultedRunway.toFixed(1)} hours.`;
  } else if (scenarioId === 'water-recovery-fault') {
    waterLitres = customInputs?.waterReserveLitres ?? 640;
    waterLossRateLPD = customInputs?.netWaterLossLPD ?? 25;

    const runwayRes = calculateWaterRunway(waterLitres, waterLossRateLPD);
    faultedRunway = runwayRes.runway ?? 0;
    warningMessage = `Water recovery pump malfunction. Net uncompensated reserve loss is ${waterLossRateLPD} L/day. Potable runway: ${faultedRunway.toFixed(1)} days.`;
  } else if (scenarioId === 'air-filter-fault') {
    oxygenIndicatorPct = customInputs?.startingIndicatorPct ?? 82;
    oxygenDeclineRatePctPerHour = customInputs?.declineRatePctPerHour ?? 1.6;

    const runwayRes = calculateOxygenRunway(oxygenIndicatorPct, oxygenDeclineRatePctPerHour);
    faultedRunway = runwayRes.runway ?? 0;
    warningMessage = `Trace contaminant scrubber bed saturated. Oxygen reserve indicator declining at ${oxygenDeclineRatePctPerHour.toFixed(1)} %/hr. Threshold runway: ${faultedRunway.toFixed(1)} hours.`;
  }

  const netPowerKW = solarOutputKW - powerDemandKW;
  const netDrainKW = Math.max(0, powerDemandKW - solarOutputKW);

  const faultedState: HabitatState = {
    batteryKWh,
    solarOutputKW,
    powerDemandKW,
    netPowerKW,
    netDrainKW,
    waterLitres,
    waterLossRateLPD,
    oxygenIndicatorPct,
    oxygenDeclineRatePctPerHour,
    loads,
    status: 'CRITICAL',
    activeScenarioId: scenarioId,
    appliedPlanId: null,
    isFaultActive: true,
    timestamp: Date.now(),
  };

  // Evaluate all recovery plans
  const planOutcomes = evaluateRecoveryPlans(scenario, {
    scenarioId,
    faultedRunway,
    solarOutputKW,
    powerDemandKW,
    batteryKWh,
    waterLitres,
    netWaterLossLPD: waterLossRateLPD,
    oxygenIndicatorPct,
    declineRatePctPerHour: oxygenDeclineRatePctPerHour,
  });

  const recommendedPlan = planOutcomes.find((p) => p.isRecommended) || planOutcomes[0];

  const simulationResult: SimulationResult = {
    scenarioId,
    faultedRunway,
    runwayUnit: scenario.runwayUnit,
    netDrainOrLoss: scenarioId === 'solar-drop' ? netDrainKW : (scenarioId === 'water-recovery-fault' ? waterLossRateLPD : oxygenDeclineRatePctPerHour),
    affectedSystems: [...scenario.dependentSystems],
    warningMessage,
    recommendedPlanId: recommendedPlan?.plan.id ?? '',
    planOutcomes,
  };

  const event: AlertEvent = {
    id: `evt-${Date.now()}-fault`,
    timestamp: Date.now(),
    formattedTime: new Date().toLocaleTimeString(),
    type: 'critical',
    source: scenario.affectedSubsystem,
    message: warningMessage,
  };

  return { faultedState, simulationResult, event };
}

/**
 * Applies a selected recovery plan to the habitat state (idempotently).
 */
export function applyRecoveryPlan(
  currentState: HabitatState,
  scenario: ScenarioDefinition,
  plan: RecoveryPlan
): {
  updatedState: HabitatState;
  updatedSimulationResult: SimulationResult;
  event: AlertEvent;
} {
  // If already applied this exact plan, return current state
  if (currentState.appliedPlanId === plan.id) {
    const existingOutcomes = evaluateRecoveryPlans(scenario, {
      scenarioId: scenario.id,
      faultedRunway: 4.0, // fallback
      solarOutputKW: currentState.solarOutputKW,
      powerDemandKW: currentState.powerDemandKW,
      batteryKWh: currentState.batteryKWh,
      waterLitres: currentState.waterLitres,
      netWaterLossLPD: currentState.waterLossRateLPD,
      oxygenIndicatorPct: currentState.oxygenIndicatorPct,
      declineRatePctPerHour: currentState.oxygenDeclineRatePctPerHour,
    });
    return {
      updatedState: currentState,
      updatedSimulationResult: {
        scenarioId: scenario.id,
        faultedRunway: 4.0,
        runwayUnit: scenario.runwayUnit,
        netDrainOrLoss: currentState.netDrainKW,
        affectedSystems: scenario.dependentSystems,
        warningMessage: 'Plan already active.',
        recommendedPlanId: plan.id,
        planOutcomes: existingOutcomes,
      },
      event: {
        id: `evt-${Date.now()}-no-op`,
        timestamp: Date.now(),
        formattedTime: new Date().toLocaleTimeString(),
        type: 'info',
        source: 'Recovery Executive',
        message: `${plan.name} is already deployed.`,
      },
    };
  }

  // Clone loads
  const loads = INITIAL_LOADS.map((load) => ({ ...load }));

  let baseDemandKW = currentState.powerDemandKW;
  let baseWaterLoss = currentState.waterLossRateLPD;
  let baseO2Decline = currentState.oxygenDeclineRatePctPerHour;

  if (currentState.appliedPlanId) {
    const prevPlan = scenario.recoveryPlans.find((p) => p.id === currentState.appliedPlanId);
    if (prevPlan?.powerReductionKW) {
      baseDemandKW += prevPlan.powerReductionKW;
    }
    if (prevPlan?.waterLossReductionLPD) {
      baseWaterLoss += prevPlan.waterLossReductionLPD;
    }
    if (prevPlan?.oxygenDeclineReductionPctPerHour) {
      baseO2Decline += prevPlan.oxygenDeclineReductionPctPerHour;
    }
  }

  let newSolarKW = currentState.solarOutputKW;
  let newDemandKW = baseDemandKW;
  let newWaterLPD = baseWaterLoss || 25;
  let newO2Decline = baseO2Decline || 1.6;

  if (scenario.id === 'solar-drop') {
    const reduction = plan.powerReductionKW ?? 0;
    newDemandKW = Math.max(0, baseDemandKW - reduction);

    // Update individual loads status
    if (plan.id === 'plan-a') {
      // Shed labs (1.5) & experiments (1.5)
      loads.find((l) => l.id === 'labs-lighting')!.status = 'offline';
      loads.find((l) => l.id === 'labs-lighting')!.currentKW = 0;
      loads.find((l) => l.id === 'experiments')!.status = 'offline';
      loads.find((l) => l.id === 'experiments')!.currentKW = 0;
    } else if (plan.id === 'plan-b') {
      // Delay experiments (1.5)
      loads.find((l) => l.id === 'experiments')!.status = 'offline';
      loads.find((l) => l.id === 'experiments')!.currentKW = 0;
    } else if (plan.id === 'plan-c') {
      // Shed labs (1.5) & experiments (1.5) & throttle water rec (1.0 -> 0.5)
      loads.find((l) => l.id === 'labs-lighting')!.status = 'offline';
      loads.find((l) => l.id === 'labs-lighting')!.currentKW = 0;
      loads.find((l) => l.id === 'experiments')!.status = 'offline';
      loads.find((l) => l.id === 'experiments')!.currentKW = 0;
      loads.find((l) => l.id === 'water-recovery')!.status = 'throttled';
      loads.find((l) => l.id === 'water-recovery')!.currentKW = 0.5;
    }
  } else if (scenario.id === 'water-recovery-fault') {
    const lossRed = plan.waterLossReductionLPD ?? 0;
    newWaterLPD = Math.max(0, (baseWaterLoss || 25) - lossRed);
    loads.find((l) => l.id === 'water-recovery')!.status = 'throttled';
  } else if (scenario.id === 'air-filter-fault') {
    const declineRed = plan.oxygenDeclineReductionPctPerHour ?? 0;
    newO2Decline = Math.max(0, (baseO2Decline || 1.6) - declineRed);
    loads.find((l) => l.id === 'life-support')!.status = 'throttled';
  }

  const netPowerKW = newSolarKW - newDemandKW;
  const netDrainKW = Math.max(0, newDemandKW - newSolarKW);

  const updatedState: HabitatState = {
    ...currentState,
    solarOutputKW: newSolarKW,
    powerDemandKW: newDemandKW,
    netPowerKW,
    netDrainKW,
    waterLossRateLPD: newWaterLPD,
    oxygenDeclineRatePctPerHour: newO2Decline,
    loads,
    appliedPlanId: plan.id,
    status: 'WARNING', // Mitigated from critical to warning
    timestamp: Date.now(),
  };

  // Recalculate faulted baseline runway for comparison
  let faultedRunway = 0;
  if (scenario.id === 'solar-drop') {
    faultedRunway = calculateBatteryRunway(currentState.batteryKWh, currentState.solarOutputKW, baseDemandKW).runway ?? 0;
  } else if (scenario.id === 'water-recovery-fault') {
    faultedRunway = calculateWaterRunway(currentState.waterLitres, baseWaterLoss || 25).runway ?? 0;
  } else if (scenario.id === 'air-filter-fault') {
    faultedRunway = calculateOxygenRunway(currentState.oxygenIndicatorPct, baseO2Decline || 1.6).runway ?? 0;
  }

  const planOutcomes = evaluateRecoveryPlans(scenario, {
    scenarioId: scenario.id,
    faultedRunway,
    solarOutputKW: currentState.solarOutputKW,
    powerDemandKW: baseDemandKW,
    batteryKWh: currentState.batteryKWh,
    waterLitres: currentState.waterLitres,
    netWaterLossLPD: baseWaterLoss || 25,
    oxygenIndicatorPct: currentState.oxygenIndicatorPct,
    declineRatePctPerHour: baseO2Decline || 1.6,
  });

  const activePlanOutcome = planOutcomes.find((p) => p.plan.id === plan.id);

  const updatedSimulationResult: SimulationResult = {
    scenarioId: scenario.id,
    faultedRunway,
    runwayUnit: scenario.runwayUnit,
    netDrainOrLoss: scenario.id === 'solar-drop' ? netDrainKW : (scenario.id === 'water-recovery-fault' ? newWaterLPD : newO2Decline),
    affectedSystems: scenario.dependentSystems,
    warningMessage: `Recovery Plan "${plan.name}" successfully deployed. Runway extended to ${activePlanOutcome?.predictedRunway.toFixed(1)} ${scenario.runwayUnit}.`,
    recommendedPlanId: plan.id,
    planOutcomes,
  };

  const event: AlertEvent = {
    id: `evt-${Date.now()}-plan-applied`,
    timestamp: Date.now(),
    formattedTime: new Date().toLocaleTimeString(),
    type: 'success',
    source: 'Recovery Executive',
    message: `Applied ${plan.name}: ${plan.tagline}. Estimated runway increased to ${activePlanOutcome?.predictedRunway.toFixed(1)} ${scenario.runwayUnit}.`,
  };

  return { updatedState, updatedSimulationResult, event };
}

/**
 * Generates high-fidelity time-stepped forecast projections for charts.
 */
export function generateResourceForecast(
  resource: 'battery' | 'water' | 'oxygen',
  state: HabitatState,
  appliedPlan: RecoveryPlan | null
): ForecastPoint[] {
  const points: ForecastPoint[] = [];

  if (resource === 'battery') {
    const threshold = HABITAT_THRESHOLDS.batteryFloorKWh; // 18
    const initialBattery = state.batteryKWh; // 38
    const currentReduction = state.appliedPlanId && appliedPlan?.id === state.appliedPlanId ? (appliedPlan.powerReductionKW ?? 0) : 0;
    const baseDemand = state.powerDemandKW + currentReduction;
    const faultedDrain = Math.max(0, baseDemand - state.solarOutputKW);
    
    let planDrain = faultedDrain;
    if (appliedPlan?.powerReductionKW) {
      planDrain = Math.max(0, (baseDemand - appliedPlan.powerReductionKW) - state.solarOutputKW);
    }

    // Project over 16 hours
    const maxHours = 16;
    for (let h = 0; h <= maxHours; h += 1) {
      const baselineVal = initialBattery; // constant
      const faultedVal = Math.max(0, initialBattery - (faultedDrain * h));
      
      const pt: ForecastPoint = {
        timeStep: h,
        timeLabel: `T+${h}h`,
        baselineValue: baselineVal,
        faultedValue: Math.round(faultedVal * 10) / 10,
        thresholdValue: threshold,
        isProjected: h > 0,
      };

      if (appliedPlan) {
        const recVal = Math.max(0, initialBattery - (planDrain * h));
        pt.recoveryValue = Math.round(recVal * 10) / 10;
      }

      points.push(pt);
    }
  } else if (resource === 'water') {
    const threshold = HABITAT_THRESHOLDS.waterFloorLitres; // 340
    const initialWater = state.waterLitres; // 640
    const currentWaterRed = state.appliedPlanId && appliedPlan?.id === state.appliedPlanId ? (appliedPlan.waterLossReductionLPD ?? 0) : 0;
    const baseLoss = (state.waterLossRateLPD > 0 ? state.waterLossRateLPD : 25) + currentWaterRed;

    let planLoss = baseLoss;
    if (appliedPlan?.waterLossReductionLPD) {
      planLoss = Math.max(0, baseLoss - appliedPlan.waterLossReductionLPD);
    }

    // Project over 30 days
    const maxDays = 30;
    for (let d = 0; d <= maxDays; d += 2) {
      const baselineVal = initialWater;
      const faultedVal = Math.max(0, initialWater - (baseLoss * d));

      const pt: ForecastPoint = {
        timeStep: d,
        timeLabel: `Day ${d}`,
        baselineValue: baselineVal,
        faultedValue: Math.round(faultedVal * 10) / 10,
        thresholdValue: threshold,
        isProjected: d > 0,
      };

      if (appliedPlan) {
        const recVal = Math.max(0, initialWater - (planLoss * d));
        pt.recoveryValue = Math.round(recVal * 10) / 10;
      }

      points.push(pt);
    }
  } else if (resource === 'oxygen') {
    const threshold = HABITAT_THRESHOLDS.oxygenThresholdPct; // 42
    const initialO2 = state.oxygenIndicatorPct; // 82
    const currentO2Red = state.appliedPlanId && appliedPlan?.id === state.appliedPlanId ? (appliedPlan.oxygenDeclineReductionPctPerHour ?? 0) : 0;
    const baseDecline = (state.oxygenDeclineRatePctPerHour > 0 ? state.oxygenDeclineRatePctPerHour : 1.6) + currentO2Red;

    let planDecline = baseDecline;
    if (appliedPlan?.oxygenDeclineReductionPctPerHour) {
      planDecline = Math.max(0, baseDecline - appliedPlan.oxygenDeclineReductionPctPerHour);
    }

    // Project over 40 hours
    const maxHours = 40;
    for (let h = 0; h <= maxHours; h += 2) {
      const baselineVal = initialO2;
      const faultedVal = Math.max(0, initialO2 - (baseDecline * h));

      const pt: ForecastPoint = {
        timeStep: h,
        timeLabel: `T+${h}h`,
        baselineValue: baselineVal,
        faultedValue: Math.round(faultedVal * 10) / 10,
        thresholdValue: threshold,
        isProjected: h > 0,
      };

      if (appliedPlan) {
        const recVal = Math.max(0, initialO2 - (planDecline * h));
        pt.recoveryValue = Math.round(recVal * 10) / 10;
      }

      points.push(pt);
    }
  }

  return points;
}
