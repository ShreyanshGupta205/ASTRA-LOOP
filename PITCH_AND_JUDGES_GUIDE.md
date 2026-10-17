# AstraLoop — Hackathon Pitch Deck & Judge Defense Guide

> **Event**: Space & Beyond Ideathon 2026  
> **Theme**: Beyond Earth  
> **Team**: HackDevs (Shreyansh Gupta, Uttkarsh Patel, Akshita Garg)  
> **Target Audience**: Technical Judges, Aerospace Engineers & System Evaluators

---

## Part 1: The 3–5 Minute Pitch Deck Script

### Slide 1: Hook & The Harsh Reality of the Moon (0:00 - 0:45)
**Visual**: AstraLoop Overview dashboard at nominal baseline (`DEMO-01`, `STABLE`).

> *"Good morning, esteemed judges. We are Team HackDevs—Shreyansh, Uttkarsh, and Akshita. Under the theme 'Beyond Earth', we tackled humanity's most unforgiving engineering challenge: surviving on the Moon.*
>
> *On the lunar surface, there is no air, no resupply around the corner, and a two-week night where temperatures plummet to -130°C. In this environment, every kilowatt-hour of battery storage, every liter of water, and every percentage point of oxygen margin is deeply intertwined.*
>
> *When a micrometeorite kicks up regolith dust that occludes your solar array, flight directors don't have time to wade through hundreds of raw telemetry streams or guess what happens next. They need an engineering decision-support tool that answers five questions immediately: What failed? What's affected? How much runway remains? What are our recovery options? And which plan saves the crew?*
>
> *This is AstraLoop: The Lunar Habitat Survival Intelligence System."*

---

### Slide 2: The Core Problem & Our Philosophy (0:45 - 1:30)
**Visual**: Habitat Dependency Map & 4 Resource Cards.

> *"Most modern hackathon projects throw a black-box AI model or static mockups at the problem. But in aerospace life-support—regulated under NASA Class A software standards—black-box hallucinations can cost human lives.*
>
> *AstraLoop is built on mathematical transparency. It is a deterministic digital-twin simulator decoupled from external networks or AI APIs. It separates stored energy in kilowatt-hours from instantaneous power in kilowatts, distinguishes hourly battery drain from daily water recovery loss, and computes strict threshold safety runways with pure, auditable TypeScript equations."*

---

### Slide 3: Live Demonstration Loop (1:30 - 3:00)
**Action**: Shreyansh or Uttkarsh executes the live interactive loop on the laptop.

#### 1. The Baseline State
> *"Here on the DEMO-01 console, our habitat is in nominal equilibrium: solar arrays generate 8.0 kW, perfectly meeting our 8.0 kW total electrical demand across ECLSS, thermal heating, comms, water recycling, and payloads."*

#### 2. Fault Injection (Click: `Run Solar Drop Demo`)
> *"Now, we simulate a sudden regolith dust occlusion event on Solar Array 01. Watch how the twin responds in real time:*
> - *Generation immediately drops from 8.0 kW to 3.0 kW.*
> - *Our Main 120V DC bus experiences an instant 5.0 kW deficit, draining our 38 kWh battery reserve.*
> - *AstraLoop calculates the exact usable margin above our 18 kWh safety floor: 20 kWh.*
> - *Divided by our 5.0 kW net draw, our survival runway is exactly 4.0 hours.*
> - *Our status immediately escalates to CRITICAL, and our Forecast Chart plots the exact moment of threshold breach at T+4h."*

#### 3. Comparing Recovery Plans (Navigate: `Recovery Plans`)
> *"Rather than forcing a panic decision, AstraLoop automatically ranks verified mitigation trade studies by calculated endurance:*
> - *Plan B delays external payload experiments, saving 1.5 kW and extending runway to 5.7 hours.*
> - *Plan A sheds all laboratory facilities, saving 3.0 kW and doubling runway to 10.0 hours.*
> - *Plan C—our top recommendation—sheds non-essential research loads and throttles the water-recovery duty cycle, saving 3.5 kW and extending runway to 13.33 hours—a massive 9.33-hour survival extension."*

#### 4. Applying the Plan & Verification (Click: `Apply Plan` on Plan C)
> *"We click Apply Plan. Watch as the twin reconfigures: electrical demand drops to 4.5 kW, net drain drops to 1.5 kW, non-essential nodes turn offline on our dependency map, the status is safely mitigated to WARNING, and the action is irreversibly logged into our session audit trail."*

---

### Slide 4: Engineering Rigor & NASA Alignment (3:00 - 3:45)
**Visual**: Model & Assumptions Page.

> *"We designed AstraLoop with full auditability:*
> - *Our calculation engine is backed by 21 automated unit and integration tests passing in Vitest, verifying zero-drain bounds, threshold clamps, and idempotent plan execution.*
> - *Our Model & Assumptions page documents every single baseline constant, units separation, and operational trade-off, citing research from NASA Lunar Surface Technology and NASA ECLSS initiatives.*
> - *We explicitly declare our prototype disclosure: AstraLoop is a transparent deterministic decision-support model, designed to demonstrate human-in-the-loop survival logic."*

---

### Slide 5: Summary & Team HackDevs Vision (3:45 - 4:15)
**Visual**: Overview / History JSON Export.

> *"In summary, AstraLoop turns raw sensor failure into immediate, actionable survival strategy. It works offline, computes with zero division-by-zero risk, and equips future lunar explorers with the clarity they need to survive Beyond Earth.*
>
> *Thank you. We are Team HackDevs—Shreyansh, Uttkarsh, and Akshita—and we welcome your questions!"*

---

## Part 2: Technical Judge Defense (Q&A Preparation)

