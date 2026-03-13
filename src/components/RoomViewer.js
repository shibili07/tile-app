'use client';

import { useEffect, useRef } from 'react';

const BASE_TILE_PX = 220;

export default function RoomViewer({
    roomUrl,
    wallTextureUrl,
    floorTextureUrl,
    wallMaskUrl,
    floorMaskUrl,
    wallMaskInvert = false,
    floorMaskInvert = false,
    wallQuad = null,
    floorQuad = null,
    tileScale = 1.0,        // tune apparent tile size per room
}) {
    const containerRef = useRef();
    const canvasRef    = useRef();
    const cacheRef     = useRef({});
    const drawFnRef    = useRef(null);

    // ── Image loader with cache ──────────────────────────────────────────────
    const loadImg = (url) => new Promise((resolve) => {
        if (!url) return resolve(null);
        if (cacheRef.current[url]) return resolve(cacheRef.current[url]);
        const img = new Image();
        img.onload  = () => { cacheRef.current[url] = img; resolve(img); };
        img.onerror = () => resolve(null);
        img.src = url;
    });

    // ── Build seamless tiled texture ─────────────────────────────────────────
    const buildTiledTexture = (img, rX, rY) => {
        const tW = Math.round(BASE_TILE_PX * tileScale);
        const tH = Math.round(tW * (img.naturalHeight / img.naturalWidth));

        const canvas = document.createElement('canvas');
        canvas.width  = tW * rX;
        canvas.height = tH * rY;
        const ctx = canvas.getContext('2d');

        for (let row = 0; row < rY; row++)
            for (let col = 0; col < rX; col++)
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight,
                    col * tW, row * tH, tW, tH);

        return canvas;
    };

    // ── Luminance → alpha mask ───────────────────────────────────────────────
    const makeMask = (img, w, h, invert) => {
        const off = document.createElement('canvas');
        off.width = w; off.height = h;
        const ctx = off.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const d = ctx.getImageData(0, 0, w, h);
        for (let i = 0; i < d.data.length; i += 4) {
            const lum = d.data[i] * 0.299 + d.data[i + 1] * 0.587 + d.data[i + 2] * 0.114;
            d.data[i + 3] = Math.round(invert ? 255 - lum : lum);
            d.data[i] = d.data[i + 1] = d.data[i + 2] = 0;
        }
        ctx.putImageData(d, 0, 0);
        return off;
    };

    // ── Perspective-correct texture mapping (100 affine strips) ─────────────
    const drawPerspective = (ctx, tex, nQuad, cW, cH) => {
        const px = nQuad.map(([nx, ny]) => [nx * cW, ny * cH]);
        const [tl, tr, br, bl] = px;
        const tW = tex.width, tH = tex.height;
        const STEPS = 100;

        const wTop = Math.hypot(tr[0] - tl[0], tr[1] - tl[1]);
        const wBot = Math.hypot(br[0] - bl[0], br[1] - bl[1]);

        // log-ratio perspective-correct V
        const pV = (t) => {
            if (wTop < 1 || Math.abs(wBot / wTop - 1) < 0.02) return t;
            const w = wTop + (wBot - wTop) * t;
            return Math.log(w / wTop) / Math.log(wBot / wTop);
        };

        for (let i = 0; i < STEPS; i++) {
            const t0 = i / STEPS, t1 = (i + 1) / STEPS;
            const sv0 = pV(t0) * tH, sv1 = pV(t1) * tH;
            const sH = sv1 - sv0;
            if (sH < 0.05) continue;

            const x0L = tl[0] + (bl[0] - tl[0]) * t0, y0L = tl[1] + (bl[1] - tl[1]) * t0;
            const x0R = tr[0] + (br[0] - tr[0]) * t0, y0R = tr[1] + (br[1] - tr[1]) * t0;
            const x1L = tl[0] + (bl[0] - tl[0]) * t1, y1L = tl[1] + (bl[1] - tl[1]) * t1;
            const x1R = tr[0] + (br[0] - tr[0]) * t1, y1R = tr[1] + (br[1] - tr[1]) * t1;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x0L, y0L); ctx.lineTo(x0R, y0R);
            ctx.lineTo(x1R, y1R); ctx.lineTo(x1L, y1L);
            ctx.closePath();
            ctx.clip();

            const a = (x0R - x0L) / tW, b = (y0R - y0L) / tW;
            const c = (x1L - x0L) / sH, d = (y1L - y0L) / sH;
            const e = x0L - c * sv0,    f = y0L - d * sv0;

            ctx.transform(a, b, c, d, e, f);
            ctx.drawImage(tex, 0, sv0, tW, sH, 0, sv0, tW, sH);
            ctx.restore();
        }
    };

    // ── Flat tiled fill ──────────────────────────────────────────────────────
    const drawFlat = (ctx, tex, w, h) => {
        const scale = Math.max(w, h) / tex.width;
        const pat = ctx.createPattern(tex, 'repeat');
        pat.setTransform(new DOMMatrix([scale, 0, 0, scale, 0, 0]));
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, w, h);
    };

    // ── Render one surface (wall or floor) ───────────────────────────────────
    const renderSurface = async (ctx, w, h, {
        textureUrl, maskUrl, maskInvert, quad, rX, rY, opacity,
    }) => {
        const [tileImg, maskImg] = await Promise.all([
            loadImg(textureUrl),
            loadImg(maskUrl),
        ]);
        if (!tileImg || !maskImg) return;

        // 1. Build colour texture
        const tex = buildTiledTexture(tileImg, rX, rY);

        // 2. Draw texture (perspective or flat) to offscreen canvas
        const off = document.createElement('canvas');
        off.width = w; off.height = h;
        const offCtx = off.getContext('2d');

        if (quad) drawPerspective(offCtx, tex, quad, w, h);
        else      drawFlat(offCtx, tex, w, h);

        // 3. Clip to mask
        const mask = makeMask(maskImg, w, h, maskInvert);
        offCtx.globalCompositeOperation = 'destination-in';
        offCtx.drawImage(mask, 0, 0);

        // 4. Multiply blend so room shadows pass through the tiles
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = opacity;
        ctx.drawImage(off, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    };

    // ── Main draw
    const draw = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Room must be drawn on a white background for multiply to work correctly
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);

        const roomImg = await loadImg(roomUrl);
        if (roomImg) ctx.drawImage(roomImg, 0, 0, w, h);

        if (wallMaskUrl && wallTextureUrl)
            await renderSurface(ctx, w, h, {
                textureUrl: wallTextureUrl, maskUrl: wallMaskUrl,
                maskInvert: wallMaskInvert, quad: wallQuad,
                rX: 8, rY: 8, opacity: 0.88, isFloor: false,
            });

        if (floorMaskUrl && floorTextureUrl)
            await renderSurface(ctx, w, h, {
                textureUrl: floorTextureUrl, maskUrl: floorMaskUrl,
                maskInvert: floorMaskInvert, quad: floorQuad,
                rX: 6, rY: 6, opacity: 0.92, isFloor: true,
            });
    };

    drawFnRef.current = draw;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
        canvas.width  = container.clientWidth  || 800;
        canvas.height = container.clientHeight || 600;
        container.appendChild(canvas);
        canvasRef.current = canvas;
        drawFnRef.current?.();
        const onResize = () => {
            if (!containerRef.current || !canvasRef.current) return;
            canvasRef.current.width  = containerRef.current.clientWidth;
            canvasRef.current.height = containerRef.current.clientHeight;
            drawFnRef.current?.();
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            if (container.contains(canvas)) container.removeChild(canvas);
            canvasRef.current = null;
        };
    }, []);

    useEffect(() => { draw(); }, [
        roomUrl, wallTextureUrl, floorTextureUrl,
        wallMaskUrl, floorMaskUrl, wallMaskInvert, floorMaskInvert,
        wallQuad, floorQuad, tileScale,
    ]);

    return <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black" />;
}
