/**
 * Generates public/og.png — 1200x630 Open Graph image, zero dependencies.
 * Renders with an embedded 5x7 bitmap font on the site's dark console aesthetic.
 * Run: node scripts/generate-og.mjs
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const W = 1200, H = 630;
const px = new Uint8Array(W * H * 3);

const set = (x, y, r, g, b) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = r; px[i + 1] = g; px[i + 2] = b;
};
const fill = (r, g, b) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) set(x, y, r, g, b); };
const rect = (x0, y0, w, h, r, g, b) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(x, y, r, g, b); };

const FONT = {
  A:['01110','10001','10001','11111','10001','10001','10001'], B:['11110','10001','10001','11110','10001','10001','11110'],
  C:['01110','10001','10000','10000','10000','10001','01110'], D:['11100','10010','10001','10001','10001','10010','11100'],
  E:['11111','10000','10000','11110','10000','10000','11111'], F:['11111','10000','10000','11110','10000','10000','10000'],
  G:['01110','10001','10000','10111','10001','10001','01111'], H:['10001','10001','10001','11111','10001','10001','10001'],
  I:['01110','00100','00100','00100','00100','00100','01110'], J:['00111','00010','00010','00010','00010','10010','01100'],
  K:['10001','10010','10100','11000','10100','10010','10001'], L:['10000','10000','10000','10000','10000','10000','11111'],
  M:['10001','11011','10101','10101','10001','10001','10001'], N:['10001','11001','10101','10011','10001','10001','10001'],
  O:['01110','10001','10001','10001','10001','10001','01110'], P:['11110','10001','10001','11110','10000','10000','10000'],
  Q:['01110','10001','10001','10001','10101','10010','01101'], R:['11110','10001','10001','11110','10100','10010','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'], T:['11111','00100','00100','00100','00100','00100','00100'],
  U:['10001','10001','10001','10001','10001','10001','01110'], V:['10001','10001','10001','10001','10001','01010','00100'],
  W:['10001','10001','10001','10101','10101','10101','01010'], X:['10001','10001','01010','00100','01010','10001','10001'],
  Y:['10001','10001','01010','00100','00100','00100','00100'], Z:['11111','00001','00010','00100','01000','10000','11111'],
  '0':['01110','10001','10011','10101','11001','10001','01110'], '1':['00100','01100','00100','00100','00100','00100','01110'],
  '2':['01110','10001','00001','00010','00100','01000','11111'], '3':['11110','00001','00001','01110','00001','00001','11110'],
  '4':['00010','00110','01010','10010','11111','00010','00010'], '5':['11111','10000','11110','00001','00001','10001','01110'],
  '6':['00110','01000','10000','11110','10001','10001','01110'], '7':['11111','00001','00010','00100','01000','01000','01000'],
  '8':['01110','10001','10001','01110','10001','10001','01110'], '9':['01110','10001','10001','01111','00001','00010','01100'],
  ' ':['00000','00000','00000','00000','00000','00000','00000'], '-':['00000','00000','00000','11111','00000','00000','00000'],
  '.':['00000','00000','00000','00000','00000','01100','01100'], '/':['00001','00010','00010','00100','01000','01000','10000'],
  '+':['00000','00100','00100','11111','00100','00100','00000'], ':':['00000','01100','01100','00000','01100','01100','00000'],
};

function drawText(str, x0, y0, scale, r, g, b) {
  let cx = x0;
  for (const ch of str.toUpperCase()) {
    const glyph = FONT[ch] ?? FONT[' '];
    for (let row = 0; row < 7; row++)
      for (let col = 0; col < 5; col++)
        if (glyph[row][col] === '1') rect(cx + col * scale, y0 + row * scale, scale, scale, r, g, b);
    cx += 6 * scale;
  }
  return cx;
}

// Background
fill(5, 5, 5);
// Grid
for (let y = 0; y < H; y += 48) rect(0, y, W, 1, 255, 255, 255);
for (let x = 0; x < W; x += 48) rect(x, 0, 1, H, 255, 255, 255);
// Dim grid: overwrite with very dark gray (simulate low opacity)
fill(5, 5, 5);
for (let y = 0; y < H; y += 48) rect(0, y, W, 1, 14, 14, 15);
for (let x = 0; x < W; x += 48) rect(x, 0, 1, H, 14, 14, 15);

// Status bar
rect(80, 84, 14, 14, 0, 255, 136);
drawText('SYSTEM ONLINE', 108, 86, 3, 0, 255, 136);
drawText('UTC+5 / ASTANA', 108 + 15 * 18 + 40, 86, 3, 63, 63, 70);

// Name + role
drawText('NURDAULET BEKETOV', 80, 216, 9, 255, 255, 255);
drawText('BACKEND SOFTWARE ENGINEER', 80, 330, 5, 113, 113, 122);
drawText('GO / JAVA / DISTRIBUTED SYSTEMS / AI INFRASTRUCTURE', 80, 396, 3, 82, 82, 88);

// Metrics strip
rect(80, 470, 1040, 1, 30, 30, 33);
drawText('3.5M+ USERS', 80, 500, 3, 0, 255, 136);
drawText('40K-50K CONCURRENT', 390, 500, 3, 0, 255, 136);
drawText('RAG + VECTOR SEARCH', 820, 500, 3, 129, 140, 248);

// Bottom bar
rect(0, H - 6, W, 6, 0, 255, 136);
drawText('NURDAULET.DEV', 80, 576, 3, 63, 63, 70);

// ---- PNG encode ----
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; // 8-bit, truecolor RGB

const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0; // filter: none
  Buffer.from(px.buffer, y * W * 3, W * 3).copy(raw, y * (1 + W * 3) + 1);
}

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

writeFileSync('public/og.png', png);
console.log(`og.png written (${png.length} bytes)`);
