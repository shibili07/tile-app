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
    const drawSeqRef   = useRef(0);

    const setHighQuality = (ctx) => {
        if (!ctx) return;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    };

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
        const TILE_OVERDRAW = 1.25;

        const canvas = document.createElement('canvas');
        canvas.width  = tW * rX;
        canvas.height = tH * rY;
        const ctx = canvas.getContext('2d');
        setHighQuality(ctx);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let row = 0; row < rY; row++)
            for (let col = 0; col < rX; col++)
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight,
                    col * tW - TILE_OVERDRAW / 2,
                    row * tH - TILE_OVERDRAW / 2,
                    tW + TILE_OVERDRAW,
                    tH + TILE_OVERDRAW);

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

    // ── Build neutral (grayscale) room shading to preserve tile color ───────
    const makeNeutralShading = (roomImg, w, h, maskCanvas, strength = 0.3) => {
        if (!roomImg) return null;
        const shade = document.createElement('canvas');
        shade.width = w;
        shade.height = h;
        const shadeCtx = shade.getContext('2d');
        setHighQuality(shadeCtx);
        shadeCtx.drawImage(roomImg, 0, 0, w, h);

        const imgData = shadeCtx.getImageData(0, 0, w, h);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
            // Neutral luminance retains light/shadow but removes color tint.
            const lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
            const boosted = Math.min(255, lum * 1.06);
            d[i] = boosted;
            d[i + 1] = boosted;
            d[i + 2] = boosted;
            d[i + 3] = Math.round(d[i + 3] * strength);
        }
        shadeCtx.putImageData(imgData, 0, 0);

        // Keep shading only where floor mask exists.
        shadeCtx.globalCompositeOperation = 'destination-in';
        shadeCtx.drawImage(maskCanvas, 0, 0);
        shadeCtx.globalCompositeOperation = 'source-over';
        return shade;
    };

    // ── Perspective-correct texture mapping with seam protection ─────────────
    const drawPerspective = (ctx, tex, nQuad, cW, cH) => {
        setHighQuality(ctx);
        const px = nQuad.map(([nx, ny]) => [nx * cW, ny * cH]);
        const [tl, tr, br, bl] = px;
        const tW = tex.width, tH = tex.height;
        const STEPS = 140;
        const EDGE_OVERLAP = 0.0015;

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
            const t1Edge = Math.min(1, t1 + EDGE_OVERLAP);
            const sv0 = pV(t0) * tH, sv1 = pV(t1Edge) * tH;
            const sH = sv1 - sv0;
            if (sH < 0.05) continue;

            const x0L = tl[0] + (bl[0] - tl[0]) * t0, y0L = tl[1] + (bl[1] - tl[1]) * t0;
            const x0R = tr[0] + (br[0] - tr[0]) * t0, y0R = tr[1] + (br[1] - tr[1]) * t0;
            const x1L = tl[0] + (bl[0] - tl[0]) * t1Edge, y1L = tl[1] + (bl[1] - tl[1]) * t1Edge;
            const x1R = tr[0] + (br[0] - tr[0]) * t1Edge, y1R = tr[1] + (br[1] - tr[1]) * t1Edge;

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
        setHighQuality(ctx);
        const scale = Math.max(w, h) / tex.width;
        const pat = ctx.createPattern(tex, 'repeat');
        pat.setTransform(new DOMMatrix([scale, 0, 0, scale, 0, 0]));
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, w, h);
    };

    // ── Render one surface (wall or floor) ───────────────────────────────────
    const renderSurface = async (ctx, w, h, {
        textureUrl, maskUrl, maskInvert, quad, rX, rY, opacity, blendMode = 'multiply',
        roomImg = null, roomShadeStrength = 0, renderScale = 1, drawId = 0,
    }) => {
        const [tileImg, maskImg] = await Promise.all([
            loadImg(textureUrl),
            loadImg(maskUrl),
        ]);
        if (drawId !== drawSeqRef.current) return;
        if (!tileImg || !maskImg) return;

        // 1. Build colour texture
        const tex = buildTiledTexture(tileImg, rX, rY);

        // 2. Draw texture (perspective or flat) to offscreen canvas
        const offW = Math.max(1, Math.round(w * renderScale));
        const offH = Math.max(1, Math.round(h * renderScale));
        const off = document.createElement('canvas');
        off.width = offW;
        off.height = offH;
        const offCtx = off.getContext('2d');
        setHighQuality(offCtx);

        if (quad) drawPerspective(offCtx, tex, quad, offW, offH);
        else      drawFlat(offCtx, tex, offW, offH);

        // 3. Clip to mask
        const mask = makeMask(maskImg, offW, offH, maskInvert);
        offCtx.globalCompositeOperation = 'destination-in';
        offCtx.drawImage(mask, 0, 0);

        // 4. Blend into room (multiply for realism, source-over for true color)
        if (drawId !== drawSeqRef.current) return;
        ctx.globalCompositeOperation = blendMode;
        ctx.globalAlpha = opacity;
        ctx.drawImage(off, 0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;

        // 5. Optional neutral shading pass for natural blending without tinting.
        if (roomImg && roomShadeStrength > 0) {
            const shadeMask = makeMask(maskImg, w, h, maskInvert);
            const neutralShade = makeNeutralShading(roomImg, w, h, shadeMask, roomShadeStrength);
            if (drawId !== drawSeqRef.current) return;
            if (neutralShade) {
                ctx.globalCompositeOperation = 'multiply';
                ctx.globalAlpha = 1;
                ctx.drawImage(neutralShade, 0, 0);
                ctx.globalCompositeOperation = 'source-over';
            }
        }
    };

    // ── Main draw
    const draw = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const drawId = ++drawSeqRef.current;
        const ctx = canvas.getContext('2d');
        setHighQuality(ctx);
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Room must be drawn on a white background for multiply to work correctly
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);

        const roomImg = await loadImg(roomUrl);
        if (drawId !== drawSeqRef.current) return;
        if (roomImg) ctx.drawImage(roomImg, 0, 0, w, h);

        if (wallMaskUrl && wallTextureUrl)
            await renderSurface(ctx, w, h, {
                textureUrl: wallTextureUrl, maskUrl: wallMaskUrl,
                maskInvert: wallMaskInvert, quad: wallQuad,
                rX: 8, rY: 8, opacity: 0.88, drawId, isFloor: false,
            });

        if (floorMaskUrl && floorTextureUrl)
            await renderSurface(ctx, w, h, {
                textureUrl: floorTextureUrl, maskUrl: floorMaskUrl,
                maskInvert: floorMaskInvert, quad: floorQuad,
                rX: 6, rY: 6, opacity: 1, blendMode: 'source-over',
                roomImg, roomShadeStrength: 0.32, renderScale: 2, drawId, isFloor: true,
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
