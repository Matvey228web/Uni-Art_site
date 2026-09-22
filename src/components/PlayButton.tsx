type Props = {
  /** Диаметр в пикселях */
  size?: number;
  label?: string;
  variant?: "outline" | "solid";
  /**
   * false — отрисовать как span. Нужно, когда кнопка воспроизведения лежит
   * внутри другой кнопки: вложенные button дают невалидный HTML и ломают гидратацию.
   */
  interactive?: boolean;
  className?: string;
};

/** Кнопка воспроизведения: кольцо с расходящейся обводкой или залитый круг. */
export default function PlayButton({
  size = 80,
  label = "Смотреть шоурил",
  variant = "outline",
  interactive = true,
  className = "",
}: Props) {
  const solid = variant === "solid";
  const Tag = interactive ? "button" : "span";

  return (
    <Tag
      {...(interactive
        ? { type: "button" as const, "aria-label": label }
        : { "aria-hidden": true })}
      className={`group relative inline-flex shrink-0 items-center justify-center rounded-full transition duration-500 ${
        solid
          ? "bg-[var(--p-accent,var(--accent))] group-hover:scale-110 hover:scale-110"
          : "border border-[var(--p-fg,var(--fg))]/45 hover:border-[var(--p-fg,var(--fg))]"
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {!solid && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-[var(--p-fg,var(--fg))]/30 opacity-0 transition duration-700 group-hover:scale-125 group-hover:opacity-100"
        />
      )}
      <span
        aria-hidden
        className="ml-[0.15em] inline-block h-0 w-0 border-y-transparent"
        style={{
          borderTopWidth: size * 0.115,
          borderBottomWidth: size * 0.115,
          borderLeftWidth: size * 0.18,
          borderLeftStyle: "solid",
          borderLeftColor: solid
            ? "var(--p-on-accent, #0b0c0e)"
            : "var(--p-fg, var(--fg))",
        }}
      />
    </Tag>
  );
}
