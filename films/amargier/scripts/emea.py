# Writes src/emea.json: a dot map of EMEA (Natural Earth land, 1:50m, from the world-atlas package, public domain)
# in frame coordinates, dots fading toward the crop edges, plus the cities the film marks.
#   python3 scripts/emea.py      (needs harvest/land-50m.json: https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json)
import json, math, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
topo = json.load(open(os.path.join(ROOT, "harvest", "land-50m.json")))
sx, sy = topo["transform"]["scale"]; tx, ty = topo["transform"]["translate"]
arcs = []
for a in topo["arcs"]:
    x = y = 0; pts = []
    for dx, dy in a: x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)
def ring(idx):
    out = []
    for i in idx:
        p = arcs[i] if i >= 0 else arcs[~i][::-1]
        out += p if not out else p[1:]
    return out
LON0, LON1, LAT0, LAT1 = -26, 64, -36, 71
polys = []
for g in topo["objects"]["land"]["geometries"]:
    for poly in (g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]):
        rs = [ring(r) for r in poly]
        xs = [p[0] for p in rs[0]]; ys = [p[1] for p in rs[0]]
        if max(xs) < LON0 - 5 or min(xs) > LON1 + 5 or max(ys) < LAT0 - 5 or min(ys) > LAT1 + 5: continue
        polys.append((min(xs), max(xs), min(ys), max(ys), rs))
def pip(r, lon, lat):
    c = False
    for k in range(len(r)):
        x1, y1 = r[k - 1]; x2, y2 = r[k]
        if (y1 > lat) != (y2 > lat) and lon < (x2 - x1) * (lat - y1) / (y2 - y1 + 1e-12) + x1: c = not c
    return c
def inside(lon, lat):
    return any(a <= lon <= b and c <= lat <= d and pip(rs[0], lon, lat) and not any(pip(h, lon, lat) for h in rs[1:]) for a, b, c, d, rs in polys)
PX = 960 / (LAT1 - LAT0); K = math.cos(math.radians(30)); CX, CY = 1250, 545
proj = lambda lon, lat: (round(CX + (lon - (LON0 + LON1) / 2) * PX * K, 1), round(CY - (lat - (LAT0 + LAT1) / 2) * PX, 1))
step = 1.15; dots = []; row = 0; lat = LAT1
while lat > LAT0:
    lon = LON0 + (row % 2) * step / 2
    while lon < LON1:
        if not (lon < -12 and lat > 59) and inside(lon, lat):
            fade = max(0.0, min(1.0, (LON1 - lon) / 12, (LAT1 - lat) / 7, (lon - LON0) / 8))
            if fade > 0.05: dots.append([*proj(lon, lat), round(fade, 2)])
        lon += step
    lat -= step * 0.88; row += 1
CITIES = {"Málaga": (-4.42, 36.72), "London": (-0.13, 51.5), "Paris": (2.35, 48.86), "Amsterdam": (4.9, 52.37), "Berlin": (13.4, 52.5),
          "Stockholm": (18.07, 59.33), "Milan": (9.19, 45.46), "Warsaw": (21.0, 52.23), "Dubai": (55.27, 25.2), "Tel Aviv": (34.78, 32.08),
          "Cairo": (31.24, 30.04), "Lagos": (3.38, 6.52), "Nairobi": (36.82, -1.29), "Johannesburg": (28.04, -26.2), "Dublin": (-6.26, 53.35),
          "Zurich": (8.54, 47.37), "Riyadh": (46.7, 24.7), "Madrid": (-3.7, 40.4)}
json.dump({"dots": dots, "cities": {k: proj(*v) for k, v in CITIES.items()}}, open(os.path.join(ROOT, "src", "emea.json"), "w"))
print(len(dots), "dots")
