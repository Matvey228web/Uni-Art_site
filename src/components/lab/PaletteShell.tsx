"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { getPalette, palettes } from "@/content/palettes";

const STORAGE_KEY = "uniart-lab-palette";

/**
 * Выбор палитры живёт вне React: localStorage плюс запасная переменная
 * в памяти на случай приватного режима, где хранилище бросает исключение.
 */
const listeners = new Set<() => void>();
let memory: string | null = null;

function readChoice(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

function writeChoice(value: string) {
  memory = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // приватный режим: выбор не переживёт перезагрузку, но страница работает
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

type Props = {
  /** Палитра, с которой открывается прототип */
  defaultPalette: string;
  /** Плёночное зерно поверх страницы */
  grain?: boolean;
  children: React.ReactNode;
};

/**
 * Обёртка прототипа: подставляет переменные палитры и рисует переключатель.
 * Дочерние компоненты берут цвета через var(--p-*) и не знают о палитрах ничего.
 */
export default function PaletteShell({ defaultPalette, grain = true, children }: Props) {
  const [open, setOpen] = useState(false);
  const stored = useSyncExternalStore(subscribe, readChoice, () => null);

  const id = stored && palettes.some((p) => p.id === stored) ? stored : defaultPalette;
  const palette = getPalette(id);

  return (
    <div
      data-stills={palette.stills}
      style={palette.vars as React.CSSProperties}
      className="relative min-h-svh bg-[var(--p-bg)] text-[var(--p-fg)]"
    >
      {grain && (
        <div
          aria-hidden
          className="grain pointer-events-none fixed inset-0 z-[60]"
        />
      )}

      {children}

      {/* Переключатель палитр */}
      <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex max-w-full items-center gap-1 rounded-full border border-[var(--p-line)] bg-[var(--p-bg-soft)]/92 p-1 shadow-lg backdrop-blur">
          <Link
            href="/lab/"
            className="shrink-0 rounded-full px-3 py-2 text-[12px] text-[var(--p-muted)] transition hover:text-[var(--p-fg)]"
            aria-label="К списку прототипов"
          >
            ←
          </Link>

          <div className="h-5 w-px shrink-0 bg-[var(--p-line)]" />

          {palettes.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => writeChoice(p.id)}
              title={p.name}
              aria-label={`Палитра «${p.name}»`}
              aria-pressed={p.id === id}
              className={`h-8 w-8 shrink-0 rounded-full border-2 transition ${
                p.id === id
                  ? "scale-110 border-[var(--p-fg)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <span
                className="block h-full w-full rounded-full border border-white/25"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${p.swatch[0]} 0 50%, ${p.swatch[1]} 50% 100%)`,
                }}
              />
            </button>
          ))}

          <div className="h-5 w-px shrink-0 bg-[var(--p-line)]" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[12px] text-[var(--p-muted)] transition hover:text-[var(--p-fg)]"
            aria-expanded={open}
          >
            {palette.name}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-3 bottom-20 z-[70] mx-auto max-w-sm rounded-xl border border-[var(--p-line)] bg-[var(--p-bg-soft)]/95 p-4 text-[13px] backdrop-blur">
          <p className="font-semibold">{palette.name}</p>
          <p className="mt-1 text-[var(--p-muted)]">{palette.note}</p>
          <p className="mt-3 text-[var(--p-muted)]">
            Кадры: {palette.stills === "mono" ? "обесцвечены" : "в цвете"}
          </p>
        </div>
      )}
    </div>
  );
}
