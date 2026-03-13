#!/usr/bin/env node
/**
 * Generates procedural tile textures and saves them as PNG files.
 * Uses only Node.js built-ins (zlib, fs) — no external dependencies.
 */

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'textures', 'generated');
fs.mkdirSync(OUT, { recursive: true });

// ── Minimal PNG encoder ────────────────────────────────────────────────────
function crc32(buf) {
    let c = 0xffffffff;
    for (const b of buf) {
        c ^= b;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([typeB, data])));
    return Buffer.concat([len, typeB, data, crc]);
}

function encodePNG(width, height, rgba) {
    // Build raw rows with filter byte 0 (None) per row
    const rowSize = width * 4;
    const raw = Buffer.alloc(height * (rowSize + 1));
    for (let y = 0; y < height; y++) {
        raw[y * (rowSize + 1)] = 0; // filter = None
        rgba.copy(raw, y * (rowSize + 1) + 1, y * rowSize, (y + 1) * rowSize);
    }
    const compressed = zlib.deflateSync(raw, { level: 6 });

    const IHDR_data = Buffer.alloc(13);
    IHDR_data.writeUInt32BE(width,  0);
    IHDR_data.writeUInt32BE(height, 4);
    IHDR_data[8]  = 8;  // bit depth
    IHDR_data[9]  = 6;  // RGBA
    IHDR_data[10] = 0;
    IHDR_data[11] = 0;
    IHDR_data[12] = 0;

    return Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
        chunk('IHDR', IHDR_data),
        chunk('IDAT', compressed),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

function makeBuffer(w, h) {
    return { w, h, buf: Buffer.alloc(w * h * 4) };
}

function setPixel(img, x, y, r, g, b, a = 255) {
    const i = (y * img.w + x) * 4;
    img.buf[i]     = r;
    img.buf[i + 1] = g;
    img.buf[i + 2] = b;
    img.buf[i + 3] = a;
}

function save(img, name) {
    const png = encodePNG(img.w, img.h, img.buf);
    const p = path.join(OUT, name);
    fs.writeFileSync(p, png);
    console.log('✓', name);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function noise(x, y, seed = 0) {
    // simple deterministic pseudo-noise
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.3) * 43758.5453;
    return n - Math.floor(n);
}

// ── 1. Hex Cream Mosaic ───────────────────────────────────────────────────
function hexCream() {
    const SIZE = 512;
    const img = makeBuffer(SIZE, SIZE);

    const HEX_R = 28; // hex "radius"
    const HEX_H = Math.sqrt(3) * HEX_R;

    // For each pixel decide nearest hex centre
    function hexCenter(x, y) {
        const col = Math.round(x / (1.5 * HEX_R));
        const row = Math.round(y / HEX_H - (col & 1) * 0.5);
        const cx = col * 1.5 * HEX_R;
        const cy = (row + (col & 1) * 0.5) * HEX_H;
        return [cx, cy, col * 1000 + row];
    }

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const [cx, cy, id] = hexCenter(x, y);
            const dx = x - cx, dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const inHex = dist < HEX_R - 2;
            const grout = !inHex;

            if (grout) {
                setPixel(img, x, y, 200, 195, 188);
            } else {
                const jitter = noise(id, 0) * 0.15;
                const base = 230 + Math.round(noise(id, 1) * 20);
                const shade = Math.round(base * (1 - jitter));
                setPixel(img, x, y, shade, shade - 5, shade - 10);
            }
        }
    }
    return img;
}

// ── 2. Terrazzo Grey ──────────────────────────────────────────────────────
function terrazzoGrey() {
    const SIZE = 512;
    const img = makeBuffer(SIZE, SIZE);

    // Base light grey
    for (let y = 0; y < SIZE; y++)
        for (let x = 0; x < SIZE; x++) {
            const v = 200 + Math.round(noise(x, y) * 15);
            setPixel(img, x, y, v, v, v);
        }

    // Scatter ~200 chips of various colours
    const CHIPS = [
        [180, 120, 80],   // warm brown
        [80, 120, 160],   // slate blue
        [200, 60, 60],    // brick red
        [220, 200, 140],  // sand
        [60, 80, 60],     // moss
        [240, 240, 240],  // white
        [60, 60, 60],     // dark
    ];

    const rng = (seed) => {
        const v = Math.sin(seed * 9301.5 + 49297.7) * 233280.0;
        return v - Math.floor(v);
    };

    for (let i = 0; i < 220; i++) {
        const cx = Math.round(rng(i * 3 + 1) * SIZE);
        const cy = Math.round(rng(i * 3 + 2) * SIZE);
        const r  = 4 + Math.round(rng(i * 3 + 3) * 14);
        const col = CHIPS[i % CHIPS.length];
        const angle = rng(i) * Math.PI * 2;

        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                // Ellipse-ish chip shape rotated
                const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
                const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
                if ((rx * rx) / (r * r) + (ry * ry) / ((r * 0.5) * (r * 0.5)) < 1) {
                    const px = (cx + dx + SIZE) % SIZE;
                    const py = (cy + dy + SIZE) % SIZE;
                    setPixel(img, px, py, col[0], col[1], col[2]);
                }
            }
        }
    }
    return img;
}

