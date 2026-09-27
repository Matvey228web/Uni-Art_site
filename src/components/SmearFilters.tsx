/**
 * Фильтры срыва картинки.
 *
 * Два семейства. Первое — простой смаз по вертикали для отдельных кадров:
 * CSS-блюр размывает во все стороны одинаково, а нужен только по вертикали,
 * такое умеет лишь SVG.
 *
 * Второе — срыв всей картины, и он собран как аналоговый, а не цифровой.
 * Разница в приёмах:
 *
 *  — строки уезжают вбок. Смещение почти постоянно вдоль строки и гуляет
 *    сверху вниз — так ведёт себя развёртка, когда сбивается синхронизация.
 *    Поэтому шум растянут по горизонтали: по X частота почти нулевая,
 *    по Y высокая. Зелёный канал карты смещения прибит к 0.5, иначе кадр
 *    поехал бы ещё и по вертикали;
 *  — двоение вбок. Отражённый сигнал приходит с задержкой, и правее
 *    основной картинки идёт её бледная копия. Копия не цветная: разведение
 *    каналов в красное и голубое — приём цифрового сбоя, к аналоговому
 *    он отношения не имеет;
 *  — и лёгкий смаз по вертикали, потому что кадр в этот момент плывёт.
 *    Именно лёгкий: сильное размытие съедает сам снос строк, ради
 *    которого всё и затевалось.
 *
 * Ступени различаются не только силой, но и зерном шума: у каждой свой seed,
 * поэтому от ступени к ступени строки перекладываются заново, а не тянутся
 * одной и той же гармошкой.
 *
 * Область фильтра шире кадра: смещённым строкам есть откуда брать картинку,
 * иначе по краям открывались бы пустые полосы.
 */

/** Одна ступень срыва: снос строк, двоение вбок, вертикальный смаз. */
function Tear({
  id,
  seed,
  shift,
  bands,
  ghost,
  ghostAlpha,
  smear,
}: {
  id: string;
  seed: number;
  /** на сколько пикселей уводит строки */
  shift: number;
  /** частота по вертикали: чем выше, тем тоньше полосы сноса */
  bands: number;
  /** сдвиг бледной копии вправо */
  ghost: number;
  ghostAlpha: number;
  smear: number;
}) {
  return (
    <filter
      id={id}
      x="-12%"
      y="-6%"
      width="124%"
      height="112%"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency={`0.0006 ${bands}`}
        numOctaves={2}
        seed={seed}
        result="noise"
      />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="1 0 0 0 0
                0 0 0 0 0.5
                0 0 0 0 0
                0 0 0 0 1"
        result="lines"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="lines"
        scale={shift}
        xChannelSelector="R"
        yChannelSelector="G"
        result="torn"
      />
      <feOffset in="torn" dx={ghost} result="shifted" />
      <feComponentTransfer in="shifted" result="faint">
        <feFuncA type="linear" slope={ghostAlpha} />
      </feComponentTransfer>
      <feBlend in="faint" in2="torn" mode="screen" result="doubled" />
      <feGaussianBlur in="doubled" stdDeviation={`0 ${smear}`} />
    </filter>
  );
}

export default function SmearFilters() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0" focusable="false">
      <defs>
        <filter id="smear-1" x="0" y="-10%" width="100%" height="120%">
          <feGaussianBlur stdDeviation="0 0.9" />
        </filter>
        <filter id="smear-2" x="0" y="-10%" width="100%" height="120%">
          <feGaussianBlur stdDeviation="0 1.8" />
        </filter>
        <filter id="smear-3" x="0" y="-12%" width="100%" height="124%">
          <feGaussianBlur stdDeviation="0 3.4" />
        </filter>

        <Tear id="tear-1" seed={11} shift={6} bands={0.09} ghost={3} ghostAlpha={0.14} smear={0.3} />
        <Tear id="tear-2" seed={23} shift={16} bands={0.055} ghost={7} ghostAlpha={0.2} smear={0.7} />
        <Tear id="tear-3" seed={47} shift={30} bands={0.035} ghost={13} ghostAlpha={0.26} smear={1.4} />
        <Tear id="tear-4" seed={5} shift={21} bands={0.12} ghost={9} ghostAlpha={0.18} smear={0.5} />
      </defs>
    </svg>
  );
}
