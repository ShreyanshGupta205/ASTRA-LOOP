export type HabitatStatus = 'STABLE' | 'WARNING' | 'CRITICAL';

export type ResourceType = 'battery' | 'water' | 'oxygen' | 'solar';

export interface ResourceThresholds {
  batteryFloorKWh: number;     // 18 kWh safety floor
  batteryCapacityKWh: number;  // 100 kWh nominal capacity
  waterFloorLitres: number;    // 340 L safety floor
  waterCapacityLitres: number; // 1,000 L nominal capacity
  oxygenThresholdPct: number;  // 42% threshold
  oxygenNominalPct: number;    // 100% nominal reference
}

export interface SubsystemLoad {
  id: string;
  name: string;
  baselineKW: number;
  currentKW: number;
  category: 'critical' | 'essential' | 'non-essential' | 'payload';
  status: 'nominal' | 'throttled' | 'offline';
  description: string;
}

export interface HabitatState {
  // Battery & Power
  batteryKWh: number;          // Stored energy (kWh), baseline 38
  solarOutputKW: number;       // Solar generation rate (kW), baseline 8.0
  powerDemandKW: number;       // Electrical load demand (kW), baseline 8.0
  netPowerKW: number;          // solarOutputKW - powerDemandKW
  netDrainKW: number;          // Math.max(0, powerDemandKW - solarOutputKW)
  
  // Water
  waterLitres: number;         // Reserve volume (L), baseline 640
  waterLossRateLPD: number;    // Net loss rate (L/day), baseline 0 (or balanced)
  
  // Oxygen Reserve Indicator (illustrative model, not physiological measurement)
  oxygenIndicatorPct: number;  // Indicator % (0-100), baseline 82
  oxygenDeclineRatePctPerHour: number; // Decline rate (%/hour), baseline 0
  
  // Subsystem loads breakdown
  loads: SubsystemLoad[];
  
  // System Health & Status
  status: HabitatStatus;
  activeScenarioId: string | null;
  appliedPlanId: string | null;
  isFaultActive: boolean;
  
  // Metadata
  timestamp: number;
}

export type ScenarioId = 'solar-drop' | 'water-recovery-fault' | 'air-filter-fault';

export interface SolarScenarioInputs {
  solarOutputKW: number;       // e.g. 3.0 kW (faulted) vs baseline 8.0 kW
  powerDemandKW: number;       // e.g. 8.0 kW
  batteryReserveKWh: number;   // baseline 38 kWh
}

export interface WaterScenarioInputs {
  waterReserveLitres: number;  // baseline 640 L
  netWaterLossLPD: number;     // baseline 25 L/day
}

export interface AirFilterScenarioInputs {
  startingIndicatorPct: number; // baseline 82%
  declineRatePctPerHour: number; // baseline 1.6 %/hr
}

export type ScenarioInputs = SolarScenarioInputs | WaterScenarioInputs | AirFilterScenarioInputs;

export interface RecoveryPlan {
  id: string;
  scenarioId: ScenarioId;
  name: string;
  tagline: string;
  actionDescription: string;
  operationalTradeOff: string;
  reasoning: string;
  // Modifiers
  powerReductionKW?: number;
  throttledSubsystems?: string[];
  waterLossReductionLPD?: number;
  oxygenDeclineReductionPctPerHour?: number;
}

export interface CalculatedPlanOutcome {
  plan: RecoveryPlan;
  predictedRunway: number;        // in scenario units (hours or days)
  runwayUnit: 'hours' | 'days';
  runwayImprovement: number;      // additional hours or days compared to faulted
  drainOrLossAfterPlan: number;   // new drain rate
  isRecommended: boolean;
  resourceImpactDescription: string;
}

export interface ScenarioDefinition {
  id: ScenarioId;
  name: string;
  subtitle: string;
  severity: 'warning' | 'critical';
  faultDescription: string;
  affectedSubsystem: string;
  dependentSystems: string[];
  primaryResource: ResourceType;
  runwayUnit: 'hours' | 'days';
  defaultInputs: ScenarioInputs;
  recoveryPlans: RecoveryPlan[];
}

export interface SimulationResult {
  scenarioId: ScenarioId;
  faultedRunway: number;
  runwayUnit: 'hours' | 'days';
  netDrainOrLoss: number;
  affectedSystems: string[];
  warningMessage: string;
  recommendedPlanId: string;
  planOutcomes: CalculatedPlanOutcome[];
}

export interface ForecastPoint {
  timeStep: number;        // Step index (e.g. 0, 1, 2, ... hours/days)
  timeLabel: string;       // e.g. "T+0h", "T+1h"
  baselineValue: number;   // Baseline projection
  faultedValue: number;    // Faulted projection
  recoveryValue?: number;  // After applied plan projection
  thresholdValue: number;  // Safety threshold floor
  isProjected: boolean;
}

export interface SimulationRun {
  id: string;
  timestamp: number;
  formattedTime: string;
  scenarioId: ScenarioId;
  scenarioName: string;
  inputs: Record<string, number>;
  faultedRunway: number;
  runwayUnit: 'hours' | 'days';
  appliedPlanId: string | null;
  appliedPlanName: string | null;
  postRecoveryRunway: number | null;
  runwayDelta: number | null;
  warnings: string[];
  notes?: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface AlertEvent {
  id: string;
  timestamp: number;
  formattedTime: string;
  type: AlertSeverity;
  source: string;
  message: string;
}

export type NavPage = 'overview' | 'digital-twin-3d' | 'scenario-lab' | 'recovery-plans' | 'history' | 'model-assumptions' | 'spacex-portal';
