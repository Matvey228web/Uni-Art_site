type Props = {
  /** Диаметр в пикселях на десктопе; на телефоне уменьшается автоматически */
  size?: number;
  label?: string;
  variant?: "outline" | "solid";
  className?: string;
};

/** Кнопка воспроизведения: кольцо с пульсацией или залитый круг. */
export default function PlayButton({
  size = 80,
  label = "Смотреть шоурил",
  variant = "outline",
  className = "",
}: Props) {
  const solid = variant === "solid";

  return (
    <button
      type="button"
      aria-label={label}
      className={`group relative inline-flex shrink-0 items-center justify-center rounded-full transition duration-500 ${
        solid
          ? "bg-[var(--p-accent)] hover:scale-110"
          : "border border-[var(--p-fg)]/45 hover:border-[var(--p-fg)]"
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {!solid && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-[var(--p-fg)]/30 opacity-0 transition duration-700 group-hover:scale-125 group-hover:opacity-100"
        />
      )}
      <span
        aria-hidden
        className="ml-[0.15em] inline-block h-0 w-0 border-y-transparent transition"
        style={{
          borderTopWidth: size * 0.115,
          borderBottomWidth: size * 0.115,
          borderLeftWidth: size * 0.18,
          borderLeftStyle: "solid",
          borderLeftColor: solid ? "var(--p-on-accent)" : "var(--p-fg)",
        }}
      />
    </button>
  );
}
