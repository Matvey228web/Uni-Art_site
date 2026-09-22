"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { projects, site } from "@/content/site";

const ACCENT = "#ff4a1c";

/**
 * Вариант C — «Характер».
 * Крупная типографика во весь экран, один резкий акцент,
 * проекты — горизонтальная лента. Работает даже на слабом портфолио.
 */
export default function VariantC() {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="min-h-svh bg-[#0b0b0b] text-white">
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em]">
            {site.name}
          </span>
          <Link
            href="/lab/"
            className="text-[12px] uppercase tracking-[0.18em] opacity-60 hover:opacity-100"
          >
            ← Lab
          </Link>
        </div>
      </header>

      {/* Первый экран */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden px-4 pb-10 pt-24 sm:px-8 sm:pb-14">
        {/* Кадр: полосой сверху на телефоне, вертикальной полосой справа на десктопе */}
        <div className="pointer-events-none absolute right-0 top-0 h-[46%] w-full lg:h-full lg:w-[38%]">
          <Image
            src={site.heroPoster}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 38vw"
            className="kenburns object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-transparent lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#0b0b0b] via-transparent to-transparent lg:block" />
        </div>

        <div className="relative">
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ backgroundColor: ACCENT }}
          >
            Набираем проекты на 2026
          </div>

          <h1
            className="display leading-[0.82] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 12.5vw, 11rem)" }}
          >
            <span className="block">Снимаем</span>
            <span className="block" style={{ color: ACCENT }}>
              то, что
            </span>
            <span className="block">смотрят</span>
            <span className="block">до конца</span>
          </h1>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
            <p className="max-w-md text-[15px] leading-relaxed text-white/70">
              Реклама, клипы, короткий метр и документальное кино. Полный цикл —
              от первой строчки сценария до мастера под площадки.
            </p>
            <button
              type="button"
              className="group inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.18em]"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full transition group-hover:scale-110"
                style={{ backgroundColor: ACCENT }}
              >
                <span
                  aria-hidden
                  className="ml-1 inline-block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-black"
                />
              </span>
              Шоурил 01:42
            </button>
          </div>
        </div>
      </section>

      {/* Лента проектов */}
      <section className="border-t border-white/12 py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: ACCENT }}
            >
              Избранное
            </p>
            <h2 className="display mt-3 text-4xl sm:text-6xl">Работы</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scrollRail(d)}
                aria-label={d === 1 ? "Дальше" : "Назад"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-lg transition hover:border-white"
              >
                {d === 1 ? "→" : "←"}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-6 sm:px-8"
        >
          {projects.map((project, i) => (
            <article
              key={project.slug}
              className="group w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[30vw]"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={project.poster}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 42vw, 30vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span
                  className="display absolute left-4 top-3 text-5xl sm:text-6xl"
                  style={{ color: ACCENT }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                    {project.category} · {project.year}
                  </p>
                  <h3 className="display mt-1 text-2xl">{project.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">
                {project.summary}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 px-4 text-[12px] uppercase tracking-[0.18em] text-white/40 sm:hidden">
          Листай вбок →
        </p>
      </section>
    </div>
  );
}