### Category A: Architecture & Software Engineering

#### Q1: "Why did you build a deterministic rule engine instead of using Machine Learning or an LLM agent?"
**Defense (Akshita/Shreyansh)**:
> *"In spaceflight life-support systems (NASA NPR 7150.2 for Class A flight software), non-deterministic systems like LLMs are uncertifiable for real-time survival decisions due to stochastic variance and hallucination risks.*
> *AstraLoop uses deterministic, pure TypeScript functions: given identical inputs, it produces mathematically identical, auditable outputs every single time. An ML layer could later be introduced as an advisory recommender, but the core physics and threshold calculations must remain pure deterministic arithmetic."*

#### Q2: "How does the UI state connect to the simulation engine? Is anything hardcoded?"
**Defense (Uttkarsh)**:
> *"Nothing is hardcoded in the UI widgets. The entire architecture follows a single source of truth using a centralized React Context with a strict useReducer store (`simulationStore.tsx`). All four resource cards, the dependency graph, the Recharts forecast curves, and the history table subscribe to the exact same `HabitatState`. When a scenario parameter or recovery plan changes, the engine recalculates the state and broadcasts it synchronously across all views."*

#### Q3: "What happens if a user repeatedly clicks 'Apply Plan'?"
**Defense (Shreyansh)**:
> *"The recovery engine is strictly idempotent. In `src/engine/simulation.ts`, if `state.appliedPlanId === plan.id`, the engine returns a verified no-op, preventing double-subtraction of electrical loads or compounding loss rates. We wrote automated test case #4 specifically to prove idempotency under repeated calls."*

---

### Category B: Lunar Habitat Engineering & Modeling

#### Q4: "Explain the difference between kWh and kW in your model. Why is that important?"
**Defense (Uttkarsh/Akshita)**:
> *"Many generic dashboards confuse instantaneous power with stored energy. In our model:*
> - *Power (kW) is the instantaneous rate of generation or consumption (e.g., our solar array generates 8.0 kW, and our habitat subsystems consume 8.0 kW).*
> - *Energy (kWh) is the integral of power over time, representing stored capacity in our Li-Ion battery bank (38 kWh nominal stored energy).*
> - *Net drain occurs when power demand exceeds solar output: $\text{netDrain (kW)} = \text{Demand} - \text{Solar} = 8.0 - 3.0 = 5.0\text{ kW}$.*
> - *Runway is strictly $\frac{\text{Usable Energy (kWh)}}{\text{Net Drain (kW)}} = \frac{38 - 18\text{ kWh}}{5.0\text{ kW}} = 4.0\text{ hours}$. Keeping these units distinct is fundamental to lunar aerospace modeling."*

#### Q5: "Why is water runway in days while battery and oxygen are in hours?"
**Defense (Akshita)**:
> *"This reflects real lunar operational timescales:*
> - *Electrical power balance fluctuates minute-to-minute; battery depletion threatens the habitat on an hourly horizon.*
> - *Potable water reserves are large (640 L) with recycling efficiency operating on diurnal crew cycles; uncompensated loss of 25 L/day threatens the habitat over days or weeks (12 days to the 340 L floor).*
> - *Comparing daily water loss directly to hourly electrical drain would be physically invalid. AstraLoop preserves native units for each ECLSS domain."*

#### Q6: "What are the trade-offs in Plan C (Shed Loads & Throttle Activities)?"
**Defense (Shreyansh)**:
> *"Engineering is the discipline of trade-offs. Plan C provides the longest runway (13.33 hours vs 4.0 hours), but it is not a free lunch:*
> - *It completely powers down scientific labs and external regolith smelting (-3.0 kW).*
> - *It throttles the Water Recovery Unit duty cycle by 50% (-0.5 kW).*
> - *The trade-off: The crew halts all primary scientific mission milestones, and greywater recycling throughput is halved. Flight directors must weigh battery survival against operational throughput."*

---

### Category C: Production Readiness, Scalability & Roadmap

#### Q7: "How would AstraLoop integrate with real spacecraft telemetry in the future?"
**Defense (Uttkarsh)**:
> *"Because our simulation engine in `src/engine/` consists of pure TypeScript functions independent of the browser DOM or React UI, we can wrap the engine in an MQTT or CCSDS (Consultative Committee for Space Data Systems) telemetry ingester. Telemetry packets streaming from lunar surface sensors would map directly to `HabitatState.solarOutputKW` or `batteryKWh`, and AstraLoop would calculate real-time threshold margins continuously."*

#### Q8: "How did you test the application for reliability?"
**Defense (Shreyansh)**:
> *"We maintain a comprehensive Vitest automated test suite with 21 unit and integration tests covering:*
> 1. *Baseline zero depletion.*
> 2. *Exact fault calculations (4.0 hours solar, 12.0 days water, 25.0 hours oxygen).*
> 3. *Division-by-zero protection when generation meets or exceeds demand.*
> 4. *Boundary clamping when resources drop to or below safety floors.*
> 5. *Plan idempotency and load-shedding accuracy.*
> *We also validated the end-to-end user experience in the browser across all 5 navigation pages."*

---

## Part 3: Roles & Responsibilities during the Presentation

| Team Member | Pitch Role | Primary Q&A Focus Area |
|---|---|---|
| **Shreyansh Gupta** | Lead Presenter & System Architecture | Overall vision, problem hook, live demo execution, and roadmap |
| **Uttkarsh Patel** | Co-Presenter & Simulation Engineer | Mathematical runway engine, Recharts data visualization, and unit tests |
| **Akshita Garg** | Co-Presenter & ECLSS Domain Specialist | Life-support dependencies, operational trade-offs, and NASA reference alignment |
