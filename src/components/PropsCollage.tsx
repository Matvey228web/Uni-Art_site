"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Engine, Body } from "matter-js";
import { props as propList } from "@/content/props";

const WALL = 200;

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Предметов больше, чем рисунков: каждый повторяется в двух-трёх размерах,
 * иначе восемь штук просто выстраиваются в ряд по дну, а нужна куча.
 * Масштаб считается от индекса, а не случайно: разметка рендерится
 * на сервере, случайные числа разошлись бы при гидратации.
 */
const instances = Array.from({ length: propList.length * 3 }, (_, i) => {
  const prop = propList[i % propList.length];
  const scale = [1, 0.74, 0.88, 0.62, 1.08][i % 5];
  return { ...prop, key: `${prop.file}-${i}`, width: prop.width * scale };
});

/** Системная настройка «меньше движения» — читаем как внешний источник,
 *  иначе пришлось бы звать setState прямо в эффекте. */
function useReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

type Tilt = "unavailable" | "off" | "on";

/**
 * Коллаж из киноатрибутики на физическом движке: предметы падают в кадр,
 * сталкиваются, их можно швырять мышью или пальцем.
 *
 * Движок грузится динамически и работает только когда блок в зоне видимости.
 * При prefers-reduced-motion физика не запускается вовсе — показываем
 * разложенный коллаж без движения.
 */
