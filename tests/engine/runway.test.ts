import { describe, it, expect } from 'vitest';
import {
  calculateBatteryRunway,
  calculateWaterRunway,
  calculateOxygenRunway,
} from '../../src/engine/runway';

describe('Runway Engine Calculations', () => {
  it('1. Baseline solar output equals power demand, producing zero net depletion', () => {
    const res = calculateBatteryRunway(38, 8.0, 8.0, 18);
    expect(res.drainRate).toBe(0);
    expect(res.runway).toBeNull();
    expect(res.statusMessage).toContain('No battery depletion');
  });

  it('2. Solar drops from 8.0 kW to 3.0 kW with an 8.0 kW load, producing a 5.0 kW drain', () => {
    const res = calculateBatteryRunway(38, 3.0, 8.0, 18);
    expect(res.drainRate).toBe(5.0);
  });

  it('3. A 38 kWh battery with an 18 kWh floor has 20 kWh usable energy', () => {
    const res = calculateBatteryRunway(38, 3.0, 8.0, 18);
    expect(res.usableMargin).toBe(20.0);
  });

  it('4. The faulted solar runway is exactly 4.0 hours (20 kWh / 5.0 kW)', () => {
    const res = calculateBatteryRunway(38, 3.0, 8.0, 18);
    expect(res.runway).toBe(4.0);
  });

  it('5. Plan A calculates 10.0 hours (3.0 kW reduction -> 5.0 kW demand -> 2.0 kW drain -> 20 / 2.0)', () => {
    const res = calculateBatteryRunway(38, 3.0, 5.0, 18);
    expect(res.drainRate).toBe(2.0);
    expect(res.runway).toBe(10.0);
  });

  it('6. Plan B calculates approximately 5.71 hours (1.5 kW reduction -> 6.5 kW demand -> 3.5 kW drain -> 20 / 3.5)', () => {
    const res = calculateBatteryRunway(38, 3.0, 6.5, 18);
    expect(res.drainRate).toBe(3.5);
    expect(res.runway).toBeCloseTo(5.71, 2);
  });

  it('7. Plan C calculates approximately 13.33 hours (3.5 kW reduction -> 4.5 kW demand -> 1.5 kW drain -> 20 / 1.5)', () => {
    const res = calculateBatteryRunway(38, 3.0, 4.5, 18);
    expect(res.drainRate).toBe(1.5);
    expect(res.runway).toBeCloseTo(13.33, 2);
  });

  it('8. Water runway calculates to 12.0 days (300 L usable / 25 L/day loss)', () => {
    const res = calculateWaterRunway(640, 25, 340);
    expect(res.usableMargin).toBe(300);
    expect(res.runway).toBe(12.0);
    expect(res.unit).toBe('days');
  });

  it('9. Oxygen-indicator runway calculates to 25.0 hours (40 pts / 1.6 %/hr)', () => {
    const res = calculateOxygenRunway(82, 1.6, 42);
    expect(res.usableMargin).toBe(40);
    expect(res.runway).toBe(25.0);
    expect(res.unit).toBe('hours');
  });

  it('10. A resource already at or below safety floor returns zero runway', () => {
    const batteryAtFloor = calculateBatteryRunway(18, 3.0, 8.0, 18);
    expect(batteryAtFloor.runway).toBe(0);
    expect(batteryAtFloor.isAtOrBelowFloor).toBe(true);

    const waterBelowFloor = calculateWaterRunway(300, 25, 340);
    expect(waterBelowFloor.runway).toBe(0);
    expect(waterBelowFloor.isAtOrBelowFloor).toBe(true);

    const o2AtFloor = calculateOxygenRunway(42, 1.6, 42);
    expect(o2AtFloor.runway).toBe(0);
    expect(o2AtFloor.isAtOrBelowFloor).toBe(true);
  });

  it('11. Zero or negative drain does not divide by zero', () => {
    const zeroDrain = calculateBatteryRunway(38, 8.0, 8.0, 18);
    expect(zeroDrain.runway).toBeNull();

    const surplusPower = calculateBatteryRunway(38, 10.0, 8.0, 18);
    expect(surplusPower.runway).toBeNull();
    expect(surplusPower.drainRate).toBe(0);

    const zeroWaterLoss = calculateWaterRunway(640, 0, 340);
    expect(zeroWaterLoss.runway).toBeNull();

    const zeroO2Decline = calculateOxygenRunway(82, 0, 42);
    expect(zeroO2Decline.runway).toBeNull();
  });

  it('12. Negative drain rate provides clear "no battery depletion" status', () => {
    const surplus = calculateBatteryRunway(38, 12.0, 8.0, 18);
    expect(surplus.runway).toBeNull();
    expect(surplus.statusMessage).toContain('No battery depletion');
    expect(surplus.isAtOrBelowFloor).toBe(false);
  });

  it('13. Clamping and boundary safety checks prevent invalid negative margins', () => {
    // Battery well below floor (e.g. 5 kWh when floor is 18 kWh)
    const deepDeficit = calculateBatteryRunway(5, 2.0, 8.0, 18);
    expect(deepDeficit.usableMargin).toBe(0);
    expect(deepDeficit.runway).toBe(0);
    expect(deepDeficit.isAtOrBelowFloor).toBe(true);

    // Water below floor
    const dryTank = calculateWaterRunway(100, 25, 340);
    expect(dryTank.usableMargin).toBe(0);
    expect(dryTank.runway).toBe(0);
  });
});
