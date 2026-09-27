/**
 * Плёночное зерно.
 *
 * Белый шум попиксельно читается жёстко и геометрично: вся его энергия сидит
 * на самой мелкой частоте, какую экран вообще может показать, и глаз ловит
 * не зерно, а рябь. У настоящего зерна есть характерный размер сгустка,
 * то есть спектр полосовой — энергия спадает и вверх, и вниз от него.
 *
 * Такой спектр собирается разностью двух коробчатых размытий: широкое
 * срезает низ, узкое — верх. Размытие заворачивается по краям, свёртка
 * выходит круговой, а плитка — периодической: её можно мостить без шва.
 *
 * Числа подобраны по спектру: сгусток около 4 пикселей, верхний хвост 0.6
 * от пика, нижний 0.03. Для сравнения у прежней плитки хвост был 1.0 и рос
 * до предела разрешения — отсюда и жёсткость.
 */

export const TILE = 512;

const SHARP = 0.7; // доля неразмытого шума в верхней части полосы
const WIDE = 2; // радиус широкого размытия, срезающего низ
/*
 * Среднее и амплитуда подобраны вместе с прозрачностью слоя.
 *
 * Зерно на почти чёрной странице может только осветлять, поэтому контраст
 * и подъём яркости связаны: чем сильнее зерно, тем светлее становится фон.
 * Прежняя плитка обходила это обрезкой — половина её пикселей упиралась
 * в ноль, и получалась соль с перцем. Здесь обрезано 8%, а недостающую
 * заметность добирает размер сгустка: двухпиксельные сгустки видны лучше
 * попиксельной ряби той же силы.
 */
const MEAN = 64;
const AMP = 46;
const GAMMA = 1.15; // сгустки заметнее просветов, как на плёнке

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

/** Коробчатое размытие с заворотом по краям, по строкам и по столбцам. */
function blurWrap(src: Float32Array, n: number, r: number): Float32Array {
  const k = 2 * r + 1;
  const mid = new Float32Array(n * n);
  for (let y = 0; y < n; y++) {
    const o = y * n;
    let sum = 0;
    for (let i = -r; i <= r; i++) sum += src[o + ((i % n) + n) % n];
    for (let x = 0; x < n; x++) {
      mid[o + x] = sum / k;
      sum += src[o + (x + r + 1) % n] - src[o + ((x - r) % n + n) % n];
    }
  }
  const out = new Float32Array(n * n);
  for (let x = 0; x < n; x++) {
    let sum = 0;
    for (let i = -r; i <= r; i++) sum += mid[((i % n) + n) % n * n + x];
    for (let y = 0; y < n; y++) {
      out[y * n + x] = sum / k;
      sum += mid[(y + r + 1) % n * n + x] - mid[((y - r) % n + n) % n * n + x];
    }
  }
  return out;
}

/** Одна бесшовная плитка зерна. */
export function grainTile(seed: number): ImageData {
  const n = TILE;
  const rnd = mulberry32(seed);
  const white = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) white[i] = rnd() * 2 - 1;

  const soft = blurWrap(white, n, 1);
  const wide = blurWrap(white, n, WIDE);

  const band = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) {
    band[i] = SHARP * white[i] + (1 - SHARP) * soft[i] - wide[i];
  }

  let mean = 0;
  for (let i = 0; i < band.length; i++) mean += band[i];
  mean /= band.length;
  let sq = 0;
  for (let i = 0; i < band.length; i++) sq += (band[i] - mean) ** 2;
  const sd = Math.sqrt(sq / band.length) || 1;

  const img = new ImageData(n, n);
  const px = img.data;
  for (let i = 0; i < band.length; i++) {
    const z = (band[i] - mean) / sd;
    const v = Math.sign(z) * Math.abs(z) ** GAMMA;
    const c = Math.max(0, Math.min(255, Math.round(v * AMP + MEAN)));
    const j = i * 4;
    px[j] = px[j + 1] = px[j + 2] = c;
    px[j + 3] = 255;
  }
  return img;
}
