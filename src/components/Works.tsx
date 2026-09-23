"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { projectCategories, projects, type ProjectCategory } from "@/content/site";
import { flutterStyle } from "@/lib/flutter";
import Reveal from "./Reveal";
import Section from "./Section";

type Filter = ProjectCategory | "Все";

export default function Works() {
  const [filter, setFilter] = useState<Filter>("Все");

  const filters = useMemo(() => {
    const used = projectCategories.filter((c) => projects.some((p) => p.category === c));
    return [
      { label: "Все" as Filter, count: projects.length },
      ...used.map((c) => ({
        label: c as Filter,
        count: projects.filter((p) => p.category === c).length,
      })),
    ];
  }, []);

  const visible = useMemo(
    () => (filter === "Все" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <Section
      id="works"
      eyebrow="Работы"
      title="Что сняли"
      lead="Короткий метр, клипы и документальные зарисовки. Всё сделано своими силами."
    >
      <div
        className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="Фильтр проектов"
      >
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            role="tab"
            aria-selected={filter === f.label}
            onClick={() => setFilter(f.label)}
            className={`meta flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 transition ${
              filter === f.label
                ? "border-accent bg-accent text-on-accent"
                : "border-line hover:border-accent hover:text-fg"
            }`}
          >
            {f.label}
            <span className="tabular-nums opacity-60">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:gap-x-6">
        {visible.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 90}>
            <Link
              href={`/works/${project.slug}/`}
              data-rim
              className="rim group block rounded-sm"
            >
              <div
                className="flutter relative aspect-video overflow-hidden bg-black"
                style={flutterStyle(i)}
              >
                <Image
                  src={project.poster}
                  alt={`Кадр из проекта «${project.title}»`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="film object-cover group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-bg/10 transition group-hover:bg-transparent" />
                <span className="meta absolute left-4 top-4 rounded-full bg-bg/75 px-3 py-1 text-fg backdrop-blur">
                  {project.category}
                </span>
                <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-[2s] ease-linear group-hover:scale-x-100" />
              </div>

              <div className="mt-4 flex items-start justify-between gap-5 border-t border-line pt-4">
                <div>
                  <h3 className="display text-2xl transition group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="meta mt-2">{project.role}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="meta block tabular-nums">{project.year}</span>
                  <span className="display mt-1 block text-xl tabular-nums text-line">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
