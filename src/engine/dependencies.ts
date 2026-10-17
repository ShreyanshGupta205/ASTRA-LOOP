export interface DependencyNode {
  id: string;
  label: string;
  type: 'source' | 'bus' | 'storage' | 'consumer' | 'eclss';
  status: 'nominal' | 'warning' | 'critical' | 'throttled' | 'offline';
  loadKW?: number;
  metric?: string;
  category: string;
  x: number; // Layout coordinates for visual graph
  y: number;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  status: 'nominal' | 'warning' | 'critical' | 'throttled' | 'offline';
  label?: string;
}

export interface DependencyTopology {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

/**
 * Returns the deterministic habitat system dependency graph with dynamic node statuses
 * based on the active scenario and whether a recovery plan is applied.
 */
export function getHabitatTopology(
  activeScenarioId: string | null,
  appliedPlanId: string | null,
  solarOutputKW: number = 8.0,
  powerDemandKW: number = 8.0
): DependencyTopology {
  const isSolarFault = activeScenarioId === 'solar-drop';
  const isWaterFault = activeScenarioId === 'water-recovery-fault';
  const isAirFault = activeScenarioId === 'air-filter-fault';

  const isPlanApplied = Boolean(appliedPlanId);
  const netPower = solarOutputKW - powerDemandKW;

  // Build nodes
  const nodes: DependencyNode[] = [
    // Layer 1: Sources
    {
      id: 'solar-array',
      label: 'Solar Photovoltaic Array',
      type: 'source',
      status: isSolarFault ? 'critical' : 'nominal',
      metric: `${solarOutputKW.toFixed(1)} kW`,
      category: 'Power Generation',
      x: 100,
      y: 80,
    },
    // Layer 2: Main Power Bus & Balance
    {
      id: 'power-bus',
      label: 'Main 120V DC Power Bus',
      type: 'bus',
      status: isSolarFault ? (isPlanApplied ? 'warning' : 'critical') : 'nominal',
      metric: `Net: ${netPower > 0 ? '+' : ''}${netPower.toFixed(1)} kW`,
      category: 'Distribution',
      x: 320,
      y: 80,
    },
    // Layer 3: Battery Energy Storage
    {
      id: 'battery-bank',
      label: 'Li-Ion Battery Bank (38 kWh)',
      type: 'storage',
      status: isSolarFault ? (netPower < 0 ? 'critical' : 'nominal') : 'nominal',
      metric: netPower < 0 ? `-${Math.abs(netPower).toFixed(1)} kW Drain` : 'Floating / Stable',
      category: 'Energy Storage',
      x: 540,
      y: 80,
    },

    // Layer 4: Electrical Consumers
    {
      id: 'life-support-load',
      label: 'Life Support / ECLSS',
      type: 'consumer',
      status: isAirFault ? (isPlanApplied ? 'warning' : 'critical') : 'nominal',
      loadKW: 2.5,
      metric: '2.5 kW',
      category: 'Critical Load',
      x: 760,
      y: 40,
    },
    {
      id: 'thermal-load',
      label: 'Thermal & Heating Loop',
      type: 'consumer',
      status: 'nominal',
      loadKW: 1.0,
      metric: '1.0 kW',
      category: 'Critical Load',
      x: 760,
      y: 110,
    },
    {
      id: 'comms-load',
      label: 'Lunar Telemetry & Comms',
      type: 'consumer',
      status: 'nominal',
      loadKW: 0.5,
      metric: '0.5 kW',
      category: 'Essential Load',
      x: 760,
      y: 180,
    },
    {
      id: 'water-rec-load',
      label: 'Water Recovery Distillation',
      type: 'consumer',
      status: isWaterFault
        ? (isPlanApplied ? 'warning' : 'critical')
        : (appliedPlanId === 'plan-c' ? 'throttled' : 'nominal'),
      loadKW: appliedPlanId === 'plan-c' ? 0.5 : 1.0,
      metric: appliedPlanId === 'plan-c' ? '0.5 kW (Throttled)' : '1.0 kW',
      category: 'Essential Load',
      x: 760,
      y: 250,
    },
    {
      id: 'labs-load',
      label: 'Labs & Cabin Lighting',
      type: 'consumer',
      status: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-c') ? 'offline' : (isSolarFault ? 'warning' : 'nominal'),
      loadKW: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-c') ? 0 : 1.5,
      metric: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-c') ? '0 kW (Shed)' : '1.5 kW',
      category: 'Non-Essential',
      x: 760,
      y: 320,
    },
    {
      id: 'exp-load',
      label: 'External Experiments',
      type: 'consumer',
      status: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-b' || appliedPlanId === 'plan-c') ? 'offline' : (isSolarFault ? 'warning' : 'nominal'),
      loadKW: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-b' || appliedPlanId === 'plan-c') ? 0 : 1.5,
      metric: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-b' || appliedPlanId === 'plan-c') ? '0 kW (Shed)' : '1.5 kW',
      category: 'Payload',
      x: 760,
      y: 390,
    },

    // Layer 5: Specialized Fluid & Atmospheric Pathways
    {
      id: 'water-storage',
      label: 'Potable Water Reserve (640 L)',
      type: 'eclss',
      status: isWaterFault ? 'critical' : 'nominal',
      metric: isWaterFault ? (isPlanApplied ? 'Loss: -5 to -15 L/d' : 'Loss: -25 L/d') : 'Stable 640 L',
      category: 'Fluid ECLSS',
      x: 980,
      y: 250,
    },
    {
      id: 'o2-indicator',
      label: 'Oxygen Indicator (82%)',
      type: 'eclss',
      status: isAirFault ? 'critical' : 'nominal',
      metric: isAirFault ? (isPlanApplied ? '-0.2 to -0.8 %/h' : '-1.6 %/h') : '82% Nominal',
      category: 'Atmospheric ECLSS',
      x: 980,
      y: 40,
    },
  ];

  // Build edges
  const edges: DependencyEdge[] = [
    {
      id: 'e-solar-bus',
      source: 'solar-array',
      target: 'power-bus',
      status: isSolarFault ? 'critical' : 'nominal',
      label: `${solarOutputKW.toFixed(1)} kW`,
    },
    {
      id: 'e-bus-battery',
      source: 'power-bus',
      target: 'battery-bank',
      status: isSolarFault ? 'critical' : 'nominal',
      label: netPower < 0 ? `-${Math.abs(netPower).toFixed(1)} kW` : 'Balanced',
    },
    // Bus to consumers
    {
      id: 'e-bus-life',
      source: 'power-bus',
      target: 'life-support-load',
      status: 'nominal',
      label: '2.5 kW',
    },
    {
      id: 'e-bus-thermal',
      source: 'power-bus',
      target: 'thermal-load',
      status: 'nominal',
      label: '1.0 kW',
    },
    {
      id: 'e-bus-comms',
      source: 'power-bus',
      target: 'comms-load',
      status: 'nominal',
      label: '0.5 kW',
    },
    {
      id: 'e-bus-water',
      source: 'power-bus',
      target: 'water-rec-load',
      status: appliedPlanId === 'plan-c' ? 'throttled' : 'nominal',
      label: appliedPlanId === 'plan-c' ? '0.5 kW' : '1.0 kW',
    },
    {
      id: 'e-bus-labs',
      source: 'power-bus',
      target: 'labs-load',
      status: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-c') ? 'offline' : 'nominal',
      label: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-c') ? '0 kW' : '1.5 kW',
    },
    {
      id: 'e-bus-exp',
      source: 'power-bus',
      target: 'exp-load',
      status: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-b' || appliedPlanId === 'plan-c') ? 'offline' : 'nominal',
      label: (appliedPlanId === 'plan-a' || appliedPlanId === 'plan-b' || appliedPlanId === 'plan-c') ? '0 kW' : '1.5 kW',
    },
    // Consumer to ECLSS storage
    {
      id: 'e-water-storage',
      source: 'water-rec-load',
      target: 'water-storage',
      status: isWaterFault ? 'critical' : 'nominal',
    },
    {
      id: 'e-life-o2',
      source: 'life-support-load',
      target: 'o2-indicator',
      status: isAirFault ? 'critical' : 'nominal',
    },
  ];

  return { nodes, edges };
}
