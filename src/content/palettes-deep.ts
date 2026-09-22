/**
 * Глубокие палитры для выбора. Без кислотных, кремовых и пастельных тонов.
 *
 * У каждой: тёмная основа, насыщенный, но приглушённый акцент и цвет
 * контурного света. Контрасты считаются тут же и показываются в демо —
 * палитру нельзя выбрать «красивую, но нечитаемую».
 */

export type DeepPalette = {
  id: string;
  name: string;
  note: string;
  bg: string;
  bgSoft: string;
  surface: string;
  line: string;
  fg: string;
  muted: string;
  accent: string;
  rim: string;
  onAccent: string;
};

export const deepPalettes: DeepPalette[] = [
  {
    id: "oxide",
    name: "Оксид",
    note: "Тёмный бордо и медь. Тёплая, слегка архивная — как старая афиша.",
    bg: "#140A0B", bgSoft: "#1D1113", surface: "#251619",
    line: "rgba(235, 200, 190, 0.16)", fg: "#F0E4E2",
    muted: "rgba(240, 228, 226, 0.6)", accent: "#C0703C", rim: "#E0A472",
    onAccent: "#140A0B",
  },
  {
    id: "midnight",
    name: "Полночь",
    note: "Сине-стальная. Холодная и спокойная, ближе всего к ночной съёмке.",
    bg: "#080C14", bgSoft: "#0D131F", surface: "#111A29",
    line: "rgba(190, 210, 245, 0.16)", fg: "#E4EAF5",
    muted: "rgba(228, 234, 245, 0.6)", accent: "#6E92D8", rim: "#9BB8EC",
    onAccent: "#080C14",
  },
  {
    id: "pine",
    name: "Хвоя",
    note: "Глубокий еловый и приглушённый нефрит. Природная, без зелёного крика.",
    bg: "#07110E", bgSoft: "#0C1A16", surface: "#10231E",
    line: "rgba(190, 235, 215, 0.16)", fg: "#E2F0EA",
    muted: "rgba(226, 240, 234, 0.6)", accent: "#57A98A", rim: "#8CD1B4",
    onAccent: "#07110E",
  },
  {
    id: "plum",
    name: "Слива",
    note: "Баклажан с винным акцентом. Самая «вечерняя» из набора.",
    bg: "#100A14", bgSoft: "#18101F", surface: "#1F1528",
    line: "rgba(225, 200, 240, 0.16)", fg: "#EDE4F2",
    muted: "rgba(237, 228, 242, 0.6)", accent: "#AE6FA1", rim: "#C795BD",
    onAccent: "#100A14",
  },
  {
    id: "brass",
    name: "Графит и латунь",
    note: "Нейтральная основа, латунный акцент. Сдержанная, ближе к технике.",
    bg: "#0B0C0D", bgSoft: "#121416", surface: "#181B1E",
    line: "rgba(225, 225, 225, 0.15)", fg: "#ECECEC",
    muted: "rgba(236, 236, 236, 0.6)", accent: "#B79155", rim: "#DCBE86",
    onAccent: "#0B0C0D",
  },
  {
    id: "petrol",
    name: "Петроль и терракота",
    note: "Текущая основа, но акцент приглушён до обожжённой глины.",
    bg: "#060F14", bgSoft: "#0A1820", surface: "#0E212B",
    line: "rgba(150, 205, 220, 0.18)", fg: "#E6F2F5",
    muted: "rgba(230, 242, 245, 0.62)", accent: "#C57259", rim: "#6FB6C8",
    onAccent: "#060F14",
  },
  {
    id: "ink",
    name: "Чернила",
    note: "Почти чёрная основа и густой синий акцент. Самая строгая.",
    bg: "#0A0A0C", bgSoft: "#101115", surface: "#15171C",
    line: "rgba(210, 215, 230, 0.15)", fg: "#E8EAF0",
    muted: "rgba(232, 234, 240, 0.6)", accent: "#627FCB", rim: "#93A9E0",
    onAccent: "#0A0A0C",
  },
  {
    id: "rust",
    name: "Ржавчина",
    note: "Тёмно-коричневая основа и глухой кирпичный акцент. Плотная и земляная.",
    bg: "#120D09", bgSoft: "#1A130E", surface: "#221913",
    line: "rgba(235, 215, 195, 0.16)", fg: "#EFE6DC",
    muted: "rgba(239, 230, 220, 0.6)", accent: "#C36E50", rim: "#D69068",
    onAccent: "#120D09",
  },
];

/** Контраст по формуле WCAG: нужен, чтобы отсеять красивое, но нечитаемое. */
export function contrast(a: string, b: string): number {
  const channels = (h: string) =>
    (h.replace("#", "").match(/../g) ?? []).map((x) => parseInt(x, 16) / 255);
  const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = (h: string) => {
    const [r, g, bl] = channels(h).map(linear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
