"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { site, stats } from "@/content/site";
import PlayButton from "./PlayButton";
import VideoModal from "./VideoModal";

export default function Hero() {
  const [showreelOpen, setShowreelOpen] = useState(false);

  return (
    <>
      <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-24">
        <div className="flutter absolute inset-0 -z-10">
          {site.heroVideo ? (
            <video
              className="h-full w-full object-cover"
              src={site.heroVideo}
              poster={site.heroPoster}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={site.heroPoster}
              alt=""
              fill
              priority
              className="film film-lit kenburns object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/65 to-bg/25" />
        </div>

        {/* Верхняя строка: то же место, что у мета-подписей в кадре */}
        <div className="pointer-events-none absolute inset-x-0 top-20 hidden justify-between px-4 sm:flex sm:px-6">
          <span className="meta">{site.tagline}</span>
          <span className="meta">{site.city}</span>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <h1 className="display text-[clamp(2.6rem,8.5vw,6.5rem)]">
            {site.heroTitle.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-8 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              {site.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-5">
              {site.showreelUrl && (
                <button
                  type="button"
                  onClick={() => setShowreelOpen(true)}
                  className="group flex items-center gap-3"
                >
                  <PlayButton size={56} variant="solid" interactive={false} />
                  <span className="meta text-fg">Смотреть ролик</span>
                </button>
              )}
              <Link
                href="/#contact"
                data-rim
                className="rim meta rounded-full border border-line px-5 py-3 text-fg transition hover:border-accent hover:text-accent"
              >
                Написать нам
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Цифры отдельной полосой. Пустой список — полосы нет */}
      {stats.length > 0 && (
      <section className="border-t border-line bg-bg-soft">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-bg-soft px-4 py-7 sm:px-6">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="display block text-3xl tabular-nums sm:text-4xl">
                  {s.value}
                </span>
                <span className="meta mt-2 block">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      )}

      {showreelOpen && (
        <VideoModal
          src={site.showreelUrl}
          title={`Шоурил · ${site.name}`}
          onClose={() => setShowreelOpen(false)}
        />
      )}
    </>
  );
}
