# python3 scripts/sheet.py [cols] [width] -> out/test/sheet.png: labelled contact sheet of out/test/f*.png
import glob, sys
from PIL import Image, ImageDraw
cols = int(sys.argv[1]) if len(sys.argv) > 1 else 4
W = int(sys.argv[2]) if len(sys.argv) > 2 else 480
files = sorted(glob.glob("out/test/f*.png"))
H = W * 9 // 16
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (W + 6), rows * (H + 28)), "white")
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((W, H))
    x, y = (i % cols) * (W + 6), (i // cols) * (H + 28)
    sheet.paste(im, (x, y + 22))
    fr = int(f[-8:-4])
    d.text((x + 4, y + 4), f"f{fr}  {fr/30:.2f}s", fill="black")
sheet.save("out/test/sheet.png")
print(sheet.size)
