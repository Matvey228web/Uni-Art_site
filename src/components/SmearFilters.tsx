/**
 * Фильтры вертикального смаза.
 *
 * CSS-блюр размывает во все стороны одинаково, а нужен только по вертикали —
 * такое умеет лишь SVG: stdDeviation задаётся отдельно по осям, и по X он
 * равен нулю. Несколько ступеней вместо плавного изменения: значение фильтра
 * в CSS не интерполируется, оно переключается скачком — для срыва картинки
 * это как раз то, что нужно.
 */
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
      </defs>
    </svg>
  );
}
