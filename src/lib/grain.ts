/**
 * Плёночное зерно.
 *
 * Собирается не фильтрацией шума, а так, как зерно образуется на плёнке.
 * Это важно: любой фильтрованный гауссов шум остаётся симметричным —
 * светлых отклонений ровно столько же, сколько тёмных, — а у плёнки
 * сгустки плотнее просветов, и глаз эту несимметричность ловит. Отсюда
 * и ощущение, что фильтрованный шум «не плёнка».
 *
 * Модель простая и физическая. Кристаллы серебра ложатся по кадру
 * случайно и независимо друг от друга — это пуассоновский поток точек.
 * Калибр у кристаллов разный, поэтому разыгрываем несколько размеров
 * и для каждого свой поток. Сумма кружков — оптическая плотность;
 * плотность переводим в пропускание по закону поглощения, и уже оно
 * даёт несимметричное распределение и неровные сгустки.
 *
 * Разные калибры сами собой дают широкий спектр: энергия размазана
 * от крупного к мелкому, а не сидит на одном размере. Доли от пика
 * по длинам волн 128 / 64 / 16 / 4 / 2.4 пикселя:
 *
 *   фильтрованный шум  0.53  0.88  0.89  0.61  0.38  (скос  0.00)
 *   зёрна серебра      0.99  0.93  0.74  0.32  0.23  (скос -0.32)
 *
 * Всё считается с заворотом по краям, поэтому плитка периодическая:
 * её можно мостить без шва.
 */

export const TILE = 512;

/** Калибры кристаллов в пикселях и доля общей плотности на каждый. */
const SIZES = [0.6, 1.1, 2.0, 3.4];
const SHARE = [0.4, 0.3, 0.2, 0.1];
/** Сколько всего серебра: ниже — редкие крупинки, выше — сплошная муть. */
const DENSITY = 1.0;

const MEAN = 64; // чтобы не поехала яркость страницы
const AMP = 40;

/** Детерминированный источник: плитка одна и та же везде и всегда. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Смещения пикселей кружка данного радиуса от его центра. */
function stamp(radius: number): [number, number][] {
  const out: [number, number][] = [];
  const r = Math.ceil(radius);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= radius * radius) out.push([dx, dy]);
    }
  }
  // у самых мелких кристаллов радиус меньше пикселя: такое зерно всё равно
  // засвечивает свой пиксель, иначе этот калибр просто пропал бы
  return out.length ? out : [[0, 0]];
}

/** Одна бесшовная плитка зерна. */
export function grainTile(seed: number): ImageData {
  const n = TILE;
  const rnd = mulberry32(seed);
  const density = new Float32Array(n * n);

  for (let k = 0; k < SIZES.length; k++) {
    const radius = SIZES[k];
    const cells = stamp(radius);
    const area = Math.PI * radius * radius;
    // столько кристаллов этого калибра нужно, чтобы дать свою долю плотности
    const count = Math.round((DENSITY * SHARE[k] / area) * n * n);
    // каждый кристалл добавляет столько, чтобы доля не зависела от того,
    // на сколько пикселей он лёг
    const add = area / cells.length;
    for (let i = 0; i < count; i++) {
      const cy = (rnd() * n) | 0;
      const cx = (rnd() * n) | 0;
      for (const [dx, dy] of cells) {
        const y = (cy + dy + n) % n;
        const x = (cx + dx + n) % n;
        density[y * n + x] += add;
      }
    }
  }

  let mean = 0;
  const pass = new Float32Array(n * n);
  for (let i = 0; i < pass.length; i++) {
    pass[i] = 1 - Math.exp(-density[i]);
    mean += pass[i];
  }
  mean /= pass.length;
  let sq = 0;
  for (let i = 0; i < pass.length; i++) sq += (pass[i] - mean) ** 2;
  const sd = Math.sqrt(sq / pass.length) || 1;

  const img = new ImageData(n, n);
  const px = img.data;
  for (let i = 0; i < pass.length; i++) {
    const v = Math.max(0, Math.min(255, Math.round(((pass[i] - mean) / sd) * AMP + MEAN)));
    const j = i * 4;
    px[j] = px[j + 1] = px[j + 2] = v;
    px[j + 3] = 255;
  }
  return img;
}