// ── 3. Chevron Terracotta ─────────────────────────────────────────────────
function chevronTerracotta() {
    const SIZE = 512;
    const img = makeBuffer(SIZE, SIZE);
    const brickW = 64, brickH = 32;

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            // Chevron: alternate direction per column pair
            const col = Math.floor(x / brickW);
            const flip = col % 2 === 0 ? 1 : -1;
            const bx = x % brickW;
            const by = (y + flip * Math.floor(x / brickW) * brickH + SIZE * brickH) % (brickH * 2);
            const row = Math.floor(by / brickH);

            const groutX = bx < 2 || bx > brickW - 3;
            const groutY = by % brickH < 2 || by % brickH > brickH - 3;
            const grout  = groutX || groutY;

            if (grout) {
                setPixel(img, x, y, 170, 140, 115);
            } else {
                const id = col * 1000 + row;
                const v = noise(id, 3);
                const r = clamp(190 + Math.round(v * 30), 0, 255);
                const g = clamp(100 + Math.round(v * 20), 0, 255);
                const b = clamp(60  + Math.round(v * 15), 0, 255);
                setPixel(img, x, y, r, g, b);
            }
        }
    }
    return img;
}

// ── 4. Diamond White ──────────────────────────────────────────────────────
function diamondWhite() {
    const SIZE = 512;
    const img = makeBuffer(SIZE, SIZE);
    const D = 48; // diamond half-size

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            // Rotate grid 45°
            const u = (x + y) / (D * 2);
            const v = (x - y + SIZE) / (D * 2);
            const fu = u - Math.floor(u);
            const fv = v - Math.floor(v);
            const id = Math.floor(u) * 1000 + Math.floor(v);

            const margin = 0.06;
            const grout  = fu < margin || fu > 1 - margin || fv < margin || fv > 1 - margin;

            if (grout) {
                setPixel(img, x, y, 190, 185, 180);
            } else {
                const base = 238 + Math.round(noise(id, 5) * 12);
                setPixel(img, x, y, base, base, base - 2);
            }
        }
    }
    return img;
}

// ── 5. Moroccan Blue ──────────────────────────────────────────────────────
function moroccanBlue() {
    const SIZE = 512;
    const img = makeBuffer(SIZE, SIZE);
    const R = 40; // tile size
    const sq2 = Math.SQRT2;

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            // Moroccan 4-pointed star grid
            const gx = (x % (R * 2)) / R - 1; // -1..1
            const gy = (y % (R * 2)) / R - 1;
            const col = Math.floor(x / (R * 2));
            const row = Math.floor(y / (R * 2));
            const offset = (col + row) % 2;

            const ax = offset === 0 ? gx : gx + 1 - Math.abs(gx) * 0; // checkerboard shift
            const dist = Math.abs(gx) + Math.abs(gy); // Manhattan = diamond shape

            // Star shape: cross + 45° rotated cross
            const inCross = Math.abs(gx) < 0.35 || Math.abs(gy) < 0.35;
            const inDiag  = Math.abs(gx + gy) < 0.5 && Math.abs(gx - gy) < 0.5;
            const grout   = !(inCross || inDiag);

            const id = col * 100 + row;
            if (grout) {
                setPixel(img, x, y, 230, 220, 200);
            } else if (offset === 0) {
                // Blue tile
                const v = noise(id, 7) * 0.15;
                setPixel(img, x, y,
                    clamp(Math.round(40 + v * 30), 0, 255),
                    clamp(Math.round(100 + v * 30), 0, 255),
                    clamp(Math.round(180 + v * 40), 0, 255));
            } else {
                // Cream accent
                const v = noise(id, 8);
                const b = 230 + Math.round(v * 15);
                setPixel(img, x, y, b, b - 10, b - 20);
            }
        }
    }
    return img;
}

// ── 6. Wood Walnut Plank ──────────────────────────────────────────────────
function woodWalnut() {
    const SIZE = 512;
    const img = makeBuffer(SIZE, SIZE);
    const plankW = 128;

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const plankCol = Math.floor(x / plankW);
            const bx = x % plankW;
            const offset = plankCol % 2 === 1 ? SIZE / 2 : 0;
            const py = (y + offset) % SIZE;

            // Grain lines
            const grain = Math.sin((py + noise(x * 0.03, plankCol) * 40) * 0.25) * 0.5 + 0.5;
            const knot  = Math.max(0, 1 - Math.sqrt(
                Math.pow((bx - plankW * 0.4) / 20, 2) +
                Math.pow((py % 256 - 128) / 30, 2)
            ) * 2);

            const groutX = bx < 3;
            const groutY = py < 3;

            const base_r = 120, base_g = 72, base_b = 40;
            const dark = grain * 0.4 + knot * 0.5;

            if (groutX || groutY) {
                setPixel(img, x, y, 50, 30, 15);
            } else {
                setPixel(img, x, y,
                    clamp(Math.round(base_r - dark * 60 + noise(x, y) * 10), 0, 255),
                    clamp(Math.round(base_g - dark * 35 + noise(x, y, 1) * 6), 0, 255),
                    clamp(Math.round(base_b - dark * 20 + noise(x, y, 2) * 4), 0, 255));
            }
        }
    }
    return img;
}

// ── Generate all ──────────────────────────────────────────────────────────
console.log('Generating textures...\n');
save(hexCream(),          'hex-cream.png');
save(terrazzoGrey(),      'terrazzo-grey.png');
save(chevronTerracotta(), 'chevron-terracotta.png');
save(diamondWhite(),      'diamond-white.png');
save(moroccanBlue(),      'moroccan-blue.png');
save(woodWalnut(),        'wood-walnut.png');
console.log('\nDone! All textures saved to public/textures/generated/');
