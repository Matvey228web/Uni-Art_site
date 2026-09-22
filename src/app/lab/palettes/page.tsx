import Image from "next/image";
import Link from "next/link";
import RimLight from "@/components/RimLight";
import { contrast, deepPalettes, type DeepPalette } from "@/content/palettes-deep";

export const metadata = { title: "Палитры" };

/** Кусок настоящего интерфейса: по квадратикам палитру выбрать нельзя. */
function Sample({ palette }: { palette: DeepPalette }) {
  const worst = Math.min(
    contrast(palette.accent, palette.bg),
    contrast(palette.accent, palette.surface),
  );

  const vars = {
    "--bg": palette.bg,
    "--bg-soft": palette.bgSoft,
    "--surface": palette.surface,
    "--border": palette.line,
    "--fg": palette.fg,
    "--fg-muted": palette.muted,
    "--accent": palette.accent,
    "--accent-soft": `color-mix(in srgb, ${palette.accent} 16%, transparent)`,
    "--rim": palette.rim,
    "--on-accent": palette.onAccent,
  } as React.CSSProperties;

  return (
    <section style={vars} className="bg-bg text-fg">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8 sm:py-20">
        {/* шапка */}
        <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
          <span className="display text-lg tracking-[0.24em]">UNI-ART</span>
          <nav className="hidden gap-6 sm:flex">
            {["Работы", "Умеем", "Кто мы"].map((item) => (
              <span key={item} className="meta">
                {item}
              </span>
            ))}
          </nav>
          <span
            data-rim
            className="rim meta rounded-full bg-accent px-4 py-2 text-on-accent"
          >
            Написать
          </span>
        </div>

        {/* первый экран */}
        <div className="grid gap-10 pt-12 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-4">{palette.name}</p>
            <h2 className="display text-[clamp(2rem,5.5vw,3.6rem)] leading-[0.95]">
              Снимаем кино
              <br />и учимся на ходу
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">{palette.note}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span
                data-rim
                className="rim inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent"
              >
                <span
                  aria-hidden
                  className="ml-1 inline-block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent"
                  style={{ borderLeftColor: palette.onAccent }}
                />
              </span>
              <span
                data-rim
                className="rim meta rounded-full border border-line px-5 py-3 text-fg"
              >
                Смотреть работы
              </span>
            </div>
          </div>

          {/* карточка работы */}
          <article data-rim className="rim group rounded-sm bg-bg-soft">
            <div className="relative aspect-video overflow-hidden rounded-t-sm bg-black">
              <Image
                src="/posters/project-3.svg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                style={{ filter: "grayscale(1) contrast(1.06)" }}
              />
              <span className="meta absolute left-3 top-3 rounded-full bg-bg/75 px-3 py-1 text-fg backdrop-blur">
                Клипы
              </span>
              <span className="absolute bottom-0 left-0 h-[2px] w-2/3 bg-accent" />
            </div>
            <div className="p-5">
              <h3 className="display text-xl">Клип для артиста</h3>
              <p className="meta mt-2">Режиссура и съёмка · 2024</p>
            </div>
          </article>
        </div>

        {/* цвета и проверка */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-6">
          {[
            ["Фон", palette.bg],
            ["Поверхность", palette.surface],
            ["Текст", palette.fg],
            ["Акцент", palette.accent],
            ["Свет", palette.rim],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center gap-2.5">
              <span
                className="h-7 w-7 shrink-0 rounded-full border border-line"
                style={{ backgroundColor: value }}
              />
              <span className="meta">
                {label} <span className="opacity-60">{value}</span>
              </span>
            </div>
          ))}
          <span className="meta ml-auto">
            контраст акцента {worst.toFixed(2)}:1
          </span>
        </div>
      </div>
    </section>
  );
}

export default function PalettesPage() {
  return (
    <>
      <RimLight />
      <div className="bg-bg px-4 pb-10 pt-16 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <p className="eyebrow mb-4">Палитры</p>
          <h1 className="display text-4xl sm:text-5xl">Восемь глубоких вариантов</h1>
          <p className="mt-5 max-w-2xl text-muted">
            Каждая показана на живом куске интерфейса, а не квадратиками: шапка,
            первый экран, карточка работы. Кислотных, кремовых и пастельных тонов
            нет. У всех проверен контраст — цифра в конце каждого блока, минимум
            для мелкого текста 4.5:1.
          </p>
          <p className="mt-4 max-w-2xl text-muted">
            На компьютере наведите курсор на карточку или кнопку: контровый свет
            в каждой палитре свой.
          </p>
          <Link href="/lab/" className="mt-8 inline-block text-sm text-muted hover:text-fg">
            ← Все прототипы
          </Link>
        </div>
      </div>

      {deepPalettes.map((palette) => (
        <Sample key={palette.id} palette={palette} />
      ))}

      <div className="bg-bg px-4 py-16 text-center sm:px-8">
        <p className="text-muted">
          Назовите вариант — переведу основной сайт на него.
        </p>
      </div>
    </>
  );
}
