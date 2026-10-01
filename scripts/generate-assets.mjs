// Builds the Open Graph image + favicons from brand artwork.
// Usage: node scripts/generate-assets.mjs   (needs Google Chrome installed for the OG render)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Logo mark SVG (kept in sync with src/components/LogoMark.tsx)
const mark = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style="color:${color}">
  <path d="M24.6 59.2A28 28 0 1 1 39.4 59.2" fill="none" stroke="${color}" stroke-width="5.2" stroke-linecap="round"/>
  <rect x="18" y="13" width="28" height="22" rx="3" fill="none" stroke="${color}" stroke-width="3.6"/>
  <text x="32" y="30.4" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="14.5" fill="${color}" letter-spacing="-0.6">EZ</text>
  <rect x="18" y="37.5" width="28" height="4.4" rx="1.4" fill="${color}"/>
  <rect x="20" y="43.6" width="24" height="3.4" rx="1.2" fill="${color}"/>
  <path d="M28.2 47h7.6l-1.5 11.6c-.35 2.6-4.25 2.6-4.6 0z" fill="${color}"/>
</svg>`;

// ---- favicons: teal mark on a navy rounded tile (reads well on light + dark tabs)
const tile = (size, radius) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${radius}" fill="#011230"/>
  <g transform="translate(6 5) scale(0.82)">${mark("#2ec3d6").replace(/<\/?svg[^>]*>/g, "")}</g>
</svg>`;

writeFileSync(join(root, "src/app/icon.svg"), tile(64, 14));
await sharp(Buffer.from(tile(512, 14))).resize(512, 512).png().toFile(join(root, "src/app/icon.png"));
await sharp(Buffer.from(tile(180, 0))).resize(180, 180).png().toFile(join(root, "src/app/apple-icon.png"));
// favicon.ico (32px PNG-in-ICO)
const png32 = await sharp(Buffer.from(tile(32, 14))).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(png32.length, 14); header.writeUInt32LE(22, 18);
writeFileSync(join(root, "src/app/favicon.ico"), Buffer.concat([header, png32]));

// ---- Open Graph image 1200x630
const photo = await sharp(join(root, "public/images/exterior-ladder.jpg")).resize(1280, 720, { fit: "cover" }).jpeg({ quality: 88 }).toBuffer();
const html = readFileSync(join(root, "scripts/og-template.html"), "utf8")
  .replace("PHOTO", `data:image/jpeg;base64,${photo.toString("base64")}`)
  .replace("LOGO", mark("#02aec4"));
const dir = mkdtempSync(join(tmpdir(), "og-"));
writeFileSync(join(dir, "og.html"), html);
const shot = join(dir, "og.png");
execFileSync(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
  "--window-size=1200,630", "--virtual-time-budget=4000", `--screenshot=${shot}`, `file://${join(dir, "og.html")}`,
], { stdio: "ignore" });
await sharp(shot).resize(1200, 630).jpeg({ quality: 86, progressive: true, mozjpeg: true }).toFile(join(root, "public/og-paint-ez-clearwater.jpg"));
console.log("Assets written.");