export default function PropsCollage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<Engine | null>(null);
  const bodiesRef = useRef<Body[]>([]);
  const frameRef = useRef<number>(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const [ready, setReady] = useState(false);
  const [tilt, setTilt] = useState<Tilt>("unavailable");
  const still = useReducedMotion();

  // Разбросать предметы заново
  const shuffle = useCallback(async () => {
    const engine = engineRef.current;
    const scene = sceneRef.current;
    if (!engine || !scene) return;
    const { Body: B } = await import("matter-js");
    const w = scene.clientWidth;
    for (const body of bodiesRef.current) {
      B.setPosition(body, { x: 40 + Math.random() * (w - 80), y: -120 - Math.random() * 300 });
      B.setVelocity(body, { x: (Math.random() - 0.5) * 12, y: 0 });
      B.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
    }
  }, []);

  // Гравитация по наклону телефона; на iOS нужно спросить разрешение жестом
  const enableTilt = useCallback(async () => {
    type Req = { requestPermission?: () => Promise<PermissionState> };
    const D = window.DeviceOrientationEvent as unknown as Req | undefined;
    if (!D) return;
    if (typeof D.requestPermission === "function") {
      try {
        if ((await D.requestPermission()) !== "granted") return;
      } catch {
        return;
      }
    }
    const onOrient = (e: DeviceOrientationEvent) => {
      const engine = engineRef.current;
      if (!engine || e.gamma === null || e.beta === null) return;
      engine.gravity.x = Math.max(-1, Math.min(1, e.gamma / 45));
      engine.gravity.y = Math.max(-1, Math.min(1, e.beta / 45));
    };
    window.addEventListener("deviceorientation", onOrient);
    setTilt("on");
    const previous = cleanupRef.current;
    cleanupRef.current = () => {
      window.removeEventListener("deviceorientation", onOrient);
      previous?.();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || still) return;

    let disposed = false;

    (async () => {
      const { Engine, Bodies, Composite, Body, Mouse, MouseConstraint } = await import("matter-js");
      if (disposed) return;

      const width = scene.clientWidth;
      const height = scene.clientHeight;
      const scale = Math.max(0.52, Math.min(1, width / 880));

      const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0014 } });
      engineRef.current = engine;

      const walls = [
        Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, { isStatic: true }),
        Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
        Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
      ];
      Composite.add(engine.world, walls);

      const bodies = instances.map((prop, i) => {
        const w = prop.width * scale;
        const h = w / prop.ratio;
        const x = 40 + Math.random() * Math.max(1, width - 80);
        const y = -100 - i * 120 - Math.random() * 90;
        const options = {
          restitution: 0.32,
          friction: 0.45,
          frictionAir: 0.012,
          density: 0.0014,
          angle: (Math.random() - 0.5) * 1.2,
        };
        return prop.shape === "circle"
          ? Bodies.circle(x, y, (w / 2) * 0.94, options)
          : Bodies.rectangle(x, y, w, h, { ...options, chamfer: { radius: Math.min(w, h) * 0.12 } });
      });
      Composite.add(engine.world, bodies);
      bodiesRef.current = bodies;

      // Перетаскивание. Matter по умолчанию гасит touchmove и блокирует
      // прокрутку страницы, поэтому гасим её только когда предмет схвачен.
      const mouse = Mouse.create(scene);
      const drag = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.16, damping: 0.08, render: { visible: false } },
      });
      Composite.add(engine.world, drag);

      const m = mouse as unknown as {
        mousemove: (e: Event) => void;
        mousedown: (e: Event) => void;
        mouseup: (e: Event) => void;
      };
      scene.removeEventListener("touchmove", m.mousemove);
      scene.removeEventListener("touchstart", m.mousedown);
      scene.removeEventListener("touchend", m.mouseup);
      const onTouchMove = (e: TouchEvent) => {
        m.mousemove(e);
        if (drag.body) e.preventDefault();
      };
      const onTouchStart = (e: TouchEvent) => m.mousedown(e);
      const onTouchEnd = (e: TouchEvent) => m.mouseup(e);
      scene.addEventListener("touchmove", onTouchMove, { passive: false });
      scene.addEventListener("touchstart", onTouchStart, { passive: true });
      scene.addEventListener("touchend", onTouchEnd, { passive: true });

      setReady(true);
      if (typeof window.DeviceOrientationEvent !== "undefined") setTilt("off");

      // Считаем только когда блок виден: за экраном движок стоит
      let running = false;
      let last = performance.now();
      const step = (now: number) => {
        const dt = Math.min(32, now - last);
        last = now;
        Engine.update(engine, dt);
        for (let i = 0; i < bodies.length; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const b = bodies[i];
          el.style.transform = `translate3d(${b.position.x}px, ${b.position.y}px, 0) translate(-50%, -50%) rotate(${b.angle}rad)`;
        }
        frameRef.current = requestAnimationFrame(step);
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            last = performance.now();
            frameRef.current = requestAnimationFrame(step);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(frameRef.current);
          }
        },
        // запас вокруг экрана: предметы успевают упасть до того,
        // как секция окажется перед глазами
        { rootMargin: "60% 0px", threshold: 0 },
      );
      io.observe(scene);

      // При смене размера окна двигаем стены и возвращаем улетевшее в кадр
      const onResize = () => {
        const nw = scene.clientWidth;
        const nh = scene.clientHeight;
        Body.setPosition(walls[0], { x: nw / 2, y: nh + WALL / 2 });
        Body.setPosition(walls[1], { x: -WALL / 2, y: nh / 2 });
        Body.setPosition(walls[2], { x: nw + WALL / 2, y: nh / 2 });
        for (const b of bodies) {
          if (b.position.x > nw || b.position.y > nh) {
            Body.setPosition(b, { x: Math.random() * nw, y: -100 });
            Body.setVelocity(b, { x: 0, y: 0 });
          }
        }
      };
      window.addEventListener("resize", onResize);

      cleanupRef.current = () => {
        io.disconnect();
        window.removeEventListener("resize", onResize);
        scene.removeEventListener("touchmove", onTouchMove);
        scene.removeEventListener("touchstart", onTouchStart);
        scene.removeEventListener("touchend", onTouchEnd);
        cancelAnimationFrame(frameRef.current);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      disposed = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
      engineRef.current = null;
    };
  }, [still]);

  return (
    <div>
      <div
        ref={sceneRef}
        role="group"
        aria-label="Коллаж из киноатрибутики, предметы можно перетаскивать"
        data-rim
        className="rim relative h-[46svh] min-h-[300px] w-full touch-pan-y select-none overflow-hidden rounded-lg border border-line bg-bg-soft"
      >
        {/* разметка кадра на фоне */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--fg) 1px, transparent 1px), linear-gradient(90deg, var(--fg) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {instances.map((prop, i) => (
          <div
            key={prop.key}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`absolute left-0 top-0 will-change-transform ${
              still ? "" : "cursor-grab active:cursor-grabbing"
            } ${ready || still ? "opacity-100" : "opacity-0"}`}
            style={
              still
                ? {
                    // без движения — просто аккуратная раскладка
                    transform: `translate3d(${6 + (i % 5) * 20}%, ${14 + Math.floor(i / 5) * 24}%, 0) rotate(${
                      (i % 5) - 2
                    }deg)`,
                  }
                : undefined
            }
          >
            <Image
              src={`/props/${prop.file}`}
              alt={prop.alt}
              width={Math.round(prop.width * 2)}
              height={Math.round((prop.width / prop.ratio) * 2)}
              draggable={false}
              className="pointer-events-none h-auto w-[var(--w)] max-w-none drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
              style={{ ["--w" as string]: `clamp(${prop.width * 0.52}px, ${prop.width / 9}vw, ${prop.width}px)` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={shuffle}
          disabled={still}
          className="meta rounded-full border border-line px-5 py-2.5 text-fg transition hover:border-accent hover:text-accent disabled:opacity-40"
        >
          Разбросать заново
        </button>

        {tilt !== "unavailable" && (
          <button
            type="button"
            onClick={enableTilt}
            disabled={tilt === "on"}
            className="meta rounded-full border border-line px-5 py-2.5 text-fg transition hover:border-accent hover:text-accent disabled:opacity-40"
          >
            {tilt === "on" ? "Наклоняй телефон" : "Управлять наклоном"}
          </button>
        )}

        <p className="meta">
          {still ? "Движение отключено в настройках системы" : "Предметы можно хватать и швырять"}
        </p>
      </div>
    </div>
  );
}
