"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  add, arcLengthTable, atDistance, lookAngles, scale, spline, sub, len,
  toCameraSpace, type Vec3,
} from "@/lib/camera";
import {
  cameraPath, sceneItems, FOG_FAR, FOG_NEAR, PERSPECTIVE, SCROLL_SCREENS,
} from "@/content/scene";

const REDUCED = "(prefers-reduced-motion: reduce)";

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

const positions = cameraPath.map((w) => w.pos);
const targets = cameraPath.map((w) => w.look);
// прокрутка мапится на длину пути, иначе камера рвано ускоряется
const arc = arcLengthTable(positions);
const lights = sceneItems.filter((i) => i.kind === "glow");

/**
 * Вокруг каждого объекта — запретная сфера. Кривая Катмулла — Рома
 * выстреливает за пределы опорных точек, и камера налетала на постеры
 * вплотную, а те гасли ближним затуханием. Теперь камера их обходит.
 */
const solids = sceneItems
  .filter((i) => i.kind !== "glow")
  .map((i) => ({
    pos: i.pos,
    radius: i.kind === "image" ? i.width * 0.85 + 420 : 520,
  }));

function keepClear(eye: Vec3): Vec3 {
  let out = eye;
  for (const s of solids) {
    const away = sub(out, s.pos);
    const d = len(away) || 1;
    if (d < s.radius) out = add(out, scale(away, (s.radius - d) / d));
  }
  return out;
}

