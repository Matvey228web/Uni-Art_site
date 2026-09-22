"use client";

import { useEffect } from "react";

/**
 * Ведёт контровый свет за курсором.
 *
 * Один слушатель на всю страницу вместо обработчика на каждой карточке:
 * находим ближайший элемент с data-rim и пишем ему координаты курсора
 * в css-переменные. Обновление раз в кадр, без перерисовки разметки.
 */
export default function RimLight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let latest: PointerEvent | null = null;
    let lit: HTMLElement | null = null;

    const dim = (el: HTMLElement | null) => el?.style.setProperty("--rim-on", "0");

    const apply = () => {
      frame = 0;
      const event = latest;
      if (!event) return;

      const target = event.target as Element | null;
      const el = target?.closest?.("[data-rim]") as HTMLElement | null;

      if (el !== lit) {
        dim(lit);
        lit = el;
      }
      if (!el) return;

      const box = el.getBoundingClientRect();
      el.style.setProperty("--rx", `${(event.clientX - box.left).toFixed(1)}px`);
      el.style.setProperty("--ry", `${(event.clientY - box.top).toFixed(1)}px`);
      el.style.setProperty("--rim-on", "1");
    };

    const onMove = (event: PointerEvent) => {
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      dim(lit);
      lit = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      dim(lit);
    };
  }, []);

  return null;
}
