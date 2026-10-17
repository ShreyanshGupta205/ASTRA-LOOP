import { describe, it, expect } from 'vitest';
import { generateResourceForecast, triggerScenario, applyRecoveryPlan } from '../../src/engine/simulation';
import { calculateBatteryRunway, calculateWaterRunway, calculateOxygenRunway } from '../../src/engine/runway';
import { SCENARIO_DEFINITIONS } from '../../src/scenarios/scenarioDefinitions';

describe('Resource Forecast & Custom Parameter Edge Cases', () => {
  it('generateResourceForecast reflects custom power demand in battery forecast', () => {
    const { faultedState } = triggerScenario('solar-drop', {
      solarOutputKW: 3.0,
      powerDemandKW: 10.0,
      batteryReserveKWh: 38.0,
    });

    const forecast = generateResourceForecast('battery', faultedState, null);
    const pt1 = forecast.find((p) => p.timeStep === 1);
    expect(pt1).toBeDefined();
    // 38 - (10 - 3)*1 = 31.0
    expect(pt1?.faultedValue).toBe(31.0);
  });

  it('applyRecoveryPlan preserves custom initial power demand', () => {
    const { faultedState } = triggerScenario('solar-drop', {
      solarOutputKW: 3.0,
      powerDemandKW: 10.0,
      batteryReserveKWh: 38.0,
    });

    const scenario = SCENARIO_DEFINITIONS['solar-drop'];
    const planC = scenario.recoveryPlans.find((p) => p.id === 'plan-c')!;
    const { updatedState, updatedSimulationResult } = applyRecoveryPlan(faultedState, scenario, planC);

    // Initial demand was 10.0, Plan C reduces by 3.5 kW -> 6.5 kW
    expect(updatedState.powerDemandKW).toBe(6.5);
    expect(updatedState.netDrainKW).toBe(3.5); // 6.5 - 3.0
    // Usable battery is 20.0 kWh (38 - 18)
    // Faulted runway: 20 / 7 = ~2.86h
    expect(updatedSimulationResult.faultedRunway).toBeCloseTo(2.86, 2);
    // Mitigated runway: 20 / 3.5 = ~5.71h
    const outcomeC = updatedSimulationResult.planOutcomes.find((p) => p.plan.id === 'plan-c');
    expect(outcomeC?.predictedRunway).toBeCloseTo(5.71, 2);
  });

  it('applyRecoveryPlan preserves custom water loss rate', () => {
    const { faultedState } = triggerScenario('water-recovery-fault', {
      waterReserveLitres: 700,
      netWaterLossLPD: 30,
    });

    const scenario = SCENARIO_DEFINITIONS['water-recovery-fault'];
    const planWC = scenario.recoveryPlans.find((p) => p.id === 'plan-w-c')!; // cuts 20 L/day
    const { updatedState, updatedSimulationResult } = applyRecoveryPlan(faultedState, scenario, planWC);

    // 30 - 20 = 10 L/day
    expect(updatedState.waterLossRateLPD).toBe(10);
    // Usable water: 700 - 340 = 360 L. Faulted runway: 360 / 30 = 12.0 days
    expect(updatedSimulationResult.faultedRunway).toBe(12.0);
    // Mitigated: 360 / 10 = 36.0 days
    const outcome = updatedSimulationResult.planOutcomes.find((p) => p.plan.id === 'plan-w-c');
    expect(outcome?.predictedRunway).toBe(36.0);
  });

  it('calculateBatteryRunway handles edge cases where power demand is less than solar output', () => {
    const res = calculateBatteryRunway(38, 10.0, 5.0, 18);
    expect(res.runway).toBeNull();
    expect(res.drainRate).toBe(0);
    expect(res.isAtOrBelowFloor).toBe(false);
  });

  it('calculateWaterRunway handles zero loss rate gracefully', () => {
    const res = calculateWaterRunway(640, 0, 340);
    expect(res.runway).toBeNull();
    expect(res.drainRate).toBe(0);
  });

  it('calculateOxygenRunway handles zero decline gracefully', () => {
    const res = calculateOxygenRunway(82, 0, 42);
    expect(res.runway).toBeNull();
    expect(res.drainRate).toBe(0);
  });
});

