# Finds spikes: motion that jumps instead of flowing, and things that fly across the screen. Karl sees these at once;
# a still never shows them (K.B, October 2026: "out of nowhere starts going right, like a spike", "the frame spikes out
# of nowhere", "too fast and spiky", "the outro is flying around too much").
#   python3 spike_check.py film.mp4 [--profile] [--json out.json]
# 1 The camera. Between every two frames it tracks a few hundred points and fits the move of the whole picture
#   (pan and zoom). A spike is a sudden change in that move: a pan or zoom that starts, stops or turns within a
#   frame or two (a linear camera segment that starts at full speed, a quick zoom "release" on a transition, a
#   lean towards a point). Reported in px/s² (pan, at 1080p) and %/s² (zoom).
# 2 Flying. After the camera's move is taken out, it measures what still moves fast (dense optical flow, per tile):
#   something visible that keeps travelling fast for more than half a second (tiles orbiting a logo, a feed racing
#   up the side, cards swinging round). Arrivals and exits are short and don't count.
# Thresholds are calibrated on Karl's 25 reference films (they pass) and on K.B v2, where he named the spikes, against
# K.B v3, which he and the client approved (scripts/index.md). Exit code 1 when a spike or flying stretch is found.
# Needs opencv-python-headless and numpy.
import argparse, json, sys
import cv2, numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("--profile", action="store_true"); ap.add_argument("--json")
ap.add_argument("--pan", type=float, default=1500, help="camera pan acceleration limit, px/s² at 1080p")
ap.add_argument("--zoom", type=float, default=12, help="camera zoom acceleration limit, %%/s²")
ap.add_argument("--fly", type=float, default=900, help="speed (px/s at 1080p) above which a moving element is flying")
ap.add_argument("--fly-time", type=float, default=0.5, help="seconds a fast element must keep flying to count")
ap.add_argument("--move", type=float, default=150, help="speed (px/s) from which a tile counts as moving, for the directions count")
ap.add_argument("--dirs", type=int, default=4, help="directions at once from which the frame is busy")
ap.add_argument("--busy-time", type=float, default=1.5, help="seconds the frame must stay busy to count")
a = ap.parse_args()

