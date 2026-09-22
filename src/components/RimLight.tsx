"use client";

import { useEffect } from "react";

/** На каком расстоянии свет ослабевает вдвое, в пикселях */
const FALLOFF = 380;

/**
 * Источник контрового света, привязанный к курсору.
 *
 * Свет — это точка на странице, а не подсветка наведённого элемента.
 * Каждый кадр каждый элемент считает, насколько он освещён и с какой
 * стороны, поэтому свет достаёт и до соседей: проводя курсором между
 * карточками, видно, как они загораются и гаснут по очереди.
 *
 * Сила падает по закону обратных квадратов — 1 / (1 + (d / R)²), где d
 * меряется до ближайшего края, а не до центра: у крупной карточки центр
 * далеко, и по нему освещённость получалась бы неправдоподобно низкой.
 */
export default function RimLight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let latest: PointerEvent | null = null;
    let touched: HTMLElement[] = [];

    const clear = () => {
      for (const el of touched) el.style.setProperty("--rim-on", "0");
      touched = [];
    };

    const apply = () => {
      frame = 0;
      const event = latest;
      if (!event) return;

      const { clientX: x, clientY: y } = event;
      const elements = document.querySelectorAll<HTMLElement>("[data-rim]");
      const next: HTMLElement[] = [];

      // сначала только чтение геометрии, потом только запись:
      // вперемешку это заставляло бы браузер пересчитывать разметку
      const measured: {
        el: HTMLElement;
        on: number;
        sx: number;
        sy: number;
        rx: number;
        ry: number;
        ax: number;
        ay: number;
      }[] = [];

      for (const el of elements) {
        const box = el.getBoundingClientRect();
        if (box.bottom < -400 || box.top > window.innerHeight + 400) continue;

        // расстояние до ближайшего края: внутри элемента оно равно нулю
        const dx = Math.max(box.left - x, 0, x - box.right);
        const dy = Math.max(box.top - y, 0, y - box.bottom);
        const distance = Math.hypot(dx, dy);
        const on = 1 / (1 + (distance / FALLOFF) ** 2);
        if (on < 0.02) continue;

        // куда падает тень: от источника к центру элемента
        const toCenter = {
          x: box.left + box.width / 2 - x,
          y: box.top + box.height / 2 - y,
        };
        const length = Math.hypot(toCenter.x, toCenter.y) || 1;

        measured.push({
          el,
          on,
          sx: toCenter.x / length,
          sy: toCenter.y / length,
          rx: x - box.left,
          ry: y - box.top,
          // точка, противоположная источнику: оттуда «светит» тень
          ax: box.width - (x - box.left),
          ay: box.height - (y - box.top),
        });
        next.push(el);
      }

      for (const el of touched) {
        if (!next.includes(el)) el.style.setProperty("--rim-on", "0");
      }

      for (const m of measured) {
        const { style } = m.el;
        style.setProperty("--rim-on", m.on.toFixed(3));
        style.setProperty("--sx", m.sx.toFixed(3));
        style.setProperty("--sy", m.sy.toFixed(3));
        style.setProperty("--rx", `${m.rx.toFixed(1)}px`);
        style.setProperty("--ry", `${m.ry.toFixed(1)}px`);
        style.setProperty("--ax", `${m.ax.toFixed(1)}px`);
        style.setProperty("--ay", `${m.ay.toFixed(1)}px`);
      }

      touched = next;
    };

    const onMove = (event: PointerEvent) => {
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", clear);
    window.addEventListener("blur", clear);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", clear);
      window.removeEventListener("blur", clear);
      clear();
    };
  }, []);

  return null;
}
