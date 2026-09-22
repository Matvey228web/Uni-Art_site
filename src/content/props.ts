/** Киноатрибутика для физического коллажа. Картинки лежат в /public/props. */

export type Prop = {
  file: string;
  alt: string;
  /** Ширина в пикселях при широком экране; высота считается из пропорций */
  width: number;
  /** Соотношение сторон исходного PNG */
  ratio: number;
  /** Круглые предметы катаются, прямоугольные — падают плашмя */
  shape: "circle" | "box";
};

export const props: Prop[] = [
  { file: "clapper.png", alt: "Хлопушка", width: 160, ratio: 370 / 340, shape: "box" },
  { file: "reel.png", alt: "Бобина с плёнкой", width: 124, ratio: 1, shape: "circle" },
  { file: "filmstrip.png", alt: "Обрывок киноплёнки", width: 176, ratio: 360 / 150, shape: "box" },
  { file: "ticket.png", alt: "Билет в кино", width: 136, ratio: 280 / 150, shape: "box" },
  { file: "lens.png", alt: "Объектив", width: 104, ratio: 1, shape: "circle" },
  { file: "megaphone.png", alt: "Мегафон", width: 148, ratio: 320 / 220, shape: "box" },
  { file: "filmcan.png", alt: "Коробка для плёнки", width: 112, ratio: 1, shape: "circle" },
  { file: "mic.png", alt: "Микрофон-пушка", width: 168, ratio: 360 / 120, shape: "box" },
];
