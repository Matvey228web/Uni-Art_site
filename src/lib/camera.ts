/**
 * Математика полёта камеры для объёмной сцены.
 *
 * Система координат совпадает с CSS: X вправо, Y вниз, Z на зрителя.
 * Камера по умолчанию смотрит вдоль −Z.
 */

export type Vec3 = { x: number; y: number; z: number };

export const v3 = (x: number, y: number, z: number): Vec3 => ({ x, y, z });
export const add = (a: Vec3, b: Vec3): Vec3 => v3(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub = (a: Vec3, b: Vec3): Vec3 => v3(a.x - b.x, a.y - b.y, a.z - b.z);
export const scale = (a: Vec3, k: number): Vec3 => v3(a.x * k, a.y * k, a.z * k);
export const len = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);
export const norm = (a: Vec3): Vec3 => {
  const l = len(a) || 1;
  return v3(a.x / l, a.y / l, a.z / l);
};

/**
 * Кривая Катмулла — Рома: проходит ровно через опорные точки,
 * поэтому маршрут задаётся списком мест, где камера должна побывать.
 */
export function spline(points: Vec3[], t: number): Vec3 {
  if (points.length === 0) return v3(0, 0, 0);
  if (points.length === 1) return points[0];

  const clamped = Math.min(0.999999, Math.max(0, t));
  const segments = points.length - 1;
  const scaled = clamped * segments;
  const i = Math.floor(scaled);
  const f = scaled - i;

  const at = (k: number) => points[Math.min(points.length - 1, Math.max(0, k))];
  const p0 = at(i - 1);
  const p1 = at(i);
  const p2 = at(i + 1);
  const p3 = at(i + 2);

  const f2 = f * f;
  const f3 = f2 * f;
  const axis = (a: number, b: number, c: number, d: number) =>
    0.5 *
    ((2 * b) + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f2 + (-a + 3 * b - 3 * c + d) * f3);

  return v3(
    axis(p0.x, p1.x, p2.x, p3.x),
    axis(p0.y, p1.y, p2.y, p3.y),
    axis(p0.z, p1.z, p2.z, p3.z),
  );
}

/** Углы поворота камеры, смотрящей из eye в target. */
export function lookAngles(eye: Vec3, target: Vec3): { yaw: number; pitch: number } {
  const d = norm(sub(target, eye));
  // при d = (0, 0, −1) оба угла равны нулю
  const yaw = Math.atan2(d.x, -d.z);
  const pitch = Math.asin(Math.max(-1, Math.min(1, -d.y)));
  return { yaw, pitch };
}

/** Направление взгляда по углам — обратная операция к lookAngles. */
export function forward(yaw: number, pitch: number): Vec3 {
  return v3(
    Math.sin(yaw) * Math.cos(pitch),
    -Math.sin(pitch),
    -Math.cos(yaw) * Math.cos(pitch),
  );
}

type Mat4 = number[]; // построчно, 16 чисел

function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array(16).fill(0);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[r * 4 + k] * b[k * 4 + c];
      out[r * 4 + c] = s;
    }
  }
  return out;
}

const translation = (x: number, y: number, z: number): Mat4 =>
  [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];

const rotationY = (a: number): Mat4 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1];
};

const rotationX = (a: number): Mat4 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1];
};

const rotationZ = (a: number): Mat4 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

/**
 * Поворот камеры. Углы берутся со знаком минус: положительный yaw уводит
 * взгляд вправо, а сам мир при этом должен повернуться влево.
 */
export function cameraRotation(yaw: number, pitch: number, roll = 0): Mat4 {
  return multiply(rotationY(-yaw), multiply(rotationX(-pitch), rotationZ(roll)));
}

/**
 * Преобразование мира под камеру: мир сдвигается и поворачивается обратно
 * тому, как летит камера. translateZ(perspective) ставит наблюдателя
 * в плоскость экрана, как того требует модель CSS.
 */
export function worldMatrix(
  eye: Vec3,
  yaw: number,
  pitch: number,
  roll: number,
  perspective: number,
): Mat4 {
  const r = cameraRotation(yaw, pitch, roll);
  // транспонирование поворота — это его обращение
  const rInv: Mat4 = [
    r[0], r[4], r[8], 0,
    r[1], r[5], r[9], 0,
    r[2], r[6], r[10], 0,
    0, 0, 0, 1,
  ];
  const view = multiply(rInv, translation(-eye.x, -eye.y, -eye.z));
  return multiply(translation(0, 0, perspective), view);
}

/** CSS ждёт матрицу по столбцам. */
export function toCss(m: Mat4): string {
  const c = [
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15],
  ];
  return `matrix3d(${c.map((n) => (Math.abs(n) < 1e-6 ? 0 : Number(n.toFixed(6)))).join(",")})`;
}

/**
 * Точка мира в системе камеры — нужна для тумана и отбраковки.
 * Считается той же матрицей поворота, что и вид, иначе два куска
 * тригонометрии неизбежно разойдутся.
 */
export function toCameraSpace(p: Vec3, eye: Vec3, yaw: number, pitch: number, roll = 0): Vec3 {
  const d = sub(p, eye);
  const r = cameraRotation(yaw, pitch, roll);
  // обращение поворота — это транспонирование
  return v3(
    r[0] * d.x + r[4] * d.y + r[8] * d.z,
    r[1] * d.x + r[5] * d.y + r[9] * d.z,
    r[2] * d.x + r[6] * d.y + r[10] * d.z,
  );
}


/**
 * Равномерный ход по кривой.
 *
 * Сама кривая параметризована по номеру опорной точки, поэтому там, где
 * точки стоят гуще, камера ползёт, а на редких участках проносится.
 * Таблица длин переводит «долю прокрутки» в «долю пройденного пути».
 */
export function arcLengthTable(points: Vec3[], steps = 600): number[] {
  const table: number[] = [0];
  let prev = spline(points, 0);
  let total = 0;
  for (let i = 1; i <= steps; i++) {
    const cur = spline(points, i / steps);
    total += len(sub(cur, prev));
    table.push(total);
    prev = cur;
  }
  return table.map((d) => (total > 0 ? d / total : 0));
}

/** Доля пути -> параметр кривой */
export function atDistance(table: number[], t: number): number {
  const steps = table.length - 1;
  const target = Math.min(1, Math.max(0, t));
  let lo = 0;
  let hi = steps;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (table[mid] < target) lo = mid;
    else hi = mid;
  }
  const span = table[hi] - table[lo] || 1;
  const f = (target - table[lo]) / span;
  return (lo + f) / steps;
}
