import { HABITAT_THRESHOLDS } from '../data/initialState';

export interface RunwayCalculationResult {
  runway: number | null; // number in hours/days, or null if no depletion
  unit: 'hours' | 'days';
  usableMargin: number;
  drainRate: number;
  isAtOrBelowFloor: boolean;
  statusMessage: string;
}

/**
 * Calculates battery depletion runway in hours.
 * 
 * Formula:
 * netDrainKW = powerDemandKW - solarOutputKW
 * usableBatteryKWh = max(0, batteryKWh - safetyFloorKWh)
 * runwayHours = usableBatteryKWh / netDrainKW
 */
export function calculateBatteryRunway(
  batteryKWh: number,
  solarOutputKW: number,
  powerDemandKW: number,
  safetyFloorKWh: number = HABITAT_THRESHOLDS.batteryFloorKWh
): RunwayCalculationResult {
  const netDrainKW = powerDemandKW - solarOutputKW;
  const usableBatteryKWh = Math.max(0, batteryKWh - safetyFloorKWh);
  const isAtOrBelowFloor = batteryKWh <= safetyFloorKWh;

  if (isAtOrBelowFloor) {
    return {
      runway: 0,
      unit: 'hours',
      usableMargin: 0,
      drainRate: Math.max(0, netDrainKW),
      isAtOrBelowFloor: true,
      statusMessage: 'CRITICAL: Battery reserve is at or below the 18 kWh safety floor.',
    };
  }

  if (netDrainKW <= 0) {
    return {
      runway: null,
      unit: 'hours',
      usableMargin: usableBatteryKWh,
      drainRate: 0,
      isAtOrBelowFloor: false,
      statusMessage: 'No battery depletion at the current modeled rate (generation meets or exceeds demand).',
    };
  }

  const runwayHours = usableBatteryKWh / netDrainKW;

  return {
    runway: Math.round(runwayHours * 100) / 100, // 2 decimal precision
    unit: 'hours',
    usableMargin: usableBatteryKWh,
    drainRate: netDrainKW,
    isAtOrBelowFloor: false,
    statusMessage: `Estimated ${runwayHours.toFixed(1)} hours before reaching the ${safetyFloorKWh} kWh safety threshold.`,
  };
}

/**
 * Calculates water reserve runway in days.
 * 
 * Formula:
 * usableWaterLitres = max(0, currentWaterLitres - waterFloorLitres)
 * runwayDays = usableWaterLitres / netLossLitresPerDay
 */
export function calculateWaterRunway(
  currentWaterLitres: number,
  netLossLitresPerDay: number,
  waterFloorLitres: number = HABITAT_THRESHOLDS.waterFloorLitres
): RunwayCalculationResult {
  const usableWaterLitres = Math.max(0, currentWaterLitres - waterFloorLitres);
  const isAtOrBelowFloor = currentWaterLitres <= waterFloorLitres;

  if (isAtOrBelowFloor) {
    return {
      runway: 0,
      unit: 'days',
      usableMargin: 0,
      drainRate: Math.max(0, netLossLitresPerDay),
      isAtOrBelowFloor: true,
      statusMessage: 'CRITICAL: Potable water reserve is at or below the 340 L safety floor.',
    };
  }

  if (netLossLitresPerDay <= 0) {
    return {
      runway: null,
      unit: 'days',
      usableMargin: usableWaterLitres,
      drainRate: 0,
      isAtOrBelowFloor: false,
      statusMessage: 'No water reserve depletion predicted under current recycling operations.',
    };
  }

  const runwayDays = usableWaterLitres / netLossLitresPerDay;

  return {
    runway: Math.round(runwayDays * 100) / 100,
    unit: 'days',
    usableMargin: usableWaterLitres,
    drainRate: netLossLitresPerDay,
    isAtOrBelowFloor: false,
    statusMessage: `Estimated ${runwayDays.toFixed(1)} days before reaching the ${waterFloorLitres} L safety floor.`,
  };
}

/**
 * Calculates oxygen reserve indicator runway in hours.
 * 
 * Formula:
 * usableMargin = max(0, currentIndicator - indicatorFloor)
 * runwayHours = usableMargin / declinePointsPerHour
 * 
 * Note: Percentage-point decline model; illustrative only.
 */
export function calculateOxygenRunway(
  currentIndicatorPct: number,
  declinePointsPerHour: number,
  indicatorFloorPct: number = HABITAT_THRESHOLDS.oxygenThresholdPct
): RunwayCalculationResult {
  const usableMargin = Math.max(0, currentIndicatorPct - indicatorFloorPct);
  const isAtOrBelowFloor = currentIndicatorPct <= indicatorFloorPct;

  if (isAtOrBelowFloor) {
    return {
      runway: 0,
      unit: 'hours',
      usableMargin: 0,
      drainRate: Math.max(0, declinePointsPerHour),
      isAtOrBelowFloor: true,
      statusMessage: 'CRITICAL: Oxygen indicator is at or below the 42% threshold margin.',
    };
  }

  if (declinePointsPerHour <= 0) {
    return {
      runway: null,
      unit: 'hours',
      usableMargin: usableMargin,
      drainRate: 0,
      isAtOrBelowFloor: false,
      statusMessage: 'Oxygen reserve indicator is stable with zero modeled decline.',
    };
  }

  const runwayHours = usableMargin / declinePointsPerHour;

  return {
    runway: Math.round(runwayHours * 100) / 100,
    unit: 'hours',
    usableMargin: usableMargin,
    drainRate: declinePointsPerHour,
    isAtOrBelowFloor: false,
    statusMessage: `Estimated ${runwayHours.toFixed(1)} hours before oxygen indicator breaches 42% threshold.`,
  };
}
