/**
 * Палитры для прототипов. Каждая задаёт набор CSS-переменных, которые
 * применяются к обёртке страницы, и режим кадров: цветные или обесцвеченные.
 */

export type Palette = {
  id: string;
  name: string;
  note: string;
  /** Образец в переключателе: фон и акцент палитры */
  swatch: [string, string];
  stills: "color" | "mono";
  vars: {
    "--p-bg": string;
    "--p-bg-soft": string;
    "--p-surface": string;
    "--p-line": string;
    "--p-fg": string;
    "--p-muted": string;
    "--p-accent": string;
    "--p-on-accent": string;
  };
};

export const palettes: Palette[] = [
  {
    id: "mono",
    name: "Монохром",
    note: "Чистый чёрно-белый, кадры обесцвечены. Максимум сдержанности.",
    swatch: ["#000000", "#ffffff"],
    stills: "mono",
    vars: {
      "--p-bg": "#000000",
      "--p-bg-soft": "#0a0a0a",
      "--p-surface": "#121212",
      "--p-line": "rgba(255,255,255,0.16)",
      "--p-fg": "#ffffff",
      "--p-muted": "rgba(255,255,255,0.58)",
      "--p-accent": "#ffffff",
      "--p-on-accent": "#000000",
    },
  },
  {
    id: "film",
    name: "Плёнка",
    note: "Тёплый тёмный с охрой. Отсылка к плёночному кино.",
    swatch: ["#14100c", "#d9a441"],
    stills: "color",
    vars: {
      "--p-bg": "#14100c",
      "--p-bg-soft": "#1b1610",
      "--p-surface": "#221c14",
      "--p-line": "rgba(233,217,190,0.18)",
      "--p-fg": "#f4ece0",
      "--p-muted": "rgba(244,236,224,0.58)",
      "--p-accent": "#d9a441",
      "--p-on-accent": "#14100c",
    },
  },
  {
    id: "cinnabar",
    name: "Киноварь",
    note: "Графит и один резкий акцент. Громко и современно.",
    swatch: ["#0b0b0b", "#ff4a1c"],
    stills: "color",
    vars: {
      "--p-bg": "#0b0b0b",
      "--p-bg-soft": "#121212",
      "--p-surface": "#181818",
      "--p-line": "rgba(255,255,255,0.14)",
      "--p-fg": "#f5f5f5",
      "--p-muted": "rgba(245,245,245,0.58)",
      "--p-accent": "#ff4a1c",
      "--p-on-accent": "#0b0b0b",
    },
  },
  {
    id: "gallery",
    name: "Галерея",
    note: "Светлая, почти бумажная. Кадры читаются как в каталоге.",
    swatch: ["#f2f1ee", "#14150f"],
    stills: "color",
    vars: {
      "--p-bg": "#f2f1ee",
      "--p-bg-soft": "#e9e7e2",
      "--p-surface": "#ffffff",
      "--p-line": "rgba(20,21,15,0.16)",
      "--p-fg": "#14150f",
      "--p-muted": "rgba(20,21,15,0.62)",
      "--p-accent": "#14150f",
      "--p-on-accent": "#f2f1ee",
    },
  },
  {
    id: "midnight",
    name: "Полночь",
    note: "Холодная ночная гамма с синим акцентом.",
    swatch: ["#070b14", "#5b8cff"],
    stills: "color",
    vars: {
      "--p-bg": "#070b14",
      "--p-bg-soft": "#0c1220",
      "--p-surface": "#111a2b",
      "--p-line": "rgba(180,205,255,0.16)",
      "--p-fg": "#eaf0fb",
      "--p-muted": "rgba(234,240,251,0.58)",
      "--p-accent": "#5b8cff",
      "--p-on-accent": "#070b14",
    },
  },
];

export function getPalette(id: string): Palette {
  return palettes.find((p) => p.id === id) ?? palettes[0];
}
