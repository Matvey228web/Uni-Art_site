"use client";

import Image from "next/image";
import { useRef } from "react";
import { projects, site } from "@/content/site";
import PaletteShell from "@/components/lab/PaletteShell";
import PlayButton from "@/components/lab/PlayButton";

/**
 * Вариант C — «Характер».
 * Крупная типографика во весь экран, один резкий акцент,
 * проекты — горизонтальная лента. Держится на подаче, а не на объёме портфолио.
 */
export default function VariantC() {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <PaletteShell defaultPalette="cinnabar">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em]">
            {site.name}
          </span>
          <nav className="hidden gap-7 text-[12px] uppercase tracking-[0.18em] sm:flex">
            {["Работы", "Студия", "Контакты"].map((item) => (
              <span
                key={item}
                className="cursor-pointer text-[var(--p-muted)] transition hover:text-[var(--p-fg)]"
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* Первый экран */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden px-4 pb-24 pt-24 sm:px-8 sm:pb-20">
        {/* Кадр: полосой сверху на телефоне, вертикальной полосой справа на десктопе */}
        <div className="pointer-events-none absolute right-0 top-0 h-[46%] w-full lg:h-full lg:w-[38%]">
          <Image
            src={site.heroPoster}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 38vw"
            className="still kenburns object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--p-bg)] via-[var(--p-bg)]/40 to-transparent lg:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[var(--p-bg)] via-transparent to-transparent lg:block" />
        </div>

        <div className="relative">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[var(--p-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--p-on-accent)]">
            Набираем проекты на 2026
          </div>

          <h1
            className="display leading-[0.82] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 12.5vw, 11rem)" }}
          >
            <span className="block">Снимаем</span>
            <span className="block text-[var(--p-accent)]">то, что</span>
            <span className="block">смотрят</span>
            <span className="block">до конца</span>
          </h1>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--p-line)] pt-6">
            <p className="max-w-md text-[15px] leading-relaxed text-[var(--p-muted)]">
              Реклама, клипы, короткий метр и документальное кино. Полный цикл —
              от первой строчки сценария до мастера под площадки.
            </p>
            <div className="inline-flex items-center gap-3 text-[13px] uppercase tracking-[0.18em]">
              <PlayButton size={56} variant="solid" />
              Шоурил 01:42
            </div>
          </div>
        </div>
      </section>

      {/* Лента проектов */}
      <section className="border-t border-[var(--p-line)] py-14 pb-28 sm:py-20 sm:pb-28">
        <div className="mb-8 flex items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--p-accent)]">
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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--p-line)] text-lg transition hover:border-[var(--p-fg)]"
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
                  className="still object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <span className="display absolute left-4 top-3 text-5xl text-[var(--p-accent)] sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                    {project.category} · {project.year}
                  </p>
                  <h3 className="display mt-1 text-2xl">{project.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--p-muted)]">
                {project.summary}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-6 px-4 text-[12px] uppercase tracking-[0.18em] text-[var(--p-muted)] sm:hidden">
          Листай вбок →
        </p>
      </section>
    </PaletteShell>
  );
}
