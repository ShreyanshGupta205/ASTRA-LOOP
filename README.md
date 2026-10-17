# AstraLoop — Lunar Habitat Survival Intelligence System

> **Space & Beyond Ideathon 2026** — *Theme: Beyond Earth*  
> **Team HackDevs**: Shreyansh Gupta · Uttkarsh Patel · Akshita Garg  
> **Habitat Identifier**: `DEMO-01` | **Status**: Operational Offline Hackathon Prototype

---

## 🚀 Overview

**AstraLoop** is a transparent digital-twin simulator engineered for exploring resource failures and recovery trade-offs in a future permanently-crewed lunar outpost. 

When a critical subsystem experiences degradation (such as lunar regolith dust on solar arrays or sorbent clogging in ECLSS scrubbers), AstraLoop empowers mission directors and habitat engineers to answer five crucial operational questions in real time:

1. **What failed?** Root-cause subsystem identification.
2. **Which dependent systems are affected?** Tracing the downstream electrical and fluid cascade.
3. **How long remains before a safety threshold is breached?** Pure, deterministic survival runway calculations.
4. **Which recovery actions are available, and what are their trade-offs?** Comparing load shedding, mission delays, and activity throttling.
5. **How much does the predicted outcome improve after selecting a response?** Quantifiable endurance extension delta.

---

## 🔄 Core Demonstration Flow

$$\text{Nominal Baseline} \longrightarrow \text{Trigger Failure} \longrightarrow \text{Observe Impact} \longrightarrow \text{Calculate Runway} \longrightarrow \text{Compare Recovery Plans} \longrightarrow \text{Apply Plan} \longrightarrow \text{Inspect Outcome}$$

---

## 📊 Parametric Specifications & Baselines

| Resource | Baseline Reserve | Safety Floor | Usable Margin | Capacity | Modeled Fault | Faulted Runway | Plan C Outcome |
|---|---|---|---|---|---|---|---|
| **Battery Storage** | **38 kWh** | **18 kWh** | **20 kWh** | 100 kWh | Solar Drop (8.0 $\rightarrow$ 3.0 kW) | **4.0 hours** | **13.33 hours** (+9.33h) |
| **Potable Water** | **640 L** | **340 L** | **300 L** | 1,000 L | WRA Malfunction (-25 L/d) | **12.0 days** | **60.00 days** (+48.0d) |
| **Oxygen Indicator** | **82%** | **42%** | **40 pts** | 100% | Scrubber Saturation (-1.6 %/h) | **25.0 hours** | **200.00 hours** (+175.0h) |
| **Solar Power** | **8.0 kW** | 8.0 kW (Demand) | Balanced | 10.0 kW | Regolith Dust Occlusion | -5.0 kW Deficit | Demand reduced to 4.5 kW |

### Subsystem Load Breakdown (Nominal Sum = 8.0 kW)
- **Life Support & ECLSS**: 2.5 kW *(Critical)*
- **Thermal Control & Heating**: 1.0 kW *(Critical)*
- **Lunar Comms & Telemetry**: 0.5 kW *(Essential)*
- **Water Recovery Unit**: 1.0 kW *(Essential)*
- **Labs & Habitat Lighting**: 1.5 kW *(Non-Essential)*
- **External Experiments**: 1.5 kW *(Payload)*

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS with custom mission-control design tokens (`#07111F`, `#53D8F4`, `#55E3B3`, `#FFC15A`, `#FF687D`)
- **Charts**: Recharts (dynamic line forecast with threshold reference line & comparative bar charts)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` for run audits & JSON report generation
- **Testing**: Vitest unit test suite (17 automated engine tests)

---

## ⚡ Quick Start & Offline Demo Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Development Server
```bash
npm run dev
```
Open **`http://127.0.0.1:5173/`** in any modern web browser. The app runs 100% locally with zero external API dependencies or keys.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 🎯 Offline Hackathon Presentation Script (3-Minute Flow)

1. **Baseline Equilibrium (Overview)**
   - Show the header: `DEMO-01`, `MODE: SIMULATION`, `ILLUSTRATIVE DATA`, `STABLE` badge.
   - Point out the 4 resource cards: Battery (38 kWh), Water (640 L), Oxygen (82%), Solar (8.0 kW).
   - Show the 8.0 kW baseline load balance in the Habitat Dependency Graph.

2. **Trigger Primary Fault (Solar Drop)**
   - Click the prominent **"Run Solar Drop Demo"** button.
   - Note the instant transition: Status changes to `CRITICAL`.
   - Solar drops from 8.0 kW to 3.0 kW; net drain becomes **5.0 kW**.
   - Battery usable energy ($38 - 18 = 20\text{ kWh}$) divided by $5.0\text{ kW}$ drain yields **4.0 hours runway**.
   - Show the threshold breach on the Resource Forecast Chart.

3. **Compare & Apply Recovery Response**
   - Click **"Compare Recovery Plans"** to navigate to the trade-study workspace.
   - Explain the 3 calculated alternatives:
     - *Plan A (Shed Labs)*: 10.0 hours
     - *Plan B (Delay Experiments)*: 5.7 hours
     - *Plan C (Deep Load Shedding & Recycling Throttle)*: **13.3 hours** (Recommended, +9.3h improvement)
   - Click **"Apply Plan"** on Plan C.
   - Observe the confirmation banner, status mitigated to `WARNING`, and the forecast curve updating.

4. **Verify Propagation & Audit Trail**
   - Return to **Overview**: demand is now 4.5 kW, net drain is 1.5 kW, and non-essential loads are marked offline.
   - Open **Scenario Lab** to showcase the Water Recovery (12 days) and Air Filter (25 hours) models with sensitivity sliders.
   - Open **Simulation History** to inspect the recorded run and demonstrate the **JSON Report Export**.
   - Open **Model & Assumptions** to show mathematical formulas, safety floors, and official NASA citations.
   - Click **"Reset Habitat"** to restore nominal equilibrium.

---

## 📑 Model Limitations & Mandatory Disclosure

> *"AstraLoop is a hackathon decision-support simulation using illustrative values and simplified deterministic rules. It is not a certified life-support controller, does not predict actual mission safety, and must not be used for real crew decisions."*

### Official Reference Citations (Problem Background)
- [NASA Lunar Surface Technology](https://www.nasa.gov/lunar-surface-technology/)
- [NASA Environmental Control and Life Support Systems (ECLSS)](https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/)
- [NASA Lunar Surface Innovation Initiative (LSII)](https://www.nasa.gov/space-technology-mission-directorate/lunar-surface-innovation-initiative/)
