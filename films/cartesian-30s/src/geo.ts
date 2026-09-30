// Isometric projection and path helpers (no fonts, so plain Node can import it).
// ---- isometric projection of the store plan (plan units: the floor is 1000 × 700) ----
export const ISO = { ox: 850, oy: 150, k: 0.95 };
export const iso = (x: number, y: number, z = 0): [number, number] => [
  ISO.ox + (x - y) * 0.866 * ISO.k,
  ISO.oy + (x + y) * 0.5 * ISO.k - z * ISO.k,
];
export const pts = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** A plan-space polyline with rounded corners, sampled evenly: returns points and their cumulative length. */
export const roundedPath = (poly: [number, number][], r = 40, step = 4) => {
  const out: [number, number][] = [];
  const push = (p: [number, number]) => out.push(p);
  push(poly[0]);
  for (let i = 1; i < poly.length - 1; i++) {
    const [ax, ay] = poly[i - 1], [bx, by] = poly[i], [cx, cy] = poly[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(cx - bx, cy - by);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const p1: [number, number] = [bx - ((bx - ax) / l1) * rr, by - ((by - ay) / l1) * rr];
    const p2: [number, number] = [bx + ((cx - bx) / l2) * rr, by + ((cy - by) / l2) * rr];
    push(p1);
    for (let t = 0.1; t < 1; t += 0.1) {
      const u = 1 - t;
      push([u * u * p1[0] + 2 * u * t * bx + t * t * p2[0], u * u * p1[1] + 2 * u * t * by + t * t * p2[1]]);
    }
    push(p2);
  }
  push(poly[poly.length - 1]);
  // resample evenly
  const res: [number, number][] = [out[0]];
  const cum = [0];
  let carry = 0;
  for (let i = 1; i < out.length; i++) {
    const [ax, ay] = out[i - 1], [bx, by] = out[i];
    const L = Math.hypot(bx - ax, by - ay);
    let d = step - carry;
    while (d <= L) {
      res.push([ax + ((bx - ax) * d) / L, ay + ((by - ay) * d) / L]);
      cum.push(cum[cum.length - 1] + step);
      d += step;
    }
    carry = L - (d - step);
  }
  res.push(out[out.length - 1]);
  cum.push(cum[cum.length - 1] + carry);
  return { points: res, cum, length: cum[cum.length - 1] };
};

export const pointAt = (path: ReturnType<typeof roundedPath>, dist: number): [number, number] => {
  const d = Math.max(0, Math.min(path.length, dist));
  let i = 1;
  while (i < path.cum.length - 1 && path.cum[i] < d) i++;
  const t = (d - path.cum[i - 1]) / Math.max(1e-6, path.cum[i] - path.cum[i - 1]);
  const a = path.points[i - 1], b = path.points[i];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

/** The part of a path from 0 to dist, as plan points. */
export const pathUntil = (path: ReturnType<typeof roundedPath>, from: number, to: number) => {
  const a = Math.max(0, from), b = Math.min(path.length, to);
  const out: [number, number][] = [];
  if (b <= a) return out;
  out.push(pointAt(path, a));
  for (let i = 0; i < path.cum.length; i++) if (path.cum[i] > a && path.cum[i] < b) out.push(path.points[i]);
  out.push(pointAt(path, b));
  return out;
};

// seeded random
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
