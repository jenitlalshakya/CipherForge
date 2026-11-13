"use client";

import { useEffect, useRef } from "react";

/**
 * Runs a one-time initialization callback after the component mounts.
 *
 * The callback is deferred to the next task so the hydrating render stays
 * pure and identical to the server output. Secrets are generated only after
 * the page is interactive, never during render or on the server.
 */
export function useAutoGenerate(callback: () => void): void {
  const initialCallback = useRef(callback);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      initialCallback.current();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);
}
