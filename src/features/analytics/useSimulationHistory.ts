/**
 * useSimulationHistory
 *
 * React hook that persists completed simulation runs in localStorage.
 *
 * Runs are stored as a JSON array under the key 'p2h_sim_history'.
 * The list is capped at MAX_RUNS to avoid filling localStorage with
 * large series arrays — oldest runs are dropped automatically.
 *
 * Usage:
 *   const { runs, saveRun, deleteRun } = useSimulationHistory();
 *
 *   saveRun(run)      — prepends a new SimulationRun (called by SimulationComponent
 *                       automatically when playback reaches the last frame)
 *   deleteRun(id)     — removes a run by id (called from the trash icon in RunCard)
 *   runs              — ordered newest-first, ready to pass to AnalyticsPage
 */

import { useState, useCallback } from 'react';
import type { SimulationRun } from './analyticsTypes';

const KEY = 'p2h_sim_history';
const MAX_RUNS = 20; // keep at most 20 runs; older ones are silently dropped

export function useSimulationHistory() {
  const [runs, setRuns] = useState<SimulationRun[]>(() => {
    try {
      const s = localStorage.getItem(KEY);
      return s ? (JSON.parse(s) as SimulationRun[]) : [];
    } catch {
      return [];
    }
  });

  const saveRun = useCallback((run: SimulationRun) => {
    setRuns((prev) => {
      const next = [run, ...prev].slice(0, MAX_RUNS);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* quota exceeded */ }
      return next;
    });
  }, []);

  const deleteRun = useCallback((id: string) => {
    setRuns((prev) => {
      const next = prev.filter((r) => r.id !== id);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { runs, saveRun, deleteRun };
}
