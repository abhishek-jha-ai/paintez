# Generates a "painted cabinets" version of the oak kitchen for the before/after demo.
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB"); W, H = im.size; s = W / 1000
a = np.asarray(im).astype(np.float32) / 255
mx, mn = a.max(2), a.min(2)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
hue_ok = (r >= g) & (g >= b * 0.9)  # orange/brown family
satw_lo = np.clip((sat - 0.30) / 0.10, 0, 1) * hue_ok   # upper cabinets: tight regions, catch highlights
satw_hi = np.clip((sat - 0.46) / 0.12, 0, 1) * hue_ok   # lower areas: avoid beige floor tile
V = mx

regions = [
  [(180,362),(320,362),(320,540),(180,540)],
  [(232,405),(870,385),(870,470),(800,470),(760,500),(745,520),(745,640),(625,662),(625,750),(330,750),(240,702)],
  [(595,350),(830,350),(830,392),(595,392)],
  [(938,384),(1000,384),(1000,540),(938,540)],
]
uppers = [
  [(0,0),(191,0),(191,182),(0,182)],
  [(182,82),(291,82),(291,286),(182,286)],
  [(386,125),(665,125),(665,290),(386,290)],
  [(892,46),(1000,46),(1000,290),(892,290)],
]
# bar stools stay untouched (seat/back silhouettes + legs and rungs)
chairs = [
  [(503,553),(530,528),(638,523),(640,498),(655,478),(748,472),(748,652),(720,655),(640,655),(618,618),(503,610)],
  [(745,485),(758,443),(824,437),(826,605),(745,605)],
  [(818,430),(884,420),(892,530),(818,540)],
  [(503,698),(628,676),(628,712),(503,742)],
]
legs = [((514,600),(514,750),18),((602,612),(600,740),16),((633,640),(633,750),22),((733,640),(736,750),22),((640,702),(728,690),14)]
bulbs = [[(452,88),(482,88),(486,165),(448,165)], [(598,128),(630,128),(632,190),(596,190)]]
def poly_mask(polys):
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
    for poly in polys: d.polygon([(x*s, y*s) for x, y in poly], fill=255)
    return np.asarray(m).astype(np.float32) / 255
def chair_mask():
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
    for poly in chairs: d.polygon([(x*s, y*s) for x, y in poly], fill=255)
    for (x0,y0),(x1,y1),w in legs: d.line([(x0*s,y0*s),(x1*s,y1*s)], fill=255, width=int(w*s))
    m = m.filter(ImageFilter.GaussianBlur(1.5*s))
    return np.asarray(m).astype(np.float32) / 255
up, low, ch, bl = poly_mask(uppers), poly_mask(regions), chair_mask(), poly_mask(bulbs)
bl = np.asarray(Image.fromarray((bl*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6*s))).astype(np.float32)/255
mask = np.maximum(up * satw_lo, low * satw_hi) * (1 - bl) * (1 - ch)
mask = np.asarray(Image.fromarray((mask*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)/255

L = 0.299*r + 0.587*g + 0.114*b
# soften wood grain so the result reads as smooth painted finish
Lb = np.asarray(Image.fromarray((L*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3*s))).astype(np.float32)/255
L = 0.22 * L + 0.78 * Lb
ref = np.median(L[mask > 0.8])
shade = np.clip(0.30 + 0.72 * (L / ref) ** 0.85, 0, 1.06)
paint = np.array([0.955, 0.945, 0.92])
painted = np.clip(paint[None, None, :] * shade[..., None], 0, 1)
res = a * (1 - mask[..., None]) + painted * mask[..., None]
Image.fromarray((res * 255).astype(np.uint8)).save(out, quality=92)
