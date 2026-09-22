"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, site } from "@/content/site";

/**
 * Вариант A — «Тихий».
 * Полноэкранные секции со снап-скроллом, обесцвеченные кадры,
 * мелкая типографика. Интерфейс уступает место изображению.
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
    <div className="relative h-svh overflow-hidden bg-black text-white">
      {/* Шапка поверх кадра: инверсия цвета делает её читаемой на любом фоне */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 mix-blend-difference">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <span className="text-[13px] font-semibold uppercase tracking-[0.3em]">
            {site.name}
          </span>
          <nav className="pointer-events-auto hidden gap-7 text-[13px] uppercase tracking-[0.18em] sm:flex">
            {["Работы", "Студия", "Контакты"].map((item) => (
              <span key={item} className="cursor-pointer opacity-70 hover:opacity-100">
                {item}
              </span>
            ))}
          </nav>
          <Link
            href="/lab/"
            className="pointer-events-auto text-[13px] uppercase tracking-[0.18em] opacity-70 hover:opacity-100 sm:hidden"
          >
            ← Lab
          </Link>
        </div>
      </header>

      {/* Индикатор секций */}
      <div className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 mix-blend-difference sm:flex">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Секция ${i + 1}`}
            className={`h-px transition-all duration-500 ${
              active === i ? "w-8 bg-white" : "w-4 bg-white/40"
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
            className="kenburns object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/35" />
          <button
            type="button"
            className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/50 transition hover:border-white sm:h-24 sm:w-24"
            aria-label="Смотреть шоурил"
          >
            <span
              aria-hidden
              className="ml-1 inline-block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-white/80 transition group-hover:border-l-white"
            />
          </button>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-8 text-[13px] uppercase tracking-[0.18em] sm:px-8">
            <span className="max-w-[14rem] leading-relaxed opacity-80 sm:max-w-none">
              Кинопродакшн полного цикла · {site.city}
            </span>
            <span className="opacity-80">Showreel 2026 · 01:42</span>
          </div>
        </section>

        {/* Проекты: один экран — один проект */}
        {projects.map((project, i) => (
          <section
            key={project.slug}
            className="relative flex h-svh snap-start items-end overflow-hidden"
          >
            <Image
              src={project.poster}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover grayscale transition duration-[1.2s] hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

            <div className="relative flex w-full items-end justify-between gap-6 px-5 pb-16 sm:px-8 sm:pb-20">
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
                {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>
          </section>
        ))}
      </div>

      <Link
        href="/lab/"
        className="fixed bottom-5 left-5 z-30 hidden text-[13px] uppercase tracking-[0.18em] mix-blend-difference hover:opacity-70 sm:block"
      >
        ← Lab
      </Link>
    </div>
  );
}
