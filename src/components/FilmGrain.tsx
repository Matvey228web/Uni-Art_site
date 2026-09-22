/**
 * Плёночное зерно поверх всей страницы.
 * Слой не ловит события и лежит ниже шапки, чтобы интерфейс оставался чётким.
 */
export default function FilmGrain() {
  return <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[45]" />;
}
