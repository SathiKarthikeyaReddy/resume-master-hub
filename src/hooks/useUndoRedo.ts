import { useCallback, useRef, useState, useEffect } from "react";

interface Options {
  maxHistory?: number;
  /** Debounce ms for snapshot collapsing (group rapid edits). */
  debounceMs?: number;
}

/**
 * Generic undo/redo for any serializable state.
 * Returns the live state, set/replace, undo, redo, and canUndo/canRedo flags.
 */
export const useUndoRedo = <T,>(initial: T, opts: Options = {}) => {
  const { maxHistory = 50, debounceMs = 600 } = opts;
  const [state, setState] = useState<T>(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const lastSnap = useRef<string>(JSON.stringify(initial));
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Snapshot current state into history
  const snapshot = useCallback((value: T) => {
    const serialized = JSON.stringify(value);
    if (serialized === lastSnap.current) return;
    past.current.push(JSON.parse(lastSnap.current));
    if (past.current.length > maxHistory) past.current.shift();
    future.current = [];
    lastSnap.current = serialized;
  }, [maxHistory]);

  // Public setter — debounces snapshot creation so rapid keystrokes group
  const set = useCallback((next: T | ((prev: T) => T)) => {
    setState((prev) => {
      const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => snapshot(value), debounceMs);
      return value;
    });
  }, [snapshot, debounceMs]);

  // Replace state without affecting history (e.g. remote update)
  const replace = useCallback((value: T) => {
    setState(value);
    lastSnap.current = JSON.stringify(value);
  }, []);

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    const prev = past.current.pop()!;
    future.current.push(JSON.parse(lastSnap.current));
    lastSnap.current = JSON.stringify(prev);
    setState(prev);
  }, []);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    const next = future.current.pop()!;
    past.current.push(JSON.parse(lastSnap.current));
    lastSnap.current = JSON.stringify(next);
    setState(next);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  return {
    state,
    set,
    replace,
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
};
