import { describe, it, expect } from 'vitest';
import { triggerScenario, applyRecoveryPlan } from '../../src/engine/simulation';
import { SCENARIO_DEFINITIONS } from '../../src/scenarios/scenarioDefinitions';
import { INITIAL_HABITAT_STATE } from '../../src/data/initialState';

describe('Simulation Engine Transitions & Recommendations', () => {
  it('1. Triggering solar-drop updates state and produces 4.0h runway and CRITICAL status', () => {
    const { faultedState, simulationResult } = triggerScenario('solar-drop');

    expect(faultedState.solarOutputKW).toBe(3.0);
    expect(faultedState.powerDemandKW).toBe(8.0);
    expect(faultedState.netDrainKW).toBe(5.0);
    expect(faultedState.status).toBe('CRITICAL');
    expect(simulationResult.faultedRunway).toBe(4.0);
    expect(simulationResult.runwayUnit).toBe('hours');
  });

  it('2. Evaluates Plan C as the recommended plan with ~13.33 hours runway', () => {
    const { simulationResult } = triggerScenario('solar-drop');
    
    // Top recommended plan should be plan-c
    expect(simulationResult.recommendedPlanId).toBe('plan-c');
    
    const planC = simulationResult.planOutcomes.find((p) => p.plan.id === 'plan-c');
    expect(planC).toBeDefined();
    expect(planC?.predictedRunway).toBeCloseTo(13.33, 2);
    expect(planC?.runwayImprovement).toBeCloseTo(9.33, 2);

    const planA = simulationResult.planOutcomes.find((p) => p.plan.id === 'plan-a');
    expect(planA?.predictedRunway).toBe(10.0);

    const planB = simulationResult.planOutcomes.find((p) => p.plan.id === 'plan-b');
    expect(planB?.predictedRunway).toBeCloseTo(5.71, 2);
  });

  it('3. Applying Plan C updates habitat power demand and mitigates status to WARNING', () => {
    const { faultedState } = triggerScenario('solar-drop');
    const scenario = SCENARIO_DEFINITIONS['solar-drop'];
    const planC = scenario.recoveryPlans.find((p) => p.id === 'plan-c')!;

    const { updatedState, updatedSimulationResult } = applyRecoveryPlan(faultedState, scenario, planC);

    expect(updatedState.powerDemandKW).toBe(4.5); // 8.0 - 3.5 = 4.5 kW
    expect(updatedState.solarOutputKW).toBe(3.0);
    expect(updatedState.netDrainKW).toBe(1.5);
    expect(updatedState.status).toBe('WARNING');
    expect(updatedState.appliedPlanId).toBe('plan-c');
    expect(updatedSimulationResult.recommendedPlanId).toBe('plan-c');
  });

  it('4. Applying the same plan twice is idempotent', () => {
    const { faultedState } = triggerScenario('solar-drop');
    const scenario = SCENARIO_DEFINITIONS['solar-drop'];
    const planC = scenario.recoveryPlans.find((p) => p.id === 'plan-c')!;

    const firstApplication = applyRecoveryPlan(faultedState, scenario, planC);
    const secondApplication = applyRecoveryPlan(firstApplication.updatedState, scenario, planC);

    expect(secondApplication.updatedState.powerDemandKW).toBe(firstApplication.updatedState.powerDemandKW);
    expect(secondApplication.updatedState.appliedPlanId).toBe('plan-c');
    expect(secondApplication.event.type).toBe('info');
  });

  it('5. Water scenario evaluates correctly to 12.0 days and Plan C yields 60.0 days', () => {
    const { faultedState, simulationResult } = triggerScenario('water-recovery-fault');
    expect(faultedState.waterLossRateLPD).toBe(25);
    expect(simulationResult.faultedRunway).toBe(12.0);
    expect(simulationResult.runwayUnit).toBe('days');

    const scenario = SCENARIO_DEFINITIONS['water-recovery-fault'];
    const planWC = scenario.recoveryPlans.find((p) => p.id === 'plan-w-c')!;
    const { updatedState, updatedSimulationResult } = applyRecoveryPlan(faultedState, scenario, planWC);

    expect(updatedState.waterLossRateLPD).toBe(5); // 25 - 20
    const planOutcome = updatedSimulationResult.planOutcomes.find((p) => p.plan.id === 'plan-w-c');
    expect(planOutcome?.predictedRunway).toBe(60.0);
  });

  it('6. Air-filter scenario evaluates correctly to 25.0 hours and Plan C yields 200.0 hours', () => {
    const { faultedState, simulationResult } = triggerScenario('air-filter-fault');
    expect(faultedState.oxygenDeclineRatePctPerHour).toBe(1.6);
    expect(simulationResult.faultedRunway).toBe(25.0);
    expect(simulationResult.runwayUnit).toBe('hours');

    const scenario = SCENARIO_DEFINITIONS['air-filter-fault'];
    const planOC = scenario.recoveryPlans.find((p) => p.id === 'plan-o-c')!;
    const { updatedState, updatedSimulationResult } = applyRecoveryPlan(faultedState, scenario, planOC);

    expect(updatedState.oxygenDeclineRatePctPerHour).toBeCloseTo(0.2, 2); // 1.6 - 1.4
    const planOutcome = updatedSimulationResult.planOutcomes.find((p) => p.plan.id === 'plan-o-c');
    expect(planOutcome?.predictedRunway).toBe(200.0);
  });

  it('7. Determinism: Same inputs consistently yield identical calculated outputs', () => {
    const run1 = triggerScenario('solar-drop', { solarOutputKW: 3.5, powerDemandKW: 7.5 });
    const run2 = triggerScenario('solar-drop', { solarOutputKW: 3.5, powerDemandKW: 7.5 });

    expect(run1.simulationResult.faultedRunway).toBe(run2.simulationResult.faultedRunway);
    expect(run1.faultedState.netDrainKW).toBe(run2.faultedState.netDrainKW);
  });

  it('8. Scenario Isolation: Switching scenarios clears previous scenario specific parameters', () => {
    const solarRun = triggerScenario('solar-drop');
    expect(solarRun.faultedState.activeScenarioId).toBe('solar-drop');
    expect(solarRun.faultedState.waterLossRateLPD).toBe(0);

    const waterRun = triggerScenario('water-recovery-fault');
    expect(waterRun.faultedState.activeScenarioId).toBe('water-recovery-fault');
    expect(waterRun.faultedState.solarOutputKW).toBe(INITIAL_HABITAT_STATE.solarOutputKW); // resets to 8.0 kW
    expect(waterRun.faultedState.waterLossRateLPD).toBe(25);
  });
});
