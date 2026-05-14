# Analytics Feature

Displays a history of completed Power-to-Heat simulations so users can compare
runs, review purchase decisions, and understand how much the price-aware strategy
saved compared to always running at full power.

---

## How a run gets saved

When the user plays a simulation all the way to the last frame, `SimulationComponent`
automatically saves the run via the `onRunComplete` callback passed down from
`MainContent`. The run is stored in the browser's `localStorage` (key:
`p2h_sim_history`) and survives page refreshes and browser restarts. Up to 20 runs
are kept; the oldest are dropped when the limit is exceeded.

---

## File overview

| File | Responsibility |
|---|---|
| `analyticsTypes.ts` | `SimulationRun` and `RunStats` types; `computeRunStats()` pure function |
| `useSimulationHistory.ts` | localStorage persistence hook — `saveRun`, `deleteRun`, `runs` |
| `AnalyticsPage.tsx` | Two-panel shell: sidebar list (left) + detail view (right) |
| `RunCard.tsx` | Compact list card showing date, range, cost, savings |
| `RunDetail.tsx` | Full detail: 2×2 chart grid, purchase log, pie chart, savings box |

---

## Page layout

```
Sidebar (260 px)          Detail panel (flex)
┌──────────────────┐      ┌─────────────────────┬─────────────────────┐
│ SIMULATION       │      │  Electricity Price  │  Heat Demand        │
│ HISTORY          │      │  (line chart)       │  (line chart)       │
│                  │      ├─────────────────────┼─────────────────────┤
│ ┌──────────────┐ │      │  Temperature        │  Storage Level      │
│ │ Run card     │ │      │  (line chart)       │  (line chart)       │
│ │ · Storage %  │ │      └─────────────────────┴─────────────────────┘
│ │ · Cost       │ │
│ │ · Cheap/Exp  │ │      ┌──────────────┐  ┌────────────────────────┐
│ │ · Savings    │ │      │  Pie chart   │  │  Purchase Log          │
│ └──────────────┘ │      │  (cheap vs   │  │  (scrollable list of   │
│                  │      │   expensive) │  │   hourly purchases)    │
│ ┌──────────────┐ │      ├──────────────┤  │                        │
│ │ Run card     │ │      │  VS. ALWAYS  │  │                        │
│ └──────────────┘ │      │  ON savings  │  │                        │
└──────────────────┘      └──────────────┘  └────────────────────────┘
```

---

## Stats calculations (`computeRunStats`)

All numbers are derived from the saved `SimulationPoint[]` series.

### Cost formula (per time step)
```
cost (€) = energy.generated (kW) × energy.price (€/MWh) ÷ 1 000
```

### Price thresholds (mirror `EnergyStorageResolver`)
| Price | Strategy | Label |
|---|---|---|
| < 60 €/MWh | P2H at max power (3 000 kW), storage charges | **Cheap** |
| 60–100 €/MWh | P2H covers demand only, storage unchanged | Medium |
| > 100 €/MWh | P2H off, storage discharges to cover demand | **Expensive** |

### Always-On baseline
The comparison strategy runs P2H at full power (3 000 kW) every hour regardless
of price:
```
alwaysCost = Σ (3 000 kW × price[h] ÷ 1 000)  for all hours h
```
`Savings = alwaysCost − totalCost`

---

## Heat Demand unit note

`SimulationPoint.demand.current` stores `energyDemand / 100` (an internal
simulation scale factor). The main-page charts display `energyDemand / 1 000` as
MW. To match, `RunDetail` divides `demand.current` by **10** (= ÷100 × ×10)
to recover the correct MW value.

---

## Data persistence

Runs are stored as a JSON array in `localStorage['p2h_sim_history']`.

- Survives browser close and page refresh
- Deleted only by the trash icon in the sidebar, or by clearing browser storage
- Inspect / delete manually in DevTools → Application → Local Storage
