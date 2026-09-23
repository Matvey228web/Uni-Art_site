import type { CSSProperties } from "react";

/** Своя фаза и свой темп дрожания для каждого блока, по его номеру. */
export function flutterStyle(index: number): CSSProperties {
  return {
    "--fl-delay": `-${(((index * 83) % 31) / 10).toFixed(2)}s`,
    "--fl-rate": (0.84 + ((index * 37) % 11) / 27).toFixed(3),
  } as CSSProperties;
}
