"use client";

import { useEffect, useRef } from "react";
import { TILE, grainTile } from "@/lib/grain";

/** Сколько плиток перебирать. Зерно должно пересыпаться, а не ездить. */
const FRAMES = 3;
/** Во сколько раз крупнее второй слой и насколько он слабее. */
const COARSE_SCALE = 2.9;
const COARSE_ALPHA = 0.45;
/** Смены кадра в секунду: у мелкого слоя чаще, у крупного реже — отсюда «кипение». */
const FINE_FPS = 13;
const COARSE_FPS = 5.3;

/**
 * Плёночное зерно поверх всей страницы.
 *
 * Рисуем на холсте, а не мостим картинку фоном, по двум причинам.
 *
 * Первая: холст заводится в css-пикселях, а растягивает его до плотности
 * экрана уже браузер — и растягивает без интерполяции, по правилу
 * image-rendering. Сгусток зерна выходит одного видимого размера и одной
 * силы на любом экране: раньше на ретине зерно мельчало вдвое, глаз его
 * усреднял, и это приходилось вытягивать отдельным правилом на прозрачность.
 *
 * В физических пикселях холст рисовать нельзя: на ретине это 2560x1800,
 * и перерисовка тринадцать раз в секунду роняла по восемьдесят длинных
 * кадров на восемьсот — замер показал, что это была самая дорогая вещь
 * на странице.
 *
 * Вторая: зерно должно пересыпаться на месте. Сдвигать одно полотно
 * нельзя — глаз цепляется за узор и видит, как тот едет целиком. Здесь
 * кадры перебираются по кругу, и каждый ещё и смещён, так что повторов
 * рисунка не поймать.
 *
 * Слой не ловит события и лежит ниже шапки, чтобы интерфейс оставался чётким.
 */
export default function FilmGrain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const patterns: CanvasPattern[] = [];
    for (let i = 0; i < FRAMES; i++) {
      const tile = document.createElement("canvas");
      tile.width = tile.height = TILE;
      tile.getContext("2d")!.putImageData(grainTile(i + 1), 0, 0);
      const pattern = ctx.createPattern(tile, "repeat");
      if (pattern) patterns.push(pattern);
    }
    if (!patterns.length) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    /** Смещение кадра: своё у каждой пары «плитка + слой», без повторов на глаз. */
    const shift = (n: number) => ((n * 2654435761) % TILE) - TILE / 2;

    const paint = (fine: number, coarse: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const a = patterns[fine % patterns.length];
      a.setTransform(new DOMMatrix().translateSelf(shift(fine), shift(fine + 7)));
      ctx.globalAlpha = 1;
      ctx.fillStyle = a;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const b = patterns[coarse % patterns.length];
      b.setTransform(
        new DOMMatrix()
          .translateSelf(shift(coarse + 3), shift(coarse + 11))
          .scaleSelf(COARSE_SCALE),
      );
      ctx.globalAlpha = COARSE_ALPHA;
      ctx.fillStyle = b;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    };

    resize();

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastFine = -1;
    let lastCoarse = -1;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden) return;
      const fine = Math.floor((now / 1000) * FINE_FPS);
      const coarse = Math.floor((now / 1000) * COARSE_FPS);
      if (fine === lastFine && coarse === lastCoarse) return;
      lastFine = fine;
      lastCoarse = coarse;
      paint(fine, coarse);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (still.matches) paint(0, 1);
      else frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      lastFine = lastCoarse = -1;
      if (still.matches) paint(0, 1);
    };

    start();
    window.addEventListener("resize", onResize);
    still.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      still.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[45] h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
