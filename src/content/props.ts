/**
 * Киноатрибутика для физического коллажа.
 *
 * Это настоящие фотографии с Викисклада, вырезанные по контуру.
 * Лицензии и ссылки на оригиналы — в public/props/CREDITS.md.
 */

export type Prop = {
  file: string;
  alt: string;
  /** Ширина в пикселях при широком экране; высота считается из пропорций */
  width: number;
  /** Соотношение сторон картинки */
  ratio: number;
  /** Круглые предметы катаются, прямоугольные — падают плашмя */
  shape: "circle" | "box";
};

export const props: Prop[] = [
  { file: "clapper-blue.webp", alt: "Деревянная хлопушка", width: 152, ratio: 430 / 360, shape: "box" },
  { file: "clapper-yellow.webp", alt: "Хлопушка со съёмок", width: 156, ratio: 430 / 310, shape: "box" },
  { file: "reel-white.webp", alt: "Бобина 16 мм с плёнкой", width: 116, ratio: 430 / 429, shape: "circle" },
  { file: "reel-black.webp", alt: "Открытая бобина Super 8", width: 132, ratio: 430 / 362, shape: "box" },
  { file: "reels-super8.webp", alt: "Бобины 8 мм", width: 150, ratio: 430 / 274, shape: "box" },
  { file: "cassettes.webp", alt: "Кассеты с плёнкой 135", width: 148, ratio: 430 / 290, shape: "box" },
];
