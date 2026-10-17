import {
  CalculatedPlanOutcome,
  RecoveryPlan,
  ScenarioDefinition,
  ScenarioId,
} from '../types/habitat';
import {
  calculateBatteryRunway,
  calculateWaterRunway,
  calculateOxygenRunway,
} from './runway';

export interface PlanEvaluationContext {
  scenarioId: ScenarioId;
  faultedRunway: number;
  // Dynamic inputs (allowing custom slider values or defaults)
  solarOutputKW?: number;
  powerDemandKW?: number;
  batteryKWh?: number;
  waterLitres?: number;
  netWaterLossLPD?: number;
  oxygenIndicatorPct?: number;
  declineRatePctPerHour?: number;
}

/**
 * Calculates outcomes for all recovery plans associated with a scenario,
 * ranks them strictly by calculated predicted runway (longest first),
 * and flags the recommended choice.
 */
export function evaluateRecoveryPlans(
  scenario: ScenarioDefinition,
  context: PlanEvaluationContext
): CalculatedPlanOutcome[] {
  const outcomes: CalculatedPlanOutcome[] = scenario.recoveryPlans.map((plan: RecoveryPlan) => {
    let predictedRunway = 0;
    let runwayUnit: 'hours' | 'days' = scenario.runwayUnit;
    let drainOrLossAfterPlan = 0;
    let resourceImpactDescription = '';

    if (scenario.id === 'solar-drop') {
      const solarOutputKW = context.solarOutputKW ?? 3.0;
      const initialDemandKW = context.powerDemandKW ?? 8.0;
      const batteryKWh = context.batteryKWh ?? 38.0;
      const reduction = plan.powerReductionKW ?? 0;
      
      const newDemandKW = Math.max(0, initialDemandKW - reduction);
      const res = calculateBatteryRunway(batteryKWh, solarOutputKW, newDemandKW);

      predictedRunway = res.runway ?? 999;
      runwayUnit = 'hours';
      drainOrLossAfterPlan = Math.max(0, newDemandKW - solarOutputKW);
      resourceImpactDescription = `Demand reduced to ${newDemandKW.toFixed(1)} kW (-${reduction.toFixed(1)} kW). Battery net drain slows to ${drainOrLossAfterPlan.toFixed(1)} kW.`;
    } else if (scenario.id === 'water-recovery-fault') {
      const currentWater = context.waterLitres ?? 640;
      const initialLossLPD = context.netWaterLossLPD ?? 25;
      const reduction = plan.waterLossReductionLPD ?? 0;

      const newLossLPD = Math.max(0, initialLossLPD - reduction);
      const res = calculateWaterRunway(currentWater, newLossLPD);

      predictedRunway = res.runway ?? 999;
      runwayUnit = 'days';
      drainOrLossAfterPlan = newLossLPD;
      resourceImpactDescription = `Water reserve loss rate reduced by ${reduction} L/day to ${newLossLPD} L/day.`;
    } else if (scenario.id === 'air-filter-fault') {
      const currentO2 = context.oxygenIndicatorPct ?? 82;
      const initialDeclineRate = context.declineRatePctPerHour ?? 1.6;
      const reduction = plan.oxygenDeclineReductionPctPerHour ?? 0;

      const newDeclineRate = Math.max(0, initialDeclineRate - reduction);
      const res = calculateOxygenRunway(currentO2, newDeclineRate);

      predictedRunway = res.runway ?? 999;
      runwayUnit = 'hours';
      drainOrLossAfterPlan = newDeclineRate;
      resourceImpactDescription = `Indicator decline rate slowed by ${reduction.toFixed(1)} %/hr down to ${newDeclineRate.toFixed(1)} %/hr.`;
    }

    const improvement = Math.round((predictedRunway - context.faultedRunway) * 100) / 100;

    return {
      plan,
      predictedRunway,
      runwayUnit,
      runwayImprovement: improvement,
      drainOrLossAfterPlan,
      isRecommended: false,
      resourceImpactDescription,
    };
  });

  // Rank strictly descending by predicted runway
  outcomes.sort((a, b) => b.predictedRunway - a.predictedRunway);

  // Flag top ranked plan as recommended
  if (outcomes.length > 0) {
    outcomes[0].isRecommended = true;
  }

  return outcomes;
}
