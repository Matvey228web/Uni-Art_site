import Link from "next/link";

const variants = [
  {
    href: "/lab/a/",
    letter: "A",
    name: "Тихий",
    idea: "Как у 1-2-3production, но без jQuery",
    points: [
      "Полноэкранные секции со снап-скроллом",
      "Чёрно-белое, кадры обесцвечены",
      "Мелкая типографика: интерфейс уходит в тень",
      "Один проект — один экран",
    ],
  },
  {
    href: "/lab/b/",
    letter: "B",
    name: "Каталог",
    idea: "Светлый, плотный, для объёма работ",
    points: [
      "Светлая тема, кадры в цвете",
      "Плотная сетка превью с фильтрами",
      "Превью оживает при наведении",
      "Держит и шесть проектов, и шестьдесят",
    ],
  },
  {
    href: "/lab/palettes/",
    letter: "P",
    name: "Палитры",
    idea: "Восемь глубоких вариантов на живом интерфейсе",
    points: [
      "Каждая показана шапкой, экраном и карточкой",
      "Без кислотных, кремовых и пастельных тонов",
      "Контраст проверен и подписан",
      "Контровый свет в каждой свой",
    ],
  },
  {
    href: "/lab/depth/",
    letter: "D",
    name: "Глубина",
    idea: "Прокрутка ведёт камеру сквозь объёмную сцену",
    points: [
      "Блоки стоят на разной глубине",
      "Камера летит по кривой и обходит их",
      "Туман и свет по расстоянию",
      "Без движения — обычная плоская лента",
    ],
  },
  {
    href: "/lab/c/",
    letter: "C",
    name: "Характер",
    idea: "Редакционный, с жёстким акцентом",
    points: [
      "Крупная типографика во весь экран",
      "Проекты — горизонтальная лента",
      "Один резкий акцентный цвет",
      "Запоминается даже при слабом портфолио",
    ],
  },
];

export default function LabIndex() {
  return (
    <div className="min-h-svh bg-bg px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <p className="eyebrow mb-4">Прототипы</p>
        <h1 className="display text-4xl sm:text-5xl">Три направления</h1>
        <p className="mt-5 max-w-2xl text-muted">
          Первый экран и блок проектов в трёх вариантах. Всё на заглушках: вместо
          кадров — сгенерированные картинки, вместо шоурила — статичный кадр
          с медленным наездом. Смотри на композицию и характер, не на содержание.
        </p>
        <p className="mt-4 max-w-2xl text-muted">
          Внизу каждого прототипа — переключатель из пяти палитр. Он меняет цвета
          на лету и работает в любом из трёх вариантов, так что макет и палитру
          можно выбирать по отдельности. Выбор запоминается и переезжает
          с вами на соседний прототип.
        </p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {variants.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="group flex h-full flex-col bg-bg-soft p-6 transition hover:bg-surface"
            >
              <span className="display text-6xl text-line transition group-hover:text-accent">
                {v.letter}
              </span>
              <h2 className="display mt-4 text-2xl">{v.name}</h2>
              <p className="mt-2 text-sm text-accent">{v.idea}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                {v.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-6 text-sm text-fg underline-offset-4 group-hover:underline">
                Открыть →
              </span>
            </Link>
          ))}
        </div>

        <Link href="/" className="mt-12 inline-block text-sm text-muted hover:text-fg">
          ← Текущая версия сайта
        </Link>
      </div>
    </div>
  );
}