/** Плавное затухание на краях диапазона */
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export default function DepthScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [progress, setProgress] = useState(0);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const wrap = wrapRef.current;
    const world = worldRef.current;
    if (!wrap || !world) return;

    let frame = 0;
    let queued = false;

    const render = () => {
      queued = false;
      const rect = wrap.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = clamp01(travel > 0 ? -rect.top / travel : 0);
      setProgress(p);

      const u = atDistance(arc, p);
      const eye = keepClear(spline(positions, u));
      const look = spline(targets, u);
      const { yaw, pitch } = lookAngles(eye, look);

      // крен на поворотах: камера чуть заваливается в сторону разворота
      const uAhead = atDistance(arc, Math.min(1, p + 0.004));
      const ahead = keepClear(spline(positions, uAhead));
      const aheadLook = spline(targets, uAhead);
      const roll = Math.max(-0.14, Math.min(0.14, (lookAngles(ahead, aheadLook).yaw - yaw) * 2.2));

      world.dataset.eyez = Math.round(eye.z).toString();
      world.dataset.p = p.toFixed(3);

      const halfW = world.clientWidth / 2;
      const halfH = world.clientHeight / 2;
      // Сцена свёрстана под широкий экран. На узком уменьшаем масштаб
      // проекции — это то же самое, что расширить угол обзора: объекты
      // перестают упираться в края.
      const fit = Math.max(0.5, Math.min(1, world.clientWidth / 1280));

      for (const item of sceneItems) {
        const el = itemRefs.current[item.id];
        if (!el) continue;

        const cam = toCameraSpace(item.pos, eye, yaw, pitch, roll);
        const ahead = -cam.z; // положительное — объект перед камерой
        // туман и ближнее затухание считаем по настоящему расстоянию:
        // по «глубине вдоль взгляда» объект сбоку ошибочно оказывается вплотную
        const distance = len(sub(item.pos, eye));

        el.dataset.ahead = Math.round(ahead).toString();
        if (ahead < 120 || distance > FOG_FAR * 1.3) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";

        // Проекция считается вручную, а не средствами CSS 3D: так объект
        // не может внезапно оказаться за плоскостью камеры и пропасть,
        // а порядок перекрытия задаётся явно.
        const k = (PERSPECTIVE / ahead) * fit;
        const x = halfW + cam.x * k;
        const y = halfH + cam.y * k;
        el.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${k.toFixed(4)})` +
          `${el.dataset.tilt ? ` rotate(${el.dataset.tilt}rad)` : ""} translate(-50%, -50%)`;
        el.style.zIndex = Math.round(200000 - distance).toString();

        const fog = smooth(clamp01((distance - FOG_NEAR) / (FOG_FAR - FOG_NEAR)));
        // у самого носа объекты растворяются, иначе камера «протыкает» их
        const near = smooth(clamp01((distance - 140) / 380));

        let light = 0;
        for (const l of lights) {
          if (l.kind !== "glow") continue;
          const d = len(sub(item.pos, l.pos));
          light += l.power / (1 + (d * d) / (l.reach * l.reach));
        }

        el.dataset.depth = Math.round(distance).toString();
        el.style.setProperty("--fog", fog.toFixed(3));
        el.style.setProperty("--near", near.toFixed(3));
        el.style.setProperty("--light", Math.min(1, light).toFixed(3));

      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [still]);

  if (still) {
    // Без движения — те же тексты и кадры обычной лентой
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-24 sm:px-6">
        {sceneItems.map((item) =>
          item.kind === "glow" ? null : (
            <section key={item.id} className="border-b border-line py-10 last:border-0">
              {item.kind === "text" ? (
                <>
                  {item.eyebrow && <p className="eyebrow mb-3">{item.eyebrow}</p>}
                  {item.title && (
                    <h2 className="display whitespace-pre-line text-3xl">{item.title}</h2>
                  )}
                  {item.body && <p className="mt-3 text-muted">{item.body}</p>}
                </>
              ) : (
                <figure className="m-0">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={800}
                    height={Math.round(800 / item.ratio)}
                    className="h-auto w-full"
                  />
                  {item.caption && <figcaption className="meta mt-2">{item.caption}</figcaption>}
                </figure>
              )}
            </section>
          ),
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ height: `${SCROLL_SCREENS * 100}svh` }}>
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-bg">
        <div ref={worldRef} className="absolute inset-0">
          {sceneItems.map((item) => {
            const tilt = item.kind === "image" && item.tilt ? item.tilt : 0;

            if (item.kind === "glow") {
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  aria-hidden
                  data-item={item.id}
                  className="absolute left-0 top-0 rounded-full"
                  style={{
                    width: item.size,
                    height: item.size,
                    visibility: "hidden",
                    background: `radial-gradient(circle, ${item.color} 0%, transparent 62%)`,
                    opacity: "calc(0.22 * (1 - var(--fog, 0)) * var(--near, 1))",
                    mixBlendMode: "screen",
                  }}
                />
              );
            }

            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                data-item={item.id}
                data-tilt={tilt || undefined}
                className="absolute left-0 top-0"
                style={{
                  width: item.width,
                  visibility: "hidden",
                  opacity: "calc((1 - var(--fog, 0)) * var(--near, 1))",
                }}
              >
                <div className="relative">
                  {item.kind === "text" ? (
                    <div className="text-center">
                      {item.eyebrow && <p className="eyebrow mb-4">{item.eyebrow}</p>}
                      {item.title && (
                        <h2 className="display whitespace-pre-line text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[0.95]">
                          {item.title}
                        </h2>
                      )}
                      {item.body && (
                        <p className="mt-5 text-[15px] leading-relaxed text-muted">{item.body}</p>
                      )}
                    </div>
                  ) : (
                    <figure className="m-0">
                      {/* рамка и подсветка: кадры-заглушки почти чёрные
                          и без оправы растворяются в темноте сцены */}
                      <div className="relative rounded-[3px] p-[3px] ring-1 ring-fg/25 shadow-[0_0_60px_rgba(224,129,60,0.18)]">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={item.width}
                          height={Math.round(item.width / item.ratio)}
                          className="h-auto w-full"
                        />
                      </div>
                      {item.caption && (
                        <figcaption className="meta mt-3 text-center">{item.caption}</figcaption>
                      )}
                    </figure>
                  )}

                  {/* Свет от ближних источников. Пятно выходит за коробку
                      и гаснет по ближней стороне, иначе на панели виден
                      светлый прямоугольник с жёсткими краями.
                      Дымку отдельным слоем не рисуем: расстояние и так
                      управляет прозрачностью всего объекта. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-[35%]"
                    style={{
                      background: "radial-gradient(closest-side, #fff, transparent)",
                      opacity: "calc(var(--light, 0) * 0.34 * (1 - var(--fog, 0)))",
                      mixBlendMode: "screen",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* общая дымка и виньетка поверх сцены */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, transparent 35%, var(--bg) 100%)",
            opacity: 0.85,
          }}
        />

        {/* индикатор глубины */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-5 sm:px-8">
          <span className="meta">Глубина</span>
          <div className="mx-4 h-px flex-1 bg-line">
            <div
              className="h-px bg-accent transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="meta tabular-nums">{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
