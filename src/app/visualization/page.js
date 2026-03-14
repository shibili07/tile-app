'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import RoomViewer from '@/components/RoomViewer';

const ROOMS = [
  {
    id: 'living_room',
    name: 'Classic Living Room',
    roomUrl: '/rooms/living_room/room.jpg',
    wallMaskUrl: null,
    floorMaskUrl: '/rooms/living_room/floor-mask.jpeg',
    floorMaskInvert: true,
    floorQuad: [[0.12, 0.54], [0.88, 0.54], [1.32, 1.02], [-0.32, 1.02]],
    tileScale: 1.0,
    wallPos: null,
    floorPos: { bottom: '25%', left: '50%' },
  },
];

function VisualizationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
  const [tiles, setTiles] = useState([]);
  const [selectedFloorTile, setSelectedFloorTile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId) {
      const room = ROOMS.find((r) => r.id === roomId);
      if (room) setActiveRoom(room);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/tiles')
      .then((res) => res.json())
      .then((data) => {
        setTiles(data);
        const preferred = data.find((t) => t.slug === 'natural-stone-mosaic' && t.category === 'Floors');
        const first = data.find((t) => t.category === 'Floors');
        setSelectedFloorTile(preferred || first);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === previewRef.current);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const clampZoom = (value) => Math.min(2, Math.max(1, value));

  const changeZoom = (delta) => {
    setZoom((prev) => clampZoom(Math.round((prev + delta) * 100) / 100));
  };

  const toggleFullscreen = async () => {
    if (!previewRef.current) return;
    if (document.fullscreenElement === previewRef.current) {
      await document.exitFullscreen();
    } else {
      await previewRef.current.requestFullscreen();
    }
  };

  const floorTiles = tiles.filter((t) => t.category === 'Floors');
  const estimateArea = 15;
  const estimateTotal = selectedFloorTile ? (selectedFloorTile.price * estimateArea).toFixed(2) : null;

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-50 text-neutral-600 text-sm font-medium">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-neutral-50 to-white text-neutral-800 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-80 flex flex-col flex-shrink-0 bg-white border-r border-neutral-200">
        <div className="flex-shrink-0 p-6 border-b border-neutral-100">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            SaaS Visualizer
          </div>
          <h1 className="mt-3 text-lg font-semibold text-neutral-900 tracking-tight">
            TilePro Gen
          </h1>
          <p className="mt-1 text-xs text-neutral-500">Choose a room and apply textures instantly</p>
          {ROOMS.length > 1 && (
            <div className="mt-5">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Room</p>
              <div className="flex flex-wrap gap-2">
                {ROOMS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      activeRoom.id === room.id
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Floor texture</p>
            <span className="text-[11px] text-neutral-400">{floorTiles.length} options</span>
          </div>
          <div className="space-y-2">
            {floorTiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedFloorTile(p)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  selectedFloorTile?.id === p.id
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                }`}
              >
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                  <Image src={p.textureUrl} alt={p.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-neutral-900 truncate">{p.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {p.material} · {p.finish} · £{p.price}/m²
                  </p>
                </div>
                {selectedFloorTile?.id === p.id && (
                  <span className="text-neutral-400 flex-shrink-0" aria-hidden>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main viewport - full screen */}
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-100/70 relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-5 left-5 z-20 rounded-lg border border-neutral-200 bg-white/95 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          ← Back
        </button>
        {/* Exit - aligned to main area */}
        <Link
          href="/"
          className="absolute top-5 right-5 z-20 rounded-lg border border-neutral-200 bg-white/95 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Exit
        </Link>

        <div className="flex-1 min-h-0 flex items-center justify-center p-6 pb-4">
          <div
            ref={previewRef}
            className="w-full h-full max-w-7xl max-h-[calc(100vh-14rem)] rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-[0_20px_70px_-50px_rgba(0,0,0,0.55)] relative"
          >
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/95 px-2 py-1 shadow-sm backdrop-blur">
              <button
                type="button"
                onClick={() => changeZoom(-0.1)}
                className="h-7 w-7 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                aria-label="Zoom out"
              >
                −
              </button>
              <span className="min-w-11 text-center text-xs font-medium text-neutral-700">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => changeZoom(0.1)}
                className="h-7 w-7 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="ml-1 rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-3 right-3 z-10 rounded-lg border border-neutral-200 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur hover:bg-neutral-50"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>

            <div
              className="h-full w-full transition-transform duration-200 ease-out"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              <RoomViewer
                roomUrl={activeRoom.roomUrl}
                wallTextureUrl={null}
                floorTextureUrl={selectedFloorTile?.textureUrl}
                wallMaskUrl={activeRoom.wallMaskUrl}
                floorMaskUrl={activeRoom.floorMaskUrl}
                wallMaskInvert={activeRoom.wallMaskInvert}
                floorMaskInvert={activeRoom.floorMaskInvert}
                wallQuad={activeRoom.wallQuad ?? null}
                floorQuad={activeRoom.floorQuad ?? null}
                tileScale={activeRoom.tileScale ?? 1.0}
                normalMapUrl={selectedFloorTile?.normalMapUrl ?? null}
              />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 bg-white border-t border-neutral-200 px-6 py-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <section className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
              {selectedFloorTile ? (
                <div className="flex items-start gap-4">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                    <Image src={selectedFloorTile.textureUrl} alt={selectedFloorTile.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{selectedFloorTile.name}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {selectedFloorTile.material} · {selectedFloorTile.finish} · {selectedFloorTile.size}
                    </p>
                    <p className="mt-2 text-xs text-neutral-600">
                      Category: <span className="font-medium">{selectedFloorTile.category}</span>
                    </p>
                    <p className="text-xs text-neutral-600">
                      Texture: <span className="font-mono text-[11px]">{selectedFloorTile.textureUrl}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No selection</p>
              )}
            </section>

            <section className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Estimate</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                £{estimateTotal ?? '0.00'}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                For {estimateArea}m² at £{selectedFloorTile?.price ?? 0}/m²
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                  Order sample
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors">
                  Get quote
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Session details</p>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-neutral-500">Room</dt>
                  <dd className="font-medium text-neutral-800">{activeRoom.name}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-neutral-500">Zoom</dt>
                  <dd className="font-medium text-neutral-800">{Math.round(zoom * 100)}%</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-neutral-500">Fullscreen</dt>
                  <dd className="font-medium text-neutral-800">{isFullscreen ? 'On' : 'Off'}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-neutral-500">Tile ID</dt>
                  <dd className="font-medium text-neutral-800">{selectedFloorTile?.id ?? '-'}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f5f5f5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 3px; }
        canvas { filter: contrast(1.02) saturate(1.02); }
      `}</style>
    </div>
  );
}

export default function Visualization() {
  return (
    <Suspense
      fallback={(
        <div className="h-screen w-full flex items-center justify-center bg-neutral-50 text-neutral-600 text-sm font-medium">
          Loading…
        </div>
      )}
    >
      <VisualizationContent />
    </Suspense>
  );
}
