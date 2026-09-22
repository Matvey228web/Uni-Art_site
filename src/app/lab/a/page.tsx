"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects, site } from "@/content/site";
import PaletteShell from "@/components/lab/PaletteShell";
import PlayButton from "@/components/lab/PlayButton";

/**
 * Вариант A — «Тихий».
 * Полноэкранные секции со снап-скроллом, мелкая типографика.
 * Интерфейс уступает место изображению.
 */
export default function VariantA() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = projects.length + 1;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const index = Math.round(scroller.scrollTop / scroller.clientHeight);
      setActive(Math.min(index, total - 1));
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [total]);

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: index * scroller.clientHeight, behavior: "smooth" });
  }

  return (
    <PaletteShell defaultPalette="mono">
      <div className="relative h-svh overflow-hidden">
        {/* Шапка поверх кадра */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
          <div className="flex items-center justify-between px-5 py-5 sm:px-8">
            <span className="text-[13px] font-semibold uppercase tracking-[0.3em]">
              {site.name}
            </span>
            <nav className="pointer-events-auto hidden gap-7 text-[13px] uppercase tracking-[0.18em] sm:flex">
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

        {/* Индикатор секций */}
        <div className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Секция ${i + 1}`}
              aria-current={active === i}
              className={`h-px bg-[var(--p-fg)] transition-all duration-500 ${
                active === i ? "w-8 opacity-100" : "w-4 opacity-40"
              }`}
            />
          ))}
        </div>

        <div
          ref={scrollerRef}
          className="no-scrollbar h-svh snap-y snap-mandatory overflow-y-scroll"
        >
          {/* Шоурил */}
          <section className="relative flex h-svh snap-start items-center justify-center overflow-hidden">
            <Image
              src={site.heroPoster}
              alt=""
              fill
              priority
              className="still kenburns object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <PlayButton size={88} className="relative" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-24 text-[13px] uppercase tracking-[0.18em] sm:px-8">
              <span className="max-w-[13rem] leading-relaxed text-[var(--p-muted)] sm:max-w-none">
                {site.tagline} · {site.city}
              </span>
              <span className="text-right text-[var(--p-muted)]">
                Showreel 2026 · 01:42
              </span>
            </div>
          </section>

          {/* Проекты: один экран — один проект */}
          {projects.map((project, i) => (
            <section
              key={project.slug}
              className="group relative flex h-svh snap-start items-end overflow-hidden"
            >
              <Image
                src={project.poster}
                alt={project.title}
                fill
                sizes="100vw"
                className="still object-cover transition duration-[1.2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

              <div className="relative flex w-full items-end justify-between gap-6 px-5 pb-24 text-white sm:px-8">
                <div>
                  <p className="text-[13px] uppercase tracking-[0.18em] opacity-70">
                    {project.category} · {project.year}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                    {project.title}
                  </h2>
                  <p className="mt-2 max-w-md text-[13px] leading-relaxed opacity-70">
                    {project.role}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] tabular-nums opacity-60">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>
            </section>
          ))}
        </div>
      </div>
    </PaletteShell>
  );
}
