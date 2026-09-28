"use client";

import { useEffect, useRef } from "react";
import { TILE, grainTile } from "@/lib/grain";

/** Сколько плиток перебирать. Зерно должно пересыпаться, а не ездить. */
const FRAMES = 3;
/** Смен кадра в секунду. */
const FPS = 13;

/**
 * Плёночное зерно поверх всей страницы.
 *
 * Рисуем на холсте, а не мостим картинку фоном, по двум причинам.
 *
 * Первая: холст заводится в css-пикселях, а растягивает его до плотности
 * экрана уже браузер, своей интерполяцией. Сгусток зерна выходит одного
 * видимого размера на любом экране: раньше на ретине зерно мельчало вдвое,
 * глаз его усреднял, и это приходилось вытягивать отдельным правилом
 * на прозрачность.
 *
 * Растягивать без интерполяции (image-rendering: pixelated) нельзя, хотя
 * так сохранялся бы контраст: на экране втрое плотнее каждый пиксель шума
 * превращается в жёсткий квадрат 3x3, и зерно перестаёт быть зерном.
 * У плёнки резких краёв нет. Потерю контраста добираем амплитудой.
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
 * Слой один. Раньше их было два, мелкий и втрое крупнее, ради «кипения»
 * на разных масштабах — теперь разные масштабы есть в самой плитке,
 * и второй слой только съедал контраст и время.
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

    /** Смещение кадра: своё у каждого, без повторов рисунка на глаз. */
    const shift = (n: number) => ((n * 2654435761) % TILE) - TILE / 2;

    const paint = (frame: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const tile = patterns[frame % patterns.length];
      tile.setTransform(new DOMMatrix().translateSelf(shift(frame), shift(frame + 7)));
      ctx.fillStyle = tile;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resize();

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = -1;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const frame = Math.floor((now / 1000) * FPS);
      if (frame === last) return;
      last = frame;
      paint(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (still.matches) paint(0);
      else raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      last = -1;
      if (still.matches) paint(0);
    };

    start();
    window.addEventListener("resize", onResize);
    still.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      still.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-[45] h-full w-full"
    />
  );
}
