/**
 * Объёмная сцена: что где стоит и как между этим летит камера.
 * Единицы — пиксели мира. Камера смотрит вдоль −Z, ось Y направлена вниз.
 */

import { v3, type Vec3 } from "@/lib/camera";

export type SceneItem =
  | {
      kind: "text";
      id: string;
      pos: Vec3;
      width: number;
      rotY?: number;
      eyebrow?: string;
      title?: string;
      body?: string;
      /** Панель всегда развёрнута к камере */
      face?: boolean;
    }
  | {
      kind: "image";
      id: string;
      pos: Vec3;
      width: number;
      ratio: number;
      /** Наклон в плоскости кадра, радианы */
      tilt?: number;
      src: string;
      alt: string;
      caption?: string;
      face?: boolean;
    }
  | {
      kind: "glow";
      id: string;
      pos: Vec3;
      /** Диаметр пятна света в пикселях мира */
      size: number;
      color: string;
      /** Во сколько раз подсвечивает соседние объекты */
      power: number;
      /** Радиус спада света */
      reach: number;
    };

export const sceneItems: SceneItem[] = [
  { kind: "glow", id: "g0", pos: v3(-200, -300, -700), size: 1500, color: "#e0813c", power: 0.9, reach: 1400 },
  {
    kind: "text", id: "hello", pos: v3(0, -40, -900), width: 760, face: true,
    eyebrow: "Uni-Art",
    title: "Снимаем кино\nи учимся на ходу",
    body: "Пролистайте — камера пойдёт вглубь сцены.",
  },

  { kind: "glow", id: "g1", pos: v3(-900, 120, -2250), size: 1700, color: "#7fb3d8", power: 1.1, reach: 1500 },
  {
    kind: "image", id: "p1", pos: v3(-720, -60, -2200), width: 900, ratio: 16 / 9, face: true, tilt: 0.42,
    src: "/posters/project-1.svg", alt: "Кадр из работы", caption: "Короткий метр · 2025",
  },
  {
    kind: "text", id: "t1", pos: v3(260, 150, -3500), width: 520, face: true,
    eyebrow: "Что снимаем",
    body: "Короткий метр, клипы, документальные зарисовки. Обычно за одну-две смены.",
  },

  { kind: "glow", id: "g2", pos: v3(1000, -200, -4850), size: 1600, color: "#e0813c", power: 1.0, reach: 1500 },
  {
    kind: "image", id: "p2", pos: v3(780, 40, -4800), width: 880, ratio: 16 / 9, face: true, tilt: -0.45,
    src: "/posters/project-3.svg", alt: "Кадр из работы", caption: "Клип · 2024",
  },

  {
    kind: "image", id: "prop1", pos: v3(-520, -260, -6100), width: 320, ratio: 430 / 360, face: true, tilt: 0.5,
    src: "/props/clapper-blue.webp", alt: "Хлопушка",
  },
  {
    kind: "image", id: "prop2", pos: v3(420, 200, -6400), width: 260, ratio: 430 / 429, face: true, tilt: -0.4,
    src: "/props/reel-white.webp", alt: "Бобина с плёнкой",
  },
  { kind: "glow", id: "g3", pos: v3(0, 0, -7000), size: 1300, color: "#f0e6d2", power: 0.8, reach: 1200 },
  {
    kind: "text", id: "t2", pos: v3(-60, 0, -7400), width: 640, face: true,
    eyebrow: "Как это устроено",
    title: "Всё делаем сами",
    body: "Придумываем, снимаем, монтируем. Просто потому, что больше некому.",
  },

  {
    kind: "image", id: "p3", pos: v3(640, -120, -8700), width: 820, ratio: 16 / 9, face: true, tilt: -0.38,
    src: "/posters/project-4.svg", alt: "Кадр из работы", caption: "Документальное · 2024",
  },
  {
    kind: "image", id: "prop3", pos: v3(-620, 60, -10000), width: 340, ratio: 430 / 290, face: true, tilt: 0.36,
    src: "/props/cassettes.webp", alt: "Кассеты с плёнкой",
  },
  { kind: "glow", id: "g4", pos: v3(-700, -100, -10100), size: 1500, color: "#7fb3d8", power: 0.9, reach: 1400 },

  {
    kind: "text", id: "t3", pos: v3(140, 180, -11300), width: 560, face: true,
    eyebrow: "Кто мы",
    body: "Небольшое объединение. На съёмки зовём друзей, когда рук не хватает.",
  },
  {
    kind: "image", id: "prop4", pos: v3(-380, -200, -11800), width: 300, ratio: 430 / 274, face: true, tilt: 0.3,
    src: "/props/reels-super8.webp", alt: "Бобины 8 мм",
  },

  { kind: "glow", id: "g5", pos: v3(0, 0, -12500), size: 2000, color: "#e0813c", power: 1.3, reach: 1700 },
  {
    kind: "text", id: "end", pos: v3(0, 0, -12600), width: 720, face: true,
    eyebrow: "Связь",
    title: "Напишите нам",
    body: "hello@example.com · Москва",
  },
];

/**
 * Маршрут камеры строится из самих объектов, а не задаётся руками:
 * к каждому камера подходит с одной стороны и уходит с другой, не переставая
 * на него смотреть. Отсюда ощущение облёта — и гарантия, что в кадре
 * всегда что-то есть.
 */
const stations = ["hello", "p1", "t1", "p2", "prop1", "t2", "p3", "prop3", "t3", "end"];

function buildPath(): { pos: Vec3; look: Vec3 }[] {
  const path: { pos: Vec3; look: Vec3 }[] = [];
  const at = (id: string) => sceneItems.find((i) => i.id === id);

  stations.forEach((id, k) => {
    const item = at(id);
    if (!item) return;
    const p = item.pos;
    const next = at(stations[k + 1] ?? "");
    const side = k % 2 === 0 ? 1 : -1;
    const wide = item.kind === "image" ? 820 : 560;

    if (k === 0) path.push({ pos: v3(p.x, p.y, p.z + 1600), look: p });

    if (!next) {
      // последняя станция: подлетаем и останавливаемся перед ней,
      // а не пролетаем насквозь
      path.push({ pos: v3(p.x + side * wide * 0.7, p.y - 80, p.z + 1100), look: p });
      path.push({ pos: v3(p.x, p.y, p.z + 620), look: p });
      return;
    }

    // Подход сбоку и проход мимо с другой стороны: камера разворачивается
    // вслед объекту. Отступы держат дистанцию около тысячи пикселей —
    // ближе камера начинает протыкать объект, и тот гаснет ближним затуханием.
    path.push({ pos: v3(p.x + side * wide, p.y - 60, p.z + 560), look: p });
    path.push({ pos: v3(p.x - side * wide * 1.1, p.y + 80, p.z - 420), look: p });

    // Разворот на следующий объект — рядом с текущим, пока тот ещё в кадре:
    // иначе на перегоне камера смотрит в пустоту между ними.
    // Сдвиги по глубине меньше зазора между станциями, чтобы путь не пятился.
    path.push({ pos: v3(p.x - side * wide * 0.5, p.y + 30, p.z - 640), look: next.pos });
  });
  return path;
}

export const cameraPath = buildPath();

/** Насколько длинной должна быть прокрутка под всю сцену */
export const SCROLL_SCREENS = 12;
export const PERSPECTIVE = 900;
/** Дальше этого объект полностью съеден туманом */
export const FOG_FAR = 5200;
export const FOG_NEAR = 400;