cap = cv2.VideoCapture(a.video); fps = cap.get(cv2.CAP_PROP_FPS) or 30
W0 = cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 1920
W, H = 480, 270; k = 1920 / W                       # analysis size; speeds are reported at 1080p
TX, TY = 16, 9                                      # tiles for the flow
cam, local = [], []                                 # per frame: (tx, ty, log-zoom, ok), (fast-tile share, max speed)
prev = None
while True:
    ok, fr = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(fr, (W, H), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
    if prev is None: prev = g; continue
    p0 = cv2.goodFeaturesToTrack(prev, 400, 0.01, 8)
    tx = ty = z = 0.0; good = False; M = None
    if p0 is not None and len(p0) >= 20:
        p1, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, p0, None, winSize=(21, 21), maxLevel=3)
        m = st.ravel() == 1
        if m.sum() >= 20:
            M, inl = cv2.estimateAffinePartial2D(p0[m], p1[m], method=cv2.RANSAC, ransacReprojThreshold=1.0)
            q = p0[m][inl.ravel() == 1].reshape(-1, 2) if inl is not None else np.zeros((0, 2))
            # only a move of the whole picture is the camera: the points it explains must spread over the frame
            spread = len(q) >= 15 and np.ptp(q[:, 0]) > 0.6 * W and np.ptp(q[:, 1]) > 0.5 * H
            if M is not None and inl is not None and inl.sum() >= max(15, 0.6 * m.sum()) and spread:
                s = float(np.hypot(M[0, 0], M[1, 0]))
                # the pan of the frame's centre, not of the corner the affine is written about
                cx, cy = W / 2, H / 2
                tx = (M[0, 0] * cx + M[0, 1] * cy + M[0, 2] - cx) * k; ty = (M[1, 0] * cx + M[1, 1] * cy + M[1, 2] - cy) * k
                z = float(np.log(s)); good = True
    cam.append((tx, ty, z, good))
    # what moves on its own: dense flow minus the camera
    sg, sp = cv2.resize(g, (240, 135)), cv2.resize(prev, (240, 135))
    fl = cv2.calcOpticalFlowFarneback(sp, sg, None, 0.5, 3, 15, 3, 5, 1.2, 0)
    if good and M is not None:
        yy, xx = np.mgrid[0:135, 0:240].astype(np.float32) * 2
        ex = (M[0, 0] * xx + M[0, 1] * yy + M[0, 2]) - xx; ey = (M[1, 0] * xx + M[1, 1] * yy + M[1, 2]) - yy
        fl[..., 0] -= ex / 2; fl[..., 1] -= ey / 2
    mag = np.hypot(fl[..., 0], fl[..., 1]) * 2 * k * fps            # px/s at 1080p
    tiles = mag[: 135 // TY * TY, : 240 // TX * TX].reshape(TY, 135 // TY, TX, 240 // TX).transpose(0, 2, 1, 3).reshape(TY, TX, -1)
    ts = np.median(tiles, axis=2)                                    # a tile moves when most of it moves
    ang = np.arctan2(fl[..., 1], fl[..., 0])[: 135 // TY * TY, : 240 // TX * TX].reshape(TY, 135 // TY, TX, 240 // TX).transpose(0, 2, 1, 3).reshape(TY, TX, -1)
    mv = ts > a.move
    bins = np.zeros(8)
    for (r, c) in zip(*np.where(mv)):
        b = int(((np.median(ang[r, c]) + np.pi) / (2 * np.pi) * 8) % 8); bins[b] += 1
    dirs = int((bins >= 2).sum())                                   # directions things are moving in, at once
    local.append((float((ts > a.fly).mean()), float(ts.max()), dirs, float(mv.mean())))
    prev = g

cam = np.array(cam, dtype=float); local = np.array(local)
n = len(cam); t = np.arange(n) / fps
okm = cam[:, 3] > 0
# velocity per second, smoothed over 3 frames so tracking noise doesn't read as a spike
def smooth(x, w=3):
    return np.convolve(x, np.ones(w) / w, mode="same")
vx, vy = smooth(cam[:, 0]) * fps, smooth(cam[:, 1]) * fps          # px/s
vz = smooth(cam[:, 2]) * fps * 100                                  # %/s
ax_ = np.gradient(vx) * fps; ay_ = np.gradient(vy) * fps; az = np.gradient(vz) * fps
pan_acc = np.hypot(ax_, ay_)
valid = okm & np.r_[okm[1:], True] & np.r_[True, okm[:-1]]          # both neighbours tracked too
spikes = []
for i in np.where(valid & ((pan_acc > a.pan) | (np.abs(az) > a.zoom)))[0]:
    if spikes and i - spikes[-1][1] <= 3: spikes[-1][1] = i; spikes[-1][2] = max(spikes[-1][2], pan_acc[i]); spikes[-1][3] = max(spikes[-1][3], abs(az[i])); continue
    spikes.append([i, i, pan_acc[i], abs(az[i])])
fly = local[:, 0] > 0.004                                           # at least one tile in 250 flying
runs, i = [], 0
while i < n:
    if fly[i]:
        j = i
        while j + 1 < n and fly[j + 1]: j += 1
        if (j - i + 1) / fps >= a.fly_time: runs.append((i, j, float(local[i:j + 1, 1].max())))
        i = j + 1
    else: i += 1
busy = local[:, 2] >= a.dirs
bruns, i = [], 0
while i < n:
    if busy[i]:
        j = i
        while j + 1 < n and busy[j + 1]: j += 1
        if (j - i + 1) / fps >= a.busy_time: bruns.append((i, j, int(local[i:j + 1, 2].max())))
        i = j + 1
    else: i += 1
end = n - int(2 * fps) if n > 4 * fps else n                        # the last 2 s are the end card, still checked
for s0, s1, pa, za in spikes:
    print(f"SPIKE {t[s0]:.2f}–{t[s1]:.2f} s: the camera {'pans' if pa > a.pan else 'zooms'} out of nowhere "
          f"(pan acceleration {pa:.0f} px/s², zoom acceleration {za:.1f} %/s²)")
for s0, s1, mx in runs:
    print(f"FLYING {t[s0]:.2f}–{t[s1]:.2f} s: something keeps travelling fast for {(s1 - s0 + 1) / fps:.1f} s (up to {mx:.0f} px/s)")
for s0, s1, d in bruns:
    print(f"BUSY {t[s0]:.2f}–{t[s1]:.2f} s: things move in {d} directions at once for {(s1 - s0 + 1) / fps:.1f} s")
calm = valid.mean()
print(f"camera: pan up to {np.percentile(np.hypot(vx, vy)[valid], 99):.0f} px/s, zoom up to {np.percentile(np.abs(vz)[valid], 99):.1f} %/s; "
      f"{len(spikes)} spike(s), {len(runs)} flying stretch(es)  (tracked {100 * calm:.0f}% of frames)")
if a.profile:
    for s in range(0, n, int(round(fps))):
        e = min(n, s + int(round(fps)))
        print(f"{s / fps:6.1f}s  pan {np.hypot(vx, vy)[s:e].max():5.0f} px/s  pan-acc {pan_acc[s:e].max():6.0f}  zoom {np.abs(vz[s:e]).max():5.1f} %/s  "
              f"zoom-acc {np.abs(az[s:e]).max():5.1f}  fast {100 * local[s:e, 0].max():4.1f}%  top {local[s:e, 1].max():5.0f} px/s  dirs {np.median(local[s:e, 2]):3.0f}  moving {100 * local[s:e, 3].mean():4.1f}%")
if a.json:
    json.dump({"fps": fps, "spikes": [[t[s0], t[s1], pa, za] for s0, s1, pa, za in spikes], "flying": [[t[s0], t[s1], mx] for s0, s1, mx in runs],
               "pan": np.hypot(vx, vy).tolist(), "pan_acc": pan_acc.tolist(), "zoom": vz.tolist(), "zoom_acc": az.tolist(),
               "fast": local[:, 0].tolist(), "top": local[:, 1].tolist(), "dirs": local[:, 2].tolist(), "moving": local[:, 3].tolist(), "valid": valid.tolist()}, open(a.json, "w"))
sys.exit(1 if spikes or runs or bruns else 0)
