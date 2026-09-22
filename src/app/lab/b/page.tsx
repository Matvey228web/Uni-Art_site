"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { projectCategories, projects, site, stats } from "@/content/site";

/**
 * Вариант B — «Каталог».
 * Светлая тема, кадры в цвете, плотная сетка с фильтрами.
 * Рассчитан на объём: одинаково работает на шести проектах и на шестидесяти.
 */
export default function VariantB() {
  const [filter, setFilter] = useState<string>("Все");

  const filters = useMemo(() => {
    const used = projectCategories.filter((c) => projects.some((p) => p.category === c));
    return [
      { label: "Все", count: projects.length },
      ...used.map((c) => ({
        label: c,
        count: projects.filter((p) => p.category === c).length,
      })),
    ];
  }, []);

  const visible =
    filter === "Все" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-svh bg-[#f2f1ee] text-[#14150f]">
      <header className="sticky top-0 z-40 border-b border-[#14150f]/12 bg-[#f2f1ee]/92 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
          <span className="text-[13px] font-semibold uppercase tracking-[0.28em]">
            {site.name}
          </span>
          <nav className="hidden gap-7 text-[13px] sm:flex">
            {["Работы", "Услуги", "Студия", "Контакты"].map((item) => (
              <span key={item} className="cursor-pointer opacity-60 hover:opacity-100">
                {item}
              </span>
            ))}
          </nav>
          <Link
            href="/lab/"
            className="rounded-full border border-[#14150f]/25 px-3 py-1 text-[12px] hover:border-[#14150f]"
          >
            ← Lab
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <button
              type="button"
              className="group relative block aspect-video w-full overflow-hidden rounded-sm bg-black"
              aria-label="Смотреть шоурил"
            >
              <Image
                src={site.heroPoster}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-black">
                Шоурил 2026
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition group-hover:scale-110">
                  <span
                    aria-hidden
                    className="ml-1 inline-block h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-black"
                  />
                </span>
              </span>
              <span className="absolute bottom-4 right-4 text-[12px] text-white/90">
                01:42
              </span>
            </button>
          </div>

          <div className="lg:col-span-4">
            <h1 className="text-[15px] font-semibold leading-relaxed">
              {site.legalName} — кинопродакшн полного цикла. {site.city}.
            </h1>
            <p className="mt-4 text-[14px] leading-relaxed opacity-70">
              Реклама, музыкальные клипы, короткий метр и документальное кино.
              Берём проект от идеи до финального мастера: сценарий, препродакшн,
              съёмочный период, постпродакшн.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-y-5 border-t border-[#14150f]/12 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-2xl font-semibold tabular-nums">
                      {s.value}
                    </span>
                    <span className="mt-0.5 block text-[12px] opacity-60">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-8">
        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {filters.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFilter(f.label)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] transition ${
                filter === f.label
                  ? "border-[#14150f] bg-[#14150f] text-[#f2f1ee]"
                  : "border-[#14150f]/20 hover:border-[#14150f]/60"
              }`}
            >
              {f.label}
              <span className="text-[11px] tabular-nums opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
          {visible.map((project) => (
            <article key={project.slug} className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden rounded-sm bg-black">
                <Image
                  src={project.poster}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-white transition-transform duration-[2.5s] ease-linear group-hover:scale-x-100" />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/0 opacity-0 transition group-hover:bg-white/90 group-hover:opacity-100">
                  <span
                    aria-hidden
                    className="ml-0.5 inline-block h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-black"
                  />
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h2 className="text-[14px] font-semibold">{project.title}</h2>
                <span className="text-[12px] tabular-nums opacity-50">{project.year}</span>
              </div>
              <p className="mt-1 text-[12px] opacity-60">
                {project.category} · {project.role}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
